
/* ==============================
   Ingredient Card Component
============================== */

import {
    getRemainingDays,
    formatDday,
    getExpiryStatus,
    formatDate
} from "../utils/date.js";


/* ==============================
   Category & Storage Labels
============================== */

const categoryLabels = {
    vegetable: "채소",
    fruit: "과일",
    meat: "육류",
    seafood: "해산물",
    dairy: "유제품",
    etc: "기타"
};

const storageLabels = {
    fridge: "냉장",
    freezer: "냉동",
    room: "실온"
};

const categoryIcons = {
    vegetable: "carrot",
    fruit: "apple",
    meat: "beef",
    seafood: "fish",
    dairy: "milk",
    etc: "package"
};


/* ==============================
   Escape HTML
============================== */

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];
    });
}


/* ==============================
   Create Ingredient Card
============================== */

function createIngredientCard(ingredient) {
    const remainingDays = getRemainingDays(ingredient.expiryDate);

    const dday = formatDday(remainingDays);
    const status = getExpiryStatus(remainingDays);

    const category = categoryLabels[ingredient.category] || "기타";
    const storage = storageLabels[ingredient.storage] || "미지정";
    const icon = categoryIcons[ingredient.category] || "package";

    const name = escapeHTML(ingredient.name);
    const quantity = escapeHTML(ingredient.quantity);
    const expiryDate = escapeHTML(formatDate(ingredient.expiryDate));

    const card = document.createElement("article");

    card.className = "ingredient-card";
    card.dataset.id = ingredient.id;

    card.innerHTML = `
        <div class="ingredient-card-info">

            <div class="ingredient-card-title">
                <span class="ingredient-icon" aria-hidden="true">
                    <i data-lucide="${icon}"></i>
                </span>
                <span>${name}</span>
            </div>

            <p class="ingredient-card-description">
                ${category} · ${storage} · ${quantity}개
            </p>

            <p class="ingredient-card-description">
                유통기한 ${expiryDate}
            </p>

        </div>

        <div class="ingredient-card-actions">

            <button
                type="button"
                class="edit-btn"
                data-action="edit"
                data-id="${ingredient.id}"
                aria-label="식재료 수정"
            >
                <i data-lucide="pencil" aria-hidden="true"></i>
            </button>

            <button
                type="button"
                class="delete-btn"
                data-action="delete"
                data-id="${ingredient.id}"
                aria-label="식재료 삭제"
            >
                <i data-lucide="trash-2" aria-hidden="true"></i>
            </button>

        </div>

        <div class="ingredient-card-dday ${status}">
            ${dday}
        </div>
    `;

    return card;
}


/* ==============================
   Render Ingredient List
============================== */

export function renderIngredientList(ingredients, container) {

    // 기존 목록 초기화
    container.innerHTML = "";

    // 등록된 식재료가 없는 경우
    if (ingredients.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <span>
                    <i data-lucide="leaf" aria-hidden="true"></i>
                </span>

                <div class="empty-heading" role="heading" aria-level="3">
                    아직 등록된 식재료가 없어요.
                </div>

                <p>식재료를 등록하고 냉장고를 관리해 보세요!</p>
            </div>
        `;

        // Lucide 아이콘 렌더링
        if (window.lucide) {
            window.lucide.createIcons();
        }

        return;
    }

    // 식재료 카드 생성 및 추가
    ingredients.forEach(ingredient => {
        const card = createIngredientCard(ingredient);

        container.appendChild(card);
    });

    // Lucide 아이콘 렌더링
    if (window.lucide) {
        window.lucide.createIcons();
    }
}
