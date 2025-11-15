/*
  Warnings:

  - You are about to drop the `ProgressLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProgressLog" DROP CONSTRAINT "ProgressLog_user_exam_id_fkey";

-- DropTable
DROP TABLE "ProgressLog";
