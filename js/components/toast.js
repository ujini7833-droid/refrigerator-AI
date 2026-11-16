const TOAST_DURATION = 3600;

function getToastContainer() {
    let container = document.querySelector("#toast-container");

    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    return container;
}

export function showToast(message, type = "error") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.setAttribute("role", type === "error" ? "alert" : "status");

    const icon = document.createElement("span");
    icon.className = "toast-icon";
    icon.setAttribute("aria-hidden", "true");

    const iconElement = document.createElement("i");
    iconElement.setAttribute(
        "data-lucide",
        type === "success" ? "circle-check" : type === "info" ? "search-x" : "triangle-alert"
    );
    icon.appendChild(iconElement);

    const text = document.createElement("span");
    text.className = "toast-message";
    text.textContent = message;

    toast.append(icon, text);

    const container = getToastContainer();
    container.appendChild(toast);
    window.lucide?.createIcons();

    window.setTimeout(() => {
        toast.classList.add("toast-leaving");
        toast.addEventListener("transitionend", () => toast.remove(), { once: true });
        window.setTimeout(() => toast.remove(), 250);
    }, TOAST_DURATION);
}
