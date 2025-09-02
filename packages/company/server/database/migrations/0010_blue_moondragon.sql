CREATE TABLE "shareholder_shares" (
	"id" serial PRIMARY KEY NOT NULL,
	"shareholder_id" integer NOT NULL,
	"shares" integer DEFAULT 0 NOT NULL,
	"share_type" varchar DEFAULT 'ordinary' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "company_applications" ADD COLUMN "is_closely_held" boolean;--> statement-breakpoint
ALTER TABLE "shareholder_shares" ADD CONSTRAINT "shareholder_shares_shareholder_id_shareholders_id_fk" FOREIGN KEY ("shareholder_id") REFERENCES "public"."shareholders"("id") ON DELETE cascade ON UPDATE no action;