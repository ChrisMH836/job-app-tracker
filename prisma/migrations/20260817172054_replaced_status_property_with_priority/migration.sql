/*
  Warnings:

  - You are about to drop the column `status` on the `JobItem` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('NONE', 'LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "JobItem" DROP COLUMN "status",
ADD COLUMN     "priority" "Priority";

-- DropEnum
DROP TYPE "Status";
