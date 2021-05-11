<script lang="ts">
    export let icon = '';
    export let alt = '';
    let cls = '';
    export { cls as class };
    export let title = '';
</script>

<img src="/_static/icons/{icon}_RGB.png" alt={alt} title={title} class={cls}/>
