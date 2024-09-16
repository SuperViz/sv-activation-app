/*
  Warnings:

  - The values [NEWSLETTER] on the enum `ActivationTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActivationTypes_new" AS ENUM ('GAME', 'DISCORD', 'GITHUB', 'HACKATHON');
ALTER TABLE "activations" ALTER COLUMN "name" TYPE "ActivationTypes_new" USING ("name"::text::"ActivationTypes_new");
ALTER TYPE "ActivationTypes" RENAME TO "ActivationTypes_old";
ALTER TYPE "ActivationTypes_new" RENAME TO "ActivationTypes";
DROP TYPE "ActivationTypes_old";
COMMIT;
