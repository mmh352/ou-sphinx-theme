<template>
    <div id="tutorial" ref="tutorial">
        <a href="#tutorial-content" class="show-for-sr">Jump to the main content</a>
        <div :class="{ 'scrolling': isScrolling, 'content': true }" ref="content" v-on:scroll.passive="scrolling">
            <header ref="header">
                {{ project }}
            </header>
            <nav ref="blockNav" class="block">
                <ul>
                    <li v-for="item in tutorial.blocks" :key="item.url" role="presentation">
                        <a :href="item.url" @click="navigateTo(item.url, $event)" :aria-current="(item.current || item.expanded) ? 'true' : 'false'">{{ item.title }}</a>
                    </li>
                </ul>
            </nav>
            <nav v-if="tutorial.withinBlockNav" class="within-block">
                <ul>
                    <li role="presentation">
                        <a v-if="tutorial.prev" :href="tutorial.prev.url" :title="tutorial.prev.title" @click="navigateTo(tutorial.prev.url, $event)"><span>&laquo; Previous</span></a>
                        <span v-else>&laquo; Previous</span>
                    </li>
                    <li role="presentation">
                        <a tabindex="0" @click="showWithinBlockNav" @keyup.enter="showWithinBlockNav" @keyup.space="showWithinBlockNav" aria-label="Show the navigation menu">
                            <span v-html="tutorial.title"></span>
                            <svg viewBox="0 0 24 24" class="icon small" alt="" role="presentation">
                                <path d="M3,3H9V7H3V3M15,10H21V14H15V10M15,17H21V21H15V17M13,13H7V18H13V20H7L5,20V9H7V11H13V13Z" />
                            </svg>
                        </a>
                    </li>
                    <li role="presentation">
                        <a v-if="tutorial.next" :href="tutorial.next.url" :title="tutorial.next.title" @click="navigateTo(tutorial.next.url, $event)"><span>Next &raquo;</span></a>
                        <span v-else>Next &raquo;</span>
                    </li>
                </ul>
            </nav>
            <main id="tutorial-content" v-html="tutorial.body" @click="contentClick" aria-live="polite" aria-atomic="true" @keyup="contentKbd"></main>
            <nav v-if="tutorial.withinBlockNav" class="within-block">
                <ul>
                    <li role="presentation">
                        <a v-if="tutorial.prev" :href="tutorial.prev.url" :title="tutorial.prev.title" @click="navigateTo(tutorial.prev.url, $event)"><span>&laquo; Previous</span></a>
                        <span v-else>&laquo; Previous</span>
                    </li>
                    <li role="presentation">
                        <a tabindex="0" @click="showWithinBlockNav" @keyup.enter="showWithinBlockNav" @keyup.space="showWithinBlockNav" aria-label="Show the navigation menu">
                            <span v-html="tutorial.title"></span>
                            <svg viewBox="0 0 24 24" class="icon small" alt="" role="presentation">
                                <path d="M3,3H9V7H3V3M15,10H21V14H15V10M15,17H21V21H15V17M13,13H7V18H13V20H7L5,20V9H7V11H13V13Z" />
                            </svg>
                        </a>
                    </li>
                    <li role="presentation">
                        <a v-if="tutorial.next" :href="tutorial.next.url" :title="tutorial.next.title" @click="navigateTo(tutorial.next.url, $event)"><span>Next &raquo;</span></a>
                        <span v-else>Next &raquo;</span>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    <nav v-if="tutorial.withinBlockNav && isWithinBlockNavActive" ref="withinBlockNavDialog" id="popup-nav-dialog" :aria-hidden="isWithinBlockNavActive ? 'false' : 'true'" @keyUp="popupNavKbd">
        <div class="text-right">
            <button aria-label="Close" @click="hideWithinBlockNav">
                <svg viewBox="0 0 24 24" class="icon">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
            </button>
        </div>
        <tutorial-nav :items="[tutorial.withinBlockNav]" @click="navigateTo" @keyUp="ariaPopupMenuKbd"></tutorial-nav>
    </nav>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { UrlState, TutorialState } from '../store/index';
import TutorialNav from './TutorialNav.vue';
import { ariaMenuMixin } from '../a11y/aria-menu';

interface ScrollPosition {
    scrollTop: number;
}

declare global {
    // eslint-disable-next-line
    interface Window { MathJax: any; }
}

@Options({
    components: {
        TutorialNav,
    },
    mixins: [
        ariaMenuMixin,
    ],
})
export default class Tutorial extends Vue {

    public isScrolling = false;
    public isWithinBlockNavActive = false;
    public withinBlockNavHeight = 0;
    private withinBlockNavOpener: HTMLElement | null = null;

    public get urls(): UrlState {
        return this.$store.state.urls;
    }

    public get project(): string {
        return this.$store.state.project;
    }

    public get tutorial(): TutorialState {
        this.$nextTick(() => {
            if (window.MathJax) {
                window.MathJax.typeset();
            }
            this.$store.commit('setScrollWidth', (this.$refs.content as HTMLElement).offsetWidth - (this.$refs.content as Element).clientWidth);
        });
        return this.$store.state.tutorial;
    }

    public mounted() {
        this.$store.commit('setScrollWidth', (this.$refs.content as HTMLElement).offsetWidth - (this.$refs.content as Element).clientWidth);
        window.addEventListener('resize', () => {
            this.$store.commit('setScrollWidth', (this.$refs.content as HTMLElement).offsetWidth - (this.$refs.content as Element).clientWidth);
        });
    }

    public async navigateTo(url: string, ev: MouseEvent): Promise<void> {
        ev.preventDefault();
        this.hideWithinBlockNav(true);
        await this.$store.dispatch('load', url);
        (this.$refs.content as Element).scrollTop = 0;
    }

    public showWithinBlockNav(ev: Event): void {
        this.isWithinBlockNavActive = true;
        this.$nextTick(() => {
            const currentLink = (this.$refs.withinBlockNavDialog as HTMLElement).querySelector('[aria-current="page"]');
            if (currentLink) {
                (currentLink as HTMLElement).focus();
            }
        });
        this.withinBlockNavOpener = (ev.target as HTMLElement);
        while (this.withinBlockNavOpener.localName.toLowerCase() !== 'a') {
            this.withinBlockNavOpener = this.withinBlockNavOpener.parentElement as HTMLElement;
        }
    }

    public hideWithinBlockNav(noRefocus: boolean): void {
        this.isWithinBlockNavActive = false;
        if (!noRefocus && this.withinBlockNavOpener) {
            this.withinBlockNavOpener.focus();
        }
    }

    public scrolling(): void {
        const scrollTop = (this.$refs.content as Element).scrollTop;
        this.isScrolling = (scrollTop > (this.$refs.header as Element).clientHeight + (this.$refs.blockNav as Element).clientHeight);
        this.$store.commit('setScrolling', scrollTop > (this.$refs.header as Element).clientHeight);
        this.$store.commit('setScrollWidth', (this.$refs.content as HTMLElement).offsetWidth - (this.$refs.content as Element).clientWidth);
    }

    public contentClick(ev: MouseEvent): void {
        let target = (ev.target as HTMLElement);
        while (target && target.localName.toLowerCase() !== 'a' && target.localName.toLowerCase() !== 'button') {
            target = target.parentElement as HTMLElement;
        }
        if (target) {
            if (target.localName.toLowerCase() === 'a') {
                const classList = target.classList;
                if (classList.contains('reference')) {
                    if (classList.contains('internal')) {
                        ev.preventDefault();
                        const url = target.getAttribute('href');
                        if (url) {
                            this.navigateTo(url, ev);
                        }
                    } else if (classList.contains('external')) {
                        target.setAttribute('rel', 'noopener');
                        target.setAttribute('target', '_blank');
                    }
                }
            } else if (target.localName.toLowerCase() === 'button') {
                console.log(target.parentElement);
                if (target.parentElement) {
                    if (target.parentElement.parentElement) {
                        if (target.parentElement.parentElement.classList.contains('answer')) {
                            target.parentElement.parentElement.classList.toggle('is-active');
                        } else if (target.parentElement.parentElement.classList.contains('transcript')) {
                            target.parentElement.parentElement.classList.toggle('is-active');
                        }
                    }
                }
            }
        }
    }

    public popupNavKbd(ev: KeyboardEvent): void {
        if (ev.keyCode === 27 && this.isWithinBlockNavActive) {
            this.hideWithinBlockNav(false);
        }
    }

    public contentKbd(): void {
        // Todo
    }
}
</script>
