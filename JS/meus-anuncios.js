"use strict";

document.addEventListener("DOMContentLoaded", async () => {
    CSUtils.initMobileMenu();
    CSUtils.initDarkMode();
    CSUtils.initAuthHeader();
    CSUtils.initScrollHeader();

    if (!CSApi.auth.isLoggedIn()) {
        window.location.href = "../HTML/login.html";
        return;
    }

    await carregarAnuncios();
    initEditModal();
    initDeleteModal();
});

/* ===== CARREGAMENTO DOS ANÚNCIOS ===== */
async function carregarAnuncios() {
    const container = document.getElementById("anuncios-container");
    const skeleton  = document.getElementById("ma-skeleton");

    try {
        const cars = await CSApi.getMyCars();

        if (skeleton) skeleton.remove();

        if (!cars.length) {
            container.innerHTML = `
                <div class="ma-empty">
                    <i class="fa-solid fa-car-side"></i>
                    <p>Você ainda não tem nenhum anúncio publicado.</p>
                    <a href="vender.html" class="ma-btn-primary">Publicar meu primeiro anúncio</a>
                </div>`;
            return;
        }

        const grid = document.createElement("div");
        grid.className = "ma-grid";
        grid.id = "ma-grid";
        cars.forEach(car => grid.appendChild(criarCard(car)));
        container.appendChild(grid);

    } catch (err) {
        if (skeleton) skeleton.remove();
        container.innerHTML = `
            <div class="ma-empty">
                <i class="fa-solid fa-circle-exclamation"></i>
                <p>Erro ao carregar anúncios: ${escHtml(err.message ?? "Tente novamente.")}</p>
            </div>`;
    }
}

/* ===== CRIAÇÃO DO CARD ===== */
function criarCard(car) {
    const MEDIA       = window.CS_MEDIA_BASE ?? "http://localhost:3000";
    const FALLBACK    = "../fotos/hb20.png";
    const imgSrc      = car.mainImage
        ? (car.mainImage.startsWith("http") ? car.mainImage : `${MEDIA}${car.mainImage}`)
        : FALLBACK;
    const price       = parseFloat(car.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const km          = Number(car.km).toLocaleString("pt-BR");
    const statusLabel = { active: "Ativo", sold: "Vendido", inactive: "Inativo" }[car.status] ?? car.status;

    const card = document.createElement("div");
    card.className = "ma-card";
    card.dataset.id = car.id;
    card.innerHTML = `
        <div class="ma-card-img">
            <img src="${escHtml(imgSrc)}" alt="${escHtml(car.brand)} ${escHtml(car.model)}" loading="lazy"
                 onerror="this.src='${FALLBACK}'">
            <span class="ma-status-badge ma-status-${car.status}">${escHtml(statusLabel)}</span>
        </div>
        <div class="ma-card-body">
            <h3 class="ma-card-title">${escHtml(car.brand)} ${escHtml(car.model)}</h3>
            <p class="ma-card-price">${price}</p>
            <p class="ma-card-info">
                <span><i class="fa-solid fa-calendar"></i> ${car.year}</span>
                <span><i class="fa-solid fa-gauge"></i> ${km} km</span>
                <span><i class="fa-solid fa-gas-pump"></i> ${escHtml(car.fuel)}</span>
            </p>
        </div>
        <div class="ma-card-actions">
            <button class="ma-btn-edit" data-id="${car.id}" title="Editar anúncio">
                <i class="fa-solid fa-pen-to-square"></i> Editar
            </button>
            <button class="ma-btn-delete" data-id="${car.id}" data-name="${escHtml(car.brand + " " + car.model)}" title="Excluir anúncio">
                <i class="fa-solid fa-trash"></i> Excluir
            </button>
        </div>`;

    card.querySelector(".ma-btn-edit").addEventListener("click", () => abrirEditModal(car));
    card.querySelector(".ma-btn-delete").addEventListener("click", (e) => {
        const btn = e.currentTarget;
        abrirDeleteModal(Number(btn.dataset.id), btn.dataset.name);
    });

    return card;
}

/* ===== MODAL DE EDIÇÃO ===== */
function initEditModal() {
    document.getElementById("btn-fechar-edit").addEventListener("click", fecharEditModal);
    document.getElementById("btn-cancelar-edit").addEventListener("click", fecharEditModal);
    document.getElementById("edit-modal").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) fecharEditModal();
    });

    /* Máscara BRL no campo de preço do edit */
    const precoInput = document.getElementById("edit-preco");
    precoInput.addEventListener("input", () => {
        const digits = precoInput.value.replace(/\D/g, "");
        if (!digits) { precoInput.value = ""; return; }
        precoInput.value = (parseInt(digits, 10) / 100)
            .toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    });

    document.getElementById("edit-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const id         = Number(document.getElementById("edit-car-id").value);
        const precoStr   = document.getElementById("edit-preco").value;
        const precoNum   = parseFloat(precoStr.replace(/\./g, "").replace(",", ".")) || 0;

        if (!precoStr || precoNum <= 0) {
            CSUtils.showToast("Preço inválido.", "error"); return;
        }

        const data = {
            brand:        document.getElementById("edit-marca").value,
            model:        document.getElementById("edit-modelo").value.trim(),
            year:         Number(document.getElementById("edit-ano").value),
            km:           Number(document.getElementById("edit-km").value),
            fuel:         document.getElementById("edit-combustivel").value,
            transmission: document.getElementById("edit-cambio").value,
            price:        precoNum,
            description:  document.getElementById("edit-descricao").value.trim(),
            status:       document.getElementById("edit-status").value,
        };

        if (!data.model || !data.year || data.km < 0) {
            CSUtils.showToast("Preencha todos os campos obrigatórios.", "error"); return;
        }

        const saveBtn = document.getElementById("btn-salvar-edit");
        CSUtils.setButtonLoading(saveBtn, "Salvando...");

        try {
            await CSApi.updateCar(id, data);
            CSUtils.showToast("Anúncio atualizado com sucesso!", "success");
            fecharEditModal();
            atualizarCard(id, data);
        } catch (err) {
            CSUtils.showToast(err.message ?? "Erro ao salvar.", "error");
        } finally {
            CSUtils.resetButton(saveBtn, '<i class="fa-solid fa-floppy-disk"></i> Salvar Alterações');
        }
    });
}

function abrirEditModal(car) {
    document.getElementById("edit-car-id").value       = car.id;
    document.getElementById("edit-marca").value        = car.brand;
    document.getElementById("edit-modelo").value       = car.model;
    document.getElementById("edit-ano").value          = car.year;
    document.getElementById("edit-km").value           = car.km;
    document.getElementById("edit-combustivel").value  = car.fuel;
    document.getElementById("edit-cambio").value       = car.transmission;
    document.getElementById("edit-status").value       = car.status;
    document.getElementById("edit-descricao").value    = car.description ?? "";

    const precoFormatado = parseFloat(car.price)
        .toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById("edit-preco").value = precoFormatado;

    document.getElementById("edit-modal").style.display = "flex";
    document.body.style.overflow = "hidden";
}

function fecharEditModal() {
    document.getElementById("edit-modal").style.display = "none";
    document.body.style.overflow = "";
}

function atualizarCard(id, data) {
    const card = document.querySelector(`.ma-card[data-id="${id}"]`);
    if (!card) return;

    const price       = parseFloat(data.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    const km          = Number(data.km).toLocaleString("pt-BR");
    const statusLabel = { active: "Ativo", sold: "Vendido", inactive: "Inativo" }[data.status] ?? data.status;

    card.querySelector(".ma-card-title").textContent = `${data.brand} ${data.model}`;
    card.querySelector(".ma-card-price").textContent = price;
    card.querySelector(".ma-card-info").innerHTML = `
        <span><i class="fa-solid fa-calendar"></i> ${data.year}</span>
        <span><i class="fa-solid fa-gauge"></i> ${km} km</span>
        <span><i class="fa-solid fa-gas-pump"></i> ${escHtml(data.fuel)}</span>`;

    const badge = card.querySelector(".ma-status-badge");
    badge.textContent = statusLabel;
    badge.className   = `ma-status-badge ma-status-${data.status}`;
}

/* ===== MODAL DE EXCLUSÃO ===== */
function initDeleteModal() {
    document.getElementById("btn-cancelar-delete").addEventListener("click", fecharDeleteModal);
    document.getElementById("delete-modal").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) fecharDeleteModal();
    });

    document.getElementById("btn-confirmar-delete").addEventListener("click", async () => {
        const id  = Number(document.getElementById("btn-confirmar-delete").dataset.id);
        const btn = document.getElementById("btn-confirmar-delete");
        CSUtils.setButtonLoading(btn, "Excluindo...");

        try {
            await CSApi.deleteCar(id);
            CSUtils.showToast("Anúncio excluído.", "success");
            fecharDeleteModal();
            document.querySelector(`.ma-card[data-id="${id}"]`)?.remove();

            const grid = document.getElementById("ma-grid");
            if (grid && !grid.querySelector(".ma-card")) {
                grid.remove();
                document.getElementById("anuncios-container").innerHTML = `
                    <div class="ma-empty">
                        <i class="fa-solid fa-car-side"></i>
                        <p>Você ainda não tem nenhum anúncio publicado.</p>
                        <a href="vender.html" class="ma-btn-primary">Publicar meu primeiro anúncio</a>
                    </div>`;
            }
        } catch (err) {
            CSUtils.showToast(err.message ?? "Erro ao excluir.", "error");
        } finally {
            CSUtils.resetButton(btn, '<i class="fa-solid fa-trash"></i> Excluir');
        }
    });
}

function abrirDeleteModal(id, name) {
    document.getElementById("delete-car-name").textContent = name;
    document.getElementById("btn-confirmar-delete").dataset.id = id;
    document.getElementById("delete-modal").style.display = "flex";
    document.body.style.overflow = "hidden";
}

function fecharDeleteModal() {
    document.getElementById("delete-modal").style.display = "none";
    document.body.style.overflow = "";
}

/* ===== HELPER XSS ===== */
function escHtml(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
