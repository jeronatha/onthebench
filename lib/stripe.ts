import Stripe from "stripe";
import { SITE_DOMAIN } from "./site";

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key);
}

export function paymentsConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function allowFreeList(): boolean {
  return process.env.ALLOW_FREE_LIST === "1";
}

export function siteUrl(): string {
  const fallback =
    process.env.NODE_ENV === "production" ? `https://${SITE_DOMAIN}` : "http://localhost:3000";
  return (process.env.NEXT_PUBLIC_SITE_URL || fallback).replace(/\/$/, "");
}
