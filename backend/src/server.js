"use strict";
import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import staticFiles from "@fastify/static";
import compress from "@fastify/compress";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import carRoutes from "./routes/cars.js";
import contactRoutes from "./routes/contact.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV !== "production";

/* JWT_SECRET obrigatório em produção */
if (!isDev && !process.env.JWT_SECRET) {
    console.error("FATAL: JWT_SECRET não definido. Configure a variável de ambiente antes de iniciar em produção.");
    process.exit(1);
}

const app = Fastify({
    logger: isDev
        ? { transport: { target: "pino-pretty", options: { colorize: true, translateTime: "HH:MM:ss" } } }
        : true,
});

/* CORS: em dev aceita tudo; em produção lê CORS_ORIGIN (separado por vírgulas) */
const corsOrigin = isDev
    ? true
    : (process.env.CORS_ORIGIN ?? "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

/* ===== PLUGINS ===== */
await app.register(compress, { global: true });

/* Rate limiting — requer: npm install @fastify/rate-limit */
try {
    const { default: rateLimit } = await import("@fastify/rate-limit");
    await app.register(rateLimit, {
        global:       true,
        max:          100,
        timeWindow:   "1 minute",
        keyGenerator: (req) => req.ip,
        errorResponseBuilder: () => ({ error: "Muitas requisições. Tente novamente em breve." }),
    });
} catch {
    console.warn("[CarShopping] @fastify/rate-limit não encontrado. Execute: npm install @fastify/rate-limit");
}

await app.register(cors, {
    origin: corsOrigin,
    credentials: true,
});

await app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "dev-secret-change-in-production",
    sign: { expiresIn: "7d" },
});

await app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });

/* Serve imagens enviadas por upload */
await app.register(staticFiles, {
    root: join(__dirname, "../uploads"),
    prefix: "/uploads/",
});

/* ===== DECORADORES ===== */
app.decorate("authenticate", async (request, reply) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.status(401).send({ error: "Token inválido ou expirado" });
    }
});

/* ===== ROTAS ===== */
await app.register(authRoutes,    { prefix: "/api/auth" });
await app.register(carRoutes,     { prefix: "/api/cars" });
await app.register(contactRoutes, { prefix: "/api/contact" });

app.get("/api/health", async () => ({
    status: "ok",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
}));

/* ===== 404 handler ===== */
app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({ error: `Rota não encontrada: ${request.method} ${request.url}` });
});

/* ===== ERROR handler ===== */
app.setErrorHandler((error, request, reply) => {
    const status = error.statusCode ?? 500;
    app.log.error(error);
    reply.status(status).send({
        error: status === 500 ? "Erro interno do servidor" : error.message,
    });
});

/* ===== INICIALIZAÇÃO ===== */
const PORT = Number(process.env.PORT) || 3000;

try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`\n  CarShopping API rodando em http://localhost:${PORT}\n`);
} catch (err) {
    app.log.error(err);
    process.exit(1);
}
