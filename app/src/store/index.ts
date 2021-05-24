import { writable, derived } from 'svelte/store';


/**
 * Default editor filename
 */
 export const defaultEditorFilename = writable(null);

 /**
 * The current editor filename
 */
export const currentEditorFilename = writable(null);
