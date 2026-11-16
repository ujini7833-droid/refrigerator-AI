import { renderIngredientList } from "../components/ingredient-card.js";
import { getIngredients } from "../data/storage.js";
import { filterIngredients } from "../utils/filter.js";
import { getRemainingDays } from "../utils/date.js";

export function createHomePage({ ingredientList, totalCount, expiringCount, expiredCount }) {
    let filters = {
        keyword: "",
        storage: "all",
        category: "all",
        sort: "expiry"
    };

    function refresh() {
        const ingredients = getIngredients();
        const visibleIngredients = filterIngredients(ingredients, filters);

        renderIngredientList(visibleIngredients, ingredientList);
        updateEmptyMessage(ingredients, visibleIngredients);
        updateDashboard(ingredients);

        return visibleIngredients.length;
    }

    function setFilters(nextFilters) {
        filters = { ...nextFilters };
        return refresh();
    }

    function updateEmptyMessage(allIngredients, visibleIngredients) {
        if (allIngredients.length === 0 || visibleIngredients.length > 0) return;

        ingredientList.querySelector(".empty-heading").textContent = "조건에 맞는 식재료가 없습니다.";
        ingredientList.querySelector(".empty-message p").textContent = "검색어나 필터를 변경해 보세요.";
    }

    function updateDashboard(ingredients) {
        let expiring = 0;
        let expired = 0;

        ingredients.forEach(ingredient => {
            const remainingDays = getRemainingDays(ingredient.expiryDate);
            if (remainingDays === null) return;

            if (remainingDays < 0) {
                expired += 1;
            } else if (remainingDays <= 3) {
                expiring += 1;
            }
        });

        totalCount.textContent = `${ingredients.length}개`;
        expiringCount.textContent = `${expiring}개`;
        expiredCount.textContent = `${expired}개`;
    }

    return { refresh, setFilters };
}
