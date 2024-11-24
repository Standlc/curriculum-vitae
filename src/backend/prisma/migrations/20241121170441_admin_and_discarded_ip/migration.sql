-- CreateTable
CREATE TABLE "DiscardedIpAddress" (
    "ip" TEXT NOT NULL,

    CONSTRAINT "DiscardedIpAddress_pkey" PRIMARY KEY ("ip")
);

-- CreateTable
CREATE TABLE "Admin" (
    "ip" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("ip")
);
