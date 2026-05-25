"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const form     = document.getElementById("formContato");
    const feedback = document.getElementById("feedback");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        feedback.textContent = "";
        feedback.className   = "feedback";

        const nome     = document.getElementById("nome").value.trim();
        const email    = document.getElementById("email").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const assunto  = document.getElementById("assunto").value;
        const mensagem = document.getElementById("mensagem").value.trim();

        if (!nome) { showMessage("Por favor, digite seu nome completo.", "erro"); document.getElementById("nome").focus(); return; }
        if (!email) { showMessage("Por favor, digite seu email.", "erro"); document.getElementById("email").focus(); return; }
        if (!CSUtils.validateEmail(email)) { showMessage("Por favor, digite um email válido.", "erro"); document.getElementById("email").focus(); return; }
        if (!telefone) { showMessage("Por favor, digite seu telefone.", "erro"); document.getElementById("telefone").focus(); return; }
        if (!assunto) { showMessage("Por favor, selecione um assunto.", "erro"); document.getElementById("assunto").focus(); return; }
        if (!mensagem || mensagem.length < 10) { showMessage("A mensagem deve ter pelo menos 10 caracteres.", "erro"); document.getElementById("mensagem").focus(); return; }

        const submitBtn = form.querySelector("[type=submit]");
        const originalText = submitBtn.innerHTML;
        CSUtils.setButtonLoading(submitBtn, "Enviando...");

        try {
            const res = await CSApi.sendContact(nome, email, telefone, assunto, mensagem);
            showMessage(res.message, "sucesso");
            form.reset();
            feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } catch (err) {
            showMessage(err.message ?? "Erro ao enviar. Tente novamente.", "erro");
        } finally {
            CSUtils.resetButton(submitBtn, originalText);
        }
    });

    function showMessage(text, type) {
        feedback.textContent = text;
        feedback.className   = `feedback ${type}`;
    }

    /* ===== MÁSCARA DE TELEFONE ===== */
    const telefoneInput = document.getElementById("telefone");
    if (telefoneInput) {
        telefoneInput.addEventListener("input", (e) => {
            e.target.value = CSUtils.formatPhone(e.target.value);
        });
    }

    /* ===== ANIMAÇÃO DE ENTRADA ===== */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    ["contato-info", "contato-form"].forEach(cls => {
        const el = document.querySelector(`.${cls}`);
        if (el) {
            el.style.opacity    = "0";
            el.style.transform  = "translateY(30px)";
            el.style.transition = cls === "contato-form" ? "all 0.6s ease 0.2s" : "all 0.6s ease";
            observer.observe(el);
        }
    });

    /* ===== BOTÃO DE CHAT ===== */
    const chatBtn = document.querySelector(".chat-float");
    if (chatBtn) {
        chatBtn.addEventListener("click", (e) => {
            e.preventDefault();
            CSUtils.showToast("Chat online em breve! Use o formulário por enquanto.", "success");
        });
    }
});
