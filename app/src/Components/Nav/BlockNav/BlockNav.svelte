<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

    import { data } from '../../../store';
    import BlockNavItem from './BlockNavItem.svelte';

    let navRoot = null;
    let menuRootElement = null;

    const unsubscribe = data.subscribe((value) => {
        if (value) {
            navRoot = value.tutorial.withinBlockNav;
        }
    });

    onMount(() => {
        console.log(menuRootElement);
        if (menuRootElement) {
            const element = menuRootElement.querySelector('a.font-bold');
            if (element) {
                element.focus();
            }
        }
        console.log('mounted');
    });

    onDestroy(unsubscribe);
</script>

<nav class="col-start-1 col-end-2 lg:col-start-2 lg:col-end-3 row-start-3 row-end-4 lg:row-start-2 lg:row-end-4 flex flex-col lg:border-r-2 border-solid border-gray-200 py-2 pr-4">
    <ul bind:this={menuRootElement}>
        {#if navRoot}
            <BlockNavItem item={navRoot}/>
        {/if}
    </ul>
</nav>
