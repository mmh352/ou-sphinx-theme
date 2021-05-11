import { writable, derived } from 'svelte/store';

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

data.subscribe((data) => {
    if (data && data.tutorial && data.tutorial.title) {
        document.title = data.tutorial.title;
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
