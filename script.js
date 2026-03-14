"use strict"; // Ativa o modo estrito para garantir melhores práticas e segurança no JS

document.addEventListener('DOMContentLoaded', () => {
    
    initMobileMenu();
    initFavoriteButtons();

    // 1. Função: Controle do Menu Mobile
    function initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const navMenu = document.getElementById('nav-menu');

        if (!mobileMenuBtn || !navMenu) return; // Evita erros caso o elemento não exista na página

        mobileMenuBtn.addEventListener('click', () => {
            // Alterna a classe 'active' que exibe ou esconde o menu no CSS
            navMenu.classList.toggle('active');
            
            // Muda o ícone de hambúrguer para 'X' (fechar) quando aberto
            const icon = mobileMenuBtn.querySelector('i');
            
            if (navMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 2. Função: Interação dos Botões de Favoritar (Ícone de Coração)
    function initFavoriteButtons() {
        const favoriteButtons = document.querySelectorAll('.favorite-btn');

        favoriteButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault(); // Evita recarregar a página ou saltar a tela
                
                // Alterna a classe 'active' no botão clicado
                this.classList.toggle('active');
                
                // Pega o elemento do ícone dentro do botão
                const icon = this.querySelector('i');
                
                // Se o botão está ativo, muda para coração sólido (preenchido) e vermelho
                if (this.classList.contains('active')) {
                    icon.classList.replace('fa-regular', 'fa-solid');
                } else {
                    // Caso contrário, volta para o coração vazado
                    icon.classList.replace('fa-solid', 'fa-regular');
                }
            });
        });
    }
});