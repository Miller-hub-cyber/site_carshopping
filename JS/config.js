"use strict";

/**
 * CS_CONFIG — URLs do backend.
 *
 * DESENVOLVIMENTO: deixe como está (aponta para localhost).
 * PRODUÇÃO: atualize CS_API_BASE e CS_MEDIA_BASE para as URLs do Railway/Render
 *           depois de criar o backend no cloud.
 *
 * Exemplo de produção:
 *   window.CS_API_BASE   = "https://carshopping-api.railway.app/api";
 *   window.CS_MEDIA_BASE = "https://carshopping-api.railway.app";
 */
(function () {
    const isLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.protocol === "file:";

    window.CS_API_BASE   = isLocal ? "http://localhost:3000/api"  : "https://SEU-BACKEND.railway.app/api";
    window.CS_MEDIA_BASE = isLocal ? "http://localhost:3000"       : "https://SEU-BACKEND.railway.app";
})();
