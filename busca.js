document.addEventListener('DOMContentLoaded', () => {

    // ================= FAVORITOS (Reaproveitado) =================
    const favoriteBtns = document.querySelectorAll('.favorite-btn');
    favoriteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.classList.toggle('active');
            
            // Troca o ícone de contorno para preenchido
            const icon = btn.querySelector('i');
            if (btn.classList.contains('active')) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
            }
        });
    });

    // ================= FILTRO MOBILE =================
    const mobileFilterBtn = document.getElementById('mobile-filter-btn');
    const sidebarFilters = document.getElementById('sidebar-filters');
    const closeFiltersBtn = document.getElementById('close-filters');

    if (mobileFilterBtn) {
        mobileFilterBtn.addEventListener('click', () => {
            sidebarFilters.classList.add('active');
            document.body.style.overflow = 'hidden'; // Impede rolagem do fundo
        });
    }

    if (closeFiltersBtn) {
        closeFiltersBtn.addEventListener('click', () => {
            sidebarFilters.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // Atualiza texto do range de KM
    const filterKm = document.getElementById('filter-km');
    const kmValue = document.getElementById('km-value');
    if (filterKm) {
        filterKm.addEventListener('input', (e) => {
            const val = parseInt(e.target.value).toLocaleString('pt-BR');
            kmValue.textContent = `Até ${val} km`;
        });
    }

    // ================= LÓGICA DE FILTROS E ORDENAÇÃO =================
    const applyBtn = document.getElementById('apply-filters');
    const clearBtn = document.getElementById('clear-filters');
    const sortSelect = document.getElementById('sort-results');
    const textSearch = document.getElementById('text-search');
    
    const carsContainer = document.getElementById('cars-container');
    const resultCount = document.getElementById('total-results');
    // Armazena os cards originais num array para facilitar
    let carCards = Array.from(document.querySelectorAll('.list-card'));

    // Função de Filtrar
    function filterCars() {
        const brand = document.getElementById('filter-brand').value;
        const year = document.getElementById('filter-year').value;
        const maxKm = parseInt(document.getElementById('filter-km').value);
        const minPrice = parseInt(document.getElementById('price-min').value) || 0;
        const maxPrice = parseInt(document.getElementById('price-max').value) || Infinity;
        const searchText = textSearch.value.toLowerCase();

        let count = 0;

        carCards.forEach(card => {
            const cardBrand = card.getAttribute('data-brand');
            const cardYear = card.getAttribute('data-year');
            const cardKm = parseInt(card.getAttribute('data-km'));
            const cardPrice = parseInt(card.getAttribute('data-price'));
            const cardTitle = card.querySelector('.car-title').innerText.toLowerCase();

            // Verificações
            const matchBrand = (brand === 'todas') || (cardBrand === brand);
            const matchYear = (year === 'todos') || (cardYear === year);
            const matchKm = cardKm <= maxKm;
            const matchPrice = cardPrice >= minPrice && cardPrice <= maxPrice;
            const matchText = cardTitle.includes(searchText);

            if (matchBrand && matchYear && matchKm && matchPrice && matchText) {
                card.style.display = 'flex';
                count++;
            } else {
                card.style.display = 'none';
            }
        });

        resultCount.textContent = count;
        
        // Fecha o menu no mobile após aplicar
        if (window.innerWidth <= 768) {
            sidebarFilters.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Função de Ordenação
    function sortCars() {
        const sortValue = sortSelect.value;
        
        const visibleCards = carCards.filter(card => card.style.display !== 'none');
        const hiddenCards = carCards.filter(card => card.style.display === 'none');

        visibleCards.sort((a, b) => {
            const priceA = parseInt(a.getAttribute('data-price'));
            const priceB = parseInt(b.getAttribute('data-price'));
            const yearA = parseInt(a.getAttribute('data-year'));
            const yearB = parseInt(b.getAttribute('data-year'));

            if (sortValue === 'menor-preco') return priceA - priceB;
            if (sortValue === 'maior-preco') return priceB - priceA;
            if (sortValue === 'recentes') return yearB - yearA;
            return 0;
        });

        // Re-anexa no DOM ordenado
        carsContainer.innerHTML = '';
        visibleCards.forEach(card => carsContainer.appendChild(card));
        hiddenCards.forEach(card => carsContainer.appendChild(card)); // Mantém os escondidos no final
    }

    // Eventos
    if(applyBtn) applyBtn.addEventListener('click', filterCars);
    
    if(textSearch) textSearch.addEventListener('input', filterCars);
    
    if(sortSelect) sortSelect.addEventListener('change', sortCars);

    if(clearBtn) {
        clearBtn.addEventListener('click', () => {
            document.getElementById('filter-brand').value = 'todas';
            document.getElementById('filter-model').value = '';
            document.getElementById('price-min').value = '';
            document.getElementById('price-max').value = '';
            document.getElementById('filter-year').value = 'todos';
            document.getElementById('filter-km').value = '100000';
            kmValue.textContent = 'Até 100.000 km';
            document.getElementById('filter-fuel').value = 'todos';
            textSearch.value = '';
            
            filterCars();
        });
    }

});