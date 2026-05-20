"use strict";

document.addEventListener('DOMContentLoaded', () => {
    initServiceFilters();
    initFaqAccordion();
    initSmoothScroll();
});

/**
 * Gerencia o filtro dos cards de serviço
 */
function initServiceFilters() {
    const filters = document.querySelectorAll('.service-filter');
    const cards = document.querySelectorAll('.service-card');

    if (!filters.length || !cards.length) return;

    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            // 1. Atualiza o estado visual dos botões
            filters.forEach(btn => btn.classList.remove('active'));
            filter.classList.add('active');

            const category = filter.getAttribute('data-category');

            // 2. Filtra os cards com uma pequena animação de fade
            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 200);
            });
        });
    });
}

/**
 * Gerencia a abertura e fechamento das perguntas (FAQ)
 */
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.faq-answer');
            const icon = question.querySelector('i');
            
            // Verifica se o item já está aberto
            const isOpen = item.classList.contains('active');

            // Fecha todos os outros itens (opcional, para um design mais limpo)
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
                if(otherItem.querySelector('i')) {
                    otherItem.querySelector('i').style.transform = 'rotate(0deg)';
                }
            });

            // Se não estava aberto, abre o atual
            if (!isOpen) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

/**
 * Adiciona scroll suave para os links internos (Ex: "Explorar Serviços")
 */
function initSmoothScroll() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100, // Ajuste por causa do header fixo
                    behavior: 'smooth'
                });
            }
        });
    });
}