CREATE TABLE "application_shareholders" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" uuid NOT NULL,
	"person_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "application_shareholders" ADD CONSTRAINT "application_shareholders_application_id_company_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."company_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_shareholders" ADD CONSTRAINT "application_shareholders_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;