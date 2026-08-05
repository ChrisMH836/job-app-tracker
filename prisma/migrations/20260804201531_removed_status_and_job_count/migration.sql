/*
  Warnings:

  - You are about to drop the column `status` on the `JobItem` table. All the data in the column will be lost.
  - Added the required column `salary` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Made the column `title` on table `Offer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "JobItem" DROP COLUMN "status",
ADD COLUMN     "maxSalary" INTEGER,
ADD COLUMN     "minSalary" INTEGER;

-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "salary" INTEGER NOT NULL,
ALTER COLUMN "title" SET NOT NULL;

-- DropEnum
DROP TYPE "JobStatus";
