import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  console.warn("DATABASE_URL not set — skipping seed check");
  process.exit(0);
}

const prisma = new PrismaClient({
  datasources: { db: { url } },
});

try {
  const count = await prisma.listing.count();
  if (count === 0) {
    console.log("Listing table empty — running seed…");
    execSync("npx tsx prisma/seed.ts", {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: url },
    });
  } else {
    console.log(`Listing table has ${count} rows — seed skipped`);
  }
} finally {
  await prisma.$disconnect();
}
