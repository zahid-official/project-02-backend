/*
  Warnings:

  - You are about to drop the column `birthDate` on the `health_records` table. All the data in the column will be lost.
  - Added the required column `dateOfBirth` to the `health_records` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "health_records" DROP COLUMN "birthDate",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL;
