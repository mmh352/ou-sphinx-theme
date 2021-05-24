<script lang="ts">
    import { derived } from 'svelte/store';

    import { defaultEditorFilename, currentEditorFilename } from '../store';
    import { metadata, baseUrl } from '../store/data';
    import { hasEditor } from '../store/components';

    const iFrameSrc = derived(
        [metadata, baseUrl, hasEditor, defaultEditorFilename, currentEditorFilename],
        ([metadata, baseUrl, hasEditor, defaultEditorFilename, currentEditorFilename]) => {
            if (metadata && metadata['iframe-src']) {
                if (hasEditor && currentEditorFilename && currentEditorFilename.endsWith('.html')) {
                    return baseUrl + metadata['iframe-src'] + currentEditorFilename;
                } else if (hasEditor && defaultEditorFilename) {
                    return baseUrl + metadata['iframe-src'] + defaultEditorFilename;
                } else {
                    return baseUrl + metadata['iframe-src'];
                }
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
