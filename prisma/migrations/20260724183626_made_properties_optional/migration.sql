/*
  Warnings:

  - Made the column `status` on table `JobItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "JobItem" ALTER COLUMN "company" DROP NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'SAVED';
