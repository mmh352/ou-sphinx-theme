<script lang="ts">
	import { onDestroy } from 'svelte';

    import { data, busy, isInJupyterHub, navigate } from './store';

    let moduleTitle = 'Loading...';
    let blocks = []

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

    function handleNav(ev: MouseEvent) {
        ev.preventDefault();
        let target = ev.target as HTMLElement;
        while (target && target.localName !== 'a') {
            target = target.parentElement;
        }
        if (target) {
            navigate(target.getAttribute('href'));
        }
    }
</script>

<nav class="col-start-1 col-end-4 row-start-1 row-end-2">
    <ul class="flex flex-row items-end">
        <li><span class="block px-3 py-2 border-b-2 border-solid border-gray-200 text-blue font-bold">{ moduleTitle }</span></li>
        {#each blocks as block}
            {#if block.current || block.expanded}
                <li><a on:click={handleNav} href={block.url} class="block px-3 py-2 text-blue hover:text-blue-400 focus:text-blue-400 border-b-2 border-solid border-orange hover:border-blue focus:border-blue">{@html block.title}</a></li>
            {:else}
                <li><a on:click={handleNav} href={block.url} class="block px-3 py-2 text-blue hover:text-blue-400 focus:text-blue-400 border-b-2 border-solid border-gray-200 hover:border-blue focus:border-blue">{@html block.title}</a></li>
            {/if}
        {/each}
        <li role="presentation" class="flex-grow flex-shrink"><span class="block border-b-2 border-solid border-gray-200">&nbsp;</span></li>
        {#if $busy}
            <li role="presentation" class="self-stretch"><span class="flex border-b-2 border-solid border-gray-200 h-full"><img src="/_static/icons/repeat_RGB.png" alt="Loading..." class="w-4 h-4 self-center mx-4"/></span></li>
        {/if}
        <li class="presentation"></li>
        {#if $isInJupyterHub}
            <li><a href="/hub/home" class="block px-3 py-2 text-blue hover:text-blue-400 focus:text-blue-400 border-b-2 border-solid border-gray-200 hover:border-blue focus:border-blue">Compute Home</a></li>
            <li><a href="/hub/logout" class="block px-3 py-2 text-blue hover:text-blue-400 focus:text-blue-400 border-b-2 border-solid border-gray-200 hover:border-blue focus:border-blue">Logout</a></li>
        {/if}
        <li><a href="https://www.open.ac.uk" target="_blank" class="block px-3 py-2 text-blue hover:text-blue-400 focus:text-blue-400 border-b-2 border-solid border-gray-200 hover:border-blue focus:border-blue"><img src="/_static/ou_logo.png" alt="The Open University" class="h-8" /></a></li>
    </ul>
</nav>
