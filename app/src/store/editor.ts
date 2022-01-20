import { writable, derived } from 'svelte/store';

import { metadata, baseUrl } from './data'

/**
 * Determine the file type from the filename extension.
 *
 * Only recognises .html, .css, and .js.
 *
 * @param filename The filename to determine the file type for
 */
function determineFileType(filename: string) {
    if (filename) {
        if (filename.endsWith('.html')) {
            return 'html';
        } else if (filename.endsWith('.css')) {
            return 'css';
        } else if (filename.endsWith('.js')) {
            return 'javascript';
        } else if (filename.endsWith('.php')) {
            return 'php'
        }
    }
    return '';
}

/**
 * The list of filenames in the metadata
 */
const metadataEditorFiles = derived(
    metadata,
    (metadata) => {
        if (metadata && metadata['editor-files']) {
            return metadata['editor-files'];
        } else {
            return '';
        }
    },
    ''
);

/**
 * The source path for the filenames
 */
const metadataEditorFilesSrc = derived(
    metadata,
    (metadata) => {
        if (metadata && metadata['editor-files-src']) {
            return metadata['editor-files-src'];
        } else {
            return '';
        }
    },
    ''
);

/**
 * List of files currently to be shown by the editor
 */
export const files = derived(
    [baseUrl, metadataEditorFiles, metadataEditorFilesSrc],
    ([baseUrl, metadataEditorFiles, metadataEditorFilesSrc]) => {
        busy.set([])
        if (metadataEditorFiles && metadataEditorFilesSrc) {
            const newFiles = (metadataEditorFiles.split(',') as string[]).map((filename, idx) => {
                busy.add(baseUrl + metadataEditorFilesSrc + filename);
                filename = filename.trim();
                const file = {
                    id: idx,
                    filename: filename,
                    filepath: baseUrl + metadataEditorFilesSrc + filename,
                    type: determineFileType(filename),
                };
                return file;
            });
            return newFiles;
        } else {
            return [];
        }
    },
    []
);

function idListStore() {
    const { subscribe, update, set } = writable([]);

    return {
        subscribe,
        set,
        add(id: string) {
            update((ids) => {
                if (ids.indexOf(id) >= 0) {
                    return ids;
                } else {
                    return [...ids, id];
                }
            });
        },
        remove(id: string) {
            update((ids) => {
                if (ids.indexOf(id) >= 0) {
                    return ids.filter((tid) => tid !== id);
                } else {
                    return ids;
                }
            });
        }
    }
}

export const busy = idListStore();

export const changed = idListStore();

export const selected = writable('');

function evented() {
    const { subscribe, update } = writable(false);

    return {
        subscribe,
        notify() {
            update((trigger) => { return !trigger; });
        }
    }
}

export const changeEvent = evented();
