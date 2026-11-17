const TOUR_STORAGE_KEY = "my-refrigerator-product-tour-complete";

const TOUR_STEPS = [
    {
        target: ".dashboard-info",
        title: "대시보드",
        description: "냉장고에 보관 중인 식재료와 소비기한 현황을 한눈에 확인할 수 있어요."
    },
    {
        target: "#search-input",
        title: "식재료 검색",
        description: "찾고 싶은 식재료의 이름을 입력하면 빠르게 검색할 수 있어요."
    },
    {
        target: ".filter-container",
        title: "필터 및 정렬",
        description: "보관 장소와 카테고리별로 분류하고, 소비기한이 임박한 순서로 정렬할 수 있어요."
    },
    {
        target: ".ingredient-list",
        title: "식재료 카드",
        description: "식재료 카드에서 수량, 보관 장소, 소비기한을 확인하고 수정하거나 삭제할 수 있어요."
    },
    {
        target: "#add-ingredient-btn",
        title: "식재료 등록",
        description: "새로운 식재료를 등록해 보세요. 이름, 카테고리, 수량, 소비기한, 보관 위치를 입력하면 돼요."
    },
    {
        target: "#menu-btn",
        title: "사이드 메뉴",
        description: "메뉴에서 대시보드와 나의 식재료 화면으로 이동하고, 언제든 새로운 식재료를 등록할 수 있어요."
    }
];

export function startProductTour({ force = false } = {}) {
    let hasCompletedTour = false;
    try {
        hasCompletedTour = localStorage.getItem(TOUR_STORAGE_KEY) === "true";
    } catch (error) {
        // Continue with the tour when storage is unavailable.
    }
    if (hasCompletedTour && !force) return;

    const overlay = document.createElement("div");
    overlay.className = "product-tour";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `
        <div class="product-tour-shade" aria-hidden="true"></div>
        <div class="product-tour-spotlight" aria-hidden="true"></div>
        <section class="product-tour-card" role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-description" tabindex="-1">
            <div class="product-tour-topline">
                <span class="product-tour-count" aria-live="polite"></span>
            </div>
            <h2 id="tour-title"></h2>
            <p id="tour-description"></p>
            <div class="product-tour-actions">
                <button type="button" class="product-tour-skip">건너뛰기</button>
                <div class="product-tour-navigation">
                    <button type="button" class="product-tour-previous">이전</button>
                    <button type="button" class="product-tour-next">다음 <span aria-hidden="true">→</span></button>
                </div>
            </div>
        </section>
    `;
    document.body.append(overlay);

    const spotlight = overlay.querySelector(".product-tour-spotlight");
    const card = overlay.querySelector(".product-tour-card");
    const title = overlay.querySelector("#tour-title");
    const description = overlay.querySelector("#tour-description");
    const count = overlay.querySelector(".product-tour-count");
    const previousButton = overlay.querySelector(".product-tour-previous");
    const nextButton = overlay.querySelector(".product-tour-next");
    let currentStep = 0;
    let targetElement = null;
    let scrollSettleTimer;

    overlay.querySelector(".product-tour-skip").addEventListener("click", () => finishTour());
    previousButton.addEventListener("click", () => showStep(currentStep - 1));
    nextButton.addEventListener("click", () => {
        if (currentStep === TOUR_STEPS.length - 1) finishTour();
        else showStep(currentStep + 1);
    });

    document.addEventListener("keydown", handleKeydown);
    window.addEventListener("resize", positionTour);
    window.addEventListener("scroll", handleScroll, true);

    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");
    showStep(0);

    function showStep(index) {
        currentStep = Math.max(0, Math.min(index, TOUR_STEPS.length - 1));
        const step = TOUR_STEPS[currentStep];
        targetElement = document.querySelector(step.target);
        if (!targetElement) return;

        const initialRect = targetElement.getBoundingClientRect();
        const needsScroll = initialRect.top < 24 || initialRect.bottom > window.innerHeight - 24;
        overlay.classList.toggle("is-scrolling", needsScroll);
        if (needsScroll) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        }
        title.textContent = step.title;
        description.textContent = step.description;
        count.textContent = `${currentStep + 1} / ${TOUR_STEPS.length}`;
        previousButton.disabled = currentStep === 0;
        nextButton.innerHTML = currentStep === TOUR_STEPS.length - 1
            ? "시작하기 <span aria-hidden=\"true\">→</span>"
            : "다음 <span aria-hidden=\"true\">→</span>";
        requestAnimationFrame(() => {
            if (needsScroll) positionSpotlight();
            else positionTour();
            card.focus({ preventScroll: true });
        });
        clearTimeout(scrollSettleTimer);
        if (needsScroll) scrollSettleTimer = window.setTimeout(settlePosition, 180);
    }

    function positionTour() {
        if (!targetElement?.isConnected) return;
        positionSpotlight();

        const targetRect = targetElement.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const margin = 16;
        const targetCenter = targetRect.left + targetRect.width / 2;
        const left = Math.max(margin, Math.min(targetCenter - cardRect.width / 2, window.innerWidth - cardRect.width - margin));
        const roomBelow = window.innerHeight - targetRect.bottom;
        const top = roomBelow >= cardRect.height + 24
            ? targetRect.bottom + 20
            : Math.max(margin, targetRect.top - cardRect.height - 20);
        card.style.left = `${left}px`;
        card.style.top = `${top}px`;
    }

    function positionSpotlight() {
        if (!targetElement?.isConnected) return;
        const targetRect = targetElement.getBoundingClientRect();
        const spotlightInset = 7;
        spotlight.style.top = `${Math.max(8, targetRect.top - spotlightInset)}px`;
        spotlight.style.left = `${Math.max(8, targetRect.left - spotlightInset)}px`;
        spotlight.style.width = `${Math.min(window.innerWidth - 16, targetRect.width + spotlightInset * 2)}px`;
        spotlight.style.height = `${Math.min(window.innerHeight - 16, targetRect.height + spotlightInset * 2)}px`;
        spotlight.style.borderRadius = getComputedStyle(targetElement).borderRadius || "14px";
    }

    function handleScroll() {
        if (!overlay.classList.contains("is-scrolling")) return;
        positionSpotlight();
        clearTimeout(scrollSettleTimer);
        scrollSettleTimer = window.setTimeout(settlePosition, 120);
    }

    function settlePosition() {
        overlay.classList.remove("is-scrolling");
        positionTour();
    }

    function handleKeydown(event) {
        if (event.key === "Escape") finishTour();
        if (event.key === "ArrowRight") showStep(currentStep + 1);
        if (event.key === "ArrowLeft") showStep(currentStep - 1);
        if (event.key === "Tab") {
            const focusable = [...card.querySelectorAll("button:not(:disabled)")];
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    }

    function finishTour() {
        try {
            localStorage.setItem(TOUR_STORAGE_KEY, "true");
        } catch (error) {
            // The tour remains dismissible for this visit when storage is unavailable.
        }
        document.removeEventListener("keydown", handleKeydown);
        window.removeEventListener("resize", positionTour);
        window.removeEventListener("scroll", handleScroll, true);
        clearTimeout(scrollSettleTimer);
        overlay.remove();
    }
}
