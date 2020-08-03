<template>
    <ul>
        <template v-for="(item, idx) in items" >
            <li v-if="item.children.length > 0" :key="idx" :aria-expanded="item.expanded ? 'true': 'false'">
                <span>
                    <a :href="item.url" :aria-current="item.current ? 'true' : 'false'" @click="click(item.url, $event)">{{ item.title }}</a>
                    <button aria-label="Show or hide this section" @click="toggleShowHide(item)">
                        <svg viewBox="0 0 24 24" class="icon">
                            <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                        </svg>
                        <svg viewBox="0 0 24 24" class="icon">
                            <path fill="currentColor" d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" />
                        </svg>
                    </button>
                </span>
                <tutorial-nav :items="item.children" @click="click"></tutorial-nav>
            </li>
            <li v-else :key="idx">
                <a :href="item.url" :aria-current="item.current ? 'true' : 'false'" @click="click(item.url, $event)">{{ item.title }}</a>
            </li>
        </template>
    </ul>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { LinkState } from '../store/index';

@Component({
    name: 'tutorial-nav',
})
export default class TutorialNav extends Vue {
    @Prop() public items!: LinkState[];

    public expanded = [];

    public click(url: string, ev: MouseEvent) {
        this.$emit('click', url, ev);
    }

    public toggleShowHide(item: LinkState) {
        item.expanded = !item.expanded;
    }
}
</script>
