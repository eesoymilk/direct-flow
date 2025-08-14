CREATE TYPE "public"."review_issue_severity" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."review_issue_status" AS ENUM('open', 'resolved', 'verified');--> statement-breakpoint
CREATE TYPE "public"."review_issue_type" AS ENUM('missing', 'invalid', 'clarification');--> statement-breakpoint
CREATE TYPE "public"."review_round_status" AS ENUM('awaiting_client', 'awaiting_staff', 'closed');--> statement-breakpoint
CREATE TABLE "review_issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"round_id" uuid NOT NULL,
	"field_path" varchar(256) NOT NULL,
	"issue_type" "review_issue_type" NOT NULL,
	"severity" "review_issue_severity" DEFAULT 'medium' NOT NULL,
	"description" text,
	"status" "review_issue_status" DEFAULT 'open' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp,
	"verified_by_sub" varchar,
	"verified_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "review_rounds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"status" "review_round_status" DEFAULT 'awaiting_client' NOT NULL,
	"summary" text,
	"opened_at" timestamp DEFAULT now() NOT NULL,
	"opened_by_sub" varchar NOT NULL,
	"closed_at" timestamp,
	"closed_by_sub" varchar,
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
ALTER TABLE "company_applications" ALTER COLUMN "organization_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "company_applications" ALTER COLUMN "business_items_description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "company_applications" ALTER COLUMN "address" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "review_issues" ADD CONSTRAINT "review_issues_round_id_review_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."review_rounds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_rounds" ADD CONSTRAINT "review_rounds_application_id_company_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."company_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_verifications" ADD CONSTRAINT "review_verifications_round_id_review_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."review_rounds"("id") ON DELETE cascade ON UPDATE no action;