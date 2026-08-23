import { execSync } from "node:child_process";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (url) {
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: url },
  });
} else {
  console.warn("DATABASE_URL not set — skipping prisma migrate deploy");
}
