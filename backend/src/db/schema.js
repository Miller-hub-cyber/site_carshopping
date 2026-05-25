import {
    pgTable, serial, varchar, text, integer,
    timestamp, boolean, numeric,
} from "drizzle-orm/pg-core";

/* ===== USUÁRIOS ===== */
export const users = pgTable("users", {
    id:           serial("id").primaryKey(),
    name:         varchar("name",          { length: 255 }).notNull(),
    email:        varchar("email",         { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    phone:        varchar("phone",         { length: 20 }),
    createdAt:    timestamp("created_at").defaultNow(),
});

/* ===== ANÚNCIOS DE CARROS ===== */
export const cars = pgTable("cars", {
    id:           serial("id").primaryKey(),
    userId:       integer("user_id").references(() => users.id, { onDelete: "set null" }),
    brand:        varchar("brand",        { length: 100 }).notNull(),
    model:        varchar("model",        { length: 100 }).notNull(),
    year:         integer("year").notNull(),
    km:           integer("km").notNull(),
    fuel:         varchar("fuel",         { length: 50 }).notNull(),
    transmission: varchar("transmission", { length: 50 }).notNull(),
    price:        numeric("price",        { precision: 12, scale: 2 }).notNull(),
    description:  text("description"),
    status:       varchar("status",       { length: 20 }).default("active").notNull(),
    createdAt:    timestamp("created_at").defaultNow(),
});

/* ===== IMAGENS DOS CARROS ===== */
export const carImages = pgTable("car_images", {
    id:     serial("id").primaryKey(),
    carId:  integer("car_id").references(() => cars.id, { onDelete: "cascade" }),
    url:    varchar("url",    { length: 500 }).notNull(),
    isMain: boolean("is_main").default(false),
});

/* ===== MENSAGENS DE CONTATO ===== */
export const contacts = pgTable("contacts", {
    id:        serial("id").primaryKey(),
    name:      varchar("name",    { length: 255 }).notNull(),
    email:     varchar("email",   { length: 255 }).notNull(),
    phone:     varchar("phone",   { length: 20 }),
    subject:   varchar("subject", { length: 100 }),
    message:   text("message").notNull(),
    read:      boolean("read").default(false),
    createdAt: timestamp("created_at").defaultNow(),
});
