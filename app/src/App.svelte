<script lang="ts">
	import MainNav from './MainNav.svelte';
	import Tutorial from './Tutorial.svelte';
</script>

<main class="grid grid-cols-full grid-rows-full w-screen h-screen">
	<a href="#tutorial" class="sr-only">Jump to the tutorial</a>
	<MainNav/>
	<div class="col-start-1 col-end-2 row-start-2 row-end-4 overflow-y-auto">
		<ul class="flex flex-col h-full">
			<li>
				<button class="block px-3 py-3 border-r-2 border-solid border-gray-200 hover:border-blue focus:border-blue">
					<img src="/_static/icons/user_options_RGB.png" alt="Show the navigation menu" title="Navigation Menu" class="w-8 h-8"/>
				</button>
			</li>
			<li>
				<button class="block px-3 py-3 border-r-2 border-solid border-blue">
					<img src="/_static/icons/article_RGB.png" alt="Show the tutorial content" title="Tutorial Content" class="w-8 h-8"/>
				</button>
			</li>
			<li>
				<button class="block px-3 py-3 border-r-2 border-solid border-gray-200 hover:border-blue focus:border-blue">
					<img src="/_static/icons/download_RGB.png" alt="Download all of the module's content" title="Download Module Content" class="w-8 h-8"/>
				</button>
			</li>
			<li class="flex-shrink flex-grow">
				<span class="block border-r-2 border-solid h-full">&nbsp;</span>
			</li>
		</ul>
	</div>
	<Tutorial/>
	<div class="col-start-3 col-end-4 row-start-2 row-end-3">
		Editor goes here
	</div>
	<div class="col-start-3 col-end-4 row-start-3 row-end-4 shadow-inner">
		iFrame goes here
	</div>
</main>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
