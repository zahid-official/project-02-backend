/*
  Warnings:

  - You are about to drop the column `bookedUntil` on the `doctor_schedules` table. All the data in the column will be lost.
  - You are about to drop the column `followUpData` on the `prescriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctor_schedules" DROP COLUMN "bookedUntil";

-- AlterTable
ALTER TABLE "prescriptions" DROP COLUMN "followUpData",
ADD COLUMN     "followUpDate" TIMESTAMP(3);
