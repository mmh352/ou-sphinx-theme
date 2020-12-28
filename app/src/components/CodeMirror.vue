<template>
    <div ref='editorElement'></div>
</template>

<script lang='ts'>
import { Options, Vue } from 'vue-class-component';

import { EditorState } from '@codemirror/next/state';
import { keymap, highlightSpecialChars, EditorView } from '@codemirror/next/view';
import { basicSetup } from '@codemirror/next/basic-setup';
import { html } from '@codemirror/next/lang-html';
import { highlightActiveLine, highlightSelectionMatches } from '@codemirror/next/highlight-selection';
import { history, historyKeymap } from '@codemirror/next/history';
import { foldGutter, foldKeymap } from '@codemirror/next/fold';
import { indentOnInput } from '@codemirror/next/language';
import { lineNumbers } from '@codemirror/next/gutter';
import { defaultKeymap } from '@codemirror/next/commands';
import { bracketMatching} from '@codemirror/next/matchbrackets';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/next/closebrackets';
import { searchKeymap } from '@codemirror/next/search';
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
    }
})
export default class Editor extends Vue {
    public editorView = null as null | EditorView;
    public file!: File;

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
            const startState = EditorState.create({
                //doc: 'You are viewing the file ' + this.file.filename + ', which is of type ' + this.file.type + '.',
                doc: '<html lang="en">\n  <head><!-- Remember this -->\n    <title>Just some text</title>\n  </head>\n</html>',
                extensions: [
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
                    html(),
                ]
            });
            console.log();

            this.editorView = new EditorView({
                state: startState,
                parent: this.$refs.editorElement as Element,
            });
        }
    }
}
</script>
