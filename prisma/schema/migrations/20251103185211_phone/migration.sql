/*
  Warnings:

  - You are about to drop the column `contactNumber` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `contactNumber` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `contactNumber` on the `patients` table. All the data in the column will be lost.
  - Added the required column `phone` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "contactNumber",
ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "contactNumber",
ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "contactNumber",
ADD COLUMN     "phone" TEXT NOT NULL;
