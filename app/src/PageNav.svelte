<script lang="ts">
	import { onDestroy } from 'svelte';

    import { data, navigate } from './store';

    let next = null;
    let prev = null;

    const unsubscribe_data = data.subscribe((data) => {
        if (data) {
            prev = data.tutorial.prev;
            next = data.tutorial.next;
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

<nav class="px-4 py-4">
    <ul class="flex flex-row">
        <li class="overflow-hidden">
            {#if prev}
                <a on:click={handleNav} href={prev.url} class="flex w-full items-center overflow-hidden text-blue hover:text-blue-400 focus:text-blue-400 hover:underline focus:underline">
                    <img src="/_static/icons/back_left_RGB.png" alt="" class="w-6 h-6 mr-2"/>
                    <span class="block flex-grow flex-shrink overflow-hidden">
                        <span class="block text-left">Previous</span>
                        <span class="block text-left text-sm truncate">{@html prev.title}</span>
                    </span>
                </a>
            {:else}
                <span class="flex w-full items-center overflow-hidden text-black-300">
                    <img src="/_static/icons/back_left_RGB.png" alt="" class="w-6 h-6 mr-2"/>
                    <span class="block flex-grow flex-shrink overflow-hidden">
                        <span class="block text-left">Previous</span>
                        <span class="block text-left text-sm truncate">You are at the beginning</span>
                    </span>
                </span>
            {/if}
        </li>
        <li role="presentation" class="flex-grow flex-shrink min-w-1rem"></li>
        <li class="overflow-hidden">
            {#if next}
                <a on:click={handleNav} href={next.url} class="flex w-full items-center overflow-hidden text-blue hover:text-blue-400 focus:text-blue-400 hover:underline focus:underline">
                    <span class="block flex-grow flex-shrink overflow-hidden">
                        <span class="block text-right">Next</span>
                        <span class="block text-right text-sm truncate">{@html next.title}</span>
                    </span>
                    <img src="/_static/icons/forward_right_RGB.png" alt="" class="w-6 h-6 ml-2"/>
                </a>
            {:else}
                <span class="flex w-full items-center overflow-hidden text-black-300">
                    <span class="block flex-grow flex-shrink overflow-hidden">
                        <span class="block text-right">Next</span>
                        <span class="block text-right text-sm truncate">You have reached the end</span>
                    </span>
                    <img src="/_static/icons/forward_right_RGB.png" alt="" class="w-6 h-6 ml-2"/>
                </span>
            {/if}
        </li>
    </ul>
</nav>
