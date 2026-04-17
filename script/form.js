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

            return "+" + digits;
        }

        if (phoneInput) {

            phoneInput.addEventListener("input", () => {
                phoneInput.value = formatPhone(phoneInput.value);
            });

            phoneInput.addEventListener("blur", () => {
                phoneInput.value = formatPhone(phoneInput.value);
            });

            phoneInput.addEventListener("paste", () => {
                setTimeout(() => {
                    phoneInput.value = formatPhone(phoneInput.value);
                }, 0);
            });
        }

        form.addEventListener("submit", async function (e) {

            e.preventDefault();

            const honeypot1 = form.querySelector('input[name="qwerty123"]')?.value;
            const honeypot2 = form.querySelector('input[name="123qwerty"]')?.value;

            if (honeypot1 || honeypot2) return;

            if (phoneInput) {
                phoneInput.value = formatPhone(phoneInput.value);
            }

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const formData = new FormData(form);

            try {

                const response = await fetch("./php/send-form.php", {
                    method: "POST",
                    body: formData
                });

                const text = await response.text();

                let result;

                try {
                    result = JSON.parse(text);
                } catch {
                    throw new Error("Invalid JSON");
                }

                if (result.success) {

                    alert("Заявка успешно отправлена!");
                    form.reset();

                    const modal = form.closest(".modal");
                    if (modal) {
                        modal.classList.remove("active");
                        document.body.classList.remove("modal-open");
                    }

                } else {
                    alert("Ошибка отправки");
                }

            } catch (error) {
                alert("Ошибка соединения");
                console.error(error);
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

    openBtn.forEach(btn => {
        btn.addEventListener("click", openModal);
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    if (overlay) {
        overlay.addEventListener("click", closeModal);
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            closeModal();
        }
    });

});