/*
  Warnings:

  - The `photo` column on the `Work` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId]` on the table `Work` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Work" DROP COLUMN "photo",
ADD COLUMN     "photo" TEXT[],
ALTER COLUMN "lat" DROP NOT NULL,
ALTER COLUMN "lng" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Work_userId_key" ON "Work"("userId");
