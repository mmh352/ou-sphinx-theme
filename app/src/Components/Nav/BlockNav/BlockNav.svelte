<script lang="ts">
	import { onDestroy } from 'svelte';

    import { data } from '../../../store';
    import BlockNavItem from './BlockNavItem.svelte';

    let navRoot = null;

    const unsubscribe = data.subscribe((value) => {
        if (value) {
            navRoot = value.tutorial.withinBlockNav;
        }
    });

    onDestroy(unsubscribe);
</script>

<nav class="col-start-2 col-end-3 row-start-2 row-end-3 lg:row-end-4 flex flex-col border-r-2 border-solid border-gray-200 py-2 pr-4">
    <ul>
        {#if navRoot}
            <BlockNavItem item={navRoot}/>
        {/if}
    </ul>
</nav>
