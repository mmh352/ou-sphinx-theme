<script lang="ts">
    import { derived } from 'svelte/store';

    import { data, baseUrl, hasEditor } from '../store';

    const iFrameSrc = derived(
        [data, baseUrl],
        ([data, baseUrl]) => {
            if (data && data.metadata && data.metadata['iframe-src']) {
                return baseUrl + data.metadata['iframe-src'];
            } else {
                return null;
            }
        },
        ''
    );
</script>

<div class="col-start-2 col-end-3 row-start-2 row-end-3 lg:col-start-3 lg:col-end-4 {$hasEditor ? 'lg:row-start-3' : 'lg:row-start-2'} lg:row-end-4 shadow-inner">
    {#if $iFrameSrc}
        <iframe src={$iFrameSrc} title="" class="w-full h-full"></iframe>
    {/if}
</div>
