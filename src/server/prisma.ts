import { PrismaClient } from "@prisma/client";

declare global {
  var Prisma: PrismaClient | undefined;
}
const db = global.Prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.Prisma = db;
}

export default db;
