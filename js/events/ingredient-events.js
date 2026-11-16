import { closeIngredientModal, openIngredientModal } from "../components/modal.js?v=5";
import { deleteIngredient, getIngredients } from "../data/storage.js";
import { showToast } from "../components/toast.js";

export function bindIngredientEvents(
    { ingredientList, addButton, closeButton, cancelButton, modal },
    onIngredientsChanged
) {
    addButton.addEventListener("click", () => openIngredientModal());
    closeButton.addEventListener("click", closeIngredientModal);
    cancelButton.addEventListener("click", closeIngredientModal);
    ingredientList.addEventListener("click", handleIngredientAction);

    modal.addEventListener("click", event => {
        if (event.target === modal) closeIngredientModal();
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
            closeIngredientModal();
        }
    });

    function handleIngredientAction(event) {
        const actionButton = event.target.closest("[data-action]");
        if (!actionButton || !ingredientList.contains(actionButton)) return;

        const { action, id } = actionButton.dataset;
        const ingredient = getIngredients().find(item => String(item.id) === String(id));
        if (!ingredient) return;

        if (action === "edit") {
            openIngredientModal(ingredient);
            return;
        }

        if (action !== "delete") return;

        const confirmed = window.confirm(
            `"${ingredient.name}" 식재료를 삭제하시겠습니까?`
        );
        if (!confirmed) return;

        try {
            deleteIngredient(id);
            onIngredientsChanged();
            showToast("식재료가 삭제되었습니다.", "success");
        } catch (error) {
            console.error("식재료 삭제 실패:", error);
            showToast("데이터를 저장하지 못했습니다.");
        }
    }
}
