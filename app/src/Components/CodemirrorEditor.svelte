<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { EditorState } from "@codemirror/state";
    import { keymap, highlightSpecialChars, EditorView } from "@codemirror/view";
    import { defaultKeymap, insertTab, indentSelection } from "@codemirror/commands";
    import { html } from '@codemirror/lang-html';
    import { css } from '@codemirror/lang-css';
    import { javascript } from '@codemirror/lang-javascript';
    import { php } from '@codemirror/lang-php';
    import { history, historyKeymap } from '@codemirror/history';
    import { foldGutter, foldKeymap } from '@codemirror/fold';
    import { indentOnInput } from '@codemirror/language';
    import { lineNumbers } from '@codemirror/gutter';
    import { bracketMatching} from '@codemirror/matchbrackets';
    import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets';
    import { autocompletion, completionKeymap } from '@codemirror/autocomplete';
    import { commentKeymap } from '@codemirror/comment';
    import { rectangularSelection } from '@codemirror/rectangular-selection';
    import { lintKeymap } from '@codemirror/lint';
    import { classHighlightStyle } from '@codemirror/highlight';

    import { hasIFrame } from '../store/components';
    import { connectionStatus } from '../store/status';
    import { busy, changed } from '../store/editor';

    export let file = null;
    export let visible = false;
    let filepath = null;
    let editorElement = null;
    let editorView = null;
    let updateTimeout = 0;
    let escapeResetTimeout = 0;

    /**
     * Construct accessible tab handling, allowing the use of the escape key to activate normal tab behaviour.
     */
    function accessibleTabBinding() {
        let escapeActive = false;

        const escapeHandler = ({state}) => {
            escapeActive = !escapeActive;
            clearTimeout(escapeResetTimeout);
            escapeResetTimeout = window.setTimeout(() => { escapeActive = false; }, 20000);

            return true;
        };

        const insertTabHandler = (obj) => {
            if (escapeActive) {
                return false;
            } else {
                return insertTab(obj);
            }
        }

        const indentSelectionHandler = (obj) => {
            if (escapeActive) {
                return false;
            } else {
                return indentSelection(obj);
            }
        }

        return [
            {key: 'Escape', run: escapeHandler},
            {key: 'Tab', run: insertTabHandler, shift: indentSelectionHandler},
        ];
    }

    /**
     * Save the document.
     *
     * @param text The updated document text
     */
    async function saveDocument(text: string) {
        busy.add(file.filepath);
        const response = await fetch(file.filepath, {
            method: 'PUT',
            body: text,
        });
        busy.remove(file.filepath);
        changed.remove(file.filepath);

        if (response.status === 200) {
            if ($hasIFrame) {
                const iframe = document.querySelector('#iframe');
                if (iframe) {
                    (iframe as HTMLIFrameElement).contentWindow.location.reload();
                }
            }
        } else {
            connectionStatus.lost();
        }
    }

    async function initialiseState() {
        filepath = file.filepath;

        // Setup the editor extensions
        const extensions = [
            highlightSpecialChars(),
            history(),
            indentOnInput(),
            lineNumbers(),
            bracketMatching(),
            closeBrackets(),
            autocompletion(),
            rectangularSelection(),
            foldGutter(),
            keymap.of([
                ...defaultKeymap,
                ...historyKeymap,
                ...foldKeymap,
                ...closeBracketsKeymap,
                ...completionKeymap,
                ...commentKeymap,
                ...lintKeymap,
                ...accessibleTabBinding(),
                // Added a keybinding to save the editor content
                {key: 'Ctrl-s', run: ({ state }) => {
                    clearTimeout(updateTimeout);
                    saveDocument(state.doc.toString());
                    return true;
                }},
            ]),
        ];
        // Set the appropriate syntax highlighter
        if (file.type === 'html') {
            extensions.push(html());
        } else if (file.type === 'css') {
            extensions.push(css());
        } else if (file.type === 'javascript') {
            extensions.push(javascript());
        } else if (file.type === 'php') {
            extensions.push(php());
        }
        // Add an update listener to automatically save the document
        extensions.push(EditorView.updateListener.of(({ state, docChanged }) => {
            if (docChanged) {
                changed.add(file.filepath);
                clearTimeout(updateTimeout);
                updateTimeout = window.setTimeout(async () => {
                    await saveDocument(state.doc.toString());
                }, 1000);
            }
        }));
        // Add a highlight style that generates CSS classes
        extensions.push(classHighlightStyle);

        /**
         * Load the document content
         */
        busy.add(file.filepath);
        const response = await fetch(file.filepath);
        editorView.setState(EditorState.create({
            doc: await response.text(),
            extensions: extensions,
        }));
        busy.remove(file.filepath);
    }

    /**
     * Initialise the editor when the component is mounted.
     */
    onMount(async () => {
        editorView = new EditorView({
            state: EditorState.create({
                doc: '',
                extensions: [keymap.of(defaultKeymap)],
            }),
            parent: editorElement,
        });

        await initialiseState();
    });

    /**
     * Reinitialise the editor if the file changes
     */
    $: {
        if (file.filepath !== filepath && editorView) {
            initialiseState();
        }
    }

    onDestroy(async () => {
        editorView.destroy();
        clearTimeout(updateTimeout);
        clearTimeout(escapeResetTimeout);
    });
</script>

<div id="editor-{file.id}" bind:this={editorElement} class="{visible ? 'block' : 'hidden'} flex-grow flex-shrink overflow-hidden"></div>

<style global lang="postcss">
    .cm-content { @apply text-sm; }
    .cm-editor .cm-gutters { @apply text-base border-r-2 border-gray-200 text-black-300; }
    .cm-editor { @apply h-full; }

    .cmt-keyword, .cmt-bool, .cmt-namespace, .cmt-propertyName { @apply text-orange-700; }
    .cmt-literal, .cmt-variableName, .cmt-typeName, .cmt-macroName { @apply text-blue-700; }
    .cmt-comment, .cmt-meta { @apply text-green-600; }
    .cmt-string { @apply text-pink-900; }
    .cmt-number { @apply text-turquoise-700; }
    .cmt-invalid { @apply text-red; }
    .cmt-operator { @apply text-orange-700 font-bold; }
    .cmt-emphasis { @apply italic; }
    .cmt-strong { @apply font-bold; }
    .cmt-heading { @apply font-bold; }
</style>
