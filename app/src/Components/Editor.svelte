<script lang="ts">
    import { onDestroy } from "svelte";

    import { data, hasIFrame } from '../store';
    import CodemirrorEditor from './CodemirrorEditor.svelte';

    let files = [];
    let currentFile = '';

    const unsubscribe = data.subscribe((data) => {
        if (data) {
            if (data.metadata && data.metadata['editor-files'] && data.metadata['editor-files-src']) {
                files = data.metadata['editor-files'].split(',').map((filename) => { return filename.trim(); });
                if (files.length > 0) {
                    currentFile = files[0]
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
            {#each files as file}
                <li>
                    <button on:click={ev => currentFile = file} class="block border-b-2 {file === currentFile ? 'border-blue' : 'border-gray-200'} border-solid px-3 py-1">{file}</button>
                </li>
            {/each}
            <li role="presentation" class="flex-grow flex-shrink"><span class="block border-b-2 border-gray-200 border-solid"></span></li>
        </ul>
    </nav>
    {#each files as file}
        <CodemirrorEditor filename={file} visible={file === currentFile}/>
    {/each}
</div>
