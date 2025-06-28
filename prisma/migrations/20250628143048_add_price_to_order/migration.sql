/*
  Warnings:

  - Added the required column `subtotal` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `OrderProducts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "subtotal" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "OrderProducts" ADD COLUMN     "price" DECIMAL(65,30) NOT NULL;
