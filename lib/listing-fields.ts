import { z } from "zod";
import { MIN_PAYMENT } from "./decay";
import { isCategorySlug } from "./categories";
import { isValidListingUrl } from "./normalize";

export const CAPACITIES = ["1", "2-3", "4-5"] as const;

export const listingInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  oneLine: z.string().trim().min(1, "Description is required").max(90),
  link: z
    .string()
    .trim()
    .min(4, "Website URL is required")
    .max(200)
    .refine(isValidListingUrl, "Enter a public website URL (e.g. yoursite.com)"),
  iconUrl: z
    .string()
    .trim()
    .max(400)
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => !v || /^https?:\/\//i.test(v), "Icon must be an http URL"),
  categorySlug: z.string().refine(isCategorySlug, "Pick a category"),
  contactEmail: z.string().trim().email("Valid email required"),
  availableFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"),
  capacity: z.enum(CAPACITIES),
  amount: z.coerce.number().int().min(MIN_PAYMENT, `Minimum is $${MIN_PAYMENT}`),
});

export type ListingInput = z.infer<typeof listingInputSchema>;
