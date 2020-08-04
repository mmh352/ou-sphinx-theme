import Vue from 'vue'
import Vuex from 'vuex'
import deepEqual from 'fast-deep-equal';

Vue.use(Vuex)

interface State {
    metadata: {[x: string]: string};
    project: string;
    urls: UrlState;
    tutorial: TutorialState;
}

interface UrlState {
    root: string;
    static: string;
}

interface TutorialState {
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

export default new Vuex.Store({
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
                state.urls = payload.urls;
            }
            if (!deepEqual(state.tutorial, payload.tutorial)) {
                state.tutorial = payload.tutorial;
            }
        },
    },

    actions: {
        async fetch({ commit, state }, url: string) {
            url = (new URL(url, document.baseURI)).href;
            url = url.replace('.html', '.json');
            commit('setPage', await (await fetch(url)).json());
            document.title = state.tutorial.title;
        },

        async load({ dispatch, state }, url: string) {
            url = (new URL(url, document.baseURI)).href;
            try {
                await dispatch('fetch', url);
                history.pushState(null, state.tutorial.title, url);
            } catch(error) {
                window.location.href = url;
            }
        },
    },

    modules: {
    }
});
