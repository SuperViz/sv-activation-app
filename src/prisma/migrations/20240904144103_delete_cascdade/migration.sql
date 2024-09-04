-- DropForeignKey
ALTER TABLE "activations" DROP CONSTRAINT "activations_userId_fkey";

-- DropForeignKey
ALTER TABLE "code_revoked" DROP CONSTRAINT "code_revoked_codeId_fkey";

-- DropForeignKey
ALTER TABLE "code_revoked" DROP CONSTRAINT "code_revoked_userId_fkey";

-- AddForeignKey
ALTER TABLE "activations" ADD CONSTRAINT "activations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_revoked" ADD CONSTRAINT "code_revoked_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_revoked" ADD CONSTRAINT "code_revoked_codeId_fkey" FOREIGN KEY ("codeId") REFERENCES "codes"("code") ON DELETE CASCADE ON UPDATE CASCADE;
