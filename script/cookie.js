(function () {
    'use strict';

    const STORAGE_KEY = 'cookie_consent_v1';
    const EXPIRY_DAYS = 365;

    function saveConsent() {
        const payload = { seen: true, ts: Date.now() };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {
            const expires = new Date(Date.now() + EXPIRY_DAYS * 864e5).toUTCString();
            document.cookie = `${STORAGE_KEY}=${encodeURIComponent(JSON.stringify(payload))};expires=${expires};path=/;SameSite=Lax`;
        }
    }

    function loadConsent() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            const match = document.cookie.match(new RegExp('(?:^|; )' + STORAGE_KEY + '=([^;]*)'));
            return match ? JSON.parse(decodeURIComponent(match[1])) : null;
        }
    }

    const overlay   = document.getElementById('ckOverlay');
    if (!overlay) return;

    const btnAccept = document.getElementById('ckAccept');

    function hideBanner() {
        overlay.classList.add('ck-overlay--hidden');
        setTimeout(() => {
            overlay.hidden = true;
            overlay.removeAttribute('aria-modal');
        }, 320);
    }

    // Кнопка просто закрывает баннер и запоминает
    btnAccept.addEventListener('click', () => {
        saveConsent();
        hideBanner();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !overlay.hidden) {
            btnAccept.click();
        }
    });

    // Если уже закрывал — не показываем баннер
    const saved = loadConsent();
    if (saved !== null) {
        overlay.hidden = true;
    } else {
        overlay.hidden = false;
    }

    window.CookieConsent = {
        reset() {
            try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
            overlay.classList.remove('ck-overlay--hidden');
            overlay.hidden = false;
        }
    };

})();