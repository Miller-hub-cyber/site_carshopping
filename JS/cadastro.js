"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm         = document.getElementById("register-form");
    const nameInput            = document.getElementById("name");
    const emailInput           = document.getElementById("email");
    const passwordInput        = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const termsCheckbox        = document.getElementById("terms");
    const togglePasswordBtns   = document.querySelectorAll(".toggle-password");
    const errorMessage         = document.getElementById("error-message");
    const submitBtn            = document.getElementById("submit-btn");

    /* Redireciona se já está logado */
    if (CSApi.auth.isLoggedIn()) {
        window.location.href = "../HTML/index.html";
        return;
    }

    togglePasswordBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            const input = this.previousElementSibling;
            const type  = input.getAttribute("type") === "password" ? "text" : "password";
            input.setAttribute("type", type);
            this.classList.toggle("fa-eye");
            this.classList.toggle("fa-eye-slash");
        });
    });

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nameValue            = nameInput.value.trim();
        const emailValue           = emailInput.value.trim();
        const passwordValue        = passwordInput.value.trim();
        const confirmPasswordValue = confirmPasswordInput.value.trim();
        const isTermsAccepted      = termsCheckbox.checked;

        if (!nameValue || !emailValue || !passwordValue || !confirmPasswordValue) {
            showError("Por favor, preencha todos os campos.");
            CSUtils.triggerShake(registerForm);
            return;
        }
        if (!CSUtils.validateEmail(emailValue)) {
            showError("Por favor, insira um e-mail válido.");
            CSUtils.triggerShake(registerForm);
            return;
        }
        if (passwordValue.length < 8) {
            showError("A senha deve ter pelo menos 8 caracteres.");
            CSUtils.triggerShake(registerForm);
            return;
        }
        if (passwordValue !== confirmPasswordValue) {
            showError("As senhas não coincidem.");
            CSUtils.triggerShake(registerForm);
            return;
        }
        if (!isTermsAccepted) {
            showError("Você precisa aceitar os Termos de Uso.");
            CSUtils.triggerShake(registerForm);
            return;
        }

        errorMessage.style.display = "none";
        CSUtils.setButtonLoading(submitBtn, "Cadastrando...");

        try {
            await CSApi.register(nameValue, emailValue, passwordValue);
            CSUtils.showToast("Cadastro realizado com sucesso! Bem-vindo ao CarShopping.", "success");
            setTimeout(() => { window.location.href = "../HTML/index.html"; }, 1200);
        } catch (err) {
            CSUtils.resetButton(submitBtn, "Cadastrar");
            showError(err.message ?? "Erro ao cadastrar. Tente novamente.");
            CSUtils.triggerShake(registerForm);
        }
    });

    function showError(message) {
        errorMessage.textContent   = message;
        errorMessage.style.display = "block";
    }
});
