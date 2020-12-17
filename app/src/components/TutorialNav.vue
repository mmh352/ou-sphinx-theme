<template>
    <ul role="menu">
        <li role="none" v-for="(item, idx) in items" :key="idx">
            <a v-if="item.children.length === 0" tabindex="-1" role="menuitem" :href="item.url" :aria-current="item.current ? 'page' : 'false'" @click="click(item.url, $event)">{{ item.title }}</a>
            <template v-else>
                <a tabindex="-1" role="menuitem" aria-haspopup="menu" :href="item.url" :aria-current="item.current ? 'page' : 'false'" :aria-expanded="item.expanded ? 'true' : 'false'" @click="click(item.url, $event)">{{ item.title }}</a>
                <button aria-hidden="true" tabindex="-1" @click="toggleShowHide(item)">
                    <svg viewBox="0 0 24 24" class="icon">
                        <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                    </svg>
                    <svg viewBox="0 0 24 24" class="icon">
                        <path fill="currentColor" d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" />
                    </svg>
                </button>
                <tutorial-nav :items="item.children" @click="click"></tutorial-nav>
            </template>
        </li>
    </ul>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import { LinkState } from '../store/index';

@Options({
    name: 'tutorial-nav',
    props: {
        items: Array,
    },
    emits: {
        click: null,
    }
})
export default class TutorialNav extends Vue {
    public items!: LinkState[];

    public expanded = [];

    public click(url: string, ev: MouseEvent): void {
        this.$emit('click', url, ev);
    }

    public toggleShowHide(item: LinkState): void {
        item.expanded = !item.expanded;
    }
}
</script>
