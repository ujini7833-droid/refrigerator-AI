
import test from "node:test";
import assert from "node:assert/strict";

import { formatDday, getExpiryStatus, getRemainingDays, } from "../js/utils/date.js";

import { validateIngredient } from "../js/utils/validation.js";

import { searchIngredients, } from "../js/utils/filter.js";

// 테스트용 식재료 데이터
const sampleIngredient = {
  name: "양파",
  quantity: 2,
  expiryDate: "2026-12-01",
  category: "vegetable",
  storage: "fridge",
};

// 테스트 1. D-day 문자열 변환
test("남은 날짜를 D-day 형식으로 변환한다", () => {
  assert.equal(formatDday(3), "D-3");
  assert.equal(formatDday(0), "D-DAY");
  assert.equal(formatDday(-2), "D+2");
});

// 테스트 2. 소비기한 상태 구분
test("소비기한에 따라 상태를 구분한다", () => {
  assert.equal(getExpiryStatus(10), "safe");
  assert.equal(getExpiryStatus(2), "expiring");
  assert.equal(getExpiryStatus(-1), "expired");
});

// 테스트 3. 잘못된 날짜 처리
test("잘못된 소비기한은 null을 반환한다", () => {
  assert.equal(getRemainingDays("2026-02-30"), null);
});

// 테스트 4. 정상적인 식재료 입력
test("올바른 식재료 정보는 검증을 통과한다", () => {
  const result = validateIngredient(sampleIngredient);

  assert.equal(result.isValid, true);
  assert.equal(result.errors.length, 0);
});

// 테스트 5. 빈 이름 입력 예외 처리
test("식재료 이름이 비어 있으면 검증에 실패한다", () => {
  const invalidIngredient = {
    ...sampleIngredient,
    name: "",
  };

  const result = validateIngredient(invalidIngredient);
  assert.equal(result.isValid, false);
  assert.ok(result.errors.length > 0);
});

// 테스트 6. 식재료 이름 검색
test("검색어와 일치하는 식재료만 반환한다", () => {
  const ingredients = [
    { name: "양파" },
    { name: "감자" },
    { name: "대파" },
  ];

  const result = searchIngredients(ingredients, "양파");
  assert.equal(result.length, 1);
  assert.equal(result[0].name, "양파");
});
