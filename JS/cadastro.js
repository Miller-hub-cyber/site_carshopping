document.addEventListener("DOMContentLoaded", () => {
    
    // Selecionando os elementos do DOM
    const registerForm = document.getElementById("register-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const termsCheckbox = document.getElementById("terms");
    
    // Seleciona todos os botões de mostrar/ocultar senha (agora são dois)
    const togglePasswordBtns = document.querySelectorAll(".toggle-password");
    
    const errorMessage = document.getElementById("error-message");
    const submitBtn = document.getElementById("submit-btn");

    // Funcionalidade: Mostrar / Ocultar Senha para múltiplos campos
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            // Encontra o input que está antes do ícone clicado
            const input = this.previousElementSibling;
            
            // Verifica o tipo atual do input e alterna
            const type = input.getAttribute("type") === "password" ? "text" : "password";
            input.setAttribute("type", type);
            
            // Alterna o ícone (olho aberto / olho fechado)
            this.classList.toggle("fa-eye");
            this.classList.toggle("fa-eye-slash");
        });
    });

    // Funcionalidade: Validação e envio do formulário
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Pegando os valores
        const nameValue = nameInput.value.trim();
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();
        const confirmPasswordValue = confirmPasswordInput.value.trim();
        const isTermsAccepted = termsCheckbox.checked;

        // Validando se os campos estão vazios
        if (nameValue === "" || emailValue === "" || passwordValue === "" || confirmPasswordValue === "") {
            showError("Por favor, preencha todos os campos.");
            triggerShake();
            return;
        }

        // Validação de formato de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
            showError("Por favor, insira um e-mail válido.");
            triggerShake();
            return;
        }

        // Validar tamanho mínimo da senha
        if (passwordValue.length < 6) {
            showError("A senha deve ter pelo menos 6 caracteres.");
            triggerShake();
            return;
        }

        // Validação: Senhas conferem?
        if (passwordValue !== confirmPasswordValue) {
            showError("As senhas não coincidem.");
            triggerShake();
            return;
        }

        // Validação: Termos aceitos?
        if (!isTermsAccepted) {
            showError("Você precisa aceitar os Termos de Uso.");
            triggerShake();
            return;
        }

        // Se passar em tudo, esconde erro e processa
        errorMessage.style.display = "none";

        // ... dentro do seu registerForm.addEventListener, após todas as validações ...

        // Crie o objeto com os dados
        const dados = {
            username: nameValue,
            email: emailValue,
            password: passwordValue
        };

        // Envie para o backend
        fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        })
        .then(response => response.text())
        .then(data => {
            alert(data); // "User registered successfully!"
            if(data === "User registered successfully!") window.location.href = "/login";
        })
        .catch(err => console.error("Erro ao cadastrar:", err));
    });

    // Função para exibir erros
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
    }

    // Função para tremer o formulário em caso de erro
    function triggerShake() {
        registerForm.classList.add("shake");
        setTimeout(() => registerForm.classList.remove("shake"), 500);
    }

    // Função que simula o envio ao backend
    // function processRegistration() {
    //     submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';
    //     submitBtn.disabled = true;
    //     submitBtn.style.opacity = "0.8";

    //     // Simula delay de 1.5s
    //     setTimeout(() => {
    //         // Após cadastrar, redireciona o usuário para a tela de login
    //         alert("Cadastro realizado com sucesso! Faça login para continuar.");
    //         window.location.href = "../HTML/login.html";
            
    //         submitBtn.innerHTML = 'Cadastrar';
    //         submitBtn.disabled = false;
    //         submitBtn.style.opacity = "1";
    //     }, 1500);
    // }
});