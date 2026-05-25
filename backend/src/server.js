"use strict";
import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";

import authRoutes from "./routes/auth.js";
import carRoutes from "./routes/cars.js";
import contactRoutes from "./routes/contact.js";

const isDev = process.env.NODE_ENV !== "production";

const app = Fastify({
    logger: isDev
        ? { transport: { target: "pino-pretty", options: { colorize: true, translateTime: "HH:MM:ss" } } }
        : true,
});

/* ===== PLUGINS ===== */
await app.register(cors, {
    /* Em dev: aceita qualquer origem (inclui file://, Live Server, etc.)
       Em produção: troque por: origin: ["https://seudominio.com"] */
    origin: isDev ? true : ["https://seudominio.com"],
    credentials: true,
});

await app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "dev-secret-change-in-production",
    sign: { expiresIn: "7d" },
});

await app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });

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
