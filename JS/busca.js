// Interatividade nos cards
        document.querySelectorAll('.card-hover').forEach(card => {
            card.addEventListener('click', function() {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });

        // Filtros interativos
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('border-orange-500');
                this.classList.toggle('text-orange-500');
                this.classList.toggle('bg-orange-50');
            });
        });