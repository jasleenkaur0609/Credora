import { prisma } from "../src/database/prisma.js";

async function testPrismaConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    console.log("Prisma database connection successful.");
  } catch (error) {
    console.error("Prisma database connection failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaConnection();