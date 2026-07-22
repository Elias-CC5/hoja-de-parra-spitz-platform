import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDomainTables1721500100000 implements MigrationInterface {
  name = 'CreateDomainTables1721500100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── ENUMS ──────────────────────────────────────────────────────────
    await queryRunner.query(`CREATE TYPE "categories_type_enum" AS ENUM('producto','servicio')`);
    await queryRunner.query(`CREATE TYPE "products_type_enum" AS ENUM('plato','combo','paquete_corporativo','coffee_break','buffet','box_lunch','postre','bebida')`);
    await queryRunner.query(`CREATE TYPE "catering_services_eventtype_enum" AS ENUM('matrimonio','cumpleanos','empresarial','conferencia','coffee_break','aniversario','graduacion','evento_privado')`);
    await queryRunner.query(`CREATE TYPE "orders_status_enum" AS ENUM('pendiente_pago','pagado','en_preparacion','en_camino','entregado','cancelado')`);
    await queryRunner.query(`CREATE TYPE "payments_status_enum" AS ENUM('pendiente','aprobado','rechazado','reembolsado')`);
    await queryRunner.query(`CREATE TYPE "payments_method_enum" AS ENUM('tarjeta_visa','tarjeta_mastercard')`);
    await queryRunner.query(`CREATE TYPE "quotations_status_enum" AS ENUM('pendiente','aprobada','rechazada','convertida_a_pedido')`);
    await queryRunner.query(`CREATE TYPE "reservations_status_enum" AS ENUM('pendiente','confirmada','cancelada','completada')`);
    await queryRunner.query(`CREATE TYPE "advertisements_placement_enum" AS ENUM('home_banner','home_popup','menu_top','promocion')`);

    // ── CATEGORIES ─────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(120) NOT NULL,
        "slug" varchar(140) NOT NULL UNIQUE,
        "description" text,
        "imageUrl" varchar,
        "type" "categories_type_enum" NOT NULL DEFAULT 'producto',
        "displayOrder" int NOT NULL DEFAULT 0,
        "isActive" boolean NOT NULL DEFAULT true,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp
      );
      CREATE UNIQUE INDEX "IDX_categories_name" ON "categories" ("name");
    `);

    // ── PRODUCTS ───────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(160) NOT NULL,
        "slug" varchar(180) NOT NULL UNIQUE,
        "description" text NOT NULL,
        "type" "products_type_enum" NOT NULL,
        "price" decimal(10,2) NOT NULL,
        "minPeoplePerOrder" int NOT NULL DEFAULT 1,
        "maxPeoplePerOrder" int,
        "isAvailable" boolean NOT NULL DEFAULT true,
        "isFeatured" boolean NOT NULL DEFAULT false,
        "stock" int NOT NULL DEFAULT 0,
        "category_id" uuid NOT NULL REFERENCES "categories"("id"),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "product_images" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "url" varchar NOT NULL,
        "publicId" varchar NOT NULL,
        "displayOrder" int NOT NULL DEFAULT 0,
        "product_id" uuid NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp
      );
    `);

    // ── SERVICES CATALOG ───────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "catering_services" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(160) NOT NULL,
        "slug" varchar(180) NOT NULL UNIQUE,
        "description" text NOT NULL,
        "eventType" "catering_services_eventtype_enum" NOT NULL,
        "referencePrice" decimal(10,2),
        "galleryUrls" text,
        "isActive" boolean NOT NULL DEFAULT true,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "service_faqs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "question" varchar NOT NULL,
        "answer" text NOT NULL,
        "displayOrder" int NOT NULL DEFAULT 0,
        "service_id" uuid NOT NULL REFERENCES "catering_services"("id") ON DELETE CASCADE,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp
      );
    `);

    // ── CART ───────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "carts" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL UNIQUE REFERENCES "users"("id"),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "cart_items" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "cart_id" uuid NOT NULL REFERENCES "carts"("id") ON DELETE CASCADE,
        "product_id" uuid NOT NULL REFERENCES "products"("id"),
        "quantity" int NOT NULL,
        "unitPrice" decimal(10,2) NOT NULL,
        "notes" text,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp
      );
    `);

    // ── ORDERS ─────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "orderNumber" varchar NOT NULL UNIQUE,
        "user_id" uuid NOT NULL REFERENCES "users"("id"),
        "deliveryAddress" varchar NOT NULL,
        "eventDate" date NOT NULL,
        "numberOfPeople" int NOT NULL,
        "notes" text,
        "subtotal" decimal(10,2) NOT NULL,
        "tax" decimal(10,2) NOT NULL,
        "shipping" decimal(10,2) NOT NULL,
        "total" decimal(10,2) NOT NULL,
        "status" "orders_status_enum" NOT NULL DEFAULT 'pendiente_pago',
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "order_id" uuid NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
        "product_id" uuid NOT NULL REFERENCES "products"("id"),
        "productNameSnapshot" varchar(160) NOT NULL,
        "quantity" int NOT NULL,
        "unitPrice" decimal(10,2) NOT NULL,
        "lineTotal" decimal(10,2) NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp
      );
    `);

    // ── PAYMENTS ───────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "order_id" uuid NOT NULL REFERENCES "orders"("id"),
        "amount" decimal(10,2) NOT NULL,
        "currency" varchar(3) NOT NULL DEFAULT 'PEN',
        "method" "payments_method_enum",
        "status" "payments_status_enum" NOT NULL DEFAULT 'pendiente',
        "culqiChargeId" varchar,
        "culqiToken" varchar,
        "failureReason" text,
        "receiptUrl" varchar,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "transactions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "payment_id" uuid NOT NULL REFERENCES "payments"("id") ON DELETE CASCADE,
        "event" varchar NOT NULL,
        "rawResponse" jsonb,
        "success" boolean NOT NULL DEFAULT false,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp
      );
    `);

    // ── QUOTATIONS ─────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "quotations" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL REFERENCES "users"("id"),
        "eventType" "catering_services_eventtype_enum" NOT NULL,
        "eventDate" date NOT NULL,
        "eventTime" time NOT NULL,
        "location" varchar NOT NULL,
        "numberOfGuests" int NOT NULL,
        "estimatedBudget" decimal(10,2),
        "additionalServices" text,
        "comments" text,
        "status" "quotations_status_enum" NOT NULL DEFAULT 'pendiente',
        "finalPrice" decimal(10,2),
        "adminNotes" text,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp
      );
    `);

    // ── RESERVATIONS ───────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "reservations" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL REFERENCES "users"("id"),
        "eventDate" date NOT NULL,
        "eventTime" time NOT NULL,
        "numberOfPeople" int NOT NULL,
        "eventType" "catering_services_eventtype_enum" NOT NULL,
        "address" varchar NOT NULL,
        "comments" text,
        "status" "reservations_status_enum" NOT NULL DEFAULT 'pendiente',
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp
      );
    `);

    // ── ADVERTISEMENTS ─────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "advertisements" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "title" varchar(160) NOT NULL,
        "description" text,
        "imageUrl" varchar NOT NULL,
        "linkUrl" varchar,
        "placement" "advertisements_placement_enum" NOT NULL,
        "startsAt" date,
        "endsAt" date,
        "displayOrder" int NOT NULL DEFAULT 0,
        "isActive" boolean NOT NULL DEFAULT true,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp
      );
    `);

    // ── REVIEWS ────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "reviews" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL REFERENCES "users"("id"),
        "product_id" uuid NOT NULL REFERENCES "products"("id"),
        "rating" int NOT NULL,
        "comment" text,
        "isVisible" boolean NOT NULL DEFAULT true,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp,
        UNIQUE ("user_id", "product_id")
      );
    `);

    // ── FAVORITES ──────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "favorites" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL REFERENCES "users"("id"),
        "product_id" uuid NOT NULL REFERENCES "products"("id"),
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        "deleted_at" timestamp,
        UNIQUE ("user_id", "product_id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "favorites"`);
    await queryRunner.query(`DROP TABLE "reviews"`);
    await queryRunner.query(`DROP TABLE "advertisements"`);
    await queryRunner.query(`DROP TABLE "reservations"`);
    await queryRunner.query(`DROP TABLE "quotations"`);
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "cart_items"`);
    await queryRunner.query(`DROP TABLE "carts"`);
    await queryRunner.query(`DROP TABLE "service_faqs"`);
    await queryRunner.query(`DROP TABLE "catering_services"`);
    await queryRunner.query(`DROP TABLE "product_images"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "categories"`);

    await queryRunner.query(`DROP TYPE "advertisements_placement_enum"`);
    await queryRunner.query(`DROP TYPE "reservations_status_enum"`);
    await queryRunner.query(`DROP TYPE "quotations_status_enum"`);
    await queryRunner.query(`DROP TYPE "payments_method_enum"`);
    await queryRunner.query(`DROP TYPE "payments_status_enum"`);
    await queryRunner.query(`DROP TYPE "orders_status_enum"`);
    await queryRunner.query(`DROP TYPE "catering_services_eventtype_enum"`);
    await queryRunner.query(`DROP TYPE "products_type_enum"`);
    await queryRunner.query(`DROP TYPE "categories_type_enum"`);
  }
}
