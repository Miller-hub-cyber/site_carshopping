"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const recoveryForm   = document.getElementById("recovery-form");
    const emailInput     = document.getElementById("email");
    const errorMessage   = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message");
    const submitBtn      = document.getElementById("submit-btn");

    recoveryForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const emailValue = emailInput.value.trim();
        errorMessage.style.display   = "none";
        successMessage.style.display = "none";

        if (!emailValue) {
            showError("Por favor, informe seu e-mail.");
            CSUtils.triggerShake(recoveryForm);
            return;
        }
        if (!CSUtils.validateEmail(emailValue)) {
            showError("Por favor, insira um e-mail válido.");
            CSUtils.triggerShake(recoveryForm);
            return;
        }

        CSUtils.setButtonLoading(submitBtn, "Enviando...");

        try {
            const res = await CSApi.recoverPassword(emailValue);
            emailInput.closest(".input-group").style.display = "none";
            submitBtn.style.display = "none";
            successMessage.innerHTML = `<i class="fas fa-check-circle"></i> ${res.message}`;
            successMessage.style.display = "block";
        } catch {
            CSUtils.resetButton(submitBtn, "Enviar Link de Recuperação");
            showError("Erro ao processar. Tente novamente mais tarde.");
        }
    });

    function showError(message) {
        errorMessage.textContent   = message;
        errorMessage.style.display = "block";
    }
});
