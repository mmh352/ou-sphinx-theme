<template>
    <div id="tutorial" ref="tutorial" @keyup="keyUp">
        <a href="#tutorial-content" class="show-for-sr">Jump to the main content</a>
        <div :class="{ 'scrolling': isScrolling, 'content': true }" ref="content" v-scroll="scrolling">
            <header ref="header">
                <div>
                    <a :href="urls.root" @click="navigateTo(urls.root, $event)" :title="project">{{ project }}</a>
                </div>
                <div><a href="http://open.ac.uk" target="_blank" rel="noopener"><img :src="urls.static + '/ou_logo.png'" alt="The Open University"/></a></div>
            </header>
            <nav ref="blockNav" class="block" aria-label="Block">
                <ul>
                    <li v-for="item in tutorial.blocks" :key="item.url" role="presentation">
                        <a :href="item.url" @click="navigateTo(item.url, $event)" :aria-current="(item.current || item.expanded) ? 'true' : 'false'">{{ item.title }}</a>
                    </li>
                </ul>
            </nav>
            <nav v-if="tutorial.withinBlockNav" class="within-block" aria-label="Within Block">
                <ul>
                    <li role="presentation">
                        <a v-if="tutorial.prev" :href="tutorial.prev.url" :title="tutorial.prev.title" @click="navigateTo(tutorial.prev.url, $event)"><span>&laquo; Previous</span></a>
                        <span v-else>&laquo; Previous</span>
                    </li>
                    <li role="presentation">
                        <a tabindex="0" @click="showWithinBlockNav" @keyup.enter="showWithinBlockNav" @keyup.space="showWithinBlockNav" aria-label="Show the within block navigation">
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
            <main id="tutorial-content" v-html="tutorial.body" @click="articleClick" aria-live="polite" aria-atomic="true"></main>
            <nav v-if="tutorial.withinBlockNav" class="within-block" aria-label="Within Block">
                <ul>
                    <li role="presentation">
                        <a v-if="tutorial.prev" :href="tutorial.prev.url" :title="tutorial.prev.title" @click="navigateTo(tutorial.prev.url, $event)"><span>&laquo; Previous</span></a>
                        <span v-else>&laquo; Previous</span>
                    </li>
                    <li role="presentation">
                        <a tabindex="0" @click="showWithinBlockNav" @keyup.enter="showWithinBlockNav" @keyup.space="showWithinBlockNav" aria-label="Show the within block navigation">
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
        <nav v-if="tutorial.withinBlockNav" ref="withinBlockNavDialog" class="within-block-overlay" :style="{ height: withinBlockNavHeight + 'px' }" :aria-hidden="isWithinBlockNavActive ? 'false' : 'true'" role="dialog" aria-label="Within Block Navigation">
            <button class="close-full-within-block" aria-label="Close" @click="hideWithinBlockNav">
                <svg viewBox="0 0 24 24" class="icon">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
            </button>
            <tutorial-nav :items="[tutorial.withinBlockNav]" @click="navigateTo"></tutorial-nav>
        </nav>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { UrlState, TutorialState } from '../store/index';
import TutorialNav from './TutorialNav.vue';

interface ScrollPosition {
    scrollTop: number;
}

declare global {
    // eslint-disable-next-line
    interface Window { MathJax: any; }
}

@Component({
    components: {
        TutorialNav,
    }
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
        });
        return this.$store.state.tutorial;
    }

    public async navigateTo(url: string, ev: MouseEvent): Promise<void> {
        ev.preventDefault();
        this.hideWithinBlockNav(true);
        await this.$store.dispatch('load', url);
        (this.$refs.content as Element).scrollTop = 0;
    }

    public showWithinBlockNav(ev: Event): void {
        this.isWithinBlockNavActive = true;
        this.withinBlockNavHeight = (this.$refs.tutorial as Element).clientHeight;
        const currentLink = (this.$refs.withinBlockNavDialog as HTMLElement).querySelector('[aria-current="true"]');
        if (currentLink) {
            (currentLink as HTMLElement).focus();
        }
        this.withinBlockNavOpener = (ev.target as HTMLElement);
        while (this.withinBlockNavOpener.localName.toLowerCase() !== 'a') {
            this.withinBlockNavOpener = this.withinBlockNavOpener.parentElement as HTMLElement;
        }
    }

    public hideWithinBlockNav(noRefocus: boolean): void {
        setTimeout(() => { this.isWithinBlockNavActive = false; }, 300);
        this.withinBlockNavHeight = 0;
        if (!noRefocus && this.withinBlockNavOpener) {
            this.withinBlockNavOpener.focus();
        }
    }

    public scrolling(ev: Event, position: ScrollPosition): void {
        this.isScrolling = (position.scrollTop > (this.$refs.header as Element).clientHeight + (this.$refs.blockNav as Element).clientHeight);
        this.$store.commit('setScrolling', position.scrollTop > (this.$refs.header as Element).clientHeight);
    }

    public articleClick(ev: MouseEvent): void {
        let target = (ev.target as HTMLElement);
        while (target && target.localName !== 'a') {
            target = target.parentElement as HTMLElement;
        }
        if (target) {
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
        }
    }

    public keyUp(ev: KeyboardEvent): void {
        if (ev.keyCode === 27 && this.isWithinBlockNavActive) {
            this.hideWithinBlockNav(false);
        }
    }
}
</script>
