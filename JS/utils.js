"use strict";

/**
 * CSUtils — funções compartilhadas do CarShopping.
 * Carregue este script ANTES de script.js e dos scripts de página.
 */
window.CSUtils = {

    /* ===== VALIDAÇÃO ===== */

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    /* ===== UTILITÁRIOS ===== */

    debounce(fn, delay = 300) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    },

    /* ===== FEEDBACK VISUAL ===== */

    triggerShake(element) {
        element.classList.remove('shake');
        void element.offsetWidth;
        element.classList.add('shake');
        setTimeout(() => element.classList.remove('shake'), 500);
    },

    setButtonLoading(btn, loadingText) {
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
        btn.disabled = true;
        btn.style.opacity = '0.8';
    },

    resetButton(btn, originalText) {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.opacity = '1';
    },

    showToast(message, type = 'success') {
        if (!document.getElementById('cs-toast-styles')) {
            const style = document.createElement('style');
            style.id = 'cs-toast-styles';
            style.textContent = `
                .cs-toast {
                    position: fixed; bottom: 24px; right: 24px;
                    background: var(--primary-blue-hover, #1a3050); color: #fff;
                    padding: 14px 20px; border-radius: 8px;
                    display: flex; align-items: center; gap: 10px;
                    font-family: var(--font-main, 'Inter', sans-serif);
                    font-size: 14px; font-weight: 500;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                    z-index: 9999; opacity: 0; transform: translateY(16px);
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    max-width: 380px; pointer-events: none;
                }
                .cs-toast--success { border-left: 4px solid var(--color-success, #27ae60); }
                .cs-toast--error   { border-left: 4px solid var(--primary-red, #cc1818); }
                .cs-toast.cs-show  { opacity: 1; transform: translateY(0); }
            `;
            document.head.appendChild(style);
        }

        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        const toast = document.createElement('div');
        toast.className = `cs-toast cs-toast--${type}`;
        toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('cs-show'));
        setTimeout(() => {
            toast.classList.remove('cs-show');
            setTimeout(() => toast.remove(), 350);
        }, 3500);
    },

    /* ===== FORMATAÇÃO ===== */

    formatPhone(value) {
        value = value.replace(/\D/g, '').slice(0, 11);
        if (value.length <= 2)  return value;
        if (value.length <= 6)  return `(${value.slice(0,2)}) ${value.slice(2)}`;
        if (value.length <= 10) return `(${value.slice(0,2)}) ${value.slice(2,6)}-${value.slice(6)}`;
        return `(${value.slice(0,2)}) ${value.slice(2,7)}-${value.slice(7)}`;
    },

    /* ===== COMPONENTES DE UI ===== */

    initMobileMenu() {
        const btn  = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('nav-menu');
        if (!btn || !menu) return;

        btn.addEventListener('click', () => {
            menu.classList.toggle('active');
            const icon   = btn.querySelector('i');
            const isOpen = menu.classList.contains('active');
            if (isOpen) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
            btn.setAttribute('aria-expanded', String(isOpen));
        });
    },

    initFavoriteButtons() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                this.classList.remove('active');
                void this.offsetWidth;
                this.classList.toggle('active');
                const icon = this.querySelector('i');
                if (this.classList.contains('active')) {
                    icon.classList.replace('fa-regular', 'fa-solid');
                } else {
                    icon.classList.replace('fa-solid', 'fa-regular');
                }
            });
        });
    },

    /* ===== HEADER SCROLL — GLASS EFFECT ===== */

    initScrollHeader() {
        const header = document.querySelector('.header');
        if (!header) return;

        const onScroll = CSUtils.debounce(() => {
            header.classList.toggle('header--scrolled', window.scrollY > 60);
        }, 50);

        window.addEventListener('scroll', onScroll, { passive: true });
    },

    /* ===== SCROLL TO TOP ===== */

    initScrollToTop() {
        const btn = document.createElement('button');
        btn.className  = 'scroll-top-btn';
        btn.id         = 'scroll-top-btn';
        btn.title      = 'Voltar ao topo';
        btn.setAttribute('aria-label', 'Voltar ao topo');
        btn.innerHTML  = '<i class="fas fa-chevron-up"></i>';
        document.body.appendChild(btn);

        window.addEventListener('scroll', CSUtils.debounce(() => {
            btn.classList.toggle('cs-visible', window.scrollY > 400);
        }, 80), { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    },

    /* ===== DARK MODE ===== */

    initDarkMode() {
        const STORAGE_KEY = 'cs-theme';
        const html        = document.documentElement;
        const btn         = document.getElementById('dark-mode-btn');

        function applyTheme(theme) {
            html.setAttribute('data-theme', theme);
            localStorage.setItem(STORAGE_KEY, theme);
            if (btn) {
                const icon = btn.querySelector('i');
                if (theme === 'dark') {
                    icon.classList.replace('fa-moon', 'fa-sun');
                    btn.setAttribute('title', 'Modo claro');
                    btn.setAttribute('aria-label', 'Ativar modo claro');
                } else {
                    icon.classList.replace('fa-sun', 'fa-moon');
                    btn.setAttribute('title', 'Modo escuro');
                    btn.setAttribute('aria-label', 'Ativar modo escuro');
                }
            }
        }

        /* Carrega preferência salva ou detecta preferência do sistema */
        const saved  = localStorage.getItem(STORAGE_KEY);
        const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        applyTheme(saved || prefers);

        /* Toggle ao clicar */
        if (btn) {
            btn.addEventListener('click', () => {
                const current = html.getAttribute('data-theme');
                applyTheme(current === 'dark' ? 'light' : 'dark');
            });
        }

        /* Sincroniza quando o sistema muda */
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(STORAGE_KEY)) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    },

    /* ===== HEADER AUTH — mostra usuário logado ou botão de cadastro ===== */

    initAuthHeader() {
        const container = document.getElementById('header-auth');
        if (!container || typeof CSApi === 'undefined') return;

        if (CSApi.auth.isLoggedIn()) {
            const user     = CSApi.auth.getUser();
            const firstName = user?.name?.split(' ')[0] ?? 'Usuário';

            container.innerHTML = `
                <div class="user-menu">
                    <button class="user-menu-btn" id="user-menu-btn"
                            aria-haspopup="true" aria-expanded="false">
                        <i class="fa-solid fa-circle-user"></i>
                        <span>${firstName}</span>
                        <i class="fa-solid fa-chevron-down user-chevron"></i>
                    </button>
                    <div class="user-dropdown" id="user-dropdown" role="menu">
                        <a href="vender.html" class="dropdown-item" role="menuitem">
                            <i class="fa-solid fa-plus"></i> Publicar anúncio
                        </a>
                        <hr class="dropdown-divider">
                        <button class="dropdown-item dropdown-logout" id="logout-btn" role="menuitem">
                            <i class="fa-solid fa-right-from-bracket"></i> Sair
                        </button>
                    </div>
                </div>`;

            const menuBtn  = document.getElementById('user-menu-btn');
            const dropdown = document.getElementById('user-dropdown');

            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = dropdown.classList.toggle('active');
                menuBtn.setAttribute('aria-expanded', String(isOpen));
            });

            document.addEventListener('click', () => {
                dropdown.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
            });

            document.getElementById('logout-btn').addEventListener('click', () => {
                CSApi.auth.logout();
                window.location.reload();
            });
        } else {
            container.innerHTML = `<a href="cadastro.html" class="btn-primary">Cadastre-se</a>`;
        }
    },
};
