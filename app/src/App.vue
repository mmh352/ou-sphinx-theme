<template>
    <div id="app" :class="appClasses">
        <tutorial v-if="hasTutorial"></tutorial>
        <iframe id="iframe" v-if="hasIFrame" :src="$store.state.metadata['iframe-src']"></iframe>
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

    public get layout() {
        if (this.$store.state.metadata && this.$store.state.metadata.layout) {
            return this.$store.state.metadata.layout;
        } else {
            return 'tutorial-only-center';
        }
    }

    public get appClasses() {
        return ['layout-' + this.layout];
    }

    public get hasTutorial() {
        return ['tutorial-only', 'tutorial-only-left', 'tutorial-only-center', 'tutorial-only-right', 'tutorial-iframe'].indexOf(this.layout) >= 0;
    }

    public get hasIFrame() {
        return this.layout === 'tutorial-iframe';
    }

    public created() {
        const pageData = document.querySelector('script#json-blob');
        if (pageData) {
            this.$store.commit('setPage', JSON.parse(atob(pageData.innerHTML)));
            window.addEventListener('popstate', () => {
                this.$store.dispatch('fetch', window.location.href);
            });
        }
    }
}
</script>
