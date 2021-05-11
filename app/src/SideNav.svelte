<script lang="ts">
    export let section = '';

    function setSection(newSection: string, ev: MouseEvent) {
        ev.preventDefault();
        section = newSection;
    }
</script>

<nav class="col-start-1 col-end-2 row-start-2 row-end-4 overflow-y-auto">
    <ul class="flex flex-col h-full">
        <li>
            <button on:click={ev => setSection('block-navigation', ev)} class="block px-3 py-3 border-r-2 border-solid  {section === 'block-navigation' ? 'border-blue' : 'border-gray-200'} hover:border-blue focus:border-blue">
                <img src="/_static/icons/user_options_RGB.png" alt="Show the navigation menu" title="Navigation Menu" class="w-8 h-8"/>
            </button>
        </li>
        <li>
            <button on:click={ev => setSection('tutorial', ev)} class="block px-3 py-3 border-r-2 border-solid {section === 'tutorial' ? 'border-blue' : 'border-gray-200'} hover:border-blue focus:border-blue">
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
</nav>
