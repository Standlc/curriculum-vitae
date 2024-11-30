-- AlterTable
ALTER TABLE "Visit" ADD COLUMN     "deviceType" TEXT,
ALTER COLUMN "referrer" DROP DEFAULT,
ALTER COLUMN "userAgent" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Device" (
    "type" TEXT NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("type")
);

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_deviceType_fkey" FOREIGN KEY ("deviceType") REFERENCES "Device"("type") ON DELETE SET NULL ON UPDATE CASCADE;
