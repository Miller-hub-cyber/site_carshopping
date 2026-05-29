"use strict";

document.addEventListener("DOMContentLoaded", async () => {
    CSUtils.initMobileMenu();
    CSUtils.initScrollHeader();
    CSUtils.initScrollToTop();
    CSUtils.initDarkMode();
    CSUtils.initAuthHeader();

    const params = new URLSearchParams(window.location.search);
    const id     = params.get("id");
    const main   = document.getElementById("detalhe-content");

    if (!id) {
        showError(main, "Nenhum veículo selecionado.");
        return;
    }

    showLoading(main);

    let car;
    try {
        car = await CSApi.getCarById(id);
    } catch (err) {
        showError(main, err.message ?? "Veículo não encontrado.");
        return;
    }

    renderDetalhe(main, car);
});

/* ===== RENDERIZAÇÃO ===== */
function renderDetalhe(container, car) {
    const price  = parseFloat(car.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const km     = Number(car.km).toLocaleString("pt-BR");
    const images   = car.images ?? [];
    const MEDIA    = window.CS_MEDIA_BASE ?? "http://localhost:3000";

    /* Sanitizar todos os campos de texto vindos do banco */
    const brand    = escapeHtml(car.brand);
    const model    = escapeHtml(car.model);
    const fuel     = escapeHtml(car.fuel);
    const transm   = escapeHtml(car.transmission);
    const year     = escapeHtml(String(car.year));
    const desc     = car.description ? escapeHtml(car.description) : "";

    const PLACEHOLDER_IMG = "../fotos/hb20.png";

    function mediaUrl(url) {
        return url.startsWith("http") ? url : `${MEDIA}${url}`;
    }

    /* Número do vendedor (dígitos apenas, garante segurança no href) */
    const rawPhone = car.sellerPhone ? car.sellerPhone.replace(/\D/g, "") : "";
    const waPhone  = rawPhone ? (rawPhone.startsWith("55") ? rawPhone : `55${rawPhone}`) : "5511999999999";

    /* HTML da galeria */
    const galeriaHTML = images.length > 0 ? `
        <div class="galeria-main">
            <img id="galeria-img" src="${escapeHtml(mediaUrl(images[0].url))}" alt="${brand} ${model}">
            ${images.length > 1 ? `
            <button class="galeria-nav prev" id="gal-prev" aria-label="Imagem anterior">
                <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button class="galeria-nav next" id="gal-next" aria-label="Próxima imagem">
                <i class="fa-solid fa-chevron-right"></i>
            </button>` : ""}
        </div>
        ${images.length > 1 ? `
        <div class="galeria-thumbs" id="galeria-thumbs">
            ${images.map((img, i) => `
                <div class="galeria-thumb ${i === 0 ? "active" : ""}" data-index="${i}">
                    <img src="${escapeHtml(mediaUrl(img.url))}" alt="Foto ${i + 1}" loading="lazy">
                </div>
            `).join("")}
        </div>` : ""}
    ` : `
        <div class="galeria-placeholder">
            <i class="fa-solid fa-car"></i>
            <span>Sem imagens disponíveis</span>
        </div>
    `;

    container.innerHTML = `
        <div class="breadcrumb">
            <a href="busca.html"><i class="fa-solid fa-arrow-left"></i> Voltar à busca</a>
            <i class="fa-solid fa-chevron-right"></i>
            <span>${brand} ${model}</span>
        </div>

        <div class="detalhe-grid">
            <!-- Coluna esquerda -->
            <div>
                <div class="galeria">${galeriaHTML}</div>

                ${desc ? `
                <div class="descricao-card">
                    <h2>Descrição</h2>
                    <p>${desc}</p>
                </div>` : ""}

                <div class="contact-form-card" id="contact-section">
                    <h2>Fale com o vendedor</h2>
                    <p>Interessado? Envie uma mensagem e entraremos em contato.</p>
                    <form id="contact-car-form" novalidate>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="c-name">Seu nome</label>
                                <input type="text" id="c-name" placeholder="João Silva" required>
                            </div>
                            <div class="form-group">
                                <label for="c-phone">Telefone</label>
                                <input type="tel" id="c-phone" placeholder="(11) 99999-9999">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="c-email">Email</label>
                            <input type="email" id="c-email" placeholder="joao@email.com" required>
                        </div>
                        <div class="form-group">
                            <label for="c-message">Mensagem</label>
                            <textarea id="c-message" placeholder="Tenho interesse neste veículo..."></textarea>
                        </div>
                        <button type="submit" class="btn-send" id="contact-submit">
                            <i class="fa-solid fa-paper-plane"></i> Enviar mensagem
                        </button>
                    </form>
                </div>
            </div>

            <!-- Coluna direita -->
            <div>
                <div class="info-card">
                    <span class="car-badge">${fuel}</span>
                    <h1>${brand} ${model}</h1>
                    <p class="car-year-km">${year} &bull; ${km} km &bull; ${transm}</p>
                    <p class="price-destaque">${price}</p>

                    <div class="specs-grid">
                        <div class="spec-item">
                            <span class="spec-label">Ano</span>
                            <span class="spec-value">${year}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Quilometragem</span>
                            <span class="spec-value">${km} km</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Combustível</span>
                            <span class="spec-value">${fuel}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Câmbio</span>
                            <span class="spec-value">${transm}</span>
                        </div>
                    </div>

                    <a href="https://wa.me/${waPhone}?text=${encodeURIComponent(`Olá! Tenho interesse no ${car.brand} ${car.model} ${car.year} por ${price}. Poderia me passar mais informações?`)}"
                       class="btn-whatsapp" target="_blank" rel="noopener noreferrer">
                        <i class="fa-brands fa-whatsapp"></i> Falar pelo WhatsApp
                    </a>

                    <button class="btn-contact-form" onclick="document.getElementById('contact-section').scrollIntoView({behavior:'smooth'})">
                        <i class="fa-solid fa-envelope"></i> Enviar mensagem
                    </button>
                </div>
            </div>
        </div>
    `;

    /* Preenche textarea via DOM (seguro — sem innerHTML) */
    const msgArea = document.getElementById("c-message");
    if (msgArea) {
        msgArea.value = `${car.brand} ${car.model} ${car.year} — Tenho interesse neste veículo. Poderia me passar mais informações?`;
    }

    /* Atualiza título e meta description */
    document.title = `${car.brand} ${car.model} ${car.year} — CarShopping`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute("content",
            `${car.brand} ${car.model} ${car.year} por ${price}. ${car.fuel}, ${km} km. Compre no CarShopping.`
        );
    }

    /* Galeria interativa */
    if (images.length > 1) {
        initGaleria(images);
    }

    /* Formulário de contato */
    initContactForm(car);
}

/* ===== GALERIA ===== */
function initGaleria(images) {
    let current = 0;
    const img    = document.getElementById("galeria-img");
    const thumbs = document.querySelectorAll(".galeria-thumb");
    const prev   = document.getElementById("gal-prev");
    const next   = document.getElementById("gal-next");
    const MEDIA  = window.CS_MEDIA_BASE ?? "http://localhost:3000";

    function goTo(index) {
        current = (index + images.length) % images.length;
        img.src = images[current].url.startsWith("http")
            ? images[current].url
            : `${MEDIA}${images[current].url}`;
        thumbs.forEach((t, i) => t.classList.toggle("active", i === current));
    }

    if (prev) prev.addEventListener("click", () => goTo(current - 1));
    if (next) next.addEventListener("click", () => goTo(current + 1));
    thumbs.forEach((t, i) => t.addEventListener("click", () => goTo(i)));
}

/* ===== FORMULÁRIO DE CONTATO ===== */
function initContactForm(car) {
    const form   = document.getElementById("contact-car-form");
    const submit = document.getElementById("contact-submit");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name    = document.getElementById("c-name").value.trim();
        const email   = document.getElementById("c-email").value.trim();
        const phone   = document.getElementById("c-phone").value.trim();
        const message = document.getElementById("c-message").value.trim();

        if (!name || !email || !message) {
            CSUtils.showToast("Preencha nome, email e mensagem.", "error");
            return;
        }
        if (!CSUtils.validateEmail(email)) {
            CSUtils.showToast("Email inválido.", "error");
            return;
        }

        const originalHTML = submit.innerHTML;
        CSUtils.setButtonLoading(submit, "Enviando...");

        try {
            await CSApi.sendContact(
                name, email, phone,
                `Interesse: ${car.brand} ${car.model} ${car.year}`,
                message
            );
            CSUtils.showToast("Mensagem enviada! Entraremos em contato em breve.", "success");
            form.reset();
        } catch (err) {
            CSUtils.showToast(err.message ?? "Erro ao enviar mensagem.", "error");
        } finally {
            CSUtils.resetButton(submit, originalHTML);
        }
    });
}

/* ===== HELPERS ===== */
function showLoading(container) {
    container.innerHTML = `
        <div class="detalhe-loading">
            <i class="fa-solid fa-spinner"></i>
            <span>Carregando veículo...</span>
        </div>`;
}

function showError(container, msg) {
    container.innerHTML = `
        <div class="detalhe-error">
            <i class="fa-solid fa-circle-xmark"></i>
            <p>${escapeHtml(msg)}</p>
            <a href="busca.html" class="btn-primary" style="margin-top:8px">Voltar à busca</a>
        </div>`;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
