<script lang="ts">
    import { navigate } from '../../../store/navigation';
    import Icon from '../../Icon.svelte';

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
                    <Icon icon="up_tab" alt="Collapse the {item.title} menu" class="h-5"/>
                {:else}
                    <Icon icon="down_tab" alt="Expand the {item.title} menu" class="h-5"/>
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
