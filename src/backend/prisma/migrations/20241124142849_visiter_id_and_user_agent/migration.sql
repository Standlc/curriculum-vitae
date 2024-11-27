-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "userAgent" TEXT DEFAULT '',
ADD COLUMN     "visiterId" TEXT NOT NULL DEFAULT '';
