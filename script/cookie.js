/**
 * cookie.js — Cookie Consent + Яндекс.Метрика
 *
 * Логика:
 *  - При загрузке проверяем localStorage на наличие сохранённого выбора.
 *  - Если выбора нет — показываем баннер.
 *  - «Принять все»    → сохраняем {analytics: true},  запускаем Метрику, скрываем баннер.
 *  - «Отклонить»      → сохраняем {analytics: false}, скрываем баннер.
 *  - «Настроить»      → раскрываем панель с тогглами; кнопка меняется на «Сохранить».
 *  - «Сохранить»      → читаем состояние тоггла, сохраняем, запускаем Метрику если ок.
 */

(function () {
    "use strict";

    const STORAGE_KEY = "cookie_consent_v1";
    const EXPIRY_DAYS = 365;

    // ── Утилиты хранилища
    function saveConsent(data) {
        const payload = { ...data, ts: Date.now() };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {
            // Fallback: cookie
            const expires = new Date(
                Date.now() + EXPIRY_DAYS * 864e5,
            ).toUTCString();
            document.cookie = `${STORAGE_KEY}=${encodeURIComponent(JSON.stringify(payload))};expires=${expires};path=/;SameSite=Lax`;
        }
    }

    function loadConsent() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            const match = document.cookie.match(
                new RegExp("(?:^|; )" + STORAGE_KEY + "=([^;]*)"),
            );
            return match ? JSON.parse(decodeURIComponent(match[1])) : null;
        }
    }

    // ── Применить выбор
    function applyConsent(analytics) {
        if (analytics && typeof window.initYandexMetrika === "function") {
            window.initYandexMetrika();
        }
    }

    // ── DOM-элементы
    const overlay = document.getElementById("ckOverlay");
    if (!overlay) return; // баннера нет на этой странице

    const settings = document.getElementById("ckSettings");
    const analytics = document.getElementById("ckAnalytics");
    const btnConfig = document.getElementById("ckConfigure");
    const btnDecline = document.getElementById("ckDecline");
    const btnAccept = document.getElementById("ckAccept");

    // ── Скрыть баннер с анимацией
    function hideBanner() {
        overlay.classList.add("ck-overlay--hidden");
        setTimeout(() => {
            overlay.hidden = true;
            overlay.removeAttribute("aria-modal");
        }, 320);
    }

    // ── Показать баннер
    function showBanner() {
        overlay.hidden = false;
        // document.body.style.overflow = 'hidden';   // блокируем прокрутку
    }

    // ── Настроить / Сохранить
    let configMode = false;

    btnConfig.addEventListener("click", () => {
        if (!configMode) {
            // Раскрываем настройки
            settings.hidden = false;
            btnConfig.textContent = "Сохранить";
            btnAccept.textContent = "Принять все";
            configMode = true;
        } else {
            // Сохраняем выбор из тоггла
            const val = analytics ? analytics.checked : false;
            saveConsent({ analytics: val });
            applyConsent(val);
            hideBanner();
        }
    });

    // ── Отклонить
    btnDecline.addEventListener("click", () => {
        saveConsent({ analytics: false });
        applyConsent(false);
        hideBanner();
    });

    // ── Принять все
    btnAccept.addEventListener("click", () => {
        if (analytics) analytics.checked = true;
        saveConsent({ analytics: true });
        applyConsent(true);
        hideBanner();
    });

    // ── Закрытие по клику на оверлей (вне модалки)
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            // не закрываем принудительно — пользователь должен сделать выбор
            // можно раскомментировать, если хотите разрешить закрытие:
            // hideBanner();
        }
    });

    // ── Закрытие по Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !overlay.hidden) {
            btnDecline.click(); // трактуем как отказ
        }
    });

    // ── Инициализация
    const saved = loadConsent();

    if (saved !== null) {
        // Выбор уже сделан
        overlay.hidden = true;
        applyConsent(saved.analytics);
    } else {
        // Первый визит — показываем баннер
        showBanner();
    }

    // ── Публичный API: позволяет переоткрыть баннер из кнопки «Изменить настройки»
    //    Пример: <button onclick="CookieConsent.reset()">Изменить настройки cookie</button>
    window.CookieConsent = {
        reset() {
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch (e) {
                /* */
            }
            configMode = false;
            settings.hidden = true;
            btnConfig.textContent = "Настроить";
            btnAccept.textContent = "Принять все";
            overlay.classList.remove("ck-overlay--hidden");
            overlay.hidden = false;
            document.body.style.overflow = "hidden";
        },
        getConsent() {
            return loadConsent();
        },
    };
})();
