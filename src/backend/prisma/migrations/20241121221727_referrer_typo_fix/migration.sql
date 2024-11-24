/*
  Warnings:

  - You are about to drop the column `referer` on the `Visit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Visit" DROP COLUMN "referer",
ADD COLUMN     "referrer" TEXT DEFAULT '';
