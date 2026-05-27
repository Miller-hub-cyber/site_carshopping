import { z } from "zod";
import { db } from "../db/index.js";
import { contacts } from "../db/schema.js";
import { sendEmail } from "../lib/email.js";

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

        const { name, email, subject, message, phone } = parsed.data;
        const adminEmail = process.env.ADMIN_EMAIL;

        if (adminEmail) {
            const esc = (s) => String(s ?? "")
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;");

            await sendEmail({
                to: adminEmail,
                subject: `[CarShopping] Nova mensagem: ${subject ?? "Sem assunto"}`,
                html: `
                    <h2>Nova mensagem de contato</h2>
                    <p><strong>Nome:</strong> ${esc(name)}</p>
                    <p><strong>Email:</strong> ${esc(email)}</p>
                    ${phone ? `<p><strong>Telefone:</strong> ${esc(phone)}</p>` : ""}
                    ${subject ? `<p><strong>Assunto:</strong> ${esc(subject)}</p>` : ""}
                    <p><strong>Mensagem:</strong></p>
                    <p>${esc(message).replace(/\n/g, "<br>")}</p>
                `,
            });
        }

        return reply.status(201).send({
            message: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
            id: contact.id,
        });
    });
}
