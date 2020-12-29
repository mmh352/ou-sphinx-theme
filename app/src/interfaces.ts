export interface File {
    id: number;
    filename: string;
    type: string;
    busy: boolean;
    loaded: boolean;
    content: string;
    updateTimeout: number;
    changed: boolean;
}
