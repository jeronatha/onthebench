import { execSync } from "node:child_process";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!url) {
  console.warn("DATABASE_URL not set — skipping prisma migrate deploy");
  process.exit(0);
}

const env = {
  ...process.env,
  DATABASE_URL: url,
  DATABASE_URL_UNPOOLED: url,
};

let lastError;
for (let attempt = 1; attempt <= 3; attempt += 1) {
  try {
    execSync("npx prisma migrate deploy", { stdio: "inherit", env });
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.warn(`migrate deploy attempt ${attempt} failed, retrying…`);
  }
}

throw lastError;
