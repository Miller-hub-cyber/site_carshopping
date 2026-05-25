import { z } from "zod";
import { db } from "../db/index.js";
import { contacts } from "../db/schema.js";

const contactSchema = z.object({
    name:    z.string().min(2,  "Nome muito curto"),
    email:   z.string().email("Email inválido"),
    phone:   z.string().optional(),
    subject: z.string().optional(),
    message: z.string().min(10, "Mensagem muito curta (mínimo 10 caracteres)"),
});

export default async function contactRoutes(app) {

    /* POST /api/contact */
    app.post("/", async (request, reply) => {
        const parsed = contactSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({ error: parsed.error.flatten().fieldErrors });
        }

        const [contact] = await db.insert(contacts)
            .values(parsed.data)
            .returning({ id: contacts.id });

        /* Em produção: enviar email de notificação via Resend */

        return reply.status(201).send({
            message: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
            id: contact.id,
        });
    });
}
