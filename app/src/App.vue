<template>
    <div :class="appClasses">
        <nav id="app-menu" :style="{'margin-right': scrollWidth}">
            <ul>
                <li>
                    <button v-if="hasAppMenu" id="main-menu-button" tabindex="0" aria-has-popup="menu" aria-controls="main-menu" :aria-expanded="mainMenuShowing ? 'true' : 'false'" aria-label="Show the main menu" @click="toggleMainMenu">
                        <svg viewBox="0 0 24 24" class="icon large" aria-hidden="true">
                            <path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
                        </svg>
                    </button>
                </li>
                <li><span v-if="scrolling">{{ project }}</span></li>
                <li>
                    <!--<form>
                        <label><span class="show-for-sr">Search {{ project }}</span>
                            <input type="search" />
                        </label>
                        <button aria-label="search">
                            <svg viewBox="0 0 24 24" class="icon large" aria-hidden="true">
                                <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                            </svg>
                        </button>
                    </form>-->
                </li>
                <li><a href="http://open.ac.uk" target="_blank" rel="noopener"><img :src="urls.static + '/ou_logo.png'" alt="The Open University"/></a></li>
            </ul>
            <ul v-if="hasAppMenu" id="main-menu" role="menu" aria-labelledby="main-menu-button" :style="{display: mainMenuShowing ? 'block' : 'none'}" ref="mainMenu" @keydown="ariaPopupMenuKbd">
                <li v-if="hasAppMenuDownload" role="none"><a :href="appMenuDownloadUrl" role="menuitem" tabindex="-1">Download</a></li>
                <li v-if="hasAppMenuJupyterHub" role="none"><a href="/hub/home" role="menuitem" tabindex="-1">JupyterHub</a></li>
                <li v-if="hasAppMenuJupyterHub" role="none"><a href="/hub/logout" role="menuitem" tabindex="-1">Logout</a></li>
            </ul>
        </nav>
        <tutorial v-if="hasTutorial"></tutorial>
        <iframe id="iframe" v-if="hasIFrame" :src="iFrameSrc"></iframe>
        <editor v-if="hasEditor"></editor>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { UrlState } from './store/index';
import Tutorial from './components/Tutorial.vue';
import Editor from './components/Editor.vue';
import Viewer from './components/Viewer.vue';
import { ariaPopupMenuMixin } from './a11y/aria-popup-menu';

@Options({
    components: {
        Tutorial,
        Editor,
        Viewer,
    },
    mixins: [
        ariaPopupMenuMixin,
    ]
})
export default class App extends Vue {

    mainMenuShowing = false;

    public get scrolling(): boolean {
        return this.$store.state.ui.scrolling;
    }

    public get layout(): string {
        if (this.$store.state.metadata && this.$store.state.metadata.layout) {
            return this.$store.state.metadata.layout;
        } else {
            return 'tutorial-only-center';
        }
    }

    public get appClasses(): string[] {
        const classes = ['layout-' + this.layout];
        if (this.hasAppMenu) {
            classes.push('layout-has-app-menu');
        }
        return classes;
    }

    public get scrollWidth(): string {
        if (this.hasIFrame) {
            return '0px';
        } else {
            return this.$store.state.ui.scrollWidth + 'px';
        }
    }

    public get hasAppMenu(): boolean {
        return this.hasAppMenuDownload || this.hasAppMenuJupyterHub;
    }

    public get hasAppMenuDownload(): boolean {
        return this.$store.state.metadata['app-menu-download'] && this.$store.state.metadata['app-menu-download'].toLowerCase() === 'true';
    }

    public get appMenuDownloadUrl(): string {
        if (this.$store.state.urls.prefix) {
            return this.$store.state.urls.prefix + '/tutorial/download';
        } else {
            return '/tutorial/download';
        }
    }

    public get appMenuFilesUrl(): string {
        if (this.$store.state.urls.prefix) {
            return this.$store.state.urls.prefix + '/tree';
        } else {
            return '/tree';
        }
    }

    public get hasAppMenuJupyterHub(): boolean {
        return this.$store.state.metadata['app-menu-jupyterhub'] && this.$store.state.metadata['app-menu-jupyterhub'].toLowerCase() === 'true';
    }

    public get hasTutorial(): boolean {
        return ['tutorial-only', 'tutorial-only-left', 'tutorial-only-center', 'tutorial-only-right', 'tutorial-iframe', 'tutorial-editor'].indexOf(this.layout) >= 0;
    }

    public get hasIFrame(): boolean {
        return this.layout === 'tutorial-iframe';
    }

    public get iFrameSrc(): string {
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

    public get hasEditor(): boolean {
        return ['tutorial-editor'].indexOf(this.layout) >= 0;
    }

    public get urls(): UrlState {
        return this.$store.state.urls;
    }

    public get project(): string {
        return this.$store.state.project;
    }

    public created(): void {
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

    public async navigateTo(url: string, ev: MouseEvent): Promise<void> {
        ev.preventDefault();
        await this.$store.dispatch('load', url);
    }

    public toggleMainMenu() {
        this.mainMenuShowing = !this.mainMenuShowing;
        if (this.mainMenuShowing) {
            this.$nextTick(() => {
                const link = (this.$refs.mainMenu as HTMLElement).querySelector('a');
                if (link) {
                    link.focus();
                }
            });
        }
    }
}
</script>
