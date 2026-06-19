CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_name" varchar(255) DEFAULT 'ServerHub' NOT NULL,
	"store_email" varchar(255) DEFAULT 'admin@serverhub.com' NOT NULL,
	"store_phone" varchar(50) DEFAULT '+1 (555) 123-4567' NOT NULL,
	"store_address" varchar(500) DEFAULT '123 Server Lane, San Jose, CA 95134' NOT NULL,
	"standard_shipping" numeric(10, 2) DEFAULT '150' NOT NULL,
	"express_shipping" numeric(10, 2) DEFAULT '250' NOT NULL,
	"overnight_shipping" numeric(10, 2) DEFAULT '400' NOT NULL,
	"free_shipping_threshold" numeric(10, 2) DEFAULT '5000' NOT NULL,
	"tax_rate" numeric(5, 2) DEFAULT '8.5' NOT NULL,
	"tax_inclusive" boolean DEFAULT false NOT NULL
);
