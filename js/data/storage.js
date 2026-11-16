
/* ==============================
   Storage JavaScript
============================== */

// LocalStorage Key
const STORAGE_KEY = "my-refrigerator-ingredients";


/* ==============================
   Get Ingredients
============================== */

export function getIngredients() {
    const data = localStorage.getItem(STORAGE_KEY);

    // 저장된 데이터가 없으면 빈 배열 반환
    if (!data) {
        return [];
    }

    try {
        const ingredients = JSON.parse(data);

        if (!Array.isArray(ingredients)) {
            throw new Error("잘못된 데이터 형식입니다.");
        }

        return ingredients;
    } catch (error) {
        console.error("식재료 데이터를 불러오지 못했습니다.", error);
        return [];
    }
}


/* ==============================
   Save Ingredients
============================== */

export function saveIngredients(ingredients) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(ingredients)
    );
}


/* ==============================
   Add Ingredient
============================== */

export function addIngredient(ingredient) {
    const ingredients = getIngredients();
    const normalizedName = ingredient.name.trim().toLowerCase();

    const isDuplicate = ingredients.some(item =>
        String(item.name ?? "").trim().toLowerCase() === normalizedName &&
        item.storage === ingredient.storage
    );

    if (isDuplicate) {
        const error = new Error("이미 등록된 식재료입니다.");
        error.code = "DUPLICATE_INGREDIENT";
        throw error;
    }

    const newIngredient = {
        id: Date.now(),
        ...ingredient,
        createdAt: new Date().toISOString()
    };

    ingredients.push(newIngredient);

    saveIngredients(ingredients);

    return newIngredient;
}


/* ==============================
   Update Ingredient
============================== */

export function updateIngredient(id, newData) {
    const ingredients = getIngredients();

    const updatedIngredients = ingredients.map(ingredient => {
        if (ingredient.id === Number(id)) {
            return {
                ...ingredient,
                ...newData,
                id: ingredient.id,
                createdAt: ingredient.createdAt
            };
        }

        return ingredient;
    });

    saveIngredients(updatedIngredients);
}


/* ==============================
   Delete Ingredient
============================== */

export function deleteIngredient(id) {
    const ingredients = getIngredients();

    const updatedIngredients = ingredients.filter(
        ingredient => ingredient.id !== Number(id)
    );

    saveIngredients(updatedIngredients);
}
