import { cache } from "react";
import { prisma } from "./db";

export const getListingByHandle = cache(async (handle: string) => {
  return prisma.listing.findUnique({ where: { handle } });
});
