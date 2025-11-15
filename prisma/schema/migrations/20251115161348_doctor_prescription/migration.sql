/*
  Warnings:

  - You are about to drop the column `followUpData` on the `prescriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "prescriptions" DROP COLUMN "followUpData",
ADD COLUMN     "followUpDate" TEXT;
