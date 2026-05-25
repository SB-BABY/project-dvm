document.addEventListener("DOMContentLoaded", () => {
    /* -------------------
       ФОРМЫ
    ------------------- */

    const forms = document.querySelectorAll(".js-contact-form");

    forms.forEach((form) => {
        const phoneInput = form.querySelector('input[name="phone"]');

        /* --- Маска телефона --- */

        function applyMask(digits) {
            if (digits.startsWith("8")) digits = "7" + digits.slice(1);
            if (digits.startsWith("9")) digits = "7" + digits;
            if (!digits.startsWith("7"))
                digits = "7" + digits.replace(/^7*/, "");
            digits = digits.substring(0, 11);

            let result = "+7";
            if (digits.length > 1) result += " (" + digits.substring(1, 4);
            if (digits.length >= 4) result += ") " + digits.substring(4, 7);
            if (digits.length >= 7) result += "-" + digits.substring(7, 9);
            if (digits.length >= 9) result += "-" + digits.substring(9, 11);

            return result;
        }

        function digitsBefore(str, pos) {
            return str.substring(1, pos).replace(/\D/g, "").length;
        }

        function cursorPosAfterMask(masked, digitCount) {
            let found = 0;
            for (let i = 1; i < masked.length; i++) {
                if (/\d/.test(masked[i])) found++;
                if (found === digitCount) return i + 1;
            }
            return masked.length;
        }

        function handleInput() {
            const raw = phoneInput.value;
            const pos = phoneInput.selectionStart;
            const digitsBeforeCursor = digitsBefore(raw, pos);

            const digits = raw.replace(/\D/g, "");
            const masked = applyMask(digits);

            phoneInput.value = masked;

            const newPos = cursorPosAfterMask(masked, digitsBeforeCursor);
            phoneInput.setSelectionRange(newPos, newPos);
        }

        if (phoneInput) {
            phoneInput.addEventListener("focus", () => {
                if (!phoneInput.value) {
                    phoneInput.value = "+7 (";
                    phoneInput.setSelectionRange(4, 4);
                }
            });

            phoneInput.addEventListener("click", () => {
                setTimeout(() => {
                    const pos = phoneInput.selectionStart;
                    if (pos < 4) phoneInput.setSelectionRange(4, 4);
                }, 0);
            });

            phoneInput.addEventListener("keydown", (e) => {
                const pos = phoneInput.selectionStart;
                if (e.key === "Backspace" && pos <= 4) e.preventDefault();
                if (e.key === "Delete" && pos < 4) e.preventDefault();
            });

            phoneInput.addEventListener("input", handleInput);

            phoneInput.addEventListener("paste", () => {
                setTimeout(handleInput, 0);
            });

            phoneInput.addEventListener("blur", () => {
                if (phoneInput.value === "+7 (" || phoneInput.value === "+7") {
                    phoneInput.value = "";
                }
            });
        }

        /* --- Отправка формы --- */

        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            const honeypot1 = form.querySelector(
                'input[name="qwerty123"]',
            )?.value;
            const honeypot2 = form.querySelector(
                'input[name="123qwerty"]',
            )?.value;
            if (honeypot1 || honeypot2) return;

            const submitBtn = form.querySelector('[type="submit"]');

            if (phoneInput) {
                const digits = phoneInput.value.replace(/\D/g, "");
                if (digits.length !== 11) {
                    const errorSpan = phoneInput
                        .closest(".form__group")
                        ?.querySelector(".form__error");
                    if (errorSpan) {
                        errorSpan.textContent = "Введите полный номер телефона";
                        errorSpan.style.display = "block";
                    }
                    phoneInput.focus();
                    return;
                } else {
                    const errorSpan = phoneInput
                        .closest(".form__group")
                        ?.querySelector(".form__error");
                    if (errorSpan) {
                        errorSpan.textContent = "";
                        errorSpan.style.display = "none";
                    }
                }
            }

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = "Отправка...";

            const formData = new FormData(form);

            /* --- Radio (только если есть в форме) --- */

            const radioGroup = form.querySelector(".popup__radio");
            if (radioGroup) {
                const selectedRadio = form.querySelector(
                    'input[name="radio-grp"]:checked',
                );
                if (!selectedRadio) {
                    radioGroup.style.outline = "2px solid red";
                    radioGroup.style.borderRadius = "8px";
                    setTimeout(() => {
                        radioGroup.style.outline = "";
                    }, 3000);
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Оставить заявку";
                    return;
                }
                formData.append("diagnostic", selectedRadio.value);
            }

            try {
                const response = await fetch("./php/send-form.php", {
                    method: "POST",
                    body: formData,
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
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Оставить заявку";
                }
            } catch (error) {
                alert("Ошибка соединения");
                console.error(error);
                submitBtn.disabled = false;
                submitBtn.textContent = "Оставить заявку";
            }
        });
    });

    /* -------------------
       МОДАЛКИ
    ------------------- */

    const openButtons = document.querySelectorAll(".open-modal-btn");

    openButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const modalId = btn.dataset.modal;
            const modal = document.getElementById(modalId);
            if (!modal) return;

            modal.classList.add("active");
            document.body.classList.add("modal-open");

            const closeBtn = modal.querySelector(".modal__close");
            const overlay = modal.querySelector(".modal__overlay");

            function closeModal() {
                modal.classList.remove("active");
                document.body.classList.remove("modal-open");
                document.removeEventListener("keydown", escHandler);
            }

            function escHandler(e) {
                if (e.key === "Escape") closeModal();
            }

            if (closeBtn) closeBtn.addEventListener("click", closeModal);
            if (overlay) overlay.addEventListener("click", closeModal);
            document.addEventListener("keydown", escHandler);
        });
    });

    /* -------------------
       ПОПАП (авто, через 15 сек)
    ------------------- */

    setTimeout(() => {
        const modal5 = document.getElementById("modal-5");
        if (!modal5) return;
        if (document.body.classList.contains("modal-open")) return;

        modal5.classList.add("active");
        document.body.classList.add("modal-open");

        const closeBtn = modal5.querySelector(".modal__close");
        const overlay = modal5.querySelector(".modal__overlay");

        function closeModal() {
            modal5.classList.remove("active");
            document.body.classList.remove("modal-open");
            document.removeEventListener("keydown", escHandler);
        }

        function escHandler(e) {
            if (e.key === "Escape") closeModal();
        }

        if (closeBtn) closeBtn.addEventListener("click", closeModal);
        if (overlay) overlay.addEventListener("click", closeModal);
        document.addEventListener("keydown", escHandler);
    }, 15000);
});