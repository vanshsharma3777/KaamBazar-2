/*
  Warnings:

  - Added the required column `age` to the `MyWorker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MyVendor" ADD COLUMN     "age" INTEGER;

-- AlterTable
ALTER TABLE "MyWorker" ADD COLUMN     "age" INTEGER NOT NULL;
