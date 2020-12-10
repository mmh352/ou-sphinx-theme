import { findAncestorRole } from './util';

const ariaPopupMenuMixin = {
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
            const controllerId = menu.getAttribute('aria-labelledby');
            if (!controllerId) {
                return;
            }
            const controller = document.getElementById(controllerId);
            if (!controller) {
                return;
            }
            const menuItems = menu.querySelectorAll('[role="menuitem"]');
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
                case 'Home':
                    (menuItems[0] as HTMLElement).focus();
                    break;
                case 'End':
                    (menuItems[menuItems.length - 1] as HTMLElement).focus();
                    break;
                case 'Escape':
                    controller.click();
                    controller.focus();
                    break;
                case 'Tab':
                    controller.click();
                    break;
            }
        }
    }
};

export {
    ariaPopupMenuMixin,
};
