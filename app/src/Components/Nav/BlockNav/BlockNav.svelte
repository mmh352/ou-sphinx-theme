<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

    import { withinBlockNav } from '../../../store/data';
    import BlockNavItem from './BlockNavItem.svelte';

    let menuRootElement = null;

    onMount(() => {
        if (menuRootElement) {
            const element = menuRootElement.querySelector('a.font-bold');
            if (element) {
                element.focus();
            }
        }
    });
</script>

<nav class="col-start-1 col-end-2 lg:col-start-2 lg:col-end-3 row-start-3 row-end-4 lg:row-start-2 lg:row-end-4 flex flex-col lg:border-r-2 border-solid border-gray-200 py-2 pr-4 overflow-auto">
    <ul bind:this={menuRootElement}>
        {#if $withinBlockNav}
            <BlockNavItem item={$withinBlockNav}/>
        {/if}
    </ul>
</nav>
