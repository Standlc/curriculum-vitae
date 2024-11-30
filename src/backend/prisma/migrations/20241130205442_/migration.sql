-- AlterTable
ALTER TABLE "Visitor" RENAME CONSTRAINT "Visiter_pkey" TO "Visitor_pkey";

-- RenameForeignKey
ALTER TABLE "Visit" RENAME CONSTRAINT "Visit_visiterId_fkey" TO "Visit_visitorId_fkey";
