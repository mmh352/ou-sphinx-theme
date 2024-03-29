<script lang="ts">
	import { onDestroy } from 'svelte';

	import { tutorial } from './store/data';
	import { isConnected } from './store/status';
    import { breakpoint } from './store/breakpoint';
    import { hasEditor, hasIFrame } from './store/components';
	import MainNav from './Components/Nav/MainNav/MainNav.svelte';
	import Tutorial from './Components/Tutorial.svelte';
	import SideNav from './Components/Nav/SideNav.svelte';
	import BlockNav from './Components/Nav/BlockNav/BlockNav.svelte';
	import Editor from './Components/Editor.svelte';
	import IFrame from './Components/IFrame.svelte';
	import ConnectionStatus from './Components/ConnectionStatus.svelte';

	let section = 'tutorial';

    const unsubscribe = tutorial.subscribe((value) => {
        if (value) {
            section = 'tutorial';
        }
    });

	/** Jump ahead to the tutorial content, skipping the navigation menus. */
	function jumpToTutorial(ev: Event) {
		ev.preventDefault();
		const tutorial = document.querySelector('#tutorial');
		if (tutorial) {
			(tutorial as HTMLElement).focus();
		}
	}

    onDestroy(unsubscribe);
</script>

<main class="grid grid-cols-single-pane grid-rows-single-pane lg:grid-cols-three-pane lg:grid-rows-three-pane w-screen h-screen short:w-auto short:h-auto">
	<a href="#tutorial" class="sr-only" on:click={jumpToTutorial}>Jump to the tutorial</a>
	<MainNav/>
	<SideNav bind:section={section}/>
	{#if section === 'tutorial'}
		<Tutorial/>
	{:else if section === 'block-navigation'}
		<BlockNav/>
	{/if}
	{#if $hasEditor && (section === 'editor' || $breakpoint >= 3)}
		<Editor/>
	{/if}
	{#if $hasIFrame && (section === 'iframe' || $breakpoint >= 3)}
		<IFrame/>
	{/if}
	{#if !$isConnected}
		<ConnectionStatus/>
	{/if}
</main>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
