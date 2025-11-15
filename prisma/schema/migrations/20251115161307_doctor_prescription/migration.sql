/*
  Warnings:

  - You are about to drop the column `followUpDate` on the `prescriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "prescriptions" DROP COLUMN "followUpDate",
ADD COLUMN     "followUpData" TEXT;
