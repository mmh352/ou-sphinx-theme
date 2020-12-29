const menuItems = document.querySelectorAll('[role="menuitem"]');
for (let idx = 0; idx < menuItems.length; idx++) {
    const menuItem = menuItems[idx];
    menuItem.addEventListener('keyup', (ev) => {
        console.log('Needs implementing');
    });
}
