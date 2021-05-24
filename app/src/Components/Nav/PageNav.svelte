<script lang="ts">
	import { derived } from 'svelte/store';

    import { tutorial } from '../../store/data';
    import { navigate } from '../../store/navigation';
    import Icon from '../Icon.svelte';

    let next = derived(
        tutorial,
        (tutorial) => {
            if (tutorial && tutorial.next) {
                return tutorial.next;
            } else {
                return null;
            }
        },
        null
    );
    let prev = derived(
        tutorial,
        (tutorial) => {
            if (tutorial && tutorial.prev) {
                return tutorial.prev;
            } else {
                return null;
            }
        },
        null
    );

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
            {#if $prev}
                <a on:click={handleNav} href={$prev.url} class="flex w-full items-center overflow-hidden text-blue hover:text-blue-400 focus:text-blue-400 hover:underline focus:underline">
                    <Icon icon="back_left" alt="" class="w-6 h-6 mr-2"/>
                    <span class="block flex-grow flex-shrink overflow-hidden">
                        <span class="block text-left">Previous</span>
                        <span class="block text-left text-sm truncate">{@html $prev.title}</span>
                    </span>
                </a>
            {:else}
                <span class="flex w-full items-center overflow-hidden text-black-300">
                    <Icon icon="back_left" alt="" class="w-6 h-6 mr-2"/>
                    <span class="block flex-grow flex-shrink overflow-hidden">
                        <span class="block text-left">Previous</span>
                        <span class="block text-left text-sm truncate">You are at the beginning</span>
                    </span>
                </span>
            {/if}
        </li>
        <li role="presentation" class="flex-grow flex-shrink min-w-1rem"></li>
        <li class="overflow-hidden">
            {#if $next}
                <a on:click={handleNav} href={$next.url} class="flex w-full items-center overflow-hidden text-blue hover:text-blue-400 focus:text-blue-400 hover:underline focus:underline">
                    <span class="block flex-grow flex-shrink overflow-hidden">
                        <span class="block text-right">Next</span>
                        <span class="block text-right text-sm truncate">{@html $next.title}</span>
                    </span>
                    <Icon icon="forward_right" alt="" class="w-6 h-6 ml-2"/>
                </a>
            {:else}
                <span class="flex w-full items-center overflow-hidden text-black-300">
                    <span class="block flex-grow flex-shrink overflow-hidden">
                        <span class="block text-right">Next</span>
                        <span class="block text-right text-sm truncate">You have reached the end</span>
                    </span>
                    <Icon icon="forward_right" alt="" class="w-6 h-6 ml-2"/>
                </span>
            {/if}
        </li>
    </ul>
</nav>
