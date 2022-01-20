<script lang="ts">
    import { onDestroy } from 'svelte';
    import { derived } from 'svelte/store';

    import { changeEvent, files, selected } from '../store/editor';
    import { metadata, baseUrl } from '../store/data';
    import { hasEditor } from '../store/components';

    let iFrame = null as HTMLIFrameElement;
    let externalWindow = null as Window;

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
        if (iFrame) {
            iFrame.contentWindow.location.reload();
        }
        if (externalWindow) {
            externalWindow.location.reload();
        }
    }

    function openExternal() {
        externalWindow = window.open($iFrameSrc);
    }

    const changeEventUnsubscribe = changeEvent.subscribe((value) => {
        reloadIFrame();
    });

    onDestroy(changeEventUnsubscribe);
</script>

<div class="col-start-1 col-end-2 lg:col-start-3 lg:col-end-4 row-start-3 row-end-4 {$hasEditor ? '' : 'lg:row-start-2'} shadow-inner relative">
    <nav class="absolute top-0 right-0 z-1 bg-white shadow-lg flex flex-row">
        <button on:click={openExternal} aria-label="Open in a separate tab / window" class="block px-3 py-1 border-b-2 border-white border-solid hover:border-blue focus:border-blue text-blue hover:text-blue-400 focus:text-blue-400 whitespace-nowrap">
            <svg viewBox="0 0 24 24" class="inline-block w-4 h-4 fill-current">
                <path fill="currentColor" d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
            </svg>
        </button>
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
