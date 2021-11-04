<script lang="ts">
    import { onMount, onDestroy, tick } from 'svelte';
    import { get } from 'svelte/store';
	import { tweened } from 'svelte/motion';

    import { files, busy, changed, selected } from '../store/editor';
    import { hasIFrame } from '../store/components';
    import CodemirrorEditor from './CodemirrorEditor.svelte';

    let tabsList = null as HTMLUListElement;
    let tabsScroll = tweened(0, {
        duration: 100,
    });
    let scrollable = false;
    let showMenu = false;
    let menuToggle = null as HTMLButtonElement;
    let firstMenuItem = null as HTMLButtonElement;
    let showEditors = true;

    /**
     * Switch the files tab and set the keyboard focus.
     *
     * @param file The file to switch to
     */
    async function switchTab(file) {
        selected.set(file.filepath);
        await tick();
        (document.querySelector('#editor-' + file.id + ' .cm-editor .cm-content') as HTMLElement).focus()
    }

    const unsubscribeFiles = files.subscribe((files) => {
        const selectedValue = get(selected);
        let selectedExists = false;;
        for (let idx = 0; idx < files.length; idx++) {
            if (files[idx].filepath === selectedValue) {
                selectedExists = true;
                break;
            }
        }
        if (!selectedExists && files.length > 0) {
            selected.set(files[0].filepath);
        }
    });

    const unsubscribeTabsScroll = tabsScroll.subscribe((value) => {
        if (tabsList) {
            tabsList.scrollLeft = value;
        }
    })

    function scrollTabsLeft() {
        tabsScroll.update((value) => { return Math.max(0, value - 100); });
    }

    function scrollTabsRight() {
        tabsScroll.update((value) => { return Math.min(value + 100, tabsList.scrollWidth - tabsList.clientWidth); });
    }

    function checkScrollable() {
        scrollable = tabsList.scrollWidth > tabsList.clientWidth;
    }

    function toggleMenu(ev: Event) {
        ev.preventDefault();
        showMenu = !showMenu;
        if (showMenu) {
            tick().then(() => {
                firstMenuItem.focus();
            });
        }
    }

    function keyboardCloseMenu(ev: KeyboardEvent) {
        if (ev.key === 'Escape') {
            showMenu = false;
            menuToggle.focus();
        }
    }

    function resetCurrentFile() {
        showMenu = false;
        const filepath = get(selected);
        if (filepath) {
            busy.add(filepath);
            fetch(filepath, {
                    method: 'DELETE'
            }).finally(() => {
                busy.remove(filepath);
                showEditors = false;
                tick().then(() => {
                    showEditors = true;
                });
            });
        }
    }

    function resetAllFiles() {
        showMenu = false;
        const promises = [];
        for (const file of get(files)) {
            busy.add(file.filepath);
            const promise = fetch(file.filepath, {
                method: 'DELETE'
            });
            promises.push(promise);
            promise.finally(() => {
                busy.remove(file.filepath);
            });
        }
        Promise.all(promises).finally(() => {
            showEditors = false;
            tick().then(() => {
                showEditors = true;
            });
        });
    }

    onMount(() => {
        checkScrollable();
        window.addEventListener('resize', checkScrollable);
    });

    onDestroy(() => {
        unsubscribeFiles();
        unsubscribeTabsScroll();
        window.removeEventListener('resize', checkScrollable);
    });
</script>

<div class="flex flex-col col-start-1 col-end-2 lg:col-start-3 lg:col-end-4 row-start-3 row-end-4 lg:row-start-2 {$hasIFrame ? 'lg:row-end-3' : 'lg:row-end-4'}">
    <nav class="flex flex-row">
        <ul bind:this={tabsList} class="flex-auto flex items-end overflow-x-hidden">
            <li role="presentation"><span class="block border-b-2 border-gray-200 border-solid w-4"></span></li>
            {#each $files as file}
                <li role="presentation">
                    <button on:click={ev => switchTab(file)} class="block px-3 py-1 border-b-2 {file.filepath === $selected ? 'border-blue' : 'border-gray-200'} border-solid hover:border-blue focus:border-blue text-blue hover:text-blue-400 focus:text-blue-400 whitespace-nowrap">
                        <svg viewBox="0 0 24 24" class="inline-block w-4 h-4 mr-1 fill-current" aria-hidden="true">
                            {#if $busy.indexOf(file.filepath) >= 0}
                                <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z">
                                    <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                                </path>
                            {:else if file.type === 'html'}
                                <path d="M12,17.56L16.07,16.43L16.62,10.33H9.38L9.2,8.3H16.8L17,6.31H7L7.56,12.32H14.45L14.22,14.9L12,15.5L9.78,14.9L9.64,13.24H7.64L7.93,16.43L12,17.56M4.07,3H19.93L18.5,19.2L12,21L5.5,19.2L4.07,3Z" />
                            {:else if file.type === 'css'}
                                <path d="M5,3L4.35,6.34H17.94L17.5,8.5H3.92L3.26,11.83H16.85L16.09,15.64L10.61,17.45L5.86,15.64L6.19,14H2.85L2.06,18L9.91,21L18.96,18L20.16,11.97L20.4,10.76L21.94,3H5Z" />
                            {:else if file.type === 'javascript'}
                                <path d="M3,3H21V21H3V3M7.73,18.04C8.13,18.89 8.92,19.59 10.27,19.59C11.77,19.59 12.8,18.79 12.8,17.04V11.26H11.1V17C11.1,17.86 10.75,18.08 10.2,18.08C9.62,18.08 9.38,17.68 9.11,17.21L7.73,18.04M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86Z" />
                            {:else if file.type === 'php'}
                                <path d="M12,18.08C5.37,18.08 0,15.36 0,12C0,8.64 5.37,5.92 12,5.92C18.63,5.92 24,8.64 24,12C24,15.36 18.63,18.08 12,18.08M6.81,10.13C7.35,10.13 7.72,10.23 7.9,10.44C8.08,10.64 8.12,11 8.03,11.47C7.93,12 7.74,12.34 7.45,12.56C7.17,12.78 6.74,12.89 6.16,12.89H5.29L5.82,10.13H6.81M3.31,15.68H4.75L5.09,13.93H6.32C6.86,13.93 7.3,13.87 7.65,13.76C8,13.64 8.32,13.45 8.61,13.18C8.85,12.96 9.04,12.72 9.19,12.45C9.34,12.19 9.45,11.89 9.5,11.57C9.66,10.79 9.55,10.18 9.17,9.75C8.78,9.31 8.18,9.1 7.35,9.1H4.59L3.31,15.68M10.56,7.35L9.28,13.93H10.7L11.44,10.16H12.58C12.94,10.16 13.18,10.22 13.29,10.34C13.4,10.46 13.42,10.68 13.36,11L12.79,13.93H14.24L14.83,10.86C14.96,10.24 14.86,9.79 14.56,9.5C14.26,9.23 13.71,9.1 12.91,9.1H11.64L12,7.35H10.56M18,10.13C18.55,10.13 18.91,10.23 19.09,10.44C19.27,10.64 19.31,11 19.22,11.47C19.12,12 18.93,12.34 18.65,12.56C18.36,12.78 17.93,12.89 17.35,12.89H16.5L17,10.13H18M14.5,15.68H15.94L16.28,13.93H17.5C18.05,13.93 18.5,13.87 18.85,13.76C19.2,13.64 19.5,13.45 19.8,13.18C20.04,12.96 20.24,12.72 20.38,12.45C20.53,12.19 20.64,11.89 20.7,11.57C20.85,10.79 20.74,10.18 20.36,9.75C20,9.31 19.37,9.1 18.54,9.1H15.79L14.5,15.68Z" />
                            {:else}
                                <path d="M14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2M18 20H6V4H13V9H18V20M9.54 15.65L11.63 17.74L10.35 19L7 15.65L10.35 12.3L11.63 13.56L9.54 15.65M17 15.65L13.65 19L12.38 17.74L14.47 15.65L12.38 13.56L13.65 12.3L17 15.65Z" />
                            {/if}
                        </svg>
                        {file.filename}
                        {#if $changed.indexOf(file.filepath) >= 0}
                            <svg viewBox="0 0 24 24" class="inline-block w-4 h-4 text-orange-700 fill-current">
                                <path d="M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" />
                            </svg>
                        {/if}
                    </button>
                </li>
            {/each}
            <li role="presentation" class="flex-grow flex-shrink"><span class="block border-b-2 border-gray-200 border-solid"></span></li>
        </ul>
        <ul class="flex-0 flex items-end">
            <li role="presentation" class="relative">
                <button bind:this={menuToggle} on:click={toggleMenu} class="block px-1 py-1 border-b-2 border-gray-200 border-solid hover:border-blue focus:border-blue text-blue hover:text-blue-400 focus:text-blue-400 whitespace-nowrap" aria-label="Scroll the tabs to the left">
                    <svg viewBox="0 0 24 24" class="inline-block w-4 h-4 mr-1 fill-current" aria-hidden="true">
                        <path fill="currentColor" d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z" />
                    </svg>
                </button>
                {#if showMenu}
                    <ul on:keyup={keyboardCloseMenu} class="absolute top-full right-0 bg-white z-10 shadow-lg">
                        <li role="presentation">
                            <button bind:this={firstMenuItem} on:click={resetCurrentFile} class="block px-1 py-1 border-l-2 border-gray-200 border-solid hover:border-blue focus:border-blue text-blue hover:text-blue-400 focus:text-blue-400 whitespace-nowrap whitespace-nowrap">Reset the current file</button>
                        </li>
                        <li role="presentation">
                            <button on:click={resetAllFiles} class="block px-1 py-1 border-l-2 border-gray-200 border-solid hover:border-blue focus:border-blue text-blue hover:text-blue-400 focus:text-blue-400 whitespace-nowrap whitespace-nowrap">Reset all files</button>
                        </li>
                    </ul>
                {/if}
            </li>
            {#if scrollable}
                <li role="presentation">
                    <button on:click={scrollTabsLeft} class="block px-1 py-1 border-b-2 border-gray-200 border-solid hover:border-blue focus:border-blue text-blue hover:text-blue-400 focus:text-blue-400 whitespace-nowrap" aria-label="Scroll the tabs to the left">
                        <svg viewBox="0 0 24 24" class="inline-block w-4 h-4 mr-1 fill-current" aria-hidden="true">
                            <path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                        </svg>
                    </button>
                </li>
                <li role="presentation">
                    <button on:click={scrollTabsRight} class="block px-1 py-1 border-b-2 border-gray-200 border-solid hover:border-blue focus:border-blue text-blue hover:text-blue-400 focus:text-blue-400 whitespace-nowrap" aria-label="Scroll the tabs to the right">
                        <svg viewBox="0 0 24 24" class="inline-block w-4 h-4 mr-1 fill-current" aria-hidden="true">
                            <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                        </svg>
                    </button>
                </li>
            {/if}
        </ul>
    </nav>
    {#if showEditors}
        {#each $files as file}
            <CodemirrorEditor file={file} visible={file.filepath === $selected}/>
        {/each}
    {/if}
</div>
