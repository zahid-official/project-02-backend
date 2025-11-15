/*
  Warnings:

  - The `followUpDate` column on the `prescriptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "prescriptions" DROP COLUMN "followUpDate",
ADD COLUMN     "followUpDate" TIMESTAMP(3);
