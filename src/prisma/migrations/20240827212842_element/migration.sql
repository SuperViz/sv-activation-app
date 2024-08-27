-- CreateTable
CREATE TABLE "elements" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "elementA" TEXT NOT NULL,
    "elementB" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "elements_pkey" PRIMARY KEY ("id")
);
