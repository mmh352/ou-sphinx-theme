<template>
    <div id="editor">
        <nav>
            <ul role="tablist">
                <li v-for="(file, idx) in files" :key="idx" role="presentation">
                    <button role="tab" tabindex="-1" :aria-selected="file.id === selected.id ? 'true': 'false'" :id="'editor-tab-' + file.id" :aria-controls="'editor-tabpanel-' + file.id" @click="selectFile(file)">
                        <svg v-if="file.busy" viewBox="0 0 24 24" class="icon small" aria-hidden="true">
                            <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z">
                                <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                            </path>
                        </svg>
                        <svg v-else-if="file.type === 'html'" viewBox="0 0 24 24" class="icon small" aria-hidden="true">
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
                        <svg v-else-if="file.type === 'java'" viewBox="0 0 24 24" class="icon small" aria-hidden="true">
                            <path d="M16.5,6.08C16.5,6.08 9.66,7.79 12.94,11.56C13.91,12.67 12.69,13.67 12.69,13.67C12.69,13.67 15.14,12.42 14,10.82C12.94,9.35 12.14,8.62 16.5,6.08M12.03,7.28C16.08,4.08 14,2 14,2C14.84,5.3 11.04,6.3 9.67,8.36C8.73,9.76 10.13,11.27 12,13C11.29,11.3 8.78,9.84 12.03,7.28M9.37,17.47C6.29,18.33 11.25,20.1 15.16,18.43C14.78,18.28 14.41,18.1 14.06,17.89C12.7,18.2 11.3,18.26 9.92,18.07C8.61,17.91 9.37,17.47 9.37,17.47M14.69,15.79C12.94,16.17 11.13,16.26 9.35,16.05C8.04,15.92 8.9,15.28 8.9,15.28C5.5,16.41 10.78,17.68 15.5,16.3C15.21,16.19 14.93,16 14.69,15.79M18.11,19.09C18.11,19.09 18.68,19.56 17.5,19.92C15.22,20.6 8.07,20.81 6.09,19.95C5.38,19.64 6.72,19.21 7.14,19.12C7.37,19.06 7.6,19.04 7.83,19.04C7.04,18.5 2.7,20.14 5.64,20.6C13.61,21.9 20.18,20 18.11,19.09M15.37,14.23C15.66,14.04 15.97,13.88 16.29,13.74C16.29,13.74 14.78,14 13.27,14.14C11.67,14.3 10.06,14.32 8.46,14.2C6.11,13.89 9.75,13 9.75,13C8.65,13 7.57,13.26 6.59,13.75C4.54,14.75 11.69,15.2 15.37,14.23M16.27,16.65C16.25,16.69 16.23,16.72 16.19,16.75C21.2,15.44 19.36,12.11 16.96,12.94C16.83,13 16.72,13.08 16.65,13.19C16.79,13.14 16.93,13.1 17.08,13.07C18.28,12.83 20,14.7 16.27,16.65M16.4,21.26C13.39,21.78 10.31,21.82 7.28,21.4C7.28,21.4 7.74,21.78 10.09,21.93C13.69,22.16 19.22,21.8 19.35,20.1C19.38,20.11 19.12,20.75 16.4,21.26Z" />
                        </svg>
                        <svg v-else-if="file.type === 'python'" viewBox="0 0 24 24" class="icon small" aria-hidden="true">
                            <path d="M19.14,7.5A2.86,2.86 0 0,1 22,10.36V14.14A2.86,2.86 0 0,1 19.14,17H12C12,17.39 12.32,17.96 12.71,17.96H17V19.64A2.86,2.86 0 0,1 14.14,22.5H9.86A2.86,2.86 0 0,1 7,19.64V15.89C7,14.31 8.28,13.04 9.86,13.04H15.11C16.69,13.04 17.96,11.76 17.96,10.18V7.5H19.14M14.86,19.29C14.46,19.29 14.14,19.59 14.14,20.18C14.14,20.77 14.46,20.89 14.86,20.89A0.71,0.71 0 0,0 15.57,20.18C15.57,19.59 15.25,19.29 14.86,19.29M4.86,17.5C3.28,17.5 2,16.22 2,14.64V10.86C2,9.28 3.28,8 4.86,8H12C12,7.61 11.68,7.04 11.29,7.04H7V5.36C7,3.78 8.28,2.5 9.86,2.5H14.14C15.72,2.5 17,3.78 17,5.36V9.11C17,10.69 15.72,11.96 14.14,11.96H8.89C7.31,11.96 6.04,13.24 6.04,14.82V17.5H4.86M9.14,5.71C9.54,5.71 9.86,5.41 9.86,4.82C9.86,4.23 9.54,4.11 9.14,4.11C8.75,4.11 8.43,4.23 8.43,4.82C8.43,5.41 8.75,5.71 9.14,5.71Z" />
                        </svg>
                        <svg v-else-if="file.type === 'json'" viewBox="0 0 24 24" class="icon small" aria-hidden="true">
                            <path d="M5,3H7V5H5V10A2,2 0 0,1 3,12A2,2 0 0,1 5,14V19H7V21H5C3.93,20.73 3,20.1 3,19V15A2,2 0 0,0 1,13H0V11H1A2,2 0 0,0 3,9V5A2,2 0 0,1 5,3M19,3A2,2 0 0,1 21,5V9A2,2 0 0,0 23,11H24V13H23A2,2 0 0,0 21,15V19A2,2 0 0,1 19,21H17V19H19V14A2,2 0 0,1 21,12A2,2 0 0,1 19,10V5H17V3H19M12,15A1,1 0 0,1 13,16A1,1 0 0,1 12,17A1,1 0 0,1 11,16A1,1 0 0,1 12,15M8,15A1,1 0 0,1 9,16A1,1 0 0,1 8,17A1,1 0 0,1 7,16A1,1 0 0,1 8,15M16,15A1,1 0 0,1 17,16A1,1 0 0,1 16,17A1,1 0 0,1 15,16A1,1 0 0,1 16,15Z" />
                        </svg>
                        <svg v-else-if="file.type === 'cpp'" viewBox="0 0 24 24" class="icon small" aria-hidden="true">
                            <path d="M10.5,15.97L10.91,18.41C10.65,18.55 10.23,18.68 9.67,18.8C9.1,18.93 8.43,19 7.66,19C5.45,18.96 3.79,18.3 2.68,17.04C1.56,15.77 1,14.16 1,12.21C1.05,9.9 1.72,8.13 3,6.89C4.32,5.64 5.96,5 7.94,5C8.69,5 9.34,5.07 9.88,5.19C10.42,5.31 10.82,5.44 11.08,5.59L10.5,8.08L9.44,7.74C9.04,7.64 8.58,7.59 8.05,7.59C6.89,7.58 5.93,7.95 5.18,8.69C4.42,9.42 4.03,10.54 4,12.03C4,13.39 4.37,14.45 5.08,15.23C5.79,16 6.79,16.4 8.07,16.41L9.4,16.29C9.83,16.21 10.19,16.1 10.5,15.97M11,11H13V9H15V11H17V13H15V15H13V13H11V11M18,11H20V9H22V11H24V13H22V15H20V13H18V11Z" />
                        </svg>
                        <svg v-else-if="file.type === 'sql'" viewBox="0 0 24 24" class="icon small" aria-hidden="true">
                            <path d="M12,3C7.58,3 4,4.79 4,7C4,9.21 7.58,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M4,9V12C4,14.21 7.58,16 12,16C16.42,16 20,14.21 20,12V9C20,11.21 16.42,13 12,13C7.58,13 4,11.21 4,9M4,14V17C4,19.21 7.58,21 12,21C16.42,21 20,19.21 20,17V14C20,16.21 16.42,18 12,18C7.58,18 4,16.21 4,14Z" />
                        </svg>
                        <svg v-else-if="file.type === 'markdown'" viewBox="0 0 24 24" class="icon small" aria-hidden="true">
                            <path d="M20.56 18H3.44C2.65 18 2 17.37 2 16.59V7.41C2 6.63 2.65 6 3.44 6H20.56C21.35 6 22 6.63 22 7.41V16.59C22 17.37 21.35 18 20.56 18M6.81 15.19V11.53L8.73 13.88L10.65 11.53V15.19H12.58V8.81H10.65L8.73 11.16L6.81 8.81H4.89V15.19H6.81M19.69 12H17.77V8.81H15.85V12H13.92L16.81 15.28L19.69 12Z" />
                        </svg>
                        <svg v-else viewBox="0 0 24 24" class="icon small" aria-hidden="true">
                            <path d="M14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H18C19.11 22 20 21.11 20 20V8L14 2M18 20H6V4H13V9H18V20M9.54 15.65L11.63 17.74L10.35 19L7 15.65L10.35 12.3L11.63 13.56L9.54 15.65M17 15.65L13.65 19L12.38 17.74L14.47 15.65L12.38 13.56L13.65 12.3L17 15.65Z" />
                        </svg>
                        {{ file.filename }}
                        <svg v-if="file.changed" viewBox="0 0 24 24" class="icon small" style="display: inline-block; margin-left: 0.5rem;" aria-hidden="true">
                            <path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" />
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
        <div v-for="(file, idx) in files" :key="idx" :id="'editor-tabpanel-' + file.id" :aria-labelledby="'editor-tab-' + file.id" :tabindex="file.id === selected.id ? '0' : '-1'" :style="{display: file.id === selected.id ? 'block' : 'none'}" @keydown="editorKeydown">
            <code-mirror v-if="file.loaded" :file="file" @update="updateFile($event, file)"></code-mirror>
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
            case 'php':
                return 'php';
            case 'java':
                return 'java';
            case 'py':
                return 'python';
            case 'json':
                return 'json';
            case 'cpp':
                return 'cpp';
            case 'sql':
                return 'sql';
            case 'md':
                return 'markdown';
        }
    }
    return 'generic'
}


@Options({
    components: {
        CodeMirror,
    },
    watch: {
        filenames(value: string[]) {
            let changes = value.length !== this.files.length;
            if (!changes) {
                for (let idx = 0; idx < value.length; idx++) {
                    let found = false;
                    for (let idx2 = 0; idx2 < this.files.length; idx2++) {
                        if (value[idx] === this.files[idx2].filename) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        changes = true;
                        break;
                    }
                }
            }
            if (changes) {
                const tmpFiles = {} as {[x: string]: File};
                for (let idx = 0; idx < this.files.length; idx++) {
                    tmpFiles[this.files[idx].filename] = this.files[idx];
                }
                this.files = value.map((filename: string, idx: number) => {
                    if (tmpFiles[filename]) {
                        tmpFiles[filename].id = idx;
                        return tmpFiles[filename];
                    } else {
                        const file = {
                            id: idx,
                            filename: filename,
                            type: guessFileType(filename),
                            busy: true,
                            loaded: false,
                            content: '',
                            updateTimeout: -1,
                            changed: false,
                        };
                        this.fetchFile(filename, idx)
                        return file;
                    }
                });
                if (this.files.indexOf(this.selected) < 0) {
                    if (this.files.length > 0) {
                        this.selected = this.files[0];
                    } else {
                        this.selected = null;
                    }
                }
            }
        }
    }
})
export default class Editor extends Vue {
    public selected: File | null = null;
    public files = [] as File[];

    public get filenames(): string[] {
        if (this.$store.state.metadata['editor-files']) {
            return this.$store.state.metadata['editor-files'].split(',').map((x: string) => {return x.trim();});
        } else {
            return [];
        }
    }

    public mounted(): void {
        if (this.$store.state.metadata['editor-files']) {
            this.files = this.filenames.map((filename: string, idx: number) => {
                const file = {
                    id: idx,
                    filename: filename,
                    type: guessFileType(filename),
                    busy: true,
                    loaded: false,
                    content: '',
                    updateTimeout: -1,
                    changed: false,
                };
                this.fetchFile(filename, idx)
                return file;
            });
            if (this.files.length > 0) {
                this.selected = this.files[0];
            }
        }
    }

    public selectFile(file: File) {
        if (this.selected && this.selected.changed) {
            this.saveFile(this.selected);
        }
        this.selected = file;
    }

    public updateFile(content: string, file: File) {
        file.content = content;
        file.changed = true;
        clearTimeout(file.updateTimeout);
        file.updateTimeout = setTimeout(() => {
            this.saveFile(file);
        }, 5000);
    }

    public async editorKeydown(ev: KeyboardEvent): Promise<void> {
        if (ev.key === 's') {
            if ((this.$store.state.ui.platform.isMac && ev.metaKey) || (!this.$store.state.ui.platform.isMac && ev.ctrlKey)) {
                ev.preventDefault();
                if (this.selected) {
                    this.saveFile(this.selected);
                }
            }
        }
    }

    private async fetchFile(filename: string, idx: number) {
        const response = await fetch(this.$store.state.metadata['editor-files-src'] + filename);
        if (response.status == 200) {
            this.files[idx].content = await response.text();
            this.files[idx].busy = false;
            this.files[idx].loaded = true;
        }
    }

    private async saveFile(file: File) {
        clearTimeout(file.updateTimeout);
        file.busy = true;
        await fetch(this.$store.state.metadata['editor-files-src'] + file.filename, {
            method: 'PUT',
            body: file.content,
        });
        file.busy = false;
        file.changed = false;
        const iFrame = document.querySelector('#iframe') as HTMLIFrameElement;
        if (iFrame && iFrame.contentWindow) {
            iFrame.contentWindow.location.reload();
        }
    }
}
</script>
