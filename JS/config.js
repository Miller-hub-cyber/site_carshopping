"use strict";

/**
 * CS_CONFIG — URLs do backend.
 *
 * DESENVOLVIMENTO: deixe como está (aponta para localhost).
 * PRODUÇÃO: substitua "SEU-BACKEND.railway.app" pela URL real do Railway
 *           antes de fazer deploy no Netlify.
 *
 * Exemplo:
 *   window.CS_API_BASE   = "https://carshopping-api.railway.app/api";
 *   window.CS_MEDIA_BASE = "https://carshopping-api.railway.app";
 */
(function () {
    const isLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.protocol === "file:";

    const PROD_API_BASE   = "https://SEU-BACKEND.railway.app/api";
    const PROD_MEDIA_BASE = "https://SEU-BACKEND.railway.app";

    window.CS_API_BASE   = isLocal ? "http://localhost:3000/api" : PROD_API_BASE;
    window.CS_MEDIA_BASE = isLocal ? "http://localhost:3000"      : PROD_MEDIA_BASE;

    /* Avisa no console se o placeholder ainda não foi substituído em produção */
    if (!isLocal && PROD_API_BASE.includes("SEU-BACKEND")) {
        console.error(
            "[CarShopping] ATENÇÃO: config.js ainda tem o placeholder de URL.\n" +
            "Substitua 'SEU-BACKEND.railway.app' pela URL real do Railway antes de fazer deploy."
        );
    }
})();
