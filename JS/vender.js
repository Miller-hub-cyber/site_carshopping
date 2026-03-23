"use strict"; // Ativa o modo estrito para garantir melhores práticas e segurança no JS

document.addEventListener('DOMContentLoaded', () => {

    initMobileMenu();
    initFavoriteButtons();
    initVendaCarro();

    // 1. Função: Controle do Menu Mobile
    function initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const navMenu = document.getElementById('nav-menu');

        if (!mobileMenuBtn || !navMenu) return;

        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');

            if (navMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 2. Função: Interação dos Botões de Favoritar
    function initFavoriteButtons() {
        const favoriteButtons = document.querySelectorAll('.favorite-btn');

        favoriteButtons.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                this.classList.toggle('active');
                const icon = this.querySelector('i');

                if (this.classList.contains('active')) {
                    icon.classList.replace('fa-regular', 'fa-solid');
                } else {
                    icon.classList.replace('fa-solid', 'fa-regular');
                }
            });
        });
    }

    // 3. Função: Sistema de Venda de Carro
    function initVendaCarro() {
        const form = document.getElementById('form-venda-carro');
        const uploadArea = document.getElementById('upload-area');
        const inputImagens = document.getElementById('imagens');
        const previewContainer = document.getElementById('preview-container');
        const successMessage = document.getElementById('success-message');
        const btnNovoAnuncio = document.getElementById('btn-novo-anuncio');

        if (!form) return;

        let selectedFiles = [];

        // ========== EVENTOS DE UPLOAD (DRAG & DROP) ==========
        uploadArea.addEventListener('click', () => inputImagens.click());

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#cc1818';
            uploadArea.style.backgroundColor = 'rgba(204, 24, 24, 0.05)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#23416b';
            uploadArea.style.backgroundColor = 'rgba(35, 65, 107, 0.02)';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#23416b';
            uploadArea.style.backgroundColor = 'rgba(35, 65, 107, 0.02)';

            const files = e.dataTransfer.files;
            handleImageFiles(files);
        });

        // Evento de seleção de arquivo (input file)
        inputImagens.addEventListener('change', (e) => {
            handleImageFiles(e.target.files);
        });

        // ========== PROCESSAMENTO DE IMAGENS ==========
        function handleImageFiles(files) {
            const maxImages = 10;
            const remainingSlots = maxImages - selectedFiles.length;
            const filesToAdd = Array.from(files).slice(0, remainingSlots);

            if (filesToAdd.length + selectedFiles.length > maxImages) {
                alert(`Você pode enviar no máximo ${maxImages} imagens`);
            }

            filesToAdd.forEach(file => {
                // Valida se é uma imagem
                if (!file.type.startsWith('image/')) {
                    console.warn(`${file.name} não é uma imagem válida`);
                    return;
                }

                // Valida o tamanho (máx 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert(`${file.name} é muito grande (máximo 5MB)`);
                    return;
                }

                selectedFiles.push(file);
                createPreview(file, selectedFiles.length - 1);
            });

            updateFileInput();
        }

        // ========== CRIAR PREVIEW DE IMAGEM ==========
        function createPreview(file, index) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Preview ${index + 1}">
                    <button type="button" class="remove-preview" data-index="${index}" title="Remover imagem">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                `;

                previewContainer.appendChild(previewItem);

                // Evento para remover o preview
                previewItem.querySelector('.remove-preview').addEventListener('click', (e) => {
                    e.preventDefault();
                    const idx = parseInt(e.currentTarget.dataset.index);
                    selectedFiles.splice(idx, 1);
                    previewContainer.innerHTML = '';
                    selectedFiles.forEach((file, i) => createPreview(file, i));
                    updateFileInput();
                });
            };

            reader.readAsDataURL(file);
        }

        // ========== ATUALIZAR INPUT FILE ==========
        function updateFileInput() {
            const dt = new DataTransfer();
            selectedFiles.forEach(file => dt.items.add(file));
            inputImagens.files = dt.files;
        }

        // ========== ENVIO DO FORMULÁRIO ==========
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validação de imagens
            if (selectedFiles.length === 0) {
                alert('Por favor, envie pelo menos uma imagem do veículo');
                return;
            }

            // Validação de campos obrigatórios (HTML5 já faz, mas será redundante)
            if (!validarFormulario()) {
                return;
            }

            // Coleta os dados do formulário
            const formData = new FormData(form);
            const dados = {
                marca: formData.get('marca'),
                modelo: formData.get('modelo'),
                ano: formData.get('ano'),
                quilometragem: formData.get('quilometragem'),
                preco: formData.get('preco'),
                combustivel: formData.get('combustivel'),
                cambio: formData.get('cambio'),
                descricao: formData.get('descricao'),
                imagens: selectedFiles.length,
                dataAnuncio: new Date().toLocaleDateString('pt-BR')
            };

            console.log('Dados do anúncio:', dados);

            // Gera um ID único para o anúncio
            const referenceId = gerarIdAnuncio();
            document.getElementById('reference-id').textContent = referenceId;

            // Exibe a mensagem de sucesso
            successMessage.style.display = 'flex';

            // Limpa os dados após 2 segundos
            setTimeout(() => {
                form.reset();
                selectedFiles = [];
                previewContainer.innerHTML = '';
                updateFileInput();
            }, 2000);
        });

        // ========== BOTÃO "ANUNCIAR OUTRO CARRO" ==========
        btnNovoAnuncio.addEventListener('click', () => {
            form.reset();
            selectedFiles = [];
            previewContainer.innerHTML = '';
            updateFileInput();
            successMessage.style.display = 'none';

            // Scroll para o topo do formulário
            form.scrollIntoView({ behavior: 'smooth' });
        });

        // ========== FUNÇÕES AUXILIARES ==========

        /**
         * Valida os campos do formulário
         * @returns {boolean}
         */
        function validarFormulario() {
            const marca = document.getElementById('marca').value;
            const modelo = document.getElementById('modelo').value;
            const ano = document.getElementById('ano').value;
            const quilometragem = document.getElementById('quilometragem').value;
            const preco = document.getElementById('preco').value;
            const combustivel = document.getElementById('combustivel').value;
            const cambio = document.getElementById('cambio').value;
            const descricao = document.getElementById('descricao').value;

            if (!marca || !modelo || !ano || !quilometragem || !preco || !combustivel || !cambio || !descricao) {
                alert('Por favor, preencha todos os campos obrigatórios');
                return false;
            }

            if (isNaN(ano) || ano < 1990 || ano > 2099) {
                alert('Ano inválido');
                return false;
            }

            if (isNaN(quilometragem) || quilometragem < 0) {
                alert('Quilometragem inválida');
                return false;
            }

            if (isNaN(preco) || preco <= 0) {
                alert('Preço inválido');
                return false;
            }

            if (descricao.length < 10) {
                alert('A descrição deve ter pelo menos 10 caracteres');
                return false;
            }

            return true;
        }

        /**
         * Gera um ID único para o anúncio
         * @returns {string}
         */
        function gerarIdAnuncio() {
            const timestamp = Date.now().toString(36).toUpperCase();
            const random = Math.random().toString(36).substr(2, 9).toUpperCase();
            return `${timestamp}${random}`;
        }
    }
});
