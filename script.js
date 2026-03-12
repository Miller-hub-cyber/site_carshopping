document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Controle do Menu Mobile
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            // Alterna a classe 'active' que exibe ou esconde o menu no CSS
            navMenu.classList.toggle('active');
            
            // Muda o ícone de hambúrguer para 'X' (fechar) quando aberto
            const icon = mobileMenuBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 2. Interação dos Botões de Favoritar (Ícone de Coração)
    const favoriteButtons = document.querySelectorAll('.favorite-btn');

    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault(); // Evita recarregar a página caso esteja dentro de um âncora
            
            // Alterna a classe 'active' no botão clicado
            this.classList.toggle('active');
            
            // Pega o elemento do ícone dentro do botão
            const icon = this.querySelector('i');
            
            // Se o botão está ativo, muda para coração sólido (preenchido) e vermelho
            if (this.classList.contains('active')) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            } else {
                // Caso contrário, volta para o coração de contorno
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
            }
        });
    });
});