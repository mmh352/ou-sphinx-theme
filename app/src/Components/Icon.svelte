<script lang="ts">
    import { baseUrl } from '../store';

    export let icon = '';
    export let alt = '';
    let cls = '';
    export { cls as class };
    export let title = '';
</script>

<img src="{$baseUrl}/_static/icons/{icon}_RGB.png" alt={alt} title={title} class={cls}/>
