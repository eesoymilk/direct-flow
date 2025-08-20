ALTER TABLE "review_rounds" RENAME COLUMN "started_at" TO "created_at";--> statement-breakpoint
ALTER TABLE "review_rounds" RENAME COLUMN "started_by_sub" TO "created_by_sub";--> statement-breakpoint
ALTER TABLE "review_rounds" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."review_round_status";--> statement-breakpoint
CREATE TYPE "public"."review_round_status" AS ENUM('reviewing', 'resolved', 'completed');--> statement-breakpoint
ALTER TABLE "review_rounds" ALTER COLUMN "status" SET DATA TYPE "public"."review_round_status" USING "status"::"public"."review_round_status";--> statement-breakpoint
ALTER TABLE "review_issues" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "review_issues" DROP COLUMN "verified_by_sub";--> statement-breakpoint
ALTER TABLE "review_issues" DROP COLUMN "verified_at";--> statement-breakpoint
ALTER TABLE "review_rounds" DROP COLUMN "completed_at";--> statement-breakpoint
ALTER TABLE "review_rounds" DROP COLUMN "completed_by_sub";--> statement-breakpoint
DROP TYPE "public"."review_issue_status";