function findAncestorRole(element: HTMLElement, role: string): HTMLElement | null {
    if (element.getAttribute('role') === role) {
        return element;
    } else if (element.parentElement) {
        return findAncestorRole(element.parentElement, role);
    } else {
        return null;
    }
}

export {
    findAncestorRole,
};
