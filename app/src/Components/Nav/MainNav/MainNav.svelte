<script lang="ts">
	import { onDestroy } from 'svelte';

    import { data, staticUrl, isInJupyterHub } from '../../../store';
    import MainNavItem from './MainNavItem.svelte';
    import Icon from '../../Icon.svelte';

    let moduleTitle = 'Loading...';
    let blocks = []
    let showMenu = false;

    const unsubscribe_data = data.subscribe((data) => {
        if (data) {
            moduleTitle = data.project;
            if (data.tutorial && data.tutorial.blocks) {
                blocks = data.tutorial.blocks;
            } else {
                blocks = [];
            }
        }
    });

    onDestroy(() => {
        unsubscribe_data();
    });
</script>

<nav class="col-start-1 col-end-4 row-start-1 row-end-2 border-b-2 border-solid boder-gray-200 lg:border-b-0">
    <ul class="flex flex-col lg:flex-row lg:items-end">
        <li class="flex items-end">
            <button on:click={e => showMenu = !showMenu} class="block lg:hidden px-3 py-2">
                <Icon icon="other" alt="Show the main menu" class="inline h-4"/>
            </button>
            <span class="block flex-shrink flex-grow px-3 py-2 text-blue font-bold border-l-2 border-solid border-white lg:border-l-0 lg:border-b-2 lg:border-gray-200">{moduleTitle}</span>
            <a href="https://www.open.ac.uk" target="_blank" class="block lg:hidden px-2 py-2"><img src="{$staticUrl}/ou_logo_small.png" alt="The Open University"/></a>
        </li>
        {#each blocks as block}
            <MainNavItem href={block.url} current={block.current || block.expanded} show={showMenu}>{block.title}</MainNavItem>
        {/each}
        <li role="presentation" class="flex-grow flex-shrink"><span class="{showMenu && $isInJupyterHub ? 'block' : 'hidden'} lg:block border-b-2 border-solid border-gray-200"></span></li>
        {#if $isInJupyterHub}
            <MainNavItem href="/hub/home" show={showMenu} internalNav={false}>Compute Home</MainNavItem>
            <MainNavItem href="/hub/logout" show={showMenu} internalNav={false}>Logout</MainNavItem>
        {/if}
        <li class="hidden lg:block"><a href="https://www.open.ac.uk" target="_blank" class="block px-3 py-2 text-blue hover:text-blue-400 focus:text-blue-400 lg:border-b-2 border-solid border-gray-200 hover:border-blue focus:border-blue"><img src="{$staticUrl}/ou_logo.png" alt="The Open University" class="h-8"/></a></li>
    </ul>
</nav>
