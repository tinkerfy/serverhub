CREATE TYPE "public"."quote_status" AS ENUM('pending', 'quoted', 'converted', 'expired');--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"quote_number" varchar(50) NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"company" varchar(255),
	"category" varchar(50) NOT NULL,
	"specific_interest" text,
	"quantity" integer DEFAULT 1,
	"budget_range" varchar(100),
	"message" text,
	"final_price" numeric(12, 2),
	"admin_notes" text,
	"status" "quote_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "quotes_quote_number_unique" UNIQUE("quote_number")
);
--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "image_urls" SET DATA TYPE varchar(2000)[];--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "image_urls" SET DEFAULT '{}';