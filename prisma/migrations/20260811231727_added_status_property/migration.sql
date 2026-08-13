/*
  Warnings:

  - Added the required column `status` to the `JobItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('SAVED', 'APPLIED', 'INTERVIEW', 'OFFERED', 'REJECTED', 'WITHDRAWN');

-- AlterTable
ALTER TABLE "JobItem" ADD COLUMN     "status" "Status" NOT NULL;
