import { validateIngredient } from "../utils/validation.js";
import { showToast } from "./toast.js";

/* ==============================
   Modal Component
============================== */

import {
    addIngredient,
    updateIngredient
} from "../data/storage.js";


/* ==============================
   DOM Elements
============================== */

const modal = document.querySelector("#ingredient-modal");
const modalTitle = document.querySelector("#modal-title");
const ingredientForm = document.querySelector("#ingredient-form");

const ingredientId = document.querySelector("#ingredient-id");
const ingredientName = document.querySelector("#ingredient-name");
const ingredientCategory = document.querySelector("#ingredient-category");
const ingredientQuantity = document.querySelector("#ingredient-quantity");
const ingredientExpiry = document.querySelector("#ingredient-expiry");
const ingredientStorage = document.querySelector("#ingredient-storage");

const submitButton = document.querySelector("#submit-btn");

ingredientExpiry.addEventListener("click", () => {
    if (typeof ingredientExpiry.showPicker !== "function") return;

    try {
        ingredientExpiry.showPicker();
    } catch {
        // Keep the browser's native date input behavior as a fallback.
    }
});


/* ==============================
   Open Modal
============================== */

export function openIngredientModal(ingredient = null) {

    // 폼 초기화
    ingredientForm.reset();

    if (ingredient) {
        // 수정 모드
        modalTitle.textContent = "식재료 수정";
        submitButton.textContent = "수정하기";

        ingredientId.value = ingredient.id;
        ingredientName.value = ingredient.name;
        ingredientCategory.value = ingredient.category;
        ingredientQuantity.value = ingredient.quantity;
        ingredientExpiry.value = ingredient.expiryDate;
        ingredientStorage.value = ingredient.storage;

    } else {
        // 등록 모드
        modalTitle.textContent = "식재료 등록";
        submitButton.textContent = "등록하기";

        ingredientId.value = "";
    }

    // 모달 표시
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");

    // 이름 입력창에 포커스
    ingredientName.focus();
}


/* ==============================
   Close Modal
============================== */

export function closeIngredientModal() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");

    ingredientForm.reset();
    ingredientId.value = "";
}


/* ==============================
   Get Form Data
============================== */

function getFormData() {

    return {
        name: ingredientName.value.trim(),
        category: ingredientCategory.value,
        quantity: Number(ingredientQuantity.value),
        expiryDate: ingredientExpiry.value,
        storage: ingredientStorage.value
    };
}


/* ==============================
   Submit Form
============================== */

function handleFormSubmit(event) {
    event.preventDefault();

    // HTML required 및 input 조건 검사
    if (!ingredientForm.reportValidity()) {
        return;
    }

    const formData = getFormData();

    const validation = validateIngredient(formData);
    if (!validation.isValid) {
        showToast(validation.errors[0]);
        return;
    }

    const id = ingredientId.value;

    try {
        if (id) {
            // 기존 식재료 수정
            updateIngredient(id, formData);
        } else {
            // 새로운 식재료 등록
            addIngredient(formData);
        }

        // 메인 화면에 데이터 변경 알림
        document.dispatchEvent(
            new CustomEvent("ingredients-updated")
        );

        closeIngredientModal();
        showToast(id ? "식재료 정보가 수정되었습니다." : "식재료가 추가되었습니다.", "success");

    } catch (error) {
        console.error("식재료 저장 실패:", error);
        if (error.code === "DUPLICATE_INGREDIENT") {
            showToast("이미 등록된 식재료입니다.");
        } else {
            showToast("데이터를 저장하지 못했습니다.");
        }
    }
}


/* ==============================
   Initialize Modal
============================== */

ingredientForm.addEventListener("submit", handleFormSubmit);
