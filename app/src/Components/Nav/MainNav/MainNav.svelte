<script lang="ts">
	import { onDestroy, tick } from 'svelte';

    import { data, staticUrl, isInJupyterHub, breakpoint } from '../../../store';
    import MainNavItem from './MainNavItem.svelte';
    import Icon from '../../Icon.svelte';

    let moduleTitle = 'Loading...';
    let blocks = []
    let showMenu = false;
    let menuList = null;
    let hasCurrent = false;

    const unsubscribe_data = data.subscribe((data) => {
        if (data) {
            moduleTitle = data.project;
            if (data.tutorial && data.tutorial.blocks) {
                blocks = data.tutorial.blocks;
                hasCurrent = false;
                blocks.forEach((block) => {
                    hasCurrent = hasCurrent || block.current || block.expanded;
                })
            } else {
                blocks = [];
            }
        }
    });

    function toggleMenu(ev: MouseEvent) {
        showMenu = !showMenu;
        if (showMenu) {
            tick().then(() => {
                if (menuList) {
                    const element = menuList.querySelector('a.font-bold');
                    if (element) {
                        element.focus();
                    }
                }
            });
        }
    }

    onDestroy(() => {
        unsubscribe_data();
    });
</script>

<nav class="col-start-1 col-end-4 row-start-1 row-end-2 border-b-2 border-solid boder-gray-200 lg:border-b-0 w-full">
    <ul class="flex flex-row lg:items-end">
        <li class="flex-shrink-0">
            <button on:click={toggleMenu} class="block lg:hidden px-3 py-2 {showMenu ? 'border-solid border-b-1 border-gray-200' : ''}">
                {#if showMenu}
                    <Icon icon="not_correct" alt="Hide the main menu" class="inline h-4"/>
                {:else}
                    <Icon icon="other" alt="Show the main menu" class="inline h-4"/>
                {/if}
            </button>
        </li>
        <li class="flex-shrink flex-grow overflow-hidden">
            <ul bind:this={menuList} class="flex flex-col lg:flex-row lg:items-end overflow-hidden">
                {#if showMenu || $breakpoint >= 3 || !hasCurrent}
                    <li>
                        <span class="block flex-shrink flex-grow px-3 py-2 text-blue font-bold border-solid {showMenu ? 'border-b-1' : ''} lg:border-b-2 border-gray-200">{moduleTitle}</span>
                    </li>
                {/if}
                {#each blocks as block}
                    <MainNavItem href={block.url} current={block.current || block.expanded} bind:show={showMenu}>{block.title}</MainNavItem>
                {/each}
                <li role="presentation" class="hidden lg:block flex-grow flex-shrink"><span class="lg:block border-b-2 border-solid border-gray-200"></span></li>
                {#if $isInJupyterHub}
                    <MainNavItem href="/hub/home" bind:show={showMenu} internalNav={false}>Compute Home</MainNavItem>
                    <MainNavItem href="/hub/logout" bind:show={showMenu} internalNav={false}>Logout</MainNavItem>
                {/if}
            </ul>
        </li>
        <li class="flex-shrink-0">
            <a href="https://www.open.ac.uk" target="_blank" class="block px-3 py-2 text-blue hover:text-blue-400 focus:text-blue-400 {showMenu ? 'border-b-1' : ''} lg:border-b-2 border-solid border-gray-200 hover:border-blue focus:border-blue">
                {#if $breakpoint < 3}
                    <img src="{$staticUrl}/ou_logo_small.png" alt="The Open University"/>
                {:else}
                    <img src="{$staticUrl}/ou_logo.png" alt="The Open University" class="h-8"/>
                {/if}
            </a>
        </li>
    </ul>
    <ul class="flex flex-col lg:flex-row lg:items-end">
    </ul>
</nav>
