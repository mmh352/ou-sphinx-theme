<script lang="ts">
    import { derived } from 'svelte/store';

    import { baseUrl, withinBlockNav } from '../../store/data';
    import { hasEditor, hasIFrame } from '../../store/components';
    import { breakpoint } from '../../store/breakpoint';
    import Icon from '../Icon.svelte';

    export let section = '';

    /**
     * Whether block-level navigation is available.
     */
    const hasBlockNav = derived(
        withinBlockNav,
        (withinBlockNav) => {
            if (withinBlockNav && withinBlockNav.children.length > 0) {
                return true;
            } else {
                return false;
            }
        },
        false
    )

    function setSection(newSection: string, ev: MouseEvent) {
        ev.preventDefault();
        section = newSection;
    }
</script>

<nav class="col-start-1 col-end-2 row-start-2 row-end-3 lg:row-end-4 overflow-y-auto">
    <ul class="flex flex-row justify-center lg:flex-col lg:h-full">
        <li class="lg:hidden flex-shrink flex-grow">
            <span class="block border-b-2 lg:border-b-0 lg:border-r-2 border-solid h-full">&nbsp;</span>
        </li>
        {#if $hasBlockNav}
            <li>
                <button on:click={ev => setSection('block-navigation', ev)} class="block px-5 lg:px-3 py-3 border-b-2 lg:border-b-0 lg:border-r-2 border-solid  {section === 'block-navigation' ? 'border-blue' : 'border-gray-200'} hover:border-blue focus:border-blue">
                    <Icon icon="user_options" alt="Show the navigation menu" title="Navigation Menu" class="w-4 h-4 lg:w-8 lg:h-8"/>
                </button>
            </li>
        {/if}
        <li>
            <button on:click={ev => setSection('tutorial', ev)} class="block px-5 lg:px-3 py-3 border-b-2 lg:border-b-0 lg:border-r-2 border-solid {section === 'tutorial' ? 'border-blue' : 'border-gray-200'} hover:border-blue focus:border-blue">
                <Icon icon="article" alt="Show the tutorial content" title="Tutorial Content" class="w-4 h-4 lg:w-8 lg:h-8"/>
            </button>
        </li>
        {#if $hasEditor && $breakpoint < 3}
            <li>
                <button on:click={ev => setSection('editor', ev)} class="block px-5 lg:px-3 py-3 border-b-2 lg:border-b-0 lg:border-r-2 border-solid {section === 'editor' ? 'border-blue' : 'border-gray-200'} hover:border-blue focus:border-blue">
                    <Icon icon="edit" alt="Show the editor" title="Editor" class="w-4 h-4 lg:w-8 lg:h-8"/>
                </button>
            </li>
        {/if}
        {#if $hasIFrame && $breakpoint < 3}
            <li>
                <button on:click={ev => setSection('iframe', ev)} class="block px-5 lg:px-3 py-3 border-b-2 lg:border-b-0 lg:border-r-2 border-solid {section === 'iframe' ? 'border-blue' : 'border-gray-200'} hover:border-blue focus:border-blue">
                    <Icon icon="online_doc" alt="Show the page viewer" title="HTML Page Viewer" class="w-4 h-4 lg:w-8 lg:h-8"/>
                </button>
            </li>
        {/if}
        <li>
            <a href="{$baseUrl}/download" class="block px-5 lg:px-3 py-3 border-b-2 lg:border-b-0 lg:border-r-2 border-solid border-gray-200 hover:border-blue focus:border-blue">
                <Icon icon="download" alt="Download all of the module#s content" title="Download Module Content" class="w-4 h-4 lg:w-8 lg:h-8"/>
            </a>
        </li>
        <li class="flex-shrink flex-grow">
            <span class="block border-b-2 lg:border-b-0 lg:border-r-2 border-solid h-full">&nbsp;</span>
        </li>
    </ul>
</nav>
