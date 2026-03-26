// ================= CONTATO =================
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById("formContato");
    const feedback = document.getElementById("feedback");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            // Limpar mensagens anteriores
            feedback.textContent = "";
            feedback.className = "feedback";

            // Obter valores dos campos
            const nome = document.getElementById("nome").value.trim();
            const email = document.getElementById("email").value.trim();
            const telefone = document.getElementById("telefone").value.trim();
            const assunto = document.getElementById("assunto").value;
            const mensagem = document.getElementById("mensagem").value.trim();

            // Validações
            if (!nome) {
                showMessage("Por favor, digite seu nome completo.", "erro");
                document.getElementById("nome").focus();
                return;
            }

            if (!email) {
                showMessage("Por favor, digite seu email.", "erro");
                document.getElementById("email").focus();
                return;
            }

            if (!isValidEmail(email)) {
                showMessage("Por favor, digite um email válido.", "erro");
                document.getElementById("email").focus();
                return;
            }

            if (!telefone) {
                showMessage("Por favor, digite seu telefone.", "erro");
                document.getElementById("telefone").focus();
                return;
            }

            if (!assunto) {
                showMessage("Por favor, selecione um assunto.", "erro");
                document.getElementById("assunto").focus();
                return;
            }

            if (!mensagem) {
                showMessage("Por favor, digite sua mensagem.", "erro");
                document.getElementById("mensagem").focus();
                return;
            }

            if (mensagem.length < 10) {
                showMessage("A mensagem deve ter pelo menos 10 caracteres.", "erro");
                document.getElementById("mensagem").focus();
                return;
            }

            // Simulação de envio (em produção, seria uma requisição real)
            showMessage("Mensagem enviada com sucesso! Entraremos em contato em breve.", "sucesso");

            // Resetar formulário
            form.reset();

            // Scroll suave para a mensagem
            feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });

        // Função para validar email
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        // Função para mostrar mensagens
        function showMessage(text, type) {
            feedback.textContent = text;
            feedback.className = `feedback ${type}`;
        }

        // Máscara simples para telefone (opcional)
        const telefoneInput = document.getElementById("telefone");
        telefoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length <= 2) {
                    value = value;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                } else if (value.length <= 10) {
                    value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
                } else {
                    value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
                }
                e.target.value = value;
            }
        });

        // Animação de entrada suave
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Aplicar animação aos elementos
        const contatoInfo = document.querySelector('.contato-info');
        const contatoForm = document.querySelector('.contato-form');

        if (contatoInfo) {
            contatoInfo.style.opacity = '0';
            contatoInfo.style.transform = 'translateY(30px)';
            contatoInfo.style.transition = 'all 0.6s ease';
            observer.observe(contatoInfo);
        }

        if (contatoForm) {
            contatoForm.style.opacity = '0';
            contatoForm.style.transform = 'translateY(30px)';
            contatoForm.style.transition = 'all 0.6s ease 0.2s';
            observer.observe(contatoForm);
        }
    }

    // Botão de chat (simulação)
    const chatBtn = document.querySelector('.chat-float');
    if (chatBtn) {
        chatBtn.addEventListener('click', function (e) {
            e.preventDefault();
            // Em produção, abriria WhatsApp ou chat
            alert('Chat online em breve! Por enquanto, use o formulário de contato.');
        });
    }
});