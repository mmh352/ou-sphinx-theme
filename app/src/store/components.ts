import { derived } from 'svelte/store';

import { metadata } from './data';

/**
 * Which components are activated for the current page.
 *
 * Currently supported components are 'tutorial', 'editor', 'iframe'.
 */
export const components = derived(
    metadata,
    (metadata) => {
        if (metadata && metadata.layout) {
            return metadata.layout.split('-');
        } else {
            return ['tutorial'];
        }
    },
    []
);

/**
 * Whether the current page contains an editor component.
 */
export const hasEditor = derived(
    components,
    (components) => {
        return components.indexOf('editor') >= 0;
    },
    false
);

/**
 * Whether the current page contains an iframe component.
 */
export const hasIFrame = derived(
    components,
    (components) => {
        return components.indexOf('iframe') >= 0;
    },
    false
);
