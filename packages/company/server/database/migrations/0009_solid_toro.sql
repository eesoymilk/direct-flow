ALTER TYPE "public"."application_status" ADD VALUE 'filing' BEFORE 'approved';--> statement-breakpoint
ALTER TYPE "public"."application_status" ADD VALUE 'filed' BEFORE 'approved';--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "organization_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "company_applications" ALTER COLUMN "organization_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."organization_type";--> statement-breakpoint
CREATE TYPE "public"."organization_type" AS ENUM('company_limited', 'closely_held_company_limited', 'limited_company', 'sole_proprietorship', 'partnership');--> statement-breakpoint
ALTER TABLE "companies" ALTER COLUMN "organization_type" SET DATA TYPE "public"."organization_type" USING "organization_type"::"public"."organization_type";--> statement-breakpoint
ALTER TABLE "company_applications" ALTER COLUMN "organization_type" SET DATA TYPE "public"."organization_type" USING "organization_type"::"public"."organization_type";--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "capital_amount" integer;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "authorized_shares" integer;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "ordinary_shares" integer;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "preferred_shares" integer;--> statement-breakpoint
ALTER TABLE "companies" ADD COLUMN "has_par_value_free_shares" boolean;--> statement-breakpoint
ALTER TABLE "company_applications" ADD COLUMN "capital_amount" integer;--> statement-breakpoint
ALTER TABLE "company_applications" ADD COLUMN "authorized_shares" integer;--> statement-breakpoint
ALTER TABLE "company_applications" ADD COLUMN "ordinary_shares" integer;--> statement-breakpoint
ALTER TABLE "company_applications" ADD COLUMN "preferred_shares" integer;--> statement-breakpoint
ALTER TABLE "company_applications" ADD COLUMN "has_par_value_free_shares" boolean;