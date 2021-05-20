<script lang="ts">
    export let href = null;
    export let current = null;
    export let show = false;
    export let internalNav = true;

    import { navigate } from '../../../store';

    function handleNav(ev: MouseEvent) {
        if (internalNav) {
            ev.preventDefault();
            navigate(href);
            show = false;
        }
    }
</script>

<li class="overflow-hidden">
    <a on:click={handleNav} href={href} class="{show || current ? 'block' : 'hidden'} {current ? 'font-bold lg:font-normal' : ''} w-full lg:block px-3 py-2 text-blue truncate hover:text-blue-400 border-solid {current === true && show ? 'border-blue' : 'border-white'} lg:border-b-2 {current === true ? 'lg:border-blue' : 'lg:border-gray-200'} lg:hover:border-blue lg:focus:border-blue"><slot></slot></a>
</li>
