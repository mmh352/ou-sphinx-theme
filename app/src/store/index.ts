import { createStore } from 'vuex';
import deepEqual from 'fast-deep-equal';

export interface State {
    metadata: {[x: string]: string};
    project: string;
    urls: UrlState;
    tutorial: TutorialState;
    ui: UIState;
}

export interface UrlState {
    root: string;
    static: string;
    prefix?: string;
}

export interface TutorialState {
    blocks: LinkState[];
    body: string;
    next: LinkState | null;
    prev: LinkState | null;
    title: string;
    withinBlockNav: LinkState | null;
}

export interface LinkState {
    title: string;
    url: string;
    active?: boolean;
    expanded?: boolean;
    children?: LinkState[];
}

export interface UIState {
    scrolling: boolean;
    scrollWidth: number;
    size: string;
    platform: PlatformState;
}

export interface PlatformState {
    isMac: boolean;
}

export default createStore({
    state: {
        metadata: {},
        project: '',
        urls: {
            root: '',
            static: '',
        },
        tutorial: {
            blocks: [],
            body: '',
            next: null,
            prev: null,
            title: '',
            withinBlockNav: null,
        },
        ui: {
            scrolling: false,
            scrollWidth: 0,
            size: 'large',
            platform: {
                isMac: false,
            },
        },
    } as State,

    mutations: {
        setPage(state, payload: State) {
            if (!deepEqual(state.metadata, payload.metadata)) {
                state.metadata = payload.metadata;
            }
            if (state.project !== payload.project) {
                state.project = payload.project;
            }
            if (!deepEqual(state.urls, payload.urls)) {
                state.urls.root = payload.urls.root;
                state.urls.static = payload.urls.static;
            }
            if (!deepEqual(state.tutorial, payload.tutorial)) {
                state.tutorial = payload.tutorial;
            }
        },

        setURLPrefix(state, payload: string) {
            if (payload.endsWith('/')) {
                payload = payload.substring(0, payload.length - 1);
            }
            if (state.urls.prefix !== payload) {
                state.urls.prefix = payload;
            }
        },

        setScrolling(state, payload: boolean) {
            state.ui.scrolling = payload;
        },

        setScrollWidth(state, payload: number) {
            state.ui.scrollWidth = payload;
        },

        setPlatformFlag(state, payload: {attr: string; value: boolean}) {
            if (payload.attr === 'isMac') {
                state.ui.platform.isMac = payload.value;
            }
        },

        setUISize(state, payload: string) {
            state.ui.size = payload;
        },
    },

    actions: {
        async init({ commit }) {
            window.addEventListener('resize', () => {
                if (window.innerWidth > 800) {
                    commit('setUISize', 'large');
                } else {
                    commit('setUISize', 'small');
                }
            });
            if (window.innerWidth > 800) {
                commit('setUISize', 'large');
            } else {
                commit('setUISize', 'small');
            }
            commit('setPlatformFlag', {attr: 'isMac', value: navigator.platform.toLowerCase().indexOf('mac') >= 0});
        },

        async fetch({ commit }, url: string) {
            url = (new URL(url, document.baseURI)).href;
            url = url.replace('.html', '.json');
            if (url.substr(url.length - 1) === '/') {
                url = url + 'index.json';
            }
            const response = await fetch(url);
            for (const entry of response.headers) {
                if (entry[0].toLowerCase() === 'x-url-prefix') {
                    commit('setURLPrefix', entry[1]);
                }
            }
            return await response.json();
        },

        async load({ dispatch, commit }, url: string) {
            url = (new URL(url, document.baseURI)).href;
            try {
                const page = await dispatch('fetch', url);
                history.pushState(null, page.tutorial.title, url);
                commit('setPage', page);
                document.title = page.tutorial.title.replace('&amp;', '&');
            } catch(error) {
                window.location.href = url;
            }
        },
    },

    modules: {
    },
});
