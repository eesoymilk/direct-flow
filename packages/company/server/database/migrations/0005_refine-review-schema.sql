ALTER TYPE "public"."review_issue_type" ADD VALUE 'modification';--> statement-breakpoint
ALTER TABLE "review_rounds" RENAME COLUMN "opened_at" TO "started_at";--> statement-breakpoint
ALTER TABLE "review_rounds" RENAME COLUMN "opened_by_sub" TO "started_by_sub";--> statement-breakpoint
ALTER TABLE "review_rounds" RENAME COLUMN "closed_at" TO "completed_at";--> statement-breakpoint
ALTER TABLE "review_rounds" RENAME COLUMN "closed_by_sub" TO "completed_by_sub";--> statement-breakpoint
ALTER TABLE "review_rounds" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "review_rounds" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."review_round_status";--> statement-breakpoint
CREATE TYPE "public"."review_round_status" AS ENUM('submitted', 'reviewing', 'filing', 'approved', 'rejected');--> statement-breakpoint
ALTER TABLE "review_rounds" ALTER COLUMN "status" SET DATA TYPE "public"."review_round_status" USING "status"::"public"."review_round_status";--> statement-breakpoint
ALTER TABLE "review_issues" ALTER COLUMN "severity" DROP DEFAULT;