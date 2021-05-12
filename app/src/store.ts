import { writable, readable, derived } from 'svelte/store';
import { decode } from 'he';

/**
 * The currently displayed URL
 */
export const url = writable('');

/**
 * Whether the interface is currently busy
 */
export const busy = writable(true);

/**
 * Headers extracted from the last response
 */
const headers = writable(null);

/**
 * The data configuring the current page.
 *
 * Is derived from the url to automatically update when the url is changed.
 * As a side-effect updates the headers store.
 */
export const data = derived(
    url,
    (url, set) => {
        busy.set(true);
        if (url.endsWith('/')) {
            url = url + 'index.json';
        } else if (url.endsWith('.html')) {
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
    },
    null
);

/**
 * The base URL everything is fetched from.
 *
 * Derived from the headers store.
 */
export const baseUrl = derived(
    headers,
    (headers) => {
        if (headers && headers.get('x-url-prefix')) {
            const prefix = headers.get('x-url-prefix');
            if (prefix.endsWith('/')) {
                return prefix.substring(0, prefix.length - 1);
            } else {
                return prefix;
            }
        } else {
            return ''
        }
    },
    ''
);

/**
 * The relative path to the static files directory.
 */
export const staticUrl = derived(
    data,
    (data) => {
        if (data && data.urls && data.urls.static) {
            return data.urls.static;
        } else {
            return ''
        }
    },
    ''
)

/**
 * Whether we are running inside a JupyterHub.
 */
export const isInJupyterHub = derived(
    headers,
    (headers) => {
        if (headers) {
            return headers.get('x-in-jupyter-hub') === 'true';
        } else {
            return false;
        }
    }
);

/**
 * Which components are activated for the current page.
 *
 * Currently supported components are 'tutorial', 'editor', 'iframe'.
 */
export const components = derived(
    data,
    (data) => {
        if (data && data.metadata && data.metadata.layout) {
            return data.metadata.layout.split('-');
        } else {
            return ['tutorial'];
        }
    },
    []
);

/**
 * Whether the current page contains an editor component.
 */
export const hasEditor = derived(
    components,
    (components) => {
        return components.indexOf('editor') >= 0;
    },
    false
);

/**
 * Whether the current page contains an iframe component.
 */
export const hasIFrame = derived(
    components,
    (components) => {
        return components.indexOf('iframe') >= 0;
    },
    false
);

/**
 * Update the document title when the data changes.
 */
data.subscribe((data) => {
    if (data && data.tutorial && data.tutorial.title) {
        document.title = decode(data.tutorial.title);
    }
});

/**
 * Navigate to a new URL.
 *
 * This will automatically update the history.
 *
 * @param newUrl The URL to navigate to. Can be absolute or relative.
 */
export function navigate(newUrl: string) {
    newUrl = (new URL(newUrl, document.baseURI)).href;
    url.set(newUrl);
    window.history.pushState(null, 'Loading', newUrl);
}

/**
 * Handle navigation within the history.
 */
window.addEventListener('popstate', function(ev) {
    url.set(window.location.href);
});

/**
 * Converts the window width to a breakpoint number.
 *
 * Larger numbers imply a greater screen width.
 *
 * @returns The breakpoints as a number 0-5.
 */
function calculateBreakpoint() {
    const width = window.innerWidth;
    if (width >= 1536) {
        return 5;
    } else if (width >= 1280) {
        return 4;
    } else if (width >= 1024) {
        return 3;
    } else if (width >= 768) {
        return 2;
    } else if (width >= 640) {
        return 1;
    }
    return 0;
}

/**
 * The currently active breakpoint.
 */
export const breakpoint = readable(calculateBreakpoint(), function start(set) {
    function listener() {
        set(calculateBreakpoint());
    }
    window.addEventListener('resize', listener);
    return function stop() {
        window.removeEventListener('resize', listener);
    };
});
