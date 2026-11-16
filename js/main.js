
/* ==============================
   Main JavaScript
============================== */

// Components
import { renderIngredientList } from "./components/ingredient-card.js";
import {
    openIngredientModal,
    closeIngredientModal
} from "./components/modal.js?v=5";

// Data
import {
    getIngredients,
    deleteIngredient
} from "./data/storage.js";

// Utils
import { getRemainingDays } from "./utils/date.js";
import { filterIngredients } from "./utils/filter.js";
import { showToast } from "./components/toast.js";


/* ==============================
   DOM Elements
============================== */

const ingredientList = document.querySelector("#ingredient-list");

const totalCount = document.querySelector("#total-count");
const expiringCount = document.querySelector("#expiring-count");
const expiredCount = document.querySelector("#expired-count");

const addButton = document.querySelector("#add-ingredient-btn");
const closeButton = document.querySelector("#close-modal-btn");
const cancelButton = document.querySelector("#cancel-btn");
const menuButton = document.querySelector("#menu-btn");
const menuOverlay = document.querySelector("#side-menu-overlay");
const sideMenu = document.querySelector("#side-menu");
const closeMenuButton = document.querySelector("#close-menu-btn");
const menuAddButton = document.querySelector("#menu-add-ingredient");

let menuReturnFocus = null;

const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");
const sortFilter = document.querySelector("#sort-filter");

const storageButtons = document.querySelectorAll("[data-storage]");


/* ==============================
   Filter State
============================== */

const filterState = {
    keyword: "",
    storage: "all",
    category: "all",
    sort: "expiry"
};

let noResultsTimer;


/* ==============================
   Initialize App
============================== */

function init() {
    console.log("My Refrigerator 시작!");

    loadIngredients();
    bindEvents();
}


/* ==============================
   Load Ingredients
============================== */

function loadIngredients() {
    const ingredients = getIngredients();

    // 전체 식재료 기준 대시보드 업데이트
    updateDashboard(ingredients);

    // 현재 필터 조건 적용
    renderFilteredIngredients(ingredients);
}


/* ==============================
   Render Filtered Ingredients
============================== */

function renderFilteredIngredients(ingredients) {
    const filteredIngredients = filterIngredients(
        ingredients,
        filterState
    );

    renderIngredientList(
        filteredIngredients,
        ingredientList
    );

    if (ingredients.length > 0 && filteredIngredients.length === 0) {
        ingredientList.querySelector(".empty-heading").textContent = "검색 결과가 없습니다.";
        ingredientList.querySelector(".empty-message p").textContent = "검색어나 필터를 변경해 보세요.";
    }
}


/* ==============================
   Update Dashboard
============================== */

function updateDashboard(ingredients) {
    const total = ingredients.length;

    const expiring = ingredients.filter(ingredient => {
        const remainingDays = getRemainingDays(ingredient.expiryDate);

        return remainingDays !== null &&
            remainingDays >= 0 &&
            remainingDays <= 3;
    }).length;

    const expired = ingredients.filter(ingredient => {
        const remainingDays = getRemainingDays(ingredient.expiryDate);

        return remainingDays !== null && remainingDays < 0;
    }).length;

    totalCount.textContent = `${total}개`;
    expiringCount.textContent = `${expiring}개`;
    expiredCount.textContent = `${expired}개`;
}


/* ==============================
   Handle Ingredient Actions
============================== */

function handleIngredientAction(event) {
    const actionButton = event.target.closest("[data-action]");

    if (!actionButton) {
        return;
    }

    const action = actionButton.dataset.action;
    const id = actionButton.dataset.id;

    const ingredients = getIngredients();

    const ingredient = ingredients.find(
        item => String(item.id) === String(id)
    );

    if (!ingredient) {
        return;
    }

    // 식재료 수정
    if (action === "edit") {
        openIngredientModal(ingredient);
        return;
    }

    // 식재료 삭제
    if (action === "delete") {
        const confirmed = window.confirm(
            `"${ingredient.name}" 식재료를 삭제하시겠습니까?`
        );

        if (!confirmed) {
            return;
        }

        try {
            deleteIngredient(id);
            loadIngredients();
            showToast("식재료가 삭제되었습니다.", "success");
        } catch (error) {
            console.error("식재료 삭제 실패:", error);
            showToast("데이터를 저장하지 못했습니다.");
        }
    }
}


/* ==============================
   Handle Search
============================== */

function handleSearch(event) {
    filterState.keyword = event.target.value;

    loadFilteredIngredients();
    scheduleNoResultsToast();
}

function scheduleNoResultsToast() {
    window.clearTimeout(noResultsTimer);

    if (!filterState.keyword.trim()) return;

    noResultsTimer = window.setTimeout(() => {
        const filteredIngredients = filterIngredients(getIngredients(), filterState);

        if (filteredIngredients.length === 0) {
            showToast("검색 결과가 없습니다.", "info");
        }
    }, 500);
}


/* ==============================
   Handle Storage Filter
============================== */

function handleStorageFilter(event) {
    const button = event.target.closest("[data-storage]");

    if (!button) {
        return;
    }

    // 선택된 보관 위치 저장
    filterState.storage = button.dataset.storage;

    // 활성 버튼 변경
    storageButtons.forEach(storageButton => {
        storageButton.classList.toggle(
            "active",
            storageButton === button
        );
    });

    loadFilteredIngredients();
}


/* ==============================
   Handle Category Filter
============================== */

function handleCategoryFilter(event) {
    filterState.category = event.target.value;

    loadFilteredIngredients();
}


/* ==============================
   Handle Sort
============================== */

function handleSort(event) {
    filterState.sort = event.target.value;

    loadFilteredIngredients();
}


/* ==============================
   Load Filtered Ingredients
============================== */

function loadFilteredIngredients() {
    const ingredients = getIngredients();

    renderFilteredIngredients(ingredients);
}


/* ==============================
   Event Binding
============================== */

function bindEvents() {

    // 식재료 등록 버튼
    addButton.addEventListener("click", () => {
        openIngredientModal();
    });

    // 모달 닫기
    closeButton.addEventListener("click", closeIngredientModal);
    cancelButton.addEventListener("click", closeIngredientModal);

    menuButton.addEventListener("click", openSideMenu);
    closeMenuButton.addEventListener("click", closeSideMenu);

    menuOverlay.addEventListener("click", event => {
        if (event.target === menuOverlay) {
            closeSideMenu();
        }
    });

    sideMenu.querySelectorAll("a[href^='#']").forEach(link => {
        link.addEventListener("click", closeSideMenu);
    });

    menuAddButton.addEventListener("click", () => {
        closeSideMenu();
        openIngredientModal();
    });

    // 모달 바깥 영역 클릭
    const modal = document.querySelector("#ingredient-modal");

    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeIngredientModal();
        }
    });

    document.addEventListener("keydown", handleGlobalKeydown);

    // 식재료 수정 및 삭제
    ingredientList.addEventListener(
        "click",
        handleIngredientAction
    );

    // 검색
    searchInput.addEventListener("input", handleSearch);

    // 보관 위치 필터
    storageButtons.forEach(button => {
        button.addEventListener("click", handleStorageFilter);
    });

    // 카테고리 필터
    categoryFilter.addEventListener(
        "change",
        handleCategoryFilter
    );

    // 정렬
    sortFilter.addEventListener("change", handleSort);

    // 식재료 데이터 변경
    document.addEventListener("ingredients-updated", () => {
        loadIngredients();
    });
}

function openSideMenu() {
    menuReturnFocus = document.activeElement;
    menuOverlay.classList.add("is-open");
    menuOverlay.setAttribute("aria-hidden", "false");
    menuButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("side-menu-open");
    closeMenuButton.focus();
}

function closeSideMenu() {
    menuOverlay.classList.remove("is-open");
    menuOverlay.setAttribute("aria-hidden", "true");
    menuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("side-menu-open");

    if (menuReturnFocus instanceof HTMLElement) {
        menuReturnFocus.focus();
    }

    menuReturnFocus = null;
}

function handleGlobalKeydown(event) {
    if (event.key === "Escape") {
        if (menuOverlay.classList.contains("is-open")) {
            closeSideMenu();
        } else if (document.querySelector("#ingredient-modal").getAttribute("aria-hidden") === "false") {
            closeIngredientModal();
        }
    }

    if (event.key !== "Tab" || !menuOverlay.classList.contains("is-open")) {
        return;
    }

    const focusableItems = sideMenu.querySelectorAll("a[href], button:not([disabled])");
    const firstItem = focusableItems[0];
    const lastItem = focusableItems[focusableItems.length - 1];

    if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
    } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
    }
}


/* ==============================
   App Start
============================== */

document.addEventListener("DOMContentLoaded", init);
