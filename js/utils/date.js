
/* ==============================
   Date Utility
============================== */


/* ==============================
   Get Today
============================== */

export function getToday() {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return today;
}


/* ==============================
   Parse Date
============================== */

function parseDate(dateString) {
    if (!dateString || typeof dateString !== "string") {
        return null;
    }

    const [year, month, day] = dateString.split("-").map(Number);

    if (!year || !month || !day) {
        return null;
    }

    const date = new Date(year, month - 1, day);

    // 잘못된 날짜 입력 방지
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
}


/* ==============================
   Get Remaining Days
============================== */

export function getRemainingDays(expiryDate) {
    const today = getToday();
    const expiry = parseDate(expiryDate);

    if (!expiry) {
        return null;
    }

    const diff = expiry.getTime() - today.getTime();

    const oneDay = 1000 * 60 * 60 * 24;

    return Math.round(diff / oneDay);
}


/* ==============================
   Format D-day
============================== */

export function formatDday(remainingDays) {
    if (remainingDays === null || !Number.isFinite(remainingDays)) {
        return "날짜 미정";
    }

    if (remainingDays > 0) {
        return `D-${remainingDays}`;
    }

    if (remainingDays === 0) {
        return "D-DAY";
    }

    return `D+${Math.abs(remainingDays)}`;
}


/* ==============================
   Get Expiry Status
============================== */

export function getExpiryStatus(remainingDays) {
    if (remainingDays === null || !Number.isFinite(remainingDays)) {
        return "unknown";
    }

    if (remainingDays < 0) {
        return "expired";
    }

    if (remainingDays <= 3) {
        return "expiring";
    }

    return "safe";
}


/* ==============================
   Format Date
============================== */

export function formatDate(dateString) {
    const date = parseDate(dateString);

    if (!date) {
        return "날짜 미정";
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
}
