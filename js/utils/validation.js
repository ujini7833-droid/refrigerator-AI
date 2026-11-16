
const VALID_CATEGORIES = [
  "vegetable",
  "fruit",
  "meat",
  "seafood",
  "dairy",
  "etc",
];

const VALID_STORAGES = ["fridge", "freezer", "room"];

// 날짜가 실제로 존재하는 날짜인지 확인
function isValidDate(dateString) {
  if (!dateString) return false;

  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) return false;

  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

// 식재료 입력값 검증
export function validateIngredient(ingredient) {
  const errors = [];

  if (!ingredient.name || !ingredient.name.trim()) {
    errors.push("식재료 이름을 입력해주세요.");
  }

  if (
    !Number.isInteger(ingredient.quantity) ||
    ingredient.quantity <= 0
  ) {
    errors.push("수량은 1 이상의 정수로 입력해주세요.");
  }

  if (!isValidDate(ingredient.expiryDate)) {
    errors.push("올바른 소비기한을 입력해주세요.");
  }

  if (!VALID_CATEGORIES.includes(ingredient.category)) {
    errors.push("올바른 카테고리를 선택해주세요.");
  }

  if (!VALID_STORAGES.includes(ingredient.storage)) {
    errors.push("올바른 보관 장소를 선택해주세요.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
