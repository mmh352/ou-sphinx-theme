<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { EditorState } from "@codemirror/state";
    import { keymap, highlightSpecialChars, EditorView } from "@codemirror/view";
    import { defaultKeymap, insertTab, indentSelection } from "@codemirror/commands";
    import { html } from '@codemirror/lang-html';
    import { css } from '@codemirror/lang-css';
    import { javascript } from '@codemirror/lang-javascript';
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

    import { data } from '../store';

    export let filename = null;
    export let visible = false;
    let editorElement = null;
    let editorView = null;
    let filesSrc = '';

    /**
     * Construct accessible tab handling, allowing the use of the escape key to activate normal tab behaviour.
     */
    function accessibleTabBinding() {
        let escapeActive = false;
        let escapeResetTimeout = 0;

        const escapeHandler = ({state}) => {
            escapeActive = !escapeActive;
            clearTimeout(escapeResetTimeout);
            escapeResetTimeout = setTimeout(() => { escapeActive = false; }, 20000);

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

    onMount(async () => {
        editorView = new EditorView({
            state: EditorState.create({
                doc: '',
                extensions: [keymap.of(defaultKeymap)],
            }),
            parent: editorElement,
        });

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
            ]),
        ];

        if (filename.endsWith('.html')) {
            extensions.push(html());
        } else if (filename.endsWith('.css')) {
            extensions.push(css());
        } else if (filename.endsWith('.js')) {
            extensions.push(javascript());
        }

        let updateTimeout = 0;
        extensions.push(EditorView.updateListener.of(({ state, docChanged }) => {
            if (docChanged) {
                clearTimeout(updateTimeout);
                updateTimeout = setTimeout(async () => {
                    await fetch(filesSrc + filename, {
                        method: 'PUT',
                        body: state.doc.toString(),
                    });
                }, 1000);
            }
        }));

        extensions.push(classHighlightStyle);

        const response = await fetch(filesSrc + filename);
        editorView.setState(EditorState.create({
            doc: await response.text(),
            extensions: extensions,
        }));
    });

    const unsubscribe = data.subscribe((data) => {
        if (data) {
            if (data.metadata && data.metadata['editor-files-src']) {
                filesSrc = data.metadata['editor-files-src'];
            }
        }
    });

    onDestroy(async () => {
        editorView.destroy();
        unsubscribe();
    });
</script>

<div bind:this={editorElement} class="{visible ? 'block' : 'hidden'} flex-grow flex-shrink"></div>

<style global lang="postcss">
    .cm-content { @apply text-base; }
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
