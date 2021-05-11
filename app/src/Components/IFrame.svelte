<script lang="ts">
	import { onDestroy } from 'svelte';

    import { data, hasEditor } from '../store';

    let iFrameSrc = null;

    const unsubscribe = data.subscribe((value) => {
        if (value) {
            iFrameSrc = value.metadata['iframe-src'];
        }
    });

    onDestroy(unsubscribe);
</script>

<div class="col-start-2 col-end-3 row-start-2 row-end-3 lg:col-start-3 lg:col-end-4 {$hasEditor ? 'lg:row-start-3' : 'lg:row-start-2'} lg:row-end-4 shadow-inner">
    {#if iFrameSrc}
        <iframe src={iFrameSrc} title="" class="w-full h-full"></iframe>
    {/if}
</div>
