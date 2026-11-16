import { showToast } from "../components/toast.js";

export function bindFilterEvents(
    { searchInput, storageFilter, categoryFilter, sortFilter },
    onFilterChange
) {
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

    updateFilters();
}
