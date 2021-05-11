<script lang="ts">
	import { onDestroy } from 'svelte';

	import { data, hasIFrame, hasEditor } from './store';
	import MainNav from './Components/Nav/MainNav/MainNav.svelte';
	import Tutorial from './Components/Tutorial.svelte';
	import SideNav from './Components/Nav/SideNav.svelte';
	import BlockNav from './Components/Nav/BlockNav/BlockNav.svelte';
	import Editor from './Components/Editor.svelte';
	import IFrame from './Components/IFrame.svelte';

	let section = 'block-navigation';

    const unsubscribe = data.subscribe((value) => {
        if (value) {
            section = 'tutorial';
        }
    });

    onDestroy(unsubscribe);
</script>

<main class="grid grid-cols-single-pane grid-rows-single-pane lg:grid-cols-three-pane lg:grid-rows-three-pane w-screen h-screen">
	<a href="#tutorial" class="sr-only">Jump to the tutorial</a>
	<MainNav/>
	<SideNav bind:section={section}/>
	{#if section === 'tutorial'}
		<Tutorial/>
	{:else if section === 'block-navigation'}
		<BlockNav/>
	{/if}
	{#if $hasEditor}
		<Editor/>
	{/if}
	{#if $hasIFrame}
		<IFrame/>
	{/if}
</main>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
