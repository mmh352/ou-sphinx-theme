<template>
    <div id="tutorial" ref="tutorial" @keyup="keyUp">
        <a href="#tutorial-content" class="show-for-sr">Jump to the main content</a>
        <div :class="{ 'scrolling': isScrolling, 'content': true }" ref="content" v-scroll="scrolling">
            <header ref="header">
                <div>
                    <a :href="urls.root" @click="navigateTo(urls.root, $event)" :title="project">{{ project }}</a>
                </div>
                <form>
                    <!--<label><span class="show-for-sr">Search within {{ project }}</span>
                        <input type="search" :placeholder="'Search within ' + project"/>
                    </label>
                    <button aria-label="Search">
                        <svg viewBox="0 0 24 24" class="icon">
                            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                        </svg>
                    </button>-->
                </form>
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
                            <svg viewBox="0 0 24 24" class="icon small">
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
                            <svg viewBox="0 0 24 24" class="icon small">
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

import TutorialNav from './TutorialNav.vue';

interface ScrollPosition {
    scrollTop: number;
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

    public get urls() {
        return this.$store.state.urls;
    }

    public get project() {
        return this.$store.state.project;
    }

    public get tutorial() {
        this.$nextTick(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            if (window.MathJax) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                window.MathJax.typeset();
            }
        });
        return this.$store.state.tutorial;
    }

    public async navigateTo(url: string, ev: MouseEvent) {
        ev.preventDefault();
        this.hideWithinBlockNav(true);
        await this.$store.dispatch('load', url);
        (this.$refs.content as Element).scrollTop = 0;
    }

    public showWithinBlockNav(ev: Event) {
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

    public hideWithinBlockNav(noRefocus: boolean) {
        setTimeout(() => { this.isWithinBlockNavActive = false; }, 300);
        this.withinBlockNavHeight = 0;
        if (!noRefocus && this.withinBlockNavOpener) {
            this.withinBlockNavOpener.focus();
        }
    }

    public scrolling(ev: Event, position: ScrollPosition) {
        this.isScrolling = (position.scrollTop > (this.$refs.header as Element).clientHeight + (this.$refs.blockNav as Element).clientHeight);
        this.$store.commit('setScrolling', position.scrollTop > (this.$refs.header as Element).clientHeight);
    }

    public articleClick(ev: MouseEvent) {
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

    public keyUp(ev: KeyboardEvent) {
        if (ev.keyCode === 27 && this.isWithinBlockNavActive) {
            this.hideWithinBlockNav(false);
        }
    }
}
</script>
