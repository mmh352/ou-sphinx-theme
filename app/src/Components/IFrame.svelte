<script lang="ts">
    import { onDestroy } from 'svelte';
    import { derived } from 'svelte/store';

    import { files, selected } from '../store/editor';
    import { metadata, baseUrl } from '../store/data';
    import { hasEditor } from '../store/components';

    /**
     * Extract the iFrameSrc from the metadata.
     */
    const metadataIFrameSrc = derived(
        [baseUrl, metadata],
        ([baseUrl, metadata]) => {
            if (metadata && metadata['iframe-src']) {
                return baseUrl + metadata['iframe-src'];
            } else {
                return null;
            }
        },
        null
    );

    let lastHTMLSelected = '';

    /**
     * Derive the iFrame source. Either based on the currently selected file in the editor,
     * the last HTML file selected in the editor, or the iFrame source set in the metadata.
     */
    const iFrameSrc = derived(
        [metadataIFrameSrc, files, selected],
        ([metadataIFrameSrc, files, selected]) => {
            if (metadataIFrameSrc) {
                if (files.length > 0) {
                    let filename = '';
                    let defaultFilename = lastHTMLSelected;
                    for (let idx = 0; idx < files.length; idx++) {
                        if (files[idx].filepath === selected && files[idx].filepath.endsWith('.html')) {
                            lastHTMLSelected = files[idx].filename;
                        }
                        if (defaultFilename === '' && files[idx].filename.endsWith('.html')) {
                            defaultFilename = files[idx].filename;
                        }
                        if (files[idx].filepath == selected && files[idx].filename.endsWith('.html')) {
                            filename = files[idx].filename;
                            break
                        }
                    }
                    if (filename === '' && defaultFilename !== '') {
                        filename = defaultFilename;
                    }
                    if (filename !== '') {
                        return metadataIFrameSrc + filename;
                    } else {
                        return null;
                    }
                } else {
                    return metadataIFrameSrc;
                }
            } else {
                return null;
            }
        },
        null
    );
</script>

<div class="col-start-1 col-end-2 lg:col-start-3 lg:col-end-4 row-start-3 row-end-4 {$hasEditor ? '' : 'lg:row-start-2'} shadow-inner">
    {#if $iFrameSrc}
        <iframe id="iframe" src={$iFrameSrc} title="" class="w-full h-full"></iframe>
    {/if}
</div>
