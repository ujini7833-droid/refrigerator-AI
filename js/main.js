import { bindFilterEvents } from "./events/filter-events.js";
import { bindIngredientEvents } from "./events/ingredient-events.js";
import { bindMenuEvents } from "./events/menu-events.js";
import { openIngredientModal } from "./components/modal.js?v=5";
import { createHomePage } from "./pages/home.js";

function init() {
    const elements = {
        ingredientList: document.querySelector("#ingredient-list"),
        totalCount: document.querySelector("#total-count"),
        expiringCount: document.querySelector("#expiring-count"),
        expiredCount: document.querySelector("#expired-count"),
        addButton: document.querySelector("#add-ingredient-btn"),
        closeButton: document.querySelector("#close-modal-btn"),
        cancelButton: document.querySelector("#cancel-btn"),
        modal: document.querySelector("#ingredient-modal"),
        searchInput: document.querySelector("#search-input"),
        storageFilter: document.querySelector(".storage-filter"),
        categoryFilter: document.querySelector("#category-filter"),
        sortFilter: document.querySelector("#sort-filter"),
        menuTrigger: document.querySelector("#menu-btn"),
        menuOverlay: document.querySelector("#side-menu-overlay"),
        menuPanel: document.querySelector("#side-menu"),
        menuCloseButton: document.querySelector("#close-menu-btn"),
        menuAddButton: document.querySelector("#menu-add-ingredient")
    };

    if (Object.values(elements).some(element => !element)) {
        console.error("앱을 초기화하지 못했습니다. 필요한 HTML 요소를 확인해 주세요.");
        return;
    }

    const homePage = createHomePage(elements);

    bindIngredientEvents(elements, homePage.refresh);
    bindFilterEvents(elements, homePage.setFilters);
    bindMenuEvents({
        trigger: elements.menuTrigger,
        overlay: elements.menuOverlay,
        panel: elements.menuPanel,
        closeButton: elements.menuCloseButton,
        addButton: elements.menuAddButton
    }, openIngredientModal);

    document.addEventListener("ingredients-updated", homePage.refresh);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
    init();
}
