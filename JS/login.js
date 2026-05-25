"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm       = document.getElementById("login-form");
    const emailInput      = document.getElementById("email");
    const passwordInput   = document.getElementById("password");
    const togglePasswordBtn = document.getElementById("toggle-password");
    const errorMessage    = document.getElementById("error-message");
    const submitBtn       = document.getElementById("submit-btn");

    /* Redireciona se já está logado */
    if (CSApi.auth.isLoggedIn()) {
        window.location.href = "../HTML/index.html";
        return;
    }

    togglePasswordBtn.addEventListener("click", function () {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        this.classList.toggle("fa-eye");
        this.classList.toggle("fa-eye-slash");
    });

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const emailValue    = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        if (!emailValue || !passwordValue) {
            showError("Por favor, preencha todos os campos.");
            CSUtils.triggerShake(loginForm);
            return;
        }
        if (!CSUtils.validateEmail(emailValue)) {
            showError("Por favor, insira um e-mail válido.");
            CSUtils.triggerShake(loginForm);
            return;
        }

        errorMessage.style.display = "none";
        CSUtils.setButtonLoading(submitBtn, "Entrando...");

        try {
            await CSApi.login(emailValue, passwordValue);
            CSUtils.showToast("Login realizado com sucesso!", "success");
            setTimeout(() => { window.location.href = "../HTML/index.html"; }, 800);
        } catch (err) {
            CSUtils.resetButton(submitBtn, "Entrar");
            showError(err.message ?? "Erro ao fazer login. Tente novamente.");
            CSUtils.triggerShake(loginForm);
        }
    });

    function showError(message) {
        errorMessage.textContent   = message;
        errorMessage.style.display = "block";
    }
});
