<script lang="ts">
    export let href = null;
    export let current = null;
    export let show = false;

    import { navigate } from '../store';

    function handleNav(ev: MouseEvent) {
        ev.preventDefault();
        navigate(href);
    }
</script>

<li>
    <a on:click={handleNav} href={href} class="{show || current ? 'block' : 'hidden'} lg:block px-3 py-2 text-blue hover:text-blue-400 border-l-2 border-solid {current === true && show ? 'border-blue' : 'border-white'} lg:border-l-0 lg:border-b-2 {current === true ? 'lg:border-blue' : 'lg:border-gray-200'} lg:hover:border-blue lg:focus:border-blue"><slot></slot></a>
</li>
