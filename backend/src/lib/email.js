import { Resend } from "resend";

const client = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM = process.env.EMAIL_FROM ?? "CarShopping <noreply@carshopping.com>";

export async function sendEmail({ to, subject, html }) {
    if (!client) {
        console.log(`[email] RESEND_API_KEY não configurado — email para ${to} ignorado.`);
        return;
    }
    await client.emails.send({ from: FROM, to, subject, html });
}
