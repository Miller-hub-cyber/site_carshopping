"use strict";

document.addEventListener("DOMContentLoaded", function () {
    if (!getCookie("cookieConsent")) {
        showCookieBanner();
    }

    function showCookieBanner() {
        /* Injeta estilos uma única vez, usando variáveis CSS do design system */
        if (!document.getElementById("cs-cookie-styles")) {
            const style = document.createElement("style");
            style.id = "cs-cookie-styles";
            style.textContent = `
                #cookie-banner {
                    position: fixed;
                    bottom: 0; left: 0; right: 0;
                    background: var(--primary-blue-hover, #1a3050);
                    color: var(--text-light, #ffffff);
                    padding: 16px 24px;
                    z-index: 10000;
                    font-family: var(--font-main, 'Inter', sans-serif);
                    font-size: 14px;
                    box-shadow: 0 -4px 20px rgba(0,0,0,0.25);
                }
                .cs-cookie-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                .cs-cookie-text { flex: 1; min-width: 200px; line-height: 1.5; }
                .cs-cookie-text a { color: #7eb3e8; }
                .cs-cookie-buttons { display: flex; gap: 10px; flex-shrink: 0; }
                .cs-cookie-btn {
                    border: none;
                    padding: 9px 20px;
                    border-radius: var(--radius-sm, 8px);
                    cursor: pointer;
                    font-weight: 600;
                    font-family: inherit;
                    font-size: 13px;
                    transition: opacity 0.2s;
                }
                .cs-cookie-btn:hover { opacity: 0.85; }
                .cs-cookie-accept { background: var(--primary-red, #cc1818); color: #fff; }
                .cs-cookie-decline { background: rgba(255,255,255,0.15); color: #fff; }
            `;
            document.head.appendChild(style);
        }

        const banner = document.createElement("div");
        banner.id = "cookie-banner";
        banner.innerHTML = `
            <div class="cs-cookie-content">
                <p class="cs-cookie-text">
                    Este site utiliza cookies para melhorar sua experiência.
                    Ao continuar navegando, você concorda com nossa política de uso de dados.
                </p>
                <div class="cs-cookie-buttons">
                    <button class="cs-cookie-btn cs-cookie-accept" id="accept-cookies">Aceitar</button>
                    <button class="cs-cookie-btn cs-cookie-decline" id="decline-cookies">Recusar</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        document.getElementById("accept-cookies").addEventListener("click", function () {
            setCookie("cookieConsent", "accepted", 365);
            banner.remove();
        });

        document.getElementById("decline-cookies").addEventListener("click", function () {
            setCookie("cookieConsent", "declined", 365);
            banner.remove();
        });
    }

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax`;
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        for (let c of document.cookie.split(";")) {
            c = c.trimStart();
            if (c.startsWith(nameEQ)) return c.substring(nameEQ.length);
        }
        return null;
    }
});
