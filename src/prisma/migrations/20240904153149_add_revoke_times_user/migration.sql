/*
  Warnings:

  - You are about to drop the `code_revoked` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `codes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "code_revoked" DROP CONSTRAINT "code_revoked_codeId_fkey";

-- DropForeignKey
ALTER TABLE "code_revoked" DROP CONSTRAINT "code_revoked_userId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "timesRevoked" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "code_revoked";

-- DropTable
DROP TABLE "codes";
