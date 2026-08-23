import { PrismaClient } from "@prisma/client";

if (process.env.CLEAR_LISTINGS !== "1") {
  process.exit(0);
}

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const prisma = new PrismaClient({ datasources: { db: { url } } });

try {
  const payments = await prisma.payment.deleteMany();
  const listings = await prisma.listing.deleteMany();
  console.log(`Cleared ${payments.count} payments and ${listings.count} listings`);
} finally {
  await prisma.$disconnect();
}
