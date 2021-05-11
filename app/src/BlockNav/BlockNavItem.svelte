<script lang="ts">
    import { navigate } from '../store';

    export let item = null;
    let expanded = item.expanded || item.current;

    function handleClick(ev: MouseEvent) {
        ev.preventDefault();
        navigate(item.url);
    }
</script>

<li>
    {#if item.children.length > 0}
        <span class="flex">
            <a on:click={handleClick} href={item.url} class="block flex-shrink flex-grow pl-4 py-2 text-blue hover:text-blue-400 {item.current ? 'font-bold' : ''}">{item.title}</a>
            <button on:click={e => expanded = !expanded}>
                {#if expanded}
                    <img src="/_static/icons/up_tab_RGB.png" alt="Collapse this menu" class="h-5"/>
                {:else}
                    <img src="/_static/icons/down_tab_RGB.png" alt="Expand this menu" class="h-5"/>
                {/if}
            </button>
        </span>
        {#if expanded}
            <ul class="pl-4">
                {#each item.children as child}
                    <svelte:self item={child}/>
                {/each}
            </ul>
        {/if}
    {:else}
        <a on:click={handleClick} href={item.url} class="block pl-4 py-2 text-blue hover:text-blue-400 {item.current ? 'font-bold' : ''}">{item.title}</a>
    {/if}
</li>
