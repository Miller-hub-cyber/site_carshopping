import bcrypt from "bcryptjs";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";

const registerSchema = z.object({
    name:     z.string().min(2,  "Nome deve ter ao menos 2 caracteres"),
    email:    z.string().email("Email inválido"),
    password: z.string().min(8,  "Senha deve ter ao menos 8 caracteres"),
    phone:    z.string().optional(),
});

const loginSchema = z.object({
    email:    z.string().email(),
    password: z.string().min(1),
});

export default async function authRoutes(app) {

    /* POST /api/auth/register */
    app.post("/register", async (request, reply) => {
        const parsed = registerSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({ error: parsed.error.flatten().fieldErrors });
        }

        const { name, email, password, phone } = parsed.data;

        const existing = await db.select({ id: users.id })
            .from(users).where(eq(users.email, email)).limit(1);

        if (existing.length) {
            return reply.status(409).send({ error: "Email já cadastrado" });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const [user] = await db.insert(users)
            .values({ name, email, passwordHash, phone })
            .returning({ id: users.id, name: users.name, email: users.email });

        const token = app.jwt.sign({ sub: user.id, email: user.email });

        return reply.status(201).send({ user, token });
    });

    /* POST /api/auth/login */
    app.post("/login", async (request, reply) => {
        const parsed = loginSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({ error: "Dados inválidos" });
        }

        const { email, password } = parsed.data;

        const [user] = await db.select()
            .from(users).where(eq(users.email, email)).limit(1);

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return reply.status(401).send({ error: "Email ou senha incorretos" });
        }

        const token = app.jwt.sign({ sub: user.id, email: user.email });

        return {
            user: { id: user.id, name: user.name, email: user.email },
            token,
        };
    });

    /* POST /api/auth/recover */
    app.post("/recover", async (request, reply) => {
        const { email } = request.body ?? {};
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return reply.status(400).send({ error: "Email inválido" });
        }

        /* Em produção: enviar email via Resend.
           Por enquanto confirmamos sem revelar se o email existe. */
        return {
            message: "Se o email estiver cadastrado, você receberá as instruções em breve.",
        };
    });

    /* GET /api/auth/me — rota protegida */
    app.get("/me", { onRequest: [app.authenticate] }, async (request) => {
        const [user] = await db.select({ id: users.id, name: users.name, email: users.email, phone: users.phone })
            .from(users).where(eq(users.id, request.user.sub)).limit(1);
        return user;
    });
}
