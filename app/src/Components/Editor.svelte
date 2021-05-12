<script lang="ts">
    import { onDestroy, tick } from "svelte";

    import { data, hasIFrame } from '../store';
    import CodemirrorEditor from './CodemirrorEditor.svelte';

    let files = [];
    let currentFile = '';

    function determineFileType(filename: string) {
        if (filename) {
            if (filename.endsWith('.html')) {
                return 'html';
            } else if (filename.endsWith('.css')) {
                return 'css';
            } else if (filename.endsWith('.js')) {
                return 'javascript';
            }
        }
        return '';
    }

    async function switchTab(file) {
        currentFile = file;
        await tick();
        (document.querySelector('#editor-' + file.id + ' .cm-editor .cm-content') as HTMLElement).focus()
    }

    const unsubscribe = data.subscribe((data) => {
        if (data) {
            if (data.metadata && data.metadata['editor-files'] && data.metadata['editor-files-src']) {
                files = data.metadata['editor-files'].split(',').map((filename, idx) => {
                    return {
                        id: idx,
                        busy: false,
                        filename: filename.trim(),
                        content: '',
                        changed: false,
                        type: determineFileType(filename.trim()),
                    };
                });
                if (files.length > 0) {
                    currentFile = files[0];
                }
            }
        }
    });

    onDestroy(unsubscribe);
</script>

<div class="flex flex-col col-start-2 col-end-3 row-start-2 row-end-3 lg:col-start-3 lg:col-end-4 lg:row-start-2 {$hasIFrame ? 'lg:row-end-3' : 'lg:row-end-4'}">
    <nav>
        <ul class="flex items-end">
            <li role="presentation"><span class="block border-b-2 border-gray-200 border-solid w-4"></span></li>
            {#each files as file, idx}
                <li>
                    <button on:click={ev => switchTab(file)} class="block px-3 py-1 border-b-2 {file === currentFile ? 'border-blue' : 'border-gray-200'} border-solid hover:border-blue focus:border-blue text-blue hover:text-blue-400 focus:text-blue-400">
                        <svg viewBox="0 0 24 24" class="inline-block w-4 h-4 mr-1 fill-current" aria-hidden="true">
                            {#if file.busy}
                                <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z">
                                    <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                                </path>
                            {:else if file.type === 'html'}
                                <path d="M12,17.56L16.07,16.43L16.62,10.33H9.38L9.2,8.3H16.8L17,6.31H7L7.56,12.32H14.45L14.22,14.9L12,15.5L9.78,14.9L9.64,13.24H7.64L7.93,16.43L12,17.56M4.07,3H19.93L18.5,19.2L12,21L5.5,19.2L4.07,3Z" />
                            {:else if file.type === 'css'}
                                <path d="M5,3L4.35,6.34H17.94L17.5,8.5H3.92L3.26,11.83H16.85L16.09,15.64L10.61,17.45L5.86,15.64L6.19,14H2.85L2.06,18L9.91,21L18.96,18L20.16,11.97L20.4,10.76L21.94,3H5Z" />
                            {:else if file.type === 'javascript'}
                                <path d="M3,3H21V21H3V3M7.73,18.04C8.13,18.89 8.92,19.59 10.27,19.59C11.77,19.59 12.8,18.79 12.8,17.04V11.26H11.1V17C11.1,17.86 10.75,18.08 10.2,18.08C9.62,18.08 9.38,17.68 9.11,17.21L7.73,18.04M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86Z" />
                            {:else}
                                <path d="M14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2M18 20H6V4H13V9H18V20M9.54 15.65L11.63 17.74L10.35 19L7 15.65L10.35 12.3L11.63 13.56L9.54 15.65M17 15.65L13.65 19L12.38 17.74L14.47 15.65L12.38 13.56L13.65 12.3L17 15.65Z" />
                            {/if}
                        </svg>
                        {file.filename}
                        {#if file.changed}
                            <svg viewBox="0 0 24 24" class="inline-block w-4 h-4 text-orange-700 fill-current">
                                <path d="M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" />
                            </svg>
                        {/if}
                    </button>
                </li>
            {/each}
            <li role="presentation" class="flex-grow flex-shrink"><span class="block border-b-2 border-gray-200 border-solid"></span></li>
        </ul>
    </nav>
    {#each files as file}
        <CodemirrorEditor bind:file={file} visible={file === currentFile}/>
    {/each}
</div>
