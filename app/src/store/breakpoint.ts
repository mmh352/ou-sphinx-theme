import { readable } from 'svelte/store';

/**
 * Converts the window width to a breakpoint number.
 *
 * Larger numbers imply a greater screen width.
 *
 * @returns The breakpoints as a number 0-5.
 */
 function calculateBreakpoint() {
    const width = window.innerWidth;
    if (width >= 1536) {
        return 5;
    } else if (width >= 1280) {
        return 4;
    } else if (width >= 1024) {
        return 3;
    } else if (width >= 768) {
        return 2;
    } else if (width >= 640) {
        return 1;
    }
    return 0;
}

/**
 * The currently active breakpoint.
 */
export const breakpoint = readable(calculateBreakpoint(), (set) => {
    function listener() {
        set(calculateBreakpoint());
    }
    window.addEventListener('resize', listener);
    return () => {
        window.removeEventListener('resize', listener);
    };
});
