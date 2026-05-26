"use strict";

document.addEventListener("DOMContentLoaded", async () => {

    initMobileFilters();
    initKmRange();
    await initCarFilters();

    /* ===== FILTRO MOBILE (sidebar como modal) ===== */
    function initMobileFilters() {
        const mobileBtn = document.getElementById("mobile-filter-btn");
        const sidebar   = document.getElementById("sidebar-filters");
        const closeBtn  = document.getElementById("close-filters");

        if (mobileBtn) {
            mobileBtn.addEventListener("click", () => {
                sidebar.classList.add("active");
                document.body.style.overflow = "hidden";
            });
        }
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                sidebar.classList.remove("active");
                document.body.style.overflow = "";
            });
        }
    }

    /* ===== RANGE DE KM ===== */
    function initKmRange() {
        const filterKm = document.getElementById("filter-km");
        const kmValue  = document.getElementById("km-value");
        if (!filterKm) return;

        filterKm.addEventListener("input", (e) => {
            kmValue.textContent = `Até ${parseInt(e.target.value).toLocaleString("pt-BR")} km`;
        });
    }

    /* ===== LÓGICA PRINCIPAL ===== */
    async function initCarFilters() {
        const applyBtn      = document.getElementById("apply-filters");
        const clearBtn      = document.getElementById("clear-filters");
        const sortSelect    = document.getElementById("sort-results");
        const textSearch    = document.getElementById("text-search");
        const carsContainer = document.getElementById("cars-container");
        const resultCount   = document.getElementById("total-results");

        if (!carsContainer) return;

        /* Verifica se a API está disponível */
        const apiOnline = await CSApi.ping();

        if (apiOnline) {
            await initApiMode(carsContainer, resultCount, applyBtn, clearBtn, sortSelect, textSearch);
        } else {
            initStaticMode(carsContainer, resultCount, applyBtn, clearBtn, sortSelect, textSearch);
        }
    }

    /* ===== MODO API — dados reais do backend ===== */
    async function initApiMode(container, resultCount, applyBtn, clearBtn, sortSelect, textSearch) {
        let currentSort = "recentes";

        async function loadCars() {
            const filters = {
                brand:    document.getElementById("filter-brand").value,
                year:     document.getElementById("filter-year").value,
                maxKm:    document.getElementById("filter-km").value,
                minPrice: document.getElementById("price-min").value || undefined,
                maxPrice: document.getElementById("price-max").value || undefined,
                search:   textSearch ? textSearch.value : undefined,
                sort:     currentSort,
            };

            try {
                const { data, total } = await CSApi.getCars(filters);
                renderCards(data, container);
                if (resultCount) resultCount.textContent = total;

                if (window.innerWidth <= 768) {
                    const sidebar = document.getElementById("sidebar-filters");
                    if (sidebar) { sidebar.classList.remove("active"); document.body.style.overflow = ""; }
                }
            } catch {
                CSUtils.showToast("Erro ao buscar veículos. Tente novamente.", "error");
            }
        }

        function renderCards(cars, container) {
            /* Remove skeleton cards e limpa conteúdo */
            container.querySelectorAll(".skeleton-card").forEach(s => s.remove());
            container.innerHTML = "";

            if (!cars.length) {
                container.innerHTML = `
                    <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);">
                        <i class="fa-solid fa-car" style="font-size:3rem;opacity:.3;margin-bottom:16px;display:block;"></i>
                        <p>Nenhum veículo encontrado com esses filtros.</p>
                    </div>`;
                return;
            }

            const API_BASE = window.CS_MEDIA_BASE ?? "http://localhost:3000";
            const FALLBACK_IMG = "../fotos/hb20.png";

            cars.forEach(car => {
                const price    = parseFloat(car.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
                const km       = Number(car.km).toLocaleString("pt-BR");
                const imgSrc   = car.mainImage ? `${API_BASE}${car.mainImage}` : FALLBACK_IMG;
                const detalhes = `detalhe.html?id=${car.id}`;

                const card = document.createElement("div");
                card.className = "car-card list-card";
                card.dataset.brand = car.brand.toLowerCase();
                card.dataset.price = car.price;
                card.dataset.year  = car.year;
                card.dataset.km    = car.km;
                card.innerHTML = `
                    <button class="favorite-btn" aria-label="Adicionar aos favoritos">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                    <img src="${imgSrc}" alt="${car.brand} ${car.model}" loading="lazy"
                         onerror="this.src='${FALLBACK_IMG}'">
                    <div class="car-info">
                        <h3 class="car-title">${car.brand} ${car.model}</h3>
                        <p class="car-price">${price}</p>
                        <div class="car-details">
                            <span><i class="fa-solid fa-calendar"></i> ${car.year}</span>
                            <span><i class="fa-solid fa-gauge"></i> ${km} km</span>
                            <span><i class="fa-solid fa-gas-pump"></i> ${car.fuel}</span>
                        </div>
                        <a href="${detalhes}" class="btn-details">Ver detalhes <i class="fa-solid fa-arrow-right"></i></a>
                    </div>`;
                container.appendChild(card);
            });

            CSUtils.initFavoriteButtons();
        }

        if (applyBtn)  applyBtn.addEventListener("click", loadCars);
        if (sortSelect) sortSelect.addEventListener("change", () => { currentSort = sortSelect.value; loadCars(); });
        if (textSearch) textSearch.addEventListener("input", CSUtils.debounce(loadCars, 280));

        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                document.getElementById("filter-brand").value = "todas";
                document.getElementById("filter-model").value = "";
                document.getElementById("price-min").value    = "";
                document.getElementById("price-max").value    = "";
                document.getElementById("filter-year").value  = "todos";
                document.getElementById("filter-km").value    = "100000";
                document.getElementById("km-value").textContent = "Até 100.000 km";
                document.getElementById("filter-fuel").value  = "todos";
                if (textSearch) textSearch.value = "";
                loadCars();
            });
        }

        /* Carregamento inicial com skeleton */
        initSkeletonLoading();
        await loadCars();
    }

    /* ===== MODO ESTÁTICO — fallback quando API está offline ===== */
    function initStaticMode(container, resultCount, applyBtn, clearBtn, sortSelect, textSearch) {
        let carCards = Array.from(document.querySelectorAll(".list-card:not(.skeleton-card)"));

        function filterCars() {
            const brand     = document.getElementById("filter-brand").value;
            const year      = document.getElementById("filter-year").value;
            const maxKm     = parseInt(document.getElementById("filter-km").value);
            const minPrice  = parseInt(document.getElementById("price-min").value) || 0;
            const maxPrice  = parseInt(document.getElementById("price-max").value) || Infinity;
            const searchTxt = textSearch ? textSearch.value.toLowerCase() : "";

            let count = 0;
            carCards.forEach(card => {
                const matchBrand = brand === "todas" || card.dataset.brand === brand;
                const matchYear  = year  === "todos" || card.dataset.year  === year;
                const matchKm    = parseInt(card.dataset.km)    <= maxKm;
                const matchPrice = parseInt(card.dataset.price) >= minPrice &&
                                   parseInt(card.dataset.price) <= maxPrice;
                const title      = card.querySelector(".car-title")?.textContent.toLowerCase() ?? "";
                const matchText  = title.includes(searchTxt);

                const show = matchBrand && matchYear && matchKm && matchPrice && matchText;
                card.style.display = show ? "flex" : "none";
                if (show) count++;
            });

            if (resultCount) resultCount.textContent = count;

            if (window.innerWidth <= 768) {
                const sidebar = document.getElementById("sidebar-filters");
                if (sidebar) { sidebar.classList.remove("active"); document.body.style.overflow = ""; }
            }
        }

        function sortCars() {
            const val     = sortSelect.value;
            const visible = carCards.filter(c => c.style.display !== "none");
            const hidden  = carCards.filter(c => c.style.display === "none");

            visible.sort((a, b) => {
                const pA = parseInt(a.dataset.price), pB = parseInt(b.dataset.price);
                const yA = parseInt(a.dataset.year),  yB = parseInt(b.dataset.year);
                if (val === "menor-preco") return pA - pB;
                if (val === "maior-preco") return pB - pA;
                return yB - yA;
            });

            container.innerHTML = "";
            [...visible, ...hidden].forEach(c => container.appendChild(c));
        }

        if (applyBtn)  applyBtn.addEventListener("click", filterCars);
        if (sortSelect) sortSelect.addEventListener("change", sortCars);
        if (textSearch) textSearch.addEventListener("input", CSUtils.debounce(filterCars, 280));

        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                document.getElementById("filter-brand").value = "todas";
                document.getElementById("filter-model").value = "";
                document.getElementById("price-min").value    = "";
                document.getElementById("price-max").value    = "";
                document.getElementById("filter-year").value  = "todos";
                document.getElementById("filter-km").value    = "100000";
                document.getElementById("km-value").textContent = "Até 100.000 km";
                document.getElementById("filter-fuel").value  = "todos";
                if (textSearch) textSearch.value = "";
                filterCars();
            });
        }

        initSkeletonLoading();
    }

    /* ===== SKELETON LOADING ===== */
    function initSkeletonLoading() {
        const skeletons = document.querySelectorAll(".skeleton-card");
        const realCards = document.querySelectorAll(".list-card:not(.skeleton-card)");
        if (!skeletons.length) return;

        realCards.forEach(c => { c.style.opacity = "0"; c.style.display = "none"; });

        setTimeout(() => {
            skeletons.forEach(s => {
                s.style.transition = "opacity 0.35s ease";
                s.style.opacity    = "0";
                setTimeout(() => s.remove(), 380);
            });

            setTimeout(() => {
                realCards.forEach((c, i) => {
                    c.style.display    = "flex";
                    c.style.transition = `opacity 0.4s ease ${i * 70}ms`;
                    requestAnimationFrame(() => { c.style.opacity = "1"; });
                });
            }, 280);
        }, 900);
    }

});
