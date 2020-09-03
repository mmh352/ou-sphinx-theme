<template>
    <div id="app" :class="appClasses">
        <nav v-if="hasAppMenu" id="app-menu" aria-label="JupyterHub Menu">
            <ul>
                <li v-if="scrolling" role="presentation"><a :href="urls.root" @click="navigateTo(urls.root, $event)" :title="project">{{ project }}</a></li>
                <li role="presentation" class="separator"></li>
                <li v-if="hasAppMenuDownload" role="presentation"><a :href="appMenuFilesUrl">Files</a></li>
                <li v-if="hasAppMenuDownload" role="presentation"><a :href="appMenuDownloadUrl">Download</a></li>
                <li v-if="hasAppMenuJupyterHub" role="presentation"><a href="/hub/home">JupyterHub</a></li>
                <li v-if="hasAppMenuJupyterHub" role="presentation"><a href="/hub/logout">Logout</a></li>
                <li><a href="http://open.ac.uk" target="_blank" rel="noopener"><img :src="urls.static + '/ou_logo.png'" alt="The Open University"/></a></li>
            </ul>
        </nav>
        <tutorial v-if="hasTutorial"></tutorial>
        <iframe id="iframe" v-if="hasIFrame" :src="iFrameSrc"></iframe>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Tutorial from './components/Tutorial.vue';
import Editor from './components/Editor.vue';
import Viewer from './components/Viewer.vue';

@Component({
    components: {
        Tutorial,
        Editor,
        Viewer,
    }
})
export default class App extends Vue {

    public get scrolling() {
        return this.$store.state.ui.scrolling;
    }

    public get layout() {
        if (this.$store.state.metadata && this.$store.state.metadata.layout) {
            return this.$store.state.metadata.layout;
        } else {
            return 'tutorial-only-center';
        }
    }

    public get appClasses() {
        const classes = ['layout-' + this.layout];
        if (this.hasAppMenu) {
            classes.push('layout-has-app-menu');
        }
        return classes;
    }

    public get hasAppMenu() {
        return this.hasAppMenuDownload || this.hasAppMenuJupyterHub;
    }

    public get hasAppMenuDownload() {
        return this.$store.state.metadata['app-menu-download'] && this.$store.state.metadata['app-menu-download'].toLowerCase() === 'true';
    }

    public get appMenuDownloadUrl() {
        if (this.$store.state.urls.prefix) {
            return this.$store.state.urls.prefix + '/tutorial/download';
        } else {
            return '/tutorial/download';
        }
    }

    public get appMenuFilesUrl() {
        if (this.$store.state.urls.prefix) {
            return this.$store.state.urls.prefix + '/tree';
        } else {
            return '/tree';
        }
    }

    public get hasAppMenuJupyterHub() {
        return this.$store.state.metadata['app-menu-jupyterhub'] && this.$store.state.metadata['app-menu-jupyterhub'].toLowerCase() === 'true';
    }

    public get hasTutorial() {
        return ['tutorial-only', 'tutorial-only-left', 'tutorial-only-center', 'tutorial-only-right', 'tutorial-iframe'].indexOf(this.layout) >= 0;
    }

    public get hasIFrame() {
        return this.layout === 'tutorial-iframe';
    }

    public get iFrameSrc() {
        if (this.hasIFrame) {
            if (this.$store.state.urls.prefix) {
                return this.$store.state.urls.prefix + this.$store.state.metadata['iframe-src'];
            } else {
                return this.$store.state.metadata['iframe-src'];
            }
        } else {
            return '';
        }
    }

    public get urls() {
        return this.$store.state.urls;
    }

    public get project() {
        return this.$store.state.project;
    }

    public created() {
        const pageData = document.querySelector('script#json-blob');
        if (pageData) {
            this.$store.dispatch('fetch', window.location.href);
            this.$store.commit('setPage', JSON.parse(atob(pageData.innerHTML)));
            window.addEventListener('popstate', async () => {
                const page = await this.$store.dispatch('fetch', window.location.href);
                this.$store.commit('setPage', page);
                document.title = page.tutorial.title.replace('&amp;', '&');
            });
        }
    }

    public async navigateTo(url: string, ev: MouseEvent) {
        ev.preventDefault();
        await this.$store.dispatch('load', url);
    }
}
</script>
