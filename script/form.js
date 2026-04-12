
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");
    const phoneInput = form.querySelector('input[name="phone"]');

    /* ---------------------------
       Маска телефона РФ
    --------------------------- */

    phoneInput.addEventListener("input", maskPhone);

    function maskPhone() {

        let value = phoneInput.value.replace(/\D/g, "");

        if (value.startsWith("8")) {
            value = "7" + value.slice(1);
        }

        if (!value.startsWith("7")) {
            value = "7" + value;
        }

        let formatted = "+7";

        if (value.length > 1) {
            formatted += " (" + value.substring(1, 4);
        }

        if (value.length >= 4) {
            formatted += ") " + value.substring(4, 7);
        }

        if (value.length >= 7) {
            formatted += "-" + value.substring(7, 9);
        }

        if (value.length >= 9) {
            formatted += "-" + value.substring(9, 11);
        }

        phoneInput.value = formatted;
    }

    /* ---------------------------
       Валидация формы
    --------------------------- */

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener("submit", function(e) {

        let valid = true;

        const fields = form.querySelectorAll("input, select");

        fields.forEach(field => {

            const error = field.parentElement.querySelector(".form__error");
            if (error) error.textContent = "";

            if (field.hasAttribute("required") && !field.value.trim()) {

                if (error) {
                    error.textContent = "Обязательное поле";
                }

                valid = false;
                return;
            }

            /* Проверка email */

            if (field.name === "email" && field.value) {

                if (!emailPattern.test(field.value)) {

                    if (error) {
                        error.textContent = "Введите корректную почту";
                    }

                    valid = false;
                }
            }

            /* Проверка телефона */

            if (field.name === "phone") {

                const digits = field.value.replace(/\D/g, "");

                if (digits.length !== 11) {

                    if (error) {
                        error.textContent = "Введите полный номер телефона";
                    }

                    valid = false;
                }
            }

        });

        if (!valid) {
            e.preventDefault();
        }

    });

});

