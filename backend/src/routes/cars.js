import { z } from "zod";
import { eq, and, gte, lte, ilike, desc, asc, sql, inArray } from "drizzle-orm";
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { randomBytes } from "crypto";
import { v2 as cloudinary } from "cloudinary";
import { db } from "../db/index.js";
import { cars, carImages, users } from "../db/schema.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = join(__dirname, "../../uploads");
const USE_CLOUDINARY = !!process.env.CLOUDINARY_URL;

const ALLOWED_EXTS = new Set(["jpg", "jpeg", "png", "webp", "avif"]);

/* Salva imagem localmente ou no Cloudinary */
async function saveImage(buffer, ext) {
    if (USE_CLOUDINARY) {
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: "carshopping", resource_type: "image" },
                (err, res) => err ? reject(err) : resolve(res)
            ).end(buffer);
        });
        return result.secure_url;
    }

    const filename = `${randomBytes(16).toString("hex")}.${ext}`;
    await writeFile(join(UPLOADS_DIR, filename), buffer);
    return `/uploads/${filename}`;
}

const createCarSchema = z.object({
    brand:        z.string().min(1),
    model:        z.string().min(1),
    year:         z.number().int().min(1990).max(2099),
    km:           z.number().int().min(0),
    fuel:         z.string().min(1),
    transmission: z.string().min(1),
    price:        z.number().positive(),
    description:  z.string().optional(),
});

export default async function carRoutes(app) {

    /* Cria diretório de uploads dentro do plugin (falha visível no startup) */
    await mkdir(UPLOADS_DIR, { recursive: true });

    /* Configura Cloudinary se a env var estiver definida */
    if (USE_CLOUDINARY) {
        cloudinary.config();
    }

    /* GET /api/cars — listagem com filtros */
    app.get("/", async (request) => {
        const {
            brand, year, maxKm, minPrice, maxPrice, fuel,
            search, sort = "recentes",
        } = request.query;

        /* Sanitiza paginação — sem teto, limite máximo de 50 */
        const page  = Math.max(1, Number(request.query.page)  || 1);
        const limit = Math.min(50, Math.max(1, Number(request.query.limit) || 12));

        const filters = [eq(cars.status, "active")];

        if (brand && brand !== "todas") filters.push(eq(cars.brand, brand));
        if (year  && year  !== "todos")  filters.push(eq(cars.year, Number(year)));
        if (maxKm)    filters.push(lte(cars.km,    Number(maxKm)));
        if (minPrice) filters.push(gte(cars.price, String(minPrice)));
        if (maxPrice) filters.push(lte(cars.price, String(maxPrice)));
        if (search)   filters.push(ilike(cars.model, `%${search}%`));
        if (fuel && fuel !== "todos") filters.push(eq(cars.fuel, fuel));

        const orderBy =
            sort === "menor-preco" ? asc(cars.price) :
            sort === "maior-preco" ? desc(cars.price) :
            desc(cars.createdAt);

        const offset = (page - 1) * limit;

        const [data, [{ total }]] = await Promise.all([
            db.select({
                id:           cars.id,
                brand:        cars.brand,
                model:        cars.model,
                year:         cars.year,
                km:           cars.km,
                fuel:         cars.fuel,
                transmission: cars.transmission,
                price:        cars.price,
                createdAt:    cars.createdAt,
            })
            .from(cars)
            .where(and(...filters))
            .orderBy(orderBy)
            .limit(limit)
            .offset(offset),

            db.select({ total: sql`count(*)`.mapWith(Number) })
            .from(cars)
            .where(and(...filters)),
        ]);

        /* Busca imagem principal de cada carro */
        const ids = data.map(c => c.id);
        let mainImages = [];
        if (ids.length > 0) {
            mainImages = await db.select({ carId: carImages.carId, url: carImages.url })
                .from(carImages)
                .where(and(eq(carImages.isMain, true), inArray(carImages.carId, ids)));
        }
        const imageMap = Object.fromEntries(mainImages.map(i => [i.carId, i.url]));
        const result = data.map(c => ({ ...c, mainImage: imageMap[c.id] ?? null }));

        return { data: result, total, page, limit };
    });

    /* GET /api/cars/my — anúncios do usuário autenticado */
    app.get("/my", { onRequest: [app.authenticate] }, async (request) => {
        const userId = request.user.sub;

        const data = await db.select({
            id:           cars.id,
            brand:        cars.brand,
            model:        cars.model,
            year:         cars.year,
            km:           cars.km,
            fuel:         cars.fuel,
            transmission: cars.transmission,
            price:        cars.price,
            status:       cars.status,
            createdAt:    cars.createdAt,
        })
        .from(cars)
        .where(eq(cars.userId, userId))
        .orderBy(desc(cars.createdAt));

        const ids = data.map(c => c.id);
        let mainImages = [];
        if (ids.length > 0) {
            mainImages = await db.select({ carId: carImages.carId, url: carImages.url })
                .from(carImages)
                .where(and(eq(carImages.isMain, true), inArray(carImages.carId, ids)));
        }
        const imageMap = Object.fromEntries(mainImages.map(i => [i.carId, i.url]));
        return data.map(c => ({ ...c, mainImage: imageMap[c.id] ?? null }));
    });

    /* GET /api/cars/:id — detalhe do carro (inclui telefone do vendedor) */
    app.get("/:id", async (request, reply) => {
        const id = Number(request.params.id);
        if (!id) return reply.status(400).send({ error: "ID inválido" });

        const [car] = await db
            .select({
                id:           cars.id,
                userId:       cars.userId,
                brand:        cars.brand,
                model:        cars.model,
                year:         cars.year,
                km:           cars.km,
                fuel:         cars.fuel,
                transmission: cars.transmission,
                price:        cars.price,
                description:  cars.description,
                status:       cars.status,
                createdAt:    cars.createdAt,
                sellerPhone:  users.phone,
                sellerName:   users.name,
            })
            .from(cars)
            .leftJoin(users, eq(cars.userId, users.id))
            .where(eq(cars.id, id))
            .limit(1);

        if (!car) return reply.status(404).send({ error: "Veículo não encontrado" });

        const images = await db.select().from(carImages).where(eq(carImages.carId, id));

        return { ...car, images };
    });

    /* POST /api/cars — criar anúncio (requer autenticação) */
    app.post("/", { onRequest: [app.authenticate] }, async (request, reply) => {
        const parsed = createCarSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({ error: parsed.error.flatten().fieldErrors });
        }

        const [car] = await db.insert(cars)
            .values({ ...parsed.data, userId: request.user.sub })
            .returning();

        return reply.status(201).send(car);
    });

    /* POST /api/cars/:id/images — upload de imagens (requer autenticação) */
    app.post("/:id/images", { onRequest: [app.authenticate] }, async (request, reply) => {
        const carId = Number(request.params.id);
        if (!carId) return reply.status(400).send({ error: "ID inválido" });

        const [car] = await db.select({ id: cars.id, userId: cars.userId })
            .from(cars).where(eq(cars.id, carId)).limit(1);

        if (!car) return reply.status(404).send({ error: "Veículo não encontrado" });
        if (car.userId !== request.user.sub) {
            return reply.status(403).send({ error: "Não autorizado" });
        }

        /* Verifica se já existe imagem principal */
        const [existingMain] = await db.select({ id: carImages.id })
            .from(carImages)
            .where(and(eq(carImages.carId, carId), eq(carImages.isMain, true)))
            .limit(1);

        const saved = [];
        const parts = request.parts();

        for await (const part of parts) {
            if (part.type !== "file") { await part.value; continue; }

            const ext = part.filename.split(".").pop().toLowerCase();
            if (!ALLOWED_EXTS.has(ext)) { await part.toBuffer(); continue; }

            const buffer = await part.toBuffer();
            const url    = await saveImage(buffer, ext);

            const isMain = saved.length === 0 && !existingMain;
            const [image] = await db.insert(carImages)
                .values({ carId, url, isMain })
                .returning();

            saved.push(image);
        }

        return reply.status(201).send(saved);
    });

    /* PUT /api/cars/:id — editar anúncio (requer autenticação) */
    app.put("/:id", { onRequest: [app.authenticate] }, async (request, reply) => {
        const id = Number(request.params.id);
        if (!id) return reply.status(400).send({ error: "ID inválido" });

        const updateCarSchema = z.object({
            brand:        z.string().min(1).optional(),
            model:        z.string().min(1).optional(),
            year:         z.number().int().min(1990).max(2099).optional(),
            km:           z.number().int().min(0).optional(),
            fuel:         z.string().min(1).optional(),
            transmission: z.string().min(1).optional(),
            price:        z.number().positive().optional(),
            description:  z.string().optional(),
            status:       z.enum(["active", "sold", "inactive"]).optional(),
        });

        const parsed = updateCarSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.status(400).send({ error: parsed.error.flatten().fieldErrors });
        }

        const [car] = await db.select({ id: cars.id, userId: cars.userId })
            .from(cars).where(eq(cars.id, id)).limit(1);

        if (!car) return reply.status(404).send({ error: "Veículo não encontrado" });
        if (car.userId !== request.user.sub) {
            return reply.status(403).send({ error: "Não autorizado" });
        }

        const [updated] = await db.update(cars).set(parsed.data).where(eq(cars.id, id)).returning();
        return updated;
    });

    /* DELETE /api/cars/:id — excluir anúncio (requer autenticação) */
    app.delete("/:id", { onRequest: [app.authenticate] }, async (request, reply) => {
        const id = Number(request.params.id);
        if (!id) return reply.status(400).send({ error: "ID inválido" });

        const [car] = await db.select({ id: cars.id, userId: cars.userId })
            .from(cars).where(eq(cars.id, id)).limit(1);

        if (!car) return reply.status(404).send({ error: "Veículo não encontrado" });
        if (car.userId !== request.user.sub) {
            return reply.status(403).send({ error: "Não autorizado" });
        }

        await db.delete(cars).where(eq(cars.id, id));
        return { message: "Anúncio excluído com sucesso" };
    });

    /* PATCH /api/cars/:id/status — encerrar anúncio (requer autenticação) */
    app.patch("/:id/status", { onRequest: [app.authenticate] }, async (request, reply) => {
        const id = Number(request.params.id);
        const { status } = request.body ?? {};

        if (!["active", "sold", "inactive"].includes(status)) {
            return reply.status(400).send({ error: "Status inválido" });
        }

        const [car] = await db.select({ id: cars.id, userId: cars.userId })
            .from(cars).where(eq(cars.id, id)).limit(1);

        if (!car) return reply.status(404).send({ error: "Veículo não encontrado" });
        if (car.userId !== request.user.sub) {
            return reply.status(403).send({ error: "Não autorizado" });
        }

        await db.update(cars).set({ status }).where(eq(cars.id, id));

        return { message: "Status atualizado" };
    });
}
