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

function schemaIsCurrent() {
  try {
    const status = execSync("npx prisma migrate status", { encoding: "utf8", env });
    return status.includes("Database schema is up to date");
  } catch {
    return false;
  }
}

try {
  execSync("npx prisma migrate deploy", { stdio: "inherit", env });
} catch (error) {
  if (schemaIsCurrent()) {
    console.warn("migrate deploy failed but schema is current — continuing build");
  } else {
    throw error;
  }
}
