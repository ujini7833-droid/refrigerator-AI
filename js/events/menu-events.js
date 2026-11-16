export function bindMenuEvents(
    { trigger, overlay, panel, closeButton, addButton },
    onAddIngredient
) {
    let returnFocus = null;

    trigger.addEventListener("click", openMenu);
    closeButton.addEventListener("click", closeMenu);
    addButton.addEventListener("click", () => {
        closeMenu();
        onAddIngredient();
    });

    overlay.addEventListener("click", event => {
        if (event.target === overlay) closeMenu();
    });

    panel.querySelectorAll("a[href^='#']").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
        if (!overlay.classList.contains("is-open")) return;

        if (event.key === "Escape") {
            closeMenu();
            return;
        }

        if (event.key !== "Tab") return;

        const focusableItems = panel.querySelectorAll("a[href], button:not([disabled])");
        const firstItem = focusableItems[0];
        const lastItem = focusableItems[focusableItems.length - 1];

        if (event.shiftKey && document.activeElement === firstItem) {
            event.preventDefault();
            lastItem.focus();
        } else if (!event.shiftKey && document.activeElement === lastItem) {
            event.preventDefault();
            firstItem.focus();
        }
    });

    function openMenu() {
        returnFocus = document.activeElement;
        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
        trigger.setAttribute("aria-expanded", "true");
        document.body.classList.add("side-menu-open");
        closeButton.focus();
    }

    function closeMenu() {
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        trigger.setAttribute("aria-expanded", "false");
        document.body.classList.remove("side-menu-open");

        if (returnFocus instanceof HTMLElement) returnFocus.focus();
        returnFocus = null;
    }
}
