/*
  Warnings:

  - A unique constraint covering the columns `[patientId]` on the table `health_records` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "health_records_patientId_key" ON "health_records"("patientId");
