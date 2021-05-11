var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const url = writable('');
    const busy = writable(true);
    const headers = writable(null);
    const data = derived(url, (url, set) => {
        busy.set(true);
        if (url.endsWith('/')) {
            url = url + 'index.json';
        }
        else if (url.endsWith('.html')) {
            url = url.substring(0, url.length - 4) + 'json';
        }
        if (url !== '') {
            const request = fetch(url);
            request.then((response) => {
                if (response.status === 200) {
                    headers.set(response.headers);
                    response.json().then((data) => {
                        set(data);
                        busy.set(false);
                    });
                }
            });
        }
    }, null);
    derived(headers, (headers) => {
        if (headers && headers.get('x-url-prefix')) {
            return headers.get('x-url-prefix');
        }
        else {
            return '';
        }
    }, '');
    const isInJupyterHub = derived(headers, (headers) => {
        if (headers) {
            return headers.get('x-in-jupyter-hub') === 'true';
        }
        else {
            return false;
        }
    });
    data.subscribe((data) => {
        if (data && data.tutorial && data.tutorial.title) {
            document.title = data.tutorial.title;
        }
    });
    function navigate(newUrl) {
        newUrl = (new URL(newUrl, document.baseURI)).href;
        url.set(newUrl);
        window.history.pushState(null, 'Loading', newUrl);
    }
    window.addEventListener('popstate', function (ev) {
        url.set(window.location.href);
    });

    /* src/MainNav.svelte generated by Svelte v3.38.2 */
    const file$3 = "src/MainNav.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (37:12) {:else}
    function create_else_block$1(ctx) {
    	let li;
    	let a;
    	let raw_value = /*block*/ ctx[6].title + "";
    	let a_href_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			attr_dev(a, "href", a_href_value = /*block*/ ctx[6].url);
    			attr_dev(a, "class", "block px-3 py-2 text-blue hover:text-blue-400 focus:text-blue-400 border-b-2 border-solid border-gray-200 hover:border-blue focus:border-blue");
    			add_location(a, file$3, 37, 20, 1328);
    			add_location(li, file$3, 37, 16, 1324);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			a.innerHTML = raw_value;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*handleNav*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*blocks*/ 2 && raw_value !== (raw_value = /*block*/ ctx[6].title + "")) a.innerHTML = raw_value;
    			if (dirty & /*blocks*/ 2 && a_href_value !== (a_href_value = /*block*/ ctx[6].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(37:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (35:12) {#if block.current || block.expanded}
    function create_if_block_2(ctx) {
    	let li;
    	let a;
    	let raw_value = /*block*/ ctx[6].title + "";
    	let a_href_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			attr_dev(a, "href", a_href_value = /*block*/ ctx[6].url);
    			attr_dev(a, "class", "block px-3 py-2 text-blue hover:text-blue-400 focus:text-blue-400 border-b-2 border-solid border-orange hover:border-blue focus:border-blue");
    			add_location(a, file$3, 35, 20, 1070);
    			add_location(li, file$3, 35, 16, 1066);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			a.innerHTML = raw_value;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*handleNav*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*blocks*/ 2 && raw_value !== (raw_value = /*block*/ ctx[6].title + "")) a.innerHTML = raw_value;
    			if (dirty & /*blocks*/ 2 && a_href_value !== (a_href_value = /*block*/ ctx[6].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(35:12) {#if block.current || block.expanded}",
    		ctx
    	});

    	return block;
    }

    // (34:8) {#each blocks as block}
    function create_each_block(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*block*/ ctx[6].current || /*block*/ ctx[6].expanded) return create_if_block_2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(34:8) {#each blocks as block}",
    		ctx
    	});

    	return block;
    }

    // (42:8) {#if $busy}
    function create_if_block_1$1(ctx) {
    	let li;
    	let span;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			span = element("span");
    			img = element("img");
    			if (img.src !== (img_src_value = "/_static/icons/repeat_RGB.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Loading...");
    			attr_dev(img, "class", "w-4 h-4 self-center mx-4");
    			add_location(img, file$3, 42, 123, 1866);
    			attr_dev(span, "class", "flex border-b-2 border-solid border-gray-200 h-full");
    			add_location(span, file$3, 42, 57, 1800);
    			attr_dev(li, "role", "presentation");
    			attr_dev(li, "class", "self-stretch");
    			add_location(li, file$3, 42, 12, 1755);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, span);
    			append_dev(span, img);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(42:8) {#if $busy}",
    		ctx
    	});

    	return block;
    }

    // (46:8) {#if $isInJupyterHub}
    function create_if_block$1(ctx) {
    	let li0;
    	let a0;
    	let t1;
    	let li1;
    	let a1;

    	const block = {
    		c: function create() {
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Compute Home";
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Logout";
    			attr_dev(a0, "href", "/hub/home");
    			attr_dev(a0, "class", "block px-3 py-2 text-blue hover:text-blue-400 focus:text-blue-400 border-b-2 border-solid border-gray-200 hover:border-blue focus:border-blue");
    			add_location(a0, file$3, 46, 16, 2070);
    			add_location(li0, file$3, 46, 12, 2066);
    			attr_dev(a1, "href", "/hub/logout");
    			attr_dev(a1, "class", "block px-3 py-2 text-blue hover:text-blue-400 focus:text-blue-400 border-b-2 border-solid border-gray-200 hover:border-blue focus:border-blue");
    			add_location(a1, file$3, 47, 16, 2278);
    			add_location(li1, file$3, 47, 12, 2274);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li0, anchor);
    			append_dev(li0, a0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, li1, anchor);
    			append_dev(li1, a1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(li1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(46:8) {#if $isInJupyterHub}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let nav;
    	let ul;
    	let li0;
    	let span0;
    	let t0;
    	let t1;
    	let t2;
    	let li1;
    	let span1;
    	let t4;
    	let t5;
    	let li2;
    	let t6;
    	let t7;
    	let li3;
    	let a;
    	let img;
    	let img_src_value;
    	let each_value = /*blocks*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block0 = /*$busy*/ ctx[2] && create_if_block_1$1(ctx);
    	let if_block1 = /*$isInJupyterHub*/ ctx[3] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			span0 = element("span");
    			t0 = text(/*moduleTitle*/ ctx[0]);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			li1 = element("li");
    			span1 = element("span");
    			span1.textContent = " ";
    			t4 = space();
    			if (if_block0) if_block0.c();
    			t5 = space();
    			li2 = element("li");
    			t6 = space();
    			if (if_block1) if_block1.c();
    			t7 = space();
    			li3 = element("li");
    			a = element("a");
    			img = element("img");
    			attr_dev(span0, "class", "block px-3 py-2 border-b-2 border-solid border-gray-200 text-blue font-bold");
    			add_location(span0, file$3, 32, 12, 850);
    			add_location(li0, file$3, 32, 8, 846);
    			attr_dev(span1, "class", "block border-b-2 border-solid border-gray-200");
    			add_location(span1, file$3, 40, 62, 1644);
    			attr_dev(li1, "role", "presentation");
    			attr_dev(li1, "class", "flex-grow flex-shrink");
    			add_location(li1, file$3, 40, 8, 1590);
    			attr_dev(li2, "class", "presentation");
    			add_location(li2, file$3, 44, 8, 1993);
    			if (img.src !== (img_src_value = "/_static/ou_logo.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "The Open University");
    			attr_dev(img, "class", "h-8");
    			add_location(img, file$3, 49, 211, 2691);
    			attr_dev(a, "href", "https://www.open.ac.uk");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "block px-3 py-2 text-blue hover:text-blue-400 focus:text-blue-400 border-b-2 border-solid border-gray-200 hover:border-blue focus:border-blue");
    			add_location(a, file$3, 49, 12, 2492);
    			add_location(li3, file$3, 49, 8, 2488);
    			attr_dev(ul, "class", "flex flex-row items-end");
    			add_location(ul, file$3, 31, 4, 801);
    			attr_dev(nav, "class", "col-start-1 col-end-4 row-start-1 row-end-2");
    			add_location(nav, file$3, 30, 0, 739);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			append_dev(li0, span0);
    			append_dev(span0, t0);
    			append_dev(ul, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(ul, t2);
    			append_dev(ul, li1);
    			append_dev(li1, span1);
    			append_dev(ul, t4);
    			if (if_block0) if_block0.m(ul, null);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(ul, t6);
    			if (if_block1) if_block1.m(ul, null);
    			append_dev(ul, t7);
    			append_dev(ul, li3);
    			append_dev(li3, a);
    			append_dev(a, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*moduleTitle*/ 1) set_data_dev(t0, /*moduleTitle*/ ctx[0]);

    			if (dirty & /*blocks, handleNav*/ 18) {
    				each_value = /*blocks*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*$busy*/ ctx[2]) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(ul, t5);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*$isInJupyterHub*/ ctx[3]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					if_block1.m(ul, t7);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_each(each_blocks, detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $busy;
    	let $isInJupyterHub;
    	validate_store(busy, "busy");
    	component_subscribe($$self, busy, $$value => $$invalidate(2, $busy = $$value));
    	validate_store(isInJupyterHub, "isInJupyterHub");
    	component_subscribe($$self, isInJupyterHub, $$value => $$invalidate(3, $isInJupyterHub = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("MainNav", slots, []);
    	let moduleTitle = "Loading...";
    	let blocks = [];

    	const unsubscribe_data = data.subscribe(data => {
    		if (data) {
    			$$invalidate(0, moduleTitle = data.project);

    			if (data.tutorial && data.tutorial.blocks) {
    				$$invalidate(1, blocks = data.tutorial.blocks);
    			} else {
    				$$invalidate(1, blocks = []);
    			}
    		}
    	});

    	onDestroy(() => {
    		unsubscribe_data();
    	});

    	function handleNav(ev) {
    		ev.preventDefault();
    		let target = ev.target;

    		while (target && target.localName !== "a") {
    			target = target.parentElement;
    		}

    		if (target) {
    			navigate(target.getAttribute("href"));
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MainNav> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onDestroy,
    		data,
    		busy,
    		isInJupyterHub,
    		navigate,
    		moduleTitle,
    		blocks,
    		unsubscribe_data,
    		handleNav,
    		$busy,
    		$isInJupyterHub
    	});

    	$$self.$inject_state = $$props => {
    		if ("moduleTitle" in $$props) $$invalidate(0, moduleTitle = $$props.moduleTitle);
    		if ("blocks" in $$props) $$invalidate(1, blocks = $$props.blocks);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [moduleTitle, blocks, $busy, $isInJupyterHub, handleNav];
    }

    class MainNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainNav",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/PageNav.svelte generated by Svelte v3.38.2 */
    const file$2 = "src/PageNav.svelte";

    // (37:12) {:else}
    function create_else_block_1(ctx) {
    	let span3;
    	let img;
    	let img_src_value;
    	let t0;
    	let span2;
    	let span0;
    	let t2;
    	let span1;

    	const block = {
    		c: function create() {
    			span3 = element("span");
    			img = element("img");
    			t0 = space();
    			span2 = element("span");
    			span0 = element("span");
    			span0.textContent = "Previous";
    			t2 = space();
    			span1 = element("span");
    			span1.textContent = "You are at the beginning";
    			if (img.src !== (img_src_value = "/_static/icons/back_left_RGB.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "w-6 h-6 mr-2");
    			add_location(img, file$2, 38, 16, 1391);
    			attr_dev(span0, "class", "block text-left");
    			add_location(span0, file$2, 40, 20, 1560);
    			attr_dev(span1, "class", "block text-left text-sm truncate");
    			add_location(span1, file$2, 41, 20, 1626);
    			attr_dev(span2, "class", "block flex-grow flex-shrink overflow-hidden");
    			add_location(span2, file$2, 39, 16, 1481);
    			attr_dev(span3, "class", "flex w-full items-center overflow-hidden text-black-300");
    			add_location(span3, file$2, 37, 12, 1304);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span3, anchor);
    			append_dev(span3, img);
    			append_dev(span3, t0);
    			append_dev(span3, span2);
    			append_dev(span2, span0);
    			append_dev(span2, t2);
    			append_dev(span2, span1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(37:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (29:12) {#if prev}
    function create_if_block_1(ctx) {
    	let a;
    	let img;
    	let img_src_value;
    	let t0;
    	let span2;
    	let span0;
    	let t2;
    	let span1;
    	let raw_value = /*prev*/ ctx[1].title + "";
    	let a_href_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			img = element("img");
    			t0 = space();
    			span2 = element("span");
    			span0 = element("span");
    			span0.textContent = "Previous";
    			t2 = space();
    			span1 = element("span");
    			if (img.src !== (img_src_value = "/_static/icons/back_left_RGB.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "w-6 h-6 mr-2");
    			add_location(img, file$2, 30, 20, 903);
    			attr_dev(span0, "class", "block text-left");
    			add_location(span0, file$2, 32, 24, 1080);
    			attr_dev(span1, "class", "block text-left text-sm truncate");
    			add_location(span1, file$2, 33, 24, 1150);
    			attr_dev(span2, "class", "block flex-grow flex-shrink overflow-hidden");
    			add_location(span2, file$2, 31, 20, 997);
    			attr_dev(a, "href", a_href_value = /*prev*/ ctx[1].url);
    			attr_dev(a, "class", "flex w-full items-center overflow-hidden text-blue hover:text-blue-400 focus:text-blue-400 hover:underline focus:underline");
    			add_location(a, file$2, 29, 16, 711);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, img);
    			append_dev(a, t0);
    			append_dev(a, span2);
    			append_dev(span2, span0);
    			append_dev(span2, t2);
    			append_dev(span2, span1);
    			span1.innerHTML = raw_value;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*handleNav*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*prev*/ 2 && raw_value !== (raw_value = /*prev*/ ctx[1].title + "")) span1.innerHTML = raw_value;
    			if (dirty & /*prev*/ 2 && a_href_value !== (a_href_value = /*prev*/ ctx[1].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(29:12) {#if prev}",
    		ctx
    	});

    	return block;
    }

    // (57:12) {:else}
    function create_else_block(ctx) {
    	let span3;
    	let span2;
    	let span0;
    	let t1;
    	let span1;
    	let t3;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			span3 = element("span");
    			span2 = element("span");
    			span0 = element("span");
    			span0.textContent = "Next";
    			t1 = space();
    			span1 = element("span");
    			span1.textContent = "You have reached the end";
    			t3 = space();
    			img = element("img");
    			attr_dev(span0, "class", "block text-right");
    			add_location(span0, file$2, 59, 24, 2705);
    			attr_dev(span1, "class", "block text-right text-sm truncate");
    			add_location(span1, file$2, 60, 24, 2772);
    			attr_dev(span2, "class", "block flex-grow flex-shrink overflow-hidden");
    			add_location(span2, file$2, 58, 20, 2622);
    			if (img.src !== (img_src_value = "/_static/icons/forward_right_RGB.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "w-6 h-6 ml-2");
    			add_location(img, file$2, 62, 20, 2900);
    			attr_dev(span3, "class", "flex w-full items-center overflow-hidden text-black-300");
    			add_location(span3, file$2, 57, 16, 2531);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span3, anchor);
    			append_dev(span3, span2);
    			append_dev(span2, span0);
    			append_dev(span2, t1);
    			append_dev(span2, span1);
    			append_dev(span3, t3);
    			append_dev(span3, img);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(57:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (49:12) {#if next}
    function create_if_block(ctx) {
    	let a;
    	let span2;
    	let span0;
    	let t1;
    	let span1;
    	let raw_value = /*next*/ ctx[0].title + "";
    	let t2;
    	let img;
    	let img_src_value;
    	let a_href_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			a = element("a");
    			span2 = element("span");
    			span0 = element("span");
    			span0.textContent = "Next";
    			t1 = space();
    			span1 = element("span");
    			t2 = space();
    			img = element("img");
    			attr_dev(span0, "class", "block text-right");
    			add_location(span0, file$2, 51, 24, 2207);
    			attr_dev(span1, "class", "block text-right text-sm truncate");
    			add_location(span1, file$2, 52, 24, 2274);
    			attr_dev(span2, "class", "block flex-grow flex-shrink overflow-hidden");
    			add_location(span2, file$2, 50, 20, 2124);
    			if (img.src !== (img_src_value = "/_static/icons/forward_right_RGB.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "w-6 h-6 ml-2");
    			add_location(img, file$2, 54, 20, 2396);
    			attr_dev(a, "href", a_href_value = /*next*/ ctx[0].url);
    			attr_dev(a, "class", "flex w-full items-center overflow-hidden text-blue hover:text-blue-400 focus:text-blue-400 hover:underline focus:underline");
    			add_location(a, file$2, 49, 16, 1932);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, span2);
    			append_dev(span2, span0);
    			append_dev(span2, t1);
    			append_dev(span2, span1);
    			span1.innerHTML = raw_value;
    			append_dev(a, t2);
    			append_dev(a, img);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*handleNav*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*next*/ 1 && raw_value !== (raw_value = /*next*/ ctx[0].title + "")) span1.innerHTML = raw_value;
    			if (dirty & /*next*/ 1 && a_href_value !== (a_href_value = /*next*/ ctx[0].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(49:12) {#if next}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let nav;
    	let ul;
    	let li0;
    	let t0;
    	let li1;
    	let t1;
    	let li2;

    	function select_block_type(ctx, dirty) {
    		if (/*prev*/ ctx[1]) return create_if_block_1;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*next*/ ctx[0]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block1 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			ul = element("ul");
    			li0 = element("li");
    			if_block0.c();
    			t0 = space();
    			li1 = element("li");
    			t1 = space();
    			li2 = element("li");
    			if_block1.c();
    			attr_dev(li0, "class", "overflow-hidden");
    			add_location(li0, file$2, 27, 8, 643);
    			attr_dev(li1, "role", "presentation");
    			attr_dev(li1, "class", "flex-grow flex-shrink min-w-1rem");
    			add_location(li1, file$2, 46, 8, 1785);
    			attr_dev(li2, "class", "overflow-hidden");
    			add_location(li2, file$2, 47, 8, 1864);
    			attr_dev(ul, "class", "flex flex-row");
    			add_location(ul, file$2, 26, 4, 608);
    			attr_dev(nav, "class", "px-4 py-4");
    			add_location(nav, file$2, 25, 0, 580);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			if_block0.m(li0, null);
    			append_dev(ul, t0);
    			append_dev(ul, li1);
    			append_dev(ul, t1);
    			append_dev(ul, li2);
    			if_block1.m(li2, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(li0, null);
    				}
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(li2, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if_block0.d();
    			if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("PageNav", slots, []);
    	let next = null;
    	let prev = null;

    	const unsubscribe_data = data.subscribe(data => {
    		if (data) {
    			$$invalidate(1, prev = data.tutorial.prev);
    			$$invalidate(0, next = data.tutorial.next);
    		}
    	});

    	onDestroy(() => {
    		unsubscribe_data();
    	});

    	function handleNav(ev) {
    		ev.preventDefault();
    		let target = ev.target;

    		while (target && target.localName !== "a") {
    			target = target.parentElement;
    		}

    		if (target) {
    			navigate(target.getAttribute("href"));
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PageNav> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onDestroy,
    		data,
    		navigate,
    		next,
    		prev,
    		unsubscribe_data,
    		handleNav
    	});

    	$$self.$inject_state = $$props => {
    		if ("next" in $$props) $$invalidate(0, next = $$props.next);
    		if ("prev" in $$props) $$invalidate(1, prev = $$props.prev);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [next, prev, handleNav];
    }

    class PageNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PageNav",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Tutorial.svelte generated by Svelte v3.38.2 */
    const file$1 = "src/Tutorial.svelte";

    function create_fragment$1(ctx) {
    	let article;
    	let div;
    	let t;
    	let pagenav;
    	let current;
    	let mounted;
    	let dispose;
    	pagenav = new PageNav({ $$inline: true });

    	const block = {
    		c: function create() {
    			article = element("article");
    			div = element("div");
    			t = space();
    			create_component(pagenav.$$.fragment);
    			attr_dev(div, "class", "flex-grow flex-shrink overflow-auto px-4 py-2");
    			add_location(div, file$1, 31, 4, 1073);
    			attr_dev(article, "id", "tutorial");
    			attr_dev(article, "class", "col-start-2 col-end-3 row-start-2 row-end-4 flex flex-col border-r-2 border-solid border-gray-200");
    			add_location(article, file$1, 30, 0, 939);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, div);
    			div.innerHTML = /*tutorialContent*/ ctx[0];
    			append_dev(article, t);
    			mount_component(pagenav, article, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*handleClick*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*tutorialContent*/ 1) div.innerHTML = /*tutorialContent*/ ctx[0];		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pagenav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pagenav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_component(pagenav);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tutorial", slots, []);
    	let tutorialContent = "";

    	const unsubscribe = data.subscribe(value => {
    		if (value) {
    			$$invalidate(0, tutorialContent = value.tutorial.body);
    		}
    	});

    	onDestroy(unsubscribe);

    	function handleClick(ev) {
    		let target = ev.target;

    		while (target && target.localName !== "a" && target.localName !== "button") {
    			target = target.parentElement;
    		}

    		if (target.localName === "button") {
    			if (target.parentElement.parentElement.classList.contains("answer")) {
    				ev.preventDefault();
    				target.parentElement.parentElement.classList.toggle("show");
    			}
    		} else if (target.localName === "a") {
    			if (target.classList.contains("internal")) {
    				ev.preventDefault();
    				navigate(target.getAttribute("href"));
    			}
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tutorial> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onDestroy,
    		data,
    		navigate,
    		PageNav,
    		tutorialContent,
    		unsubscribe,
    		handleClick
    	});

    	$$self.$inject_state = $$props => {
    		if ("tutorialContent" in $$props) $$invalidate(0, tutorialContent = $$props.tutorialContent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tutorialContent, handleClick];
    }

    class Tutorial extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tutorial",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.38.2 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let a;
    	let t1;
    	let mainnav;
    	let t2;
    	let div0;
    	let ul;
    	let li0;
    	let button0;
    	let img0;
    	let img0_src_value;
    	let t3;
    	let li1;
    	let button1;
    	let img1;
    	let img1_src_value;
    	let t4;
    	let li2;
    	let button2;
    	let img2;
    	let img2_src_value;
    	let t5;
    	let li3;
    	let span;
    	let t7;
    	let tutorial;
    	let t8;
    	let div1;
    	let t10;
    	let div2;
    	let current;
    	mainnav = new MainNav({ $$inline: true });
    	tutorial = new Tutorial({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			a = element("a");
    			a.textContent = "Jump to the tutorial";
    			t1 = space();
    			create_component(mainnav.$$.fragment);
    			t2 = space();
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			button0 = element("button");
    			img0 = element("img");
    			t3 = space();
    			li1 = element("li");
    			button1 = element("button");
    			img1 = element("img");
    			t4 = space();
    			li2 = element("li");
    			button2 = element("button");
    			img2 = element("img");
    			t5 = space();
    			li3 = element("li");
    			span = element("span");
    			span.textContent = " ";
    			t7 = space();
    			create_component(tutorial.$$.fragment);
    			t8 = space();
    			div1 = element("div");
    			div1.textContent = "Editor goes here";
    			t10 = space();
    			div2 = element("div");
    			div2.textContent = "iFrame goes here";
    			attr_dev(a, "href", "#tutorial");
    			attr_dev(a, "class", "sr-only");
    			add_location(a, file, 5, 1, 180);
    			if (img0.src !== (img0_src_value = "/_static/icons/user_options_RGB.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Show the navigation menu");
    			attr_dev(img0, "title", "Navigation Menu");
    			attr_dev(img0, "class", "w-8 h-8");
    			add_location(img0, file, 11, 5, 490);
    			attr_dev(button0, "class", "block px-3 py-3 border-r-2 border-solid border-gray-200 hover:border-blue focus:border-blue");
    			add_location(button0, file, 10, 4, 376);
    			add_location(li0, file, 9, 3, 367);
    			if (img1.src !== (img1_src_value = "/_static/icons/article_RGB.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "Show the tutorial content");
    			attr_dev(img1, "title", "Tutorial Content");
    			attr_dev(img1, "class", "w-8 h-8");
    			add_location(img1, file, 16, 5, 719);
    			attr_dev(button1, "class", "block px-3 py-3 border-r-2 border-solid border-blue");
    			add_location(button1, file, 15, 4, 645);
    			add_location(li1, file, 14, 3, 636);
    			if (img2.src !== (img2_src_value = "/_static/icons/download_RGB.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "Download all of the module's content");
    			attr_dev(img2, "title", "Download Module Content");
    			attr_dev(img2, "class", "w-8 h-8");
    			add_location(img2, file, 21, 5, 985);
    			attr_dev(button2, "class", "block px-3 py-3 border-r-2 border-solid border-gray-200 hover:border-blue focus:border-blue");
    			add_location(button2, file, 20, 4, 871);
    			add_location(li2, file, 19, 3, 862);
    			attr_dev(span, "class", "block border-r-2 border-solid h-full");
    			add_location(span, file, 25, 4, 1186);
    			attr_dev(li3, "class", "flex-shrink flex-grow");
    			add_location(li3, file, 24, 3, 1147);
    			attr_dev(ul, "class", "flex flex-col h-full");
    			add_location(ul, file, 8, 2, 330);
    			attr_dev(div0, "class", "col-start-1 col-end-2 row-start-2 row-end-4 overflow-y-auto");
    			add_location(div0, file, 7, 1, 254);
    			attr_dev(div1, "class", "col-start-3 col-end-4 row-start-2 row-end-3");
    			add_location(div1, file, 30, 1, 1290);
    			attr_dev(div2, "class", "col-start-3 col-end-4 row-start-3 row-end-4 shadow-inner");
    			add_location(div2, file, 33, 1, 1376);
    			attr_dev(main, "class", "grid grid-cols-full grid-rows-full w-screen h-screen");
    			add_location(main, file, 4, 0, 111);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, a);
    			append_dev(main, t1);
    			mount_component(mainnav, main, null);
    			append_dev(main, t2);
    			append_dev(main, div0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(li0, button0);
    			append_dev(button0, img0);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, button1);
    			append_dev(button1, img1);
    			append_dev(ul, t4);
    			append_dev(ul, li2);
    			append_dev(li2, button2);
    			append_dev(button2, img2);
    			append_dev(ul, t5);
    			append_dev(ul, li3);
    			append_dev(li3, span);
    			append_dev(main, t7);
    			mount_component(tutorial, main, null);
    			append_dev(main, t8);
    			append_dev(main, div1);
    			append_dev(main, t10);
    			append_dev(main, div2);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mainnav.$$.fragment, local);
    			transition_in(tutorial.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mainnav.$$.fragment, local);
    			transition_out(tutorial.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(mainnav);
    			destroy_component(tutorial);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ MainNav, Tutorial });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.querySelector('#app'),
    });
    url.set(window.location.href);

    return app;

}());
//# sourceMappingURL=bundle.js.map
