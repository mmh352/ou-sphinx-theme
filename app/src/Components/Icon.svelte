<script lang="ts">
    import { staticUrl } from '../store/data';

    export let icon = '';
    export let alt = '';
    let cls = '';
    export { cls as class };
    export let title = '';
</script>

{#if $staticUrl}
    <img src="{$staticUrl}/icons/{icon}_RGB.png" alt={alt} title={title} class={cls}/>
{/if}
