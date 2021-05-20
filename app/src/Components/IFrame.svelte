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

<div class="col-start-1 col-end-2 lg:col-start-3 lg:col-end-4 row-start-3 row-end-4 {$hasEditor ? '' : 'lg:row-start-2'} shadow-inner">
    {#if $iFrameSrc}
        <iframe id="iframe" src={$iFrameSrc} title="" class="w-full h-full"></iframe>
    {/if}
</div>
