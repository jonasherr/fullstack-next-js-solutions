CREATE TABLE IF NOT EXISTS "bookings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "bookings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"guestName" text NOT NULL,
	"status" "booking_status",
	"checkIn" date NOT NULL,
	"checkOut" date NOT NULL,
	"guests" integer NOT NULL,
	"totalPrice" integer NOT NULL,
	"amenities" text NOT NULL,
	"bnbName" text NOT NULL,
	"bnbAddress" text NOT NULL,
	"bnbPhone" text NOT NULL,
	"bnbEmail" text NOT NULL,
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
	"rating" real NOT NULL,
	"reviewCount" integer DEFAULT 0,
	CONSTRAINT "price_check" CHECK ("listings"."price" > 0),
	CONSTRAINT "bedrooms_check" CHECK ("listings"."bedrooms" > 0),
	CONSTRAINT "rating_check" CHECK ("listings"."rating" BETWEEN 0 AND 5)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reviews" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "reviews_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"rating" real NOT NULL,
	"content" text NOT NULL,
	"author" text NOT NULL,
	"date" date NOT NULL,
	CONSTRAINT "rating_check" CHECK ("reviews"."rating" BETWEEN 0 AND 5)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"age" integer NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "age_check" CHECK ("users"."age" > 17)
);
