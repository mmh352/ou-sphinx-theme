<template>
    <div ref='editorElement'></div>
</template>

<script lang='ts'>
import { Options, Vue } from 'vue-class-component';

import { EditorState } from '@codemirror/next/state';
import { keymap, highlightSpecialChars, EditorView, ViewUpdate } from '@codemirror/next/view';
import { html } from '@codemirror/next/lang-html';
import { css } from '@codemirror/next/lang-css';
import { javascript } from '@codemirror/next/lang-javascript';
import { java } from '@codemirror/next/lang-java';
import { python } from '@codemirror/next/lang-python';
import { json } from '@codemirror/next/lang-json';
import { cpp } from '@codemirror/next/lang-cpp';
import { sql } from '@codemirror/next/lang-sql';
import { markdown } from '@codemirror/next/lang-markdown';
import { highlightActiveLine, highlightSelectionMatches } from '@codemirror/next/highlight-selection';
import { history, historyKeymap } from '@codemirror/next/history';
import { foldGutter, foldKeymap } from '@codemirror/next/fold';
import { indentOnInput } from '@codemirror/next/language';
import { lineNumbers } from '@codemirror/next/gutter';
import { defaultKeymap } from '@codemirror/next/commands';
import { bracketMatching} from '@codemirror/next/matchbrackets';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/next/closebrackets';
import { autocompletion, completionKeymap } from '@codemirror/next/autocomplete';
import { commentKeymap } from '@codemirror/next/comment';
import { rectangularSelection } from '@codemirror/next/rectangular-selection';
import { gotoLineKeymap } from '@codemirror/next/goto-line';
import { lintKeymap } from '@codemirror/next/lint';
import { highlightStyle, tags } from '@codemirror/next/highlight';

import { File } from '../interfaces';

@Options({
    props: {
        file: File,
    },
    emits: ['update'],
})
export default class Editor extends Vue {
    public editorView = null as null | EditorView;
    public file!: File;
    private updateTimeout = -1;

    public mounted(): void {
        this.loadEditor();
    }

    public beforeUnmount(): void {
        if (this.editorView) {
            this.editorView.destroy();
        }
    }

    public loadEditor(): void {
        if (!this.editorView && this.$refs.editorElement && this.file) {
            const extensions = this.defaultEditorExtensions();
            if (this.file.type === 'html') {
                extensions.push(html());
            } else if (this.file.type === 'css') {
                extensions.push(css());
            } else if (this.file.type === 'javascript') {
                extensions.push(javascript());
            } else if (this.file.type === 'java') {
                extensions.push(java());
            } else if (this.file.type === 'python') {
                extensions.push(python());
            } else if (this.file.type === 'json') {
                extensions.push(json());
            } else if (this.file.type === 'cpp') {
                extensions.push(cpp());
            } else if (this.file.type === 'sql') {
                extensions.push(sql({}));
            } else if (this.file.type === 'markdown') {
                extensions.push(markdown());
            }
            const startState = EditorState.create({
                doc: this.file.content,
                extensions: extensions,
            });

            this.editorView = new EditorView({
                state: startState,
                parent: this.$refs.editorElement as Element,
            });
        }
    }

    private defaultEditorExtensions() {
        return [
            highlightActiveLine(),
            highlightSelectionMatches(),
            highlightSpecialChars(),
            history(),
            indentOnInput(),
            lineNumbers(),
            bracketMatching(),
            closeBrackets(),
            autocompletion(),
            rectangularSelection(),
            foldGutter(),
            highlightStyle(
                {
                    tag: tags.typeName,
                    color: '#569cd6',
                },
                {
                    tag: tags.comment,
                    color: '#6a9955',
                },
                {
                    tag: tags.keyword,
                    color: '#569cd6',
                    'font-weight': 'bold',
                },
                {
                    tag: tags.name,
                    color: '#ddd6a3',
                },
                {
                    tag: tags.propertyName,
                    color: '#9cdcfe',
                },
                {
                    tag: tags.className,
                    color: '#a9b7c6',
                },
                {
                    tag: tags.operator,
                    color: '#d4d4d4',
                },
                {
                    tag: tags.operatorKeyword,
                    color: '#569cd6',
                },
                {
                    tag: tags.number,
                    color: '#b5cea8',
                },
                {
                    tag: tags.string,
                    color: '#ce9178',
                },
                {
                    tag: tags.heading,
                    'font-weight': 'bold',
                },
            ),
            keymap([
                ...defaultKeymap,
                ...historyKeymap,
                ...foldKeymap,
                ...closeBracketsKeymap,
                ...completionKeymap,
                ...commentKeymap,
                ...gotoLineKeymap,
                ...lintKeymap,
            ]),
            EditorView.updateListener.of(this.updateListener)
        ];
    }

    public updateListener(update: ViewUpdate) {
        if (update.docChanged) {
            clearTimeout(this.updateTimeout);
            this.updateTimeout = setTimeout(() => {
                if (this.editorView) {
                    this.$emit('update', this.editorView.state.doc.toString());
                }
            }, 100);
        }
    }
}
</script>
