
/* ==============================
   Filter Utility
============================== */

import { getRemainingDays } from "./date.js";


/* ==============================
   Search Ingredients
============================== */

export function searchIngredients(ingredients, keyword) {
    const searchText = keyword.trim().toLowerCase();

    if (!searchText) {
        return ingredients;
    }

    return ingredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchText)
    );
}


/* ==============================
   Filter By Storage
============================== */

export function filterByStorage(ingredients, storage) {
    if (storage === "all") {
        return ingredients;
    }

    return ingredients.filter(
        ingredient => ingredient.storage === storage
    );
}


/* ==============================
   Filter By Category
============================== */

export function filterByCategory(ingredients, category) {
    if (category === "all") {
        return ingredients;
    }

    return ingredients.filter(
        ingredient => ingredient.category === category
    );
}


/* ==============================
   Sort Ingredients
============================== */

export function sortIngredients(ingredients, sortType) {
    const sortedIngredients = [...ingredients];

    switch (sortType) {

        // 유통기한 임박순
        case "expiry":
            return sortedIngredients.sort((a, b) => {
                const dateA = getRemainingDays(a.expiryDate);
                const dateB = getRemainingDays(b.expiryDate);

                // 날짜가 잘못된 데이터는 마지막으로
                if (dateA === null) return 1;
                if (dateB === null) return -1;

                return dateA - dateB;
            });

        // 최근 등록순
        case "latest":
            return sortedIngredients.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

        // 이름순
        case "name":
            return sortedIngredients.sort((a, b) => {
                return a.name.localeCompare(b.name, "ko");
            });

        default:
            return sortedIngredients;
    }
}


/* ==============================
   Apply All Filters
============================== */

export function filterIngredients(ingredients, options = {}) {
    const {
        keyword = "",
        storage = "all",
        category = "all",
        sort = "expiry"
    } = options;

    let result = [...ingredients];

    // 이름 검색
    result = searchIngredients(result, keyword);

    // 보관 위치 필터
    result = filterByStorage(result, storage);

    // 카테고리 필터
    result = filterByCategory(result, category);

    // 정렬
    result = sortIngredients(result, sort);

    return result;
}
