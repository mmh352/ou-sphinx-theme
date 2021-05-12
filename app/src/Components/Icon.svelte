<script lang="ts">
    import { staticUrl } from '../store';

    export let icon = '';
    export let alt = '';
    let cls = '';
    export { cls as class };
    export let title = '';
</script>

<img src="{$staticUrl}/icons/{icon}_RGB.png" alt={alt} title={title} class={cls}/>
