CREATE TYPE "public"."organization_type" AS ENUM('corporation', 'limited_company', 'sole_proprietorship', 'partnership');--> statement-breakpoint
CREATE TYPE "public"."application_status" AS ENUM('submitted', 'staff_review', 'pending_client_update', 'filing', 'filed', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."review_issue_severity" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."review_issue_type" AS ENUM('missing', 'invalid', 'clarification', 'modification');--> statement-breakpoint
CREATE TYPE "public"."review_round_status" AS ENUM('reviewing', 'resolved', 'completed');--> statement-breakpoint
CREATE TYPE "public"."share_type" AS ENUM('ordinary', 'preferred_a', 'preferred_b', 'preferred_c', 'preferred_d', 'preferred_e');--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"foreign_name" varchar,
	"organization_type" "organization_type" NOT NULL,
	"business_items_description" varchar,
	"business_items" varchar[] NOT NULL,
	"business_id_number" varchar,
	"tax_serial_number" varchar,
	"address" varchar NOT NULL,
	"telephone" varchar,
	"fax" varchar,
	"email" varchar,
	"capital_amount" integer,
	"authorized_shares" integer,
	"ordinary_shares" integer,
	"preferred_shares" integer,
	"has_par_value_free_shares" boolean,
	"is_foreign_investment" boolean DEFAULT false,
	"is_chinese_investment" boolean DEFAULT false,
	"is_public_offering" boolean DEFAULT false,
	"closely_held_shareholder_count" integer,
	"has_multiple_voting_rights_preferred_shares" boolean DEFAULT false,
	"has_veto_rights_preferred_shares" boolean DEFAULT false,
	"has_preferred_shares_board_rights" boolean DEFAULT false,
	"is_sole_proprietorship_llc" boolean DEFAULT false,
	"responsible_person_id" uuid NOT NULL,
	"contact_person_id" uuid NOT NULL,
	"representative_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_id" uuid NOT NULL,
	"document_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" uuid NOT NULL,
	"document_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application_shareholders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"person_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_names" varchar[] NOT NULL,
	"chosen_name" varchar,
	"organization_type" "organization_type" NOT NULL,
	"is_closely_held" boolean,
	"has_par_value_free_shares" boolean,
	"business_items_description" varchar NOT NULL,
	"capital_amount" integer,
	"par_value" integer,
	"total_shares" integer,
	"ordinary_shares_amount" integer,
	"preferred_shares_amount" integer,
	"paid_in_capital" integer,
	"address" varchar NOT NULL,
	"is_foreign_investment" boolean DEFAULT false,
	"is_chinese_investment" boolean DEFAULT false,
	"is_public_offering" boolean DEFAULT false,
	"closely_held_shareholder_count" integer,
	"has_multiple_voting_rights_preferred_shares" boolean DEFAULT false,
	"has_veto_rights_preferred_shares" boolean DEFAULT false,
	"has_preferred_shares_board_rights" boolean DEFAULT false,
	"is_sole_proprietorship_llc" boolean DEFAULT false,
	"responsible_person_id" uuid,
	"representative_id" uuid,
	"contact_person_id" uuid,
	"status" "application_status" DEFAULT 'submitted' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"round_id" uuid NOT NULL,
	"field_path" varchar(256) NOT NULL,
	"issue_type" "review_issue_type" NOT NULL,
	"severity" "review_issue_severity" NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "review_rounds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"status" "review_round_status" DEFAULT 'reviewing' NOT NULL,
	"summary" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by_sub" varchar NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"round_no" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"round_id" uuid NOT NULL,
	"field_path" varchar(256) NOT NULL,
	"verified_by_sub" varchar NOT NULL,
	"verified_at" timestamp DEFAULT now() NOT NULL,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "document_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "document_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_type_id" integer,
	"file_path" varchar NOT NULL,
	"file_name" varchar NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" varchar NOT NULL,
	"description" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "people" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"id_number" varchar NOT NULL,
	"address" varchar,
	"telephone" varchar,
	"cellphone" varchar,
	"email" varchar,
	"date_of_birth" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "people_id_number_unique" UNIQUE("id_number")
);
--> statement-breakpoint
CREATE TABLE "person_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"person_id" uuid NOT NULL,
	"document_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shareholder_shares" (
	"id" serial PRIMARY KEY NOT NULL,
	"shareholder_id" integer NOT NULL,
	"code" "share_type" DEFAULT 'ordinary' NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"price_per_share" numeric(10, 2),
	"total_price" numeric(12, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shareholders" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_id" uuid NOT NULL,
	"person_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_responsible_person_id_people_id_fk" FOREIGN KEY ("responsible_person_id") REFERENCES "public"."people"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_contact_person_id_people_id_fk" FOREIGN KEY ("contact_person_id") REFERENCES "public"."people"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_representative_id_people_id_fk" FOREIGN KEY ("representative_id") REFERENCES "public"."people"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_documents" ADD CONSTRAINT "company_documents_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_documents" ADD CONSTRAINT "company_documents_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_application_id_company_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."company_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_shareholders" ADD CONSTRAINT "application_shareholders_application_id_company_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."company_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_shareholders" ADD CONSTRAINT "application_shareholders_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_applications" ADD CONSTRAINT "company_applications_responsible_person_id_people_id_fk" FOREIGN KEY ("responsible_person_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_applications" ADD CONSTRAINT "company_applications_representative_id_people_id_fk" FOREIGN KEY ("representative_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_applications" ADD CONSTRAINT "company_applications_contact_person_id_people_id_fk" FOREIGN KEY ("contact_person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_issues" ADD CONSTRAINT "review_issues_round_id_review_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."review_rounds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_rounds" ADD CONSTRAINT "review_rounds_application_id_company_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."company_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_verifications" ADD CONSTRAINT "review_verifications_round_id_review_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."review_rounds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_document_type_id_document_types_id_fk" FOREIGN KEY ("document_type_id") REFERENCES "public"."document_types"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "person_documents" ADD CONSTRAINT "person_documents_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "person_documents" ADD CONSTRAINT "person_documents_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shareholder_shares" ADD CONSTRAINT "shareholder_shares_shareholder_id_shareholders_id_fk" FOREIGN KEY ("shareholder_id") REFERENCES "public"."shareholders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shareholders" ADD CONSTRAINT "shareholders_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shareholders" ADD CONSTRAINT "shareholders_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;