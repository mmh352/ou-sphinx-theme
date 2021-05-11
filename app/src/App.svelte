<script lang="ts">
	import MainNav from './MainNav/MainNav.svelte';
	import Tutorial from './Tutorial.svelte';
	import SideNav from './SideNav.svelte';
	import Editor from './Editor.svelte';
	import IFrame from './IFrame.svelte';

	let section = 'tutorial';
</script>

<main class="grid grid-cols-single-pane grid-rows-single-pane lg:grid-cols-three-pane lg:grid-rows-three-pane w-screen h-screen">
	<a href="#tutorial" class="sr-only">Jump to the tutorial</a>
	<MainNav/>
	<SideNav bind:section={section}/>
	{#if section === 'tutorial'}
		<Tutorial/>
	{/if}
	<Editor/>
	<IFrame/>
</main>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
