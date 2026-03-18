document.addEventListener("DOMContentLoaded", () => {
    
    // Selecionando os elementos do DOM
    const recoveryForm = document.getElementById("recovery-form");
    const emailInput = document.getElementById("email");
    const errorMessage = document.getElementById("error-message");
    const successMessage = document.getElementById("success-message");
    const submitBtn = document.getElementById("submit-btn");

    // Funcionalidade: Validação e envio do formulário
    recoveryForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const emailValue = emailInput.value.trim();

        // Esconde mensagens anteriores
        errorMessage.style.display = "none";
        successMessage.style.display = "none";

        // Validação se o campo está vazio
        if (emailValue === "") {
            showError("Por favor, informe seu e-mail.");
            triggerShake();
            return;
        }

        // Validação de formato de e-mail (Regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
            showError("Por favor, insira um e-mail válido.");
            triggerShake();
            return;
        }

        // Simula o processo de envio (Integração com Backend)
        processRecovery(emailValue);
    });

    // Função para exibir erros
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
    }

    // Função de tremor para erro
    function triggerShake() {
        recoveryForm.classList.add("shake");
        setTimeout(() => recoveryForm.classList.remove("shake"), 500);
    }

    // Função que simula o envio ao backend
    function processRecovery(email) {
        // Altera o estado do botão para carregamento
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.8";

        // Aqui entraria o seu fetch() ou axios() para a API.
        /* Exemplo de integração real:
        fetch('https://sua-api.com/api/recover', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        }).then(response => ...)
        */

        // Simula um delay de 2 segundos de rede
        setTimeout(() => {
            // Sucesso! Oculta o formulário e mostra a mensagem de sucesso
            emailInput.parentElement.style.display = "none"; // esconde o input
            submitBtn.style.display = "none"; // esconde o botão
            
            successMessage.innerHTML = `<i class="fas fa-check-circle"></i> Instruções enviadas para <strong>${email}</strong>. Verifique sua caixa de entrada e spam.`;
            successMessage.style.display = "block";

            // Opcional: Redirecionar para o login após 5 segundos
            // setTimeout(() => window.location.href = "../HTML/login.html", 5000);

        }, 2000);
    }
});