import { PrismaClient } from "@prisma/client";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  console.error("Set DATABASE_URL or DATABASE_URL_UNPOOLED");
  process.exit(1);
}

const prisma = new PrismaClient({ datasources: { db: { url } } });

try {
  const payments = await prisma.payment.deleteMany();
  const listings = await prisma.listing.deleteMany();
  console.log(`Deleted ${payments.count} payments and ${listings.count} listings`);
} finally {
  await prisma.$disconnect();
}
