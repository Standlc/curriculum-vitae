/*
  Warnings:

  - The primary key for the `Device` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `deviceType` on the `Visit` table. All the data in the column will be lost.
  - Added the required column `id` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Visit" DROP CONSTRAINT "Visit_deviceType_fkey";

-- AlterTable
ALTER TABLE "Device" DROP CONSTRAINT "Device_pkey",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Device_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Visit" DROP COLUMN "deviceType",
ADD COLUMN     "deviceId" INTEGER;

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;
