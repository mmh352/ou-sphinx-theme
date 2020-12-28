<template>
    <div id="editor">
        <nav>
            <ul role="tablist">
                <li v-for="(file, idx) in files" :key="idx" role="presentation">
                    <button role="tab" tabindex="-1" :aria-selected="file.id === selected.id ? 'true': 'false'" :id="'editor-tab-' + file.id" :aria-controls="'editor-tabpanel-' + file.id" @click="selectFile(file)">
                        <svg v-if="file.type === 'html'" viewBox="0 0 24 24" class="icon small" aria-hidden="true">
                            <path d="M12,17.56L16.07,16.43L16.62,10.33H9.38L9.2,8.3H16.8L17,6.31H7L7.56,12.32H14.45L14.22,14.9L12,15.5L9.78,14.9L9.64,13.24H7.64L7.93,16.43L12,17.56M4.07,3H19.93L18.5,19.2L12,21L5.5,19.2L4.07,3Z" />
                        </svg>
                        <svg v-else-if="file.type === 'css'" viewBox="0 0 24 24" class="icon small" aria-hidden="true">
                            <path d="M5,3L4.35,6.34H17.94L17.5,8.5H3.92L3.26,11.83H16.85L16.09,15.64L10.61,17.45L5.86,15.64L6.19,14H2.85L2.06,18L9.91,21L18.96,18L20.16,11.97L20.4,10.76L21.94,3H5Z" />
                        </svg>
                        <svg v-else-if="file.type === 'javascript'" viewBox="0 0 24 24" class="icon small" aria-hidden="true">
                            <path d="M3,3H21V21H3V3M7.73,18.04C8.13,18.89 8.92,19.59 10.27,19.59C11.77,19.59 12.8,18.79 12.8,17.04V11.26H11.1V17C11.1,17.86 10.75,18.08 10.2,18.08C9.62,18.08 9.38,17.68 9.11,17.21L7.73,18.04M13.71,17.86C14.21,18.84 15.22,19.59 16.8,19.59C18.4,19.59 19.6,18.76 19.6,17.23C19.6,15.82 18.79,15.19 17.35,14.57L16.93,14.39C16.2,14.08 15.89,13.87 15.89,13.37C15.89,12.96 16.2,12.64 16.7,12.64C17.18,12.64 17.5,12.85 17.79,13.37L19.1,12.5C18.55,11.54 17.77,11.17 16.7,11.17C15.19,11.17 14.22,12.13 14.22,13.4C14.22,14.78 15.03,15.43 16.25,15.95L16.67,16.13C17.45,16.47 17.91,16.68 17.91,17.26C17.91,17.74 17.46,18.09 16.76,18.09C15.93,18.09 15.45,17.66 15.09,17.06L13.71,17.86Z" />
                        </svg>
                        <svg v-else-if="file.type === 'php'" viewBox="0 0 24 24" class="icon small" aria-hidden="true">
                            <path d="M12,18.08C5.37,18.08 0,15.36 0,12C0,8.64 5.37,5.92 12,5.92C18.63,5.92 24,8.64 24,12C24,15.36 18.63,18.08 12,18.08M6.81,10.13C7.35,10.13 7.72,10.23 7.9,10.44C8.08,10.64 8.12,11 8.03,11.47C7.93,12 7.74,12.34 7.45,12.56C7.17,12.78 6.74,12.89 6.16,12.89H5.29L5.82,10.13H6.81M3.31,15.68H4.75L5.09,13.93H6.32C6.86,13.93 7.3,13.87 7.65,13.76C8,13.64 8.32,13.45 8.61,13.18C8.85,12.96 9.04,12.72 9.19,12.45C9.34,12.19 9.45,11.89 9.5,11.57C9.66,10.79 9.55,10.18 9.17,9.75C8.78,9.31 8.18,9.1 7.35,9.1H4.59L3.31,15.68M10.56,7.35L9.28,13.93H10.7L11.44,10.16H12.58C12.94,10.16 13.18,10.22 13.29,10.34C13.4,10.46 13.42,10.68 13.36,11L12.79,13.93H14.24L14.83,10.86C14.96,10.24 14.86,9.79 14.56,9.5C14.26,9.23 13.71,9.1 12.91,9.1H11.64L12,7.35H10.56M18,10.13C18.55,10.13 18.91,10.23 19.09,10.44C19.27,10.64 19.31,11 19.22,11.47C19.12,12 18.93,12.34 18.65,12.56C18.36,12.78 17.93,12.89 17.35,12.89H16.5L17,10.13H18M14.5,15.68H15.94L16.28,13.93H17.5C18.05,13.93 18.5,13.87 18.85,13.76C19.2,13.64 19.5,13.45 19.8,13.18C20.04,12.96 20.24,12.72 20.38,12.45C20.53,12.19 20.64,11.89 20.7,11.57C20.85,10.79 20.74,10.18 20.36,9.75C20,9.31 19.37,9.1 18.54,9.1H15.79L14.5,15.68Z" />
                        </svg>
                        <svg v-else viewBox="0 0 24 24" class="icon small" aria-hidden="true">
                            <path d="M14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2M18 20H6V4H13V9H18V20M9.54 15.65L11.63 17.74L10.35 19L7 15.65L10.35 12.3L11.63 13.56L9.54 15.65M17 15.65L13.65 19L12.38 17.74L14.47 15.65L12.38 13.56L13.65 12.3L17 15.65Z" />
                        </svg>
                        {{ file.filename }}
                    </button>
                </li>
            </ul>
        </nav>
        <div v-for="(file, idx) in files" :key="idx" :id="'editor-tabpanel-' + file.id" :aria-labelledby="'editor-tab-' + file.id" :tabindex="file.id === selected.id ? '0' : '-1'" :style="{display: file.id === selected.id ? 'block' : 'none'}">
            <code-mirror :file="file"></code-mirror>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import CodeMirror from './CodeMirror.vue';
import { File } from '../interfaces';

function guessFileType(filename: string) {
    if (filename.lastIndexOf('.') >= 0) {
        const ext = filename.substring(filename.lastIndexOf('.') + 1);
        switch (ext) {
            case 'html':
                return 'html';
            case 'css':
                return 'css';
            case 'js':
                return 'javascript';
        }
    }
    return 'generic'
}


@Options({
    components: {
        CodeMirror,
    },
})
export default class Editor extends Vue {
    public selected: File | null = null;

    public get files(): File[] {
        if (this.$store.state.metadata['editor-files']) {
            const filenames = this.$store.state.metadata['editor-files'].split(',').map((x: string) => {return x.trim();});
            const files = filenames.map((filename: string, idx: number) => {
                return {
                    id: idx,
                    filename: filename,
                    type: guessFileType(filename),
                }
            });
            this.selected = files[0];
            return files;
        } else {
            return [];
        }
    }

    public selectFile(file: File) {
        this.selected = file;
    }
}
</script>
