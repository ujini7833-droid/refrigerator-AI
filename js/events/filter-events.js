import { showToast } from "../components/toast.js";

export function bindFilterEvents(
    { searchInput, storageFilter, categoryFilter, sortFilter },
    onFilterChange
) {
    const storageIndicator = document.createElement("span");
    storageIndicator.className = "storage-filter-indicator";
    storageIndicator.setAttribute("aria-hidden", "true");
    storageFilter.prepend(storageIndicator);

    const filters = {
        keyword: "",
        storage: "all",
        category: "all",
        sort: "expiry"
    };

    let noResultsTimer;

    function updateFilters() {
        window.clearTimeout(noResultsTimer);
        const resultCount = onFilterChange({ ...filters });

        if (filters.keyword.trim()) {
            noResultsTimer = window.setTimeout(() => {
                if (resultCount === 0) {
                    showToast("검색 결과가 없습니다.", "info");
                }
            }, 500);
        }
    }

    function moveStorageIndicator(button = storageFilter.querySelector("[data-storage].active")) {
        if (!button) return;
        const filterRect = storageFilter.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        storageFilter.style.setProperty("--storage-indicator-left", `${buttonRect.left - filterRect.left - storageFilter.clientLeft}px`);
        storageFilter.style.setProperty("--storage-indicator-width", `${buttonRect.width}px`);
        storageFilter.style.setProperty("--storage-indicator-top", `${buttonRect.top - filterRect.top - storageFilter.clientTop}px`);
        storageFilter.style.setProperty("--storage-indicator-height", `${buttonRect.height}px`);
    }

    searchInput.addEventListener("input", event => {
        filters.keyword = event.currentTarget.value;
        updateFilters();
    });

    storageFilter.addEventListener("click", event => {
        const button = event.target.closest("[data-storage]");
        if (!button || !storageFilter.contains(button)) return;

        filters.storage = button.dataset.storage;
        storageFilter.querySelectorAll("[data-storage]").forEach(filterButton => {
            const isActive = filterButton === button;
            filterButton.classList.toggle("active", isActive);
            filterButton.setAttribute("aria-pressed", String(isActive));
        });
        moveStorageIndicator(button);

        updateFilters();
    });

    categoryFilter.addEventListener("change", event => {
        filters.category = event.currentTarget.value;
        updateFilters();
    });

    sortFilter.addEventListener("change", event => {
        filters.sort = event.currentTarget.value;
        updateFilters();
    });

    storageFilter.querySelectorAll("[data-storage]").forEach(button => {
        button.setAttribute("aria-pressed", String(button.classList.contains("active")));
    });
    moveStorageIndicator();
    window.addEventListener("resize", () => moveStorageIndicator());

    updateFilters();
}
