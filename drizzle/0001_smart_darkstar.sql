CREATE TABLE IF NOT EXISTS "templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"json" jsonb NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
