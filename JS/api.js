"use strict";

window.CSApi = (() => {
    const BASE = window.CS_API_BASE ?? "http://localhost:3000/api";

    /* ===== TOKEN JWT ===== */
    const auth = {
        getToken:    () => localStorage.getItem("cs-token"),
        setToken:    (t) => localStorage.setItem("cs-token", t),
        removeToken: () => localStorage.removeItem("cs-token"),

        getUser: () => {
            try {
                const raw = localStorage.getItem("cs-user");
                return raw ? JSON.parse(raw) : null;
            } catch {
                return null;
            }
        },
        setUser:    (u) => localStorage.setItem("cs-user", JSON.stringify(u)),
        removeUser: () => localStorage.removeItem("cs-user"),

        logout() {
            this.removeToken();
            this.removeUser();
        },
        isLoggedIn: () => !!localStorage.getItem("cs-token"),
    };

    /* ===== FETCH INTERNO (JSON) ===== */
    async function request(method, path, body, requiresAuth = false) {
        const headers = {};

        if (requiresAuth) {
            const token = auth.getToken();
            if (!token) throw new Error("Usuário não autenticado");
            headers["Authorization"] = `Bearer ${token}`;
        }

        const opts = { method, headers };
        if (body !== null && body !== undefined) {
            headers["Content-Type"] = "application/json";
            opts.body = JSON.stringify(body);
        }

        const res = await fetch(`${BASE}${path}`, opts);

        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
            if (res.status === 401 && requiresAuth) {
                auth.logout();
                window.location.href = window.CS_LOGIN_URL ?? "/HTML/login.html";
                return;
            }
            const msg = typeof json.error === "string" ? json.error : "Erro na requisição";
            const err = new Error(msg);
            err.status = res.status;
            err.data   = json;
            throw err;
        }

        return json;
    }

    /* ===== ENDPOINTS ===== */
    return {
        auth,

        /* --- Auth --- */
        async login(email, password) {
            const data = await request("POST", "/auth/login", { email, password });
            auth.setToken(data.token);
            auth.setUser(data.user);
            return data;
        },

        async register(name, email, password, phone) {
            const data = await request("POST", "/auth/register", { name, email, password, phone });
            auth.setToken(data.token);
            auth.setUser(data.user);
            return data;
        },

        async recoverPassword(email) {
            return request("POST", "/auth/recover", { email });
        },

        /* --- Carros --- */
        async getCars(filters = {}) {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([k, v]) => {
                if (v !== undefined && v !== null && v !== "") params.set(k, v);
            });
            const qs = params.toString();
            return request("GET", `/cars${qs ? "?" + qs : ""}`);
        },

        async getCarById(id) {
            return request("GET", `/cars/${id}`);
        },

        async createCar(carData) {
            return request("POST", "/cars", carData, true);
        },

        async getMyCars() {
            return request("GET", "/cars/my", null, true);
        },

        async updateCar(id, data) {
            return request("PUT", `/cars/${id}`, data, true);
        },

        async deleteCar(id) {
            return request("DELETE", `/cars/${id}`, null, true);
        },

        async uploadCarImages(carId, files) {
            const token = auth.getToken();
            if (!token) throw new Error("Usuário não autenticado");

            const formData = new FormData();
            files.forEach(file => formData.append("images", file));

            const res = await fetch(`${BASE}/cars/${carId}/images`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData,
            });

            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json.error ?? "Erro ao fazer upload das imagens");
            return json;
        },

        /* --- Contato --- */
        async sendContact(name, email, phone, subject, message) {
            return request("POST", "/contact", { name, email, phone, subject, message });
        },

        /* --- Health check --- */
        async ping() {
            try {
                const res = await fetch(`${BASE}/health`);
                return res.ok;
            } catch {
                return false;
            }
        },
    };
})();
