import { execSync } from "node:child_process";

if (process.env.DATABASE_URL) {
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
} else {
  console.warn("DATABASE_URL not set — skipping prisma migrate deploy");
}
