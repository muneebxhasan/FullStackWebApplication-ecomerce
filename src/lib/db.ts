import { drizzle } from "drizzle-orm/postgres-js";
import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { genSaltSync, hashSync } from "bcrypt-ts";

// Database setup
const client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
const db = drizzle(client);

// Define the User table
export const User = pgTable("User", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }).notNull(),
  super_user: boolean("super_user").notNull().default(false),
  address: varchar("address", { length: 256 }).notNull(),
  number: varchar("number", { length: 20 }).notNull(),
});

// Define the Product table with gender field
export const Product = pgTable("Product", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  clothType: varchar("cloth_type", { length: 64 }).notNull(),
  gender: varchar("gender", { length: 6 }).notNull(), // Added gender field
  price: varchar("price", { length: 16 }).notNull(),
});

// Define the Image table
export const Image = pgTable("Image", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => Product.id),
  imageUrl: varchar("image_url", { length: 256 }).notNull(),
});

// Define an ENUM for order status
export const orderStatusEnum = pgEnum("order_status", [
  "processing",
  "shipped",
  "delivered",
]);

// Define the Order table with customer details and order status
export const Order = pgTable("Order", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 256 }).notNull(), // Stripe session ID
  amountTotal: integer("amount_total").notNull(), // Amount paid in cents
  currency: varchar("currency", { length: 3 }).notNull(), // Currency code
  paymentStatus: varchar("payment_status", { length: 64 }).notNull(), // Payment status
  orderStatus: orderStatusEnum("order_status").notNull().default("processing"), // Order status enum
  customerName: varchar("customer_name", { length: 128 }), // Customer name
  customerEmail: varchar("customer_email", { length: 64 }), // Customer email
  customerPhone: varchar("customer_phone", { length: 20 }), // Customer phone number
  shippingAddress: jsonb("shipping_address"), // Shipping address as JSON
  items: jsonb("items").notNull(), // Store items as JSONB
  created: timestamp("created").notNull().defaultNow(), // Order creation timestamp
});

// Ensure the tables are created
export async function ensureTablesExist() {
  try {
    const userTableExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'User'
      );`;

    if (!userTableExists[0].exists) {
      await client`
        CREATE TABLE "User" (
          id SERIAL PRIMARY KEY,
          email VARCHAR(64) NOT NULL,
          password VARCHAR(64) NOT NULL,
          super_user BOOLEAN NOT NULL DEFAULT FALSE,
          address VARCHAR(256) NOT NULL,
          number VARCHAR(20) NOT NULL
        );`;
    }

    const productTableExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'Product'
      );`;

    if (!productTableExists[0].exists) {
      await client`
        CREATE TABLE "Product" (
          id SERIAL PRIMARY KEY,
          name VARCHAR(128) NOT NULL,
          cloth_type VARCHAR(64) NOT NULL,
          gender VARCHAR(6) NOT NULL,
          price VARCHAR(16) NOT NULL
        );`;
    }

    const imageTableExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'Image'
      );`;

    if (!imageTableExists[0].exists) {
      await client`
        CREATE TABLE "Image" (
          id SERIAL PRIMARY KEY,
          product_id INTEGER REFERENCES "Product"(id) ON DELETE CASCADE,
          image_url VARCHAR(256) NOT NULL
        );`;
    }

    const orderTableExists = await client`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'Order'
      );`;

    if (!orderTableExists[0].exists) {
      // Separate CREATE TYPE and CREATE TABLE commands
      await client`CREATE TYPE order_status AS ENUM ('processing', 'shipped', 'delivered');`;

      await client`
    CREATE TABLE "Order" (
      id SERIAL PRIMARY KEY,
      session_id VARCHAR(256) NOT NULL,
      amount_total INTEGER NOT NULL,
      currency VARCHAR(3) NOT NULL,
      payment_status VARCHAR(64) NOT NULL,
      order_status order_status NOT NULL DEFAULT 'processing',
      customer_name VARCHAR(128),
      customer_email VARCHAR(64),
      customer_phone VARCHAR(20),
      shipping_address JSONB,
      items JSONB NOT NULL,  -- Store items as JSONB
      created TIMESTAMP NOT NULL DEFAULT NOW()
    );`;
    }
  } catch (error) {
    console.error("Error ensuring tables exist:", error);
    throw error;
  }

  return { User, Product, Image, Order };
}

// Example: Creating a new user
export async function createUser(
  email: string,
  password: string,
  superUser: boolean,
  address: string,
  number: string,
) {
  const { User } = await ensureTablesExist();
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  return await db.insert(User).values({
    email,
    password: hash,
    super_user: superUser,
    address,
    number,
  });
}

// Example: Fetching a user by email
export async function getUser(email: string) {
  const { User } = await ensureTablesExist();
  return await db.select().from(User).where(eq(User.email, email));
}

export default db;
