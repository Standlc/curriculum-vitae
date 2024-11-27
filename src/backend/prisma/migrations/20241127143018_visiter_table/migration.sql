/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DiscardedIpAddress` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Visit" ALTER COLUMN "visiterId" DROP DEFAULT;

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "DiscardedIpAddress";

-- CreateTable
CREATE TABLE "Visiter" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visiter_pkey" PRIMARY KEY ("id")
);

-- -- CreateMissingRecords
-- INSERT int "Visiter" DEFAULT VALUES 

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_visiterId_fkey" FOREIGN KEY ("visiterId") REFERENCES "Visiter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;