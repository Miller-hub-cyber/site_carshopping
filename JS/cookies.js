// Script para gerenciamento de cookies
document.addEventListener('DOMContentLoaded', function () {
    // Verifica se o consentimento já foi dado
    if (!getCookie('cookieConsent')) {
        showCookieBanner();
    }

    function showCookieBanner() {
        // Cria o banner
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-banner-content">
                <p>Este site utiliza cookies para melhorar sua experiência. Ao continuar navegando, você concorda com o uso de cookies.</p>
                <div class="cookie-buttons">
                    <button id="accept-cookies" class="btn-accept">Aceitar</button>
                    <button id="decline-cookies" class="btn-decline">Recusar</button>
                </div>
            </div>
        `;

        // Adiciona estilos inline
        banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            z-index: 10000;
            font-family: 'Inter', sans-serif;
        `;

        const content = banner.querySelector('.cookie-banner-content');
        content.style.cssText = `
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
        `;

        const buttons = banner.querySelector('.cookie-buttons');
        buttons.style.cssText = `
            display: flex;
            gap: 10px;
        `;

        const btnAccept = banner.querySelector('#accept-cookies');
        btnAccept.style.cssText = `
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
        `;

        const btnDecline = banner.querySelector('#decline-cookies');
        btnDecline.style.cssText = `
            background: #6c757d;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
        `;

        // Adiciona o banner ao body
        document.body.appendChild(banner);

        // Event listeners
        btnAccept.addEventListener('click', function () {
            setCookie('cookieConsent', 'accepted', 365);
            banner.remove();
        });

        btnDecline.addEventListener('click', function () {
            setCookie('cookieConsent', 'declined', 365);
            banner.remove();
        });
    }

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
});