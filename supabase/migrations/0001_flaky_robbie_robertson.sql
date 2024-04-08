CREATE TABLE IF NOT EXISTS "admin_dashboard" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"ip" text,
	"type" varchar(1) DEFAULT 'N',
	"views" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "test";--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "content" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "auth"."users" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "auth"."users" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "auth"."users" SET SCHEMA public;
--> statement-breakpoint
DROP SCHEMA "auth";
