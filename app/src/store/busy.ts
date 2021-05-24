import { writable, derived } from 'svelte/store';

/**
 * Creates the busy counter store, with the custom inc()/dec() functions.
 */
function busyCounterStore() {
    const { subscribe, update } = writable(0);

    return {
        subscribe,
        inc() { update((value) => value + 1)},
        dec() { update((value) => Math.max(0, value - 1)) },
    }
}

/**
 * The busy activity counter.
 */
export const busyCounter = busyCounterStore();

/**
 * Readable boolean store indicating whether the app is busy or not.
 */
export const busy = derived(
    busyCounter,
    (busyCounter) => {
        return busyCounter > 0;
    },
    false
);
