-- CreateTable
CREATE TABLE "codes" (
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "codes_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "code_revoked" (
    "userId" TEXT NOT NULL,
    "codeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "code_revoked_pkey" PRIMARY KEY ("userId","codeId")
);

-- AddForeignKey
ALTER TABLE "code_revoked" ADD CONSTRAINT "code_revoked_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_revoked" ADD CONSTRAINT "code_revoked_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "codes"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
