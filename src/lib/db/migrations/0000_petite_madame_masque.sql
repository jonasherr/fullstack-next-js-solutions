CREATE TYPE "public"."booking_status" AS ENUM('Confirmed', 'Pending', 'Cancelled');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bookings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "bookings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"status" "booking_status",
	"checkIn" date NOT NULL,
	"checkOut" date NOT NULL,
	"guests" integer NOT NULL,
	"totalPrice" integer NOT NULL,
	"listing_id" integer NOT NULL,
	CONSTRAINT "guests_check" CHECK ("bookings"."guests" > 0),
	CONSTRAINT "totalPrice_check" CHECK ("bookings"."totalPrice" > 0)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "listings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "listings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"image" text NOT NULL,
	"description" text NOT NULL,
	"kitchen" boolean NOT NULL,
	"wifi" boolean NOT NULL,
	"tv" boolean NOT NULL,
	"bedrooms" integer NOT NULL,
	"address" text NOT NULL,
	"user_id" integer NOT NULL,
	CONSTRAINT "price_check" CHECK ("listings"."price" > 0),
	CONSTRAINT "bedrooms_check" CHECK ("listings"."bedrooms" > 0)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reviews_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"rating" real NOT NULL,
	"content" text NOT NULL,
	"date" date NOT NULL,
	"user_id" integer NOT NULL,
	"listing_id" integer NOT NULL,
	CONSTRAINT "rating_check" CHECK ("reviews"."rating" BETWEEN 0 AND 5)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"age" integer NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "age_check" CHECK ("users"."age" > 17)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_bookings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_to_bookings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"booking_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "listings" ADD CONSTRAINT "listings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reviews" ADD CONSTRAINT "reviews_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_bookings" ADD CONSTRAINT "users_to_bookings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_bookings" ADD CONSTRAINT "users_to_bookings_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
