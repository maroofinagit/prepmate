/*
  Warnings:

  - You are about to drop the column `created_at` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `AiModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AiPrompt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AiPrompt" DROP CONSTRAINT "AiPrompt_user_id_fkey";

-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "imageUrl" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "RoadmapPhase" ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "start_date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "RoadmapWeek" ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "start_date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user" DROP COLUMN "created_at",
DROP COLUMN "password_hash",
DROP COLUMN "updated_at";

-- DropTable
DROP TABLE "AiModel";

-- DropTable
DROP TABLE "AiPrompt";

-- DropEnum
DROP TYPE "AiPromptType";
