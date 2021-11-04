<script lang="ts">
    import { onDestroy } from 'svelte';
    import { derived } from 'svelte/store';

    import { files, selected } from '../store/editor';
    import { metadata, baseUrl } from '../store/data';
    import { hasEditor } from '../store/components';

    let iFrame = null as HTMLIFrameElement;

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
                        if (files[idx].filepath === selected && (files[idx].filepath.endsWith('.html') || files[idx].filepath.endsWith('.php'))) {
                            lastHTMLSelected = files[idx].filename;
                        }
                        if (defaultFilename === '' && (files[idx].filename.endsWith('.html') || files[idx].filename.endsWith('.php'))) {
                            defaultFilename = files[idx].filename;
                        }
                        if (files[idx].filepath == selected && (files[idx].filename.endsWith('.html') || files[idx].filename.endsWith('.php'))) {
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

    function reloadIFrame() {
        const oldSrc = iFrame.src;
        iFrame.src = '';
        setTimeout(() => {
            iFrame.src = oldSrc;
        }, 10);
    }
</script>

<div class="col-start-1 col-end-2 lg:col-start-3 lg:col-end-4 row-start-3 row-end-4 {$hasEditor ? '' : 'lg:row-start-2'} shadow-inner relative">
    <nav class="absolute top-0 right-0 z-1 bg-white shadow-lg">
        <button on:click={reloadIFrame} aria-label="Reload the viewer page" class="block px-3 py-1 border-b-2 border-white border-solid hover:border-blue focus:border-blue text-blue hover:text-blue-400 focus:text-blue-400 whitespace-nowrap">
            <svg viewBox="0 0 24 24" class="inline-block w-4 h-4 fill-current">
                <path fill="currentColor" d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
            </svg>
        </button>
    </nav>
    {#if $iFrameSrc}
        <iframe bind:this={iFrame} id="iframe" src={$iFrameSrc} title="" class="w-full h-full"></iframe>
    {/if}
</div>
