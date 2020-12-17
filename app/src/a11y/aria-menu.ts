import { findAncestorRole } from './util';

function openSubMenu(target: HTMLElement) {
    const targetParent = target.parentElement;
    if (!targetParent) {
        return;
    }
    const subMenu = targetParent.querySelector(':scope > [role="menu"]');
    if (!subMenu) {
        return;
    }
    const firstItem = subMenu.querySelector(':scope > [role="menuitem"], :scope > * > [role="menuitem"]');
    if (firstItem) {
        target.setAttribute('aria-expanded', 'true');
        (firstItem as HTMLElement).focus();
    }
}

function closeSubMenu(menu: HTMLElement) {
    const menuParent = menu.parentElement;
    if (!menuParent) {
        return;
    }
    const parentMenuItem = menuParent.querySelector(':scope > [role="menuitem"], :scope > * > [role="menuitem"]');
    if (parentMenuItem) {
        parentMenuItem.setAttribute('aria-expanded', 'false');
        (parentMenuItem as HTMLElement).focus();
    }
}

const ariaMenuMixin = {
    methods: {
        ariaPopupMenuKbd(ev: KeyboardEvent) {
            if (ev.defaultPrevented) {
                return;
            }
            const target = (ev.target as HTMLElement);
            if (!target) {
                return;
            }
            const menu = findAncestorRole(target, 'menu');
            if (!menu) {
                return;
            }
            const menuItems = menu.querySelectorAll(':scope > [role="menuitem"], :scope > * > [role="menuitem"]');
            if (menuItems.length === 0) {
                return;
            }
            switch (ev.key) {
                case ' ':
                    target.click();
                    break;
                case 'ArrowUp':
                    for(let idx = 0; idx < menuItems.length; idx++) {
                        if (menuItems[idx] === target) {
                            if (idx === 0) {
                                (menuItems[menuItems.length - 1] as HTMLElement).focus();
                            } else {
                                (menuItems[idx - 1] as HTMLElement).focus();
                            }
                            break;
                        }
                    }
                    break;
                case 'ArrowDown':
                    for(let idx = 0; idx < menuItems.length; idx++) {
                        if (menuItems[idx] === target) {
                            if (idx === menuItems.length - 1) {
                                (menuItems[0] as HTMLElement).focus();
                            } else {
                                (menuItems[idx + 1] as HTMLElement).focus();
                            }
                            break;
                        }
                    }
                    break;
                case 'ArrowRight':
                    openSubMenu(target);
                    break
                case 'ArrowLeft':
                    closeSubMenu(menu);
                    break;
                case 'Home':
                    (menuItems[0] as HTMLElement).focus();
                    break;
                case 'End':
                    (menuItems[menuItems.length - 1] as HTMLElement).focus();
                    break;
                case 'Tab':
                    break;
            }
        }
    }
};

export {
    ariaMenuMixin,
};
