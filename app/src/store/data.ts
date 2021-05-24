import { writable, derived } from 'svelte/store';
import { decode } from 'he';

import { busyCounter } from './busy';
import { connectionStatus } from './status';
import { url } from './navigation';
import { sleep } from './sleep';

/**
 * Fetch the current data and headers for the given url.
 *
 * @param url The URL to fetch
 * @returns The updated data and headers
 */
async function fetchData(url: string) {
    if (url.endsWith('/')) {
        url = url + 'index.json';
    } else if (url.endsWith('.html')) {
        url = url.substring(0, url.length - 4) + 'json';
    }
    if (url !== '') {
        for (let idx = 0; idx < 10; idx++) {
            busyCounter.inc();
            try {
                const response = await fetch(url);
                busyCounter.dec();
                if (response.status === 200) {
                    connectionStatus.connected();
                    const data = await response.json();
                    return {headers: response.headers, data: data};
                }
            } catch(e) {}
            connectionStatus.reconnecting();
            await sleep(6000);
        }
        connectionStatus.lost();
        return {data: null, headers: null};
    } else {
        return {data: null, headers: null};
    }
}

/**
 * Constructs a new state store, subscribing to the URL and fetching data.
 */
function stateStore() {
    const state = writable({data: null, headers: null});

    const urlUnsubscribe = url.subscribe((url) => {
        if (url) {
            fetchData(url).then((newState) => {
                state.set(newState);
            });
        }
    });

    return {
        subscribe(unsubscribers) {
            const stateUnsubscribe = state.subscribe(unsubscribers);
            return () => {
                stateUnsubscribe();
                urlUnsubscribe();
            }
        },
    }
}

const state = stateStore();

const data = derived(
    state,
    (state: any) => {
        return state.data;
    },
    null
);

export const metadata = derived(
    data,
    (data) => {
        if (data && data.metadata) {
            return data.metadata;
        } else {
            return null;
        }
    },
    null
);

export const project = derived(
    data,
    (data) => {
        if (data && data.tutorial) {
            return data.project;
        } else {
            return 'Loading...';
        }
    },
    'Loading...'
)

export const tutorial = derived(
    data,
    (data) => {
        if (data && data.tutorial) {
            return data.tutorial;
        } else {
            return null;
        }
    },
    null
);

export const withinBlockNav = derived(
    tutorial,
    (tutorial) => {
        if (tutorial && tutorial.withinBlockNav) {
            return tutorial.withinBlockNav;
        } else {
            return null;
        }
    },
    null
)

export const urls = derived(
    data,
    (data) => {
        if (data && data.urls) {
            return data.urls;
        } else {
            return null;
        }
    },
    null
);

/**
 * Headers retrieved from the last response.
 */
const headers = derived(
    state,
    (state: any) => {
        return state.headers;
    },
    null
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
