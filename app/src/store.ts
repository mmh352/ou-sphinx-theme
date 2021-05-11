import { writable, readable, derived } from 'svelte/store';
import { decode } from 'he';

export const url = writable('');

export const busy = writable(true);

const headers = writable(null);

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

export const baseUrl = derived(
    headers,
    (headers) => {
        if (headers && headers.get('x-url-prefix')) {
            return headers.get('x-url-prefix');
        } else {
            return ''
        }
    },
    ''
);

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

export const hasEditor = derived(
    components,
    (components) => {
        return components.indexOf('editor') >= 0;
    },
    false
);

export const hasIFrame = derived(
    components,
    (components) => {
        return components.indexOf('iframe') >= 0;
    },
    false
);

data.subscribe((data) => {
    if (data && data.tutorial && data.tutorial.title) {
        document.title = decode(data.tutorial.title);
    }
});

export function navigate(newUrl: string) {
    newUrl = (new URL(newUrl, document.baseURI)).href;
    url.set(newUrl);
    window.history.pushState(null, 'Loading', newUrl);
}

window.addEventListener('popstate', function(ev) {
    url.set(window.location.href);
});

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

export const breakpoint = readable(calculateBreakpoint(), function start(set) {
    function listener() {
        set(calculateBreakpoint());
    }
    window.addEventListener('resize', listener);
    return function stop() {
        window.removeEventListener('resize', listener);
    };
});
