<script lang="ts">
    import { hasEditor, hasIFrame, breakpoint } from '../../store';
    import Icon from '../Icon.svelte';

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
                <Icon icon="user_options" alt="Show the navigation menu" title="Navigation Menu" class="w-8 h-8"/>
            </button>
        </li>
        <li>
            <button on:click={ev => setSection('tutorial', ev)} class="block px-3 py-3 border-r-2 border-solid {section === 'tutorial' ? 'border-blue' : 'border-gray-200'} hover:border-blue focus:border-blue">
                <Icon icon="article" alt="Show the tutorial content" title="Tutorial Content" class="w-8 h-8"/>
            </button>
        </li>
        {#if $hasEditor && $breakpoint < 3}
            <li>
                <button on:click={ev => setSection('editor', ev)} class="block px-3 py-3 border-r-2 border-solid {section === 'editor' ? 'border-blue' : 'border-gray-200'} hover:border-blue focus:border-blue">
                    <Icon icon="edit" alt="Show the editor" title="Editor" class="w-8 h-8"/>
                </button>
            </li>
        {/if}
        {#if $hasIFrame && $breakpoint < 3}
            <li>
                <button on:click={ev => setSection('iframe', ev)} class="block px-3 py-3 border-r-2 border-solid {section === 'iframe' ? 'border-blue' : 'border-gray-200'} hover:border-blue focus:border-blue">
                    <Icon icon="online_doc" alt="Show the Something" title="Something" class="w-8 h-8"/>
                </button>
            </li>
        {/if}
        <li>
            <a href="/download" class="block px-3 py-3 border-r-2 border-solid border-gray-200 hover:border-blue focus:border-blue">
                <Icon icon="download" alt="Download all of the module#s content" title="Download Module Content" class="w-8 h-8"/>
            </a>
        </li>
        <li class="flex-shrink flex-grow">
            <span class="block border-r-2 border-solid h-full">&nbsp;</span>
        </li>
    </ul>
</nav>
