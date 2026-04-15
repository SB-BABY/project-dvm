document.addEventListener("DOMContentLoaded", () => {

    const forms = document.querySelectorAll(".js-contact-form");

    forms.forEach(form => {

        const phoneInput = form.querySelector('input[name="phone"]');

        function formatPhone(value) {

            let digits = value.replace(/\D/g, '');

            if (digits.startsWith('8')) {
                digits = '7' + digits.slice(1);
            }

            if (!digits.startsWith('7')) {
                digits = '7' + digits;
            }

            digits = digits.substring(0, 11);

            let result = '+7';

            if (digits.length > 1) {
                result += ' (' + digits.substring(1, 4);
            }

            if (digits.length >= 4) {
                result += ') ' + digits.substring(4, 7);
            }

            if (digits.length >= 7) {
                result += '-' + digits.substring(7, 9);
            }

            if (digits.length >= 9) {
                result += '-' + digits.substring(9, 11);
            }

            return result;
        }

        if (phoneInput) {
            phoneInput.addEventListener('input', () => {
                phoneInput.value = formatPhone(phoneInput.value);
            });

            phoneInput.addEventListener('blur', () => {
                phoneInput.value = formatPhone(phoneInput.value);
            });

            phoneInput.addEventListener('paste', () => {
                setTimeout(() => {
                    phoneInput.value = formatPhone(phoneInput.value);
                }, 0);
            });
        }

        form.addEventListener("submit", async function (e) {

            e.preventDefault();

            const honeypot1 = form.querySelector('input[name="website"]')?.value;
            const honeypot2 = form.querySelector('input[name="company_name"]')?.value;

            if (honeypot1 || honeypot2) return;

            const formData = new FormData(form);

            try {

                const response = await fetch("./php/send-form.php", {
                    method: "POST",
                    body: formData
                });

                const result = await response.json();

                if (result.success) {

                    alert("Заявка успешно отправлена!");
                    form.reset();

                    // 🔥 автозакрытие модалки
                    const modal = form.closest(".modal");
                    if (modal) {
                        modal.classList.remove("active");
                    }

                } else {
                    alert("Ошибка отправки");
                }

            } catch (error) {
                alert("Ошибка соединения");
            }

        });

    });


    /* -------------------
       МОДАЛКА
    ------------------- */

    const modal = document.getElementById("modal");
    const openBtn = document.querySelectorAll(".open-modal-btn");
    const closeBtn = document.querySelector(".modal__close");
    const overlay = document.querySelector(".modal__overlay");

    function openModal() {
        modal.classList.add("active");
        document.body.classList.add("modal-open");
    }

    function closeModal() {
        modal.classList.remove("active");
        document.body.classList.remove("modal-open");
    }

    // открыть
    openBtn.forEach(btn => {
        btn.addEventListener("click", openModal);
    });

    // закрыть кнопкой
    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    // закрыть по overlay
    if (overlay) {
        overlay.addEventListener("click", closeModal);
    }

    // 🔥 закрытие по ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }
    });

});