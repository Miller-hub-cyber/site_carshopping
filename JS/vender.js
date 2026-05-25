"use strict";

document.addEventListener("DOMContentLoaded", () => {
    CSUtils.initMobileMenu();
    CSUtils.initFavoriteButtons();
    initVendaCarro();

    function initVendaCarro() {
        const form             = document.getElementById("form-venda-carro");
        const uploadArea       = document.getElementById("upload-area");
        const inputImagens     = document.getElementById("imagens");
        const previewContainer = document.getElementById("preview-container");
        const successMessage   = document.getElementById("success-message");
        const btnNovoAnuncio   = document.getElementById("btn-novo-anuncio");

        if (!form) return;

        let selectedFiles = [];

        /* ===== UPLOAD — DRAG & DROP ===== */
        uploadArea.addEventListener("click", () => inputImagens.click());

        uploadArea.addEventListener("dragover", (e) => {
            e.preventDefault();
            uploadArea.style.borderColor     = "var(--primary-red)";
            uploadArea.style.backgroundColor = "rgba(204, 24, 24, 0.05)";
        });

        uploadArea.addEventListener("dragleave", () => {
            uploadArea.style.borderColor     = "var(--primary-blue)";
            uploadArea.style.backgroundColor = "var(--primary-blue-light)";
        });

        uploadArea.addEventListener("drop", (e) => {
            e.preventDefault();
            uploadArea.style.borderColor     = "var(--primary-blue)";
            uploadArea.style.backgroundColor = "var(--primary-blue-light)";
            handleImageFiles(e.dataTransfer.files);
        });

        inputImagens.addEventListener("change", (e) => handleImageFiles(e.target.files));

        /* ===== PROCESSAMENTO DE IMAGENS ===== */
        function handleImageFiles(files) {
            const MAX_IMAGES     = 10;
            const MAX_SIZE_BYTES = 5 * 1024 * 1024;
            const remainingSlots = MAX_IMAGES - selectedFiles.length;
            const filesToAdd     = Array.from(files).slice(0, remainingSlots);

            filesToAdd.forEach(file => {
                if (!file.type.startsWith("image/")) {
                    CSUtils.showToast(`${file.name} não é uma imagem válida.`, "error");
                    return;
                }
                if (file.size > MAX_SIZE_BYTES) {
                    CSUtils.showToast(`${file.name} excede 5 MB.`, "error");
                    return;
                }
                selectedFiles.push(file);
                createPreview(file, selectedFiles.length - 1);
            });

            if (Array.from(files).length > remainingSlots) {
                CSUtils.showToast(`Máximo de ${MAX_IMAGES} imagens permitido.`, "error");
            }

            updateFileInput();
        }

        function createPreview(file, index) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const item = document.createElement("div");
                item.className = "preview-item";
                item.innerHTML = `
                    <img src="${e.target.result}" alt="Preview ${index + 1}">
                    <button type="button" class="remove-preview" data-index="${index}" title="Remover imagem">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                `;
                previewContainer.appendChild(item);

                item.querySelector(".remove-preview").addEventListener("click", (ev) => {
                    ev.preventDefault();
                    const idx = parseInt(ev.currentTarget.dataset.index);
                    selectedFiles.splice(idx, 1);
                    previewContainer.innerHTML = "";
                    selectedFiles.forEach((f, i) => createPreview(f, i));
                    updateFileInput();
                });
            };
            reader.readAsDataURL(file);
        }

        function updateFileInput() {
            const dt = new DataTransfer();
            selectedFiles.forEach(f => dt.items.add(f));
            inputImagens.files = dt.files;
        }

        /* ===== ENVIO DO FORMULÁRIO ===== */
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            if (selectedFiles.length === 0) {
                CSUtils.showToast("Envie pelo menos uma imagem do veículo.", "error");
                return;
            }
            if (!validarFormulario()) return;

            if (!CSApi.auth.isLoggedIn()) {
                CSUtils.showToast("Faça login para publicar um anúncio.", "error");
                setTimeout(() => { window.location.href = "../HTML/login.html"; }, 1500);
                return;
            }

            const submitBtn    = form.querySelector("[type=submit]");
            const originalText = submitBtn.innerHTML;
            CSUtils.setButtonLoading(submitBtn, "Publicando...");

            try {
                const carData = {
                    brand:        document.getElementById("marca").value,
                    model:        document.getElementById("modelo").value,
                    year:         Number(document.getElementById("ano").value),
                    km:           Number(document.getElementById("quilometragem").value),
                    fuel:         document.getElementById("combustivel").value,
                    transmission: document.getElementById("cambio").value,
                    price:        Number(document.getElementById("preco").value),
                    description:  document.getElementById("descricao").value,
                };

                const car = await CSApi.createCar(carData);

                document.getElementById("reference-id").textContent = car.id;
                successMessage.style.display = "flex";

                setTimeout(() => {
                    form.reset();
                    selectedFiles = [];
                    previewContainer.innerHTML = "";
                    updateFileInput();
                }, 2000);
            } catch (err) {
                CSUtils.showToast(err.message ?? "Erro ao publicar anúncio.", "error");
            } finally {
                CSUtils.resetButton(submitBtn, originalText);
            }
        });

        btnNovoAnuncio.addEventListener("click", () => {
            form.reset();
            selectedFiles = [];
            previewContainer.innerHTML = "";
            updateFileInput();
            successMessage.style.display = "none";
            form.scrollIntoView({ behavior: "smooth" });
        });

        /* ===== VALIDAÇÃO ===== */
        function validarFormulario() {
            const campos = ["marca", "modelo", "ano", "quilometragem", "preco", "combustivel", "cambio", "descricao"];
            const values = Object.fromEntries(campos.map(id => [id, document.getElementById(id).value]));

            if (campos.some(id => !values[id])) {
                CSUtils.showToast("Preencha todos os campos obrigatórios.", "error");
                return false;
            }
            if (isNaN(values.ano) || values.ano < 1990 || values.ano > 2099) {
                CSUtils.showToast("Ano inválido (1990–2099).", "error");
                return false;
            }
            if (isNaN(values.quilometragem) || values.quilometragem < 0) {
                CSUtils.showToast("Quilometragem inválida.", "error");
                return false;
            }
            if (isNaN(values.preco) || values.preco <= 0) {
                CSUtils.showToast("Preço inválido.", "error");
                return false;
            }
            if (values.descricao.length < 10) {
                CSUtils.showToast("Descrição muito curta (mínimo 10 caracteres).", "error");
                return false;
            }
            return true;
        }
    }
});
