document.addEventListener("DOMContentLoaded", () => {
    
    // Selecionando os elementos do DOM
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const togglePasswordBtn = document.getElementById("toggle-password");
    const errorMessage = document.getElementById("error-message");
    const submitBtn = document.getElementById("submit-btn");

    // Funcionalidade: Mostrar / Ocultar Senha
    togglePasswordBtn.addEventListener("click", function () {
        // Verifica o tipo atual do input
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        
        // Alterna o ícone (olho aberto / olho fechado)
        this.classList.toggle("fa-eye");
        this.classList.toggle("fa-eye-slash");
    });

    // Funcionalidade: Validação e envio do formulário
    loginForm.addEventListener("submit", function (event) {
        // Previne o envio padrão do formulário (recarregar a página)
        event.preventDefault();

        // Pegando os valores digitados e removendo espaços em branco
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        // Validando se os campos estão vazios
        if (emailValue === "" || passwordValue === "") {
            showError("Por favor, preencha todos os campos.");
            // Adiciona efeito de tremor no formulário para alertar o usuário
            loginForm.classList.add("shake");
            setTimeout(() => loginForm.classList.remove("shake"), 500);
            return;
        }

        // Validação básica de formato de e-mail usando Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
            showError("Por favor, insira um e-mail válido.");
            return;
        }

        // Se passar nas validações, esconde mensagem de erro
        errorMessage.style.display = "none";

        // Simula o processo de login (Conexão com Banco de Dados/API futuramente)
        processLogin();
    });

    // Função para exibir erros
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
    }

    // Função que simula o envio ao backend e redirecionamento
    function processLogin() {
        // Altera o estado do botão para indicar carregamento
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.8";

        // Simula um delay de 1.5 segundos (como se fosse uma requisição à internet)
        setTimeout(() => {
            // AQUI: Redirecionamento para a página principal
            // Substitua "pagina-principal.html" pelo caminho correto do seu projeto
            window.location.href = "index.html";
            
            // Caso o redirecionamento falhe localmente, volta o botão ao normal
            submitBtn.innerHTML = 'Entrar';
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
        }, 1500);
    }
});

/* Adicione isso ao final do seu style.css para o efeito de erro */
/*
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}
.shake {
    animation: shake 0.5s;
}
*/