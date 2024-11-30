/*
  Warnings:

  - You are about to drop the column `visiterId` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the `Visiter` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `visitorId` to the `Visit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Visit" RENAME COLUMN "visiterId" TO "visitorId";

ALTER TABLE "Visiter" RENAME TO "Visitor";

-- CreateTable
CREATE TABLE "BlackListedVisitor" (
    "visitorId" TEXT NOT NULL,

    CONSTRAINT "BlackListedVisitor_pkey" PRIMARY KEY ("visitorId")
);

-- AddForeignKey
ALTER TABLE "BlackListedVisitor" ADD CONSTRAINT "BlackListedVisitor_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
