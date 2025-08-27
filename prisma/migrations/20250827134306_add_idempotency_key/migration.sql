/*
  Warnings:

  - A unique constraint covering the columns `[idempotency_key]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idempotency_key` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."bookings" ADD COLUMN     "idempotency_key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bookings_idempotency_key_key" ON "public"."bookings"("idempotency_key");
