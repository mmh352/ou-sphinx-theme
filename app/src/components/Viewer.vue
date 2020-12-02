<template>
    <div id="viewer" style="padding: 0 1rem;">
        <h1>Welcome to this page!</h1>
        <p>We are just testing some stuff.</p>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
})
export default class Viewer extends Vue {
}
</script>
