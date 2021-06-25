import { writable } from 'svelte/store';

/**
 * The currently displayed URL
 */
 export const url = writable('');

/**
 * Navigate to a new URL.
 *
 * This will automatically update the history.
 *
 * @param newUrl The URL to navigate to. Can be absolute or relative.
 */
export function navigate(newUrl: string) {
    if (newUrl === '#') {
        newUrl = '';
    }
    newUrl = (new URL(newUrl, document.baseURI)).href;
    url.set(newUrl);
    window.history.pushState(null, '', newUrl);
}

/**
 * Handle navigation within the history.
 */
window.addEventListener('popstate', function(ev) {
    url.set(window.location.href);
});
