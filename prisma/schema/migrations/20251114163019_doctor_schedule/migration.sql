-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'FAILED';

-- AlterTable
ALTER TABLE "doctor_schedules" ADD COLUMN     "bookedUntil" TIMESTAMP(3);
