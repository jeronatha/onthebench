import type Stripe from "stripe";
import { confirmedStripeEmail, OwnerEmailMismatchError } from "./email";
import { applyPayment, type ApplyPayload } from "./listings";

export function payloadFromSession(session: Stripe.Checkout.Session): ApplyPayload {
  const meta = session.metadata ?? {};
  const amount = session.amount_total ? session.amount_total / 100 : Number(meta.amount || 0);

  return {
    stripeId: session.id,
    amount,
    name: meta.name || "Listing",
    oneLine: meta.oneLine || "",
    link: meta.link || "",
    linkKey: meta.linkKey || "",
    iconUrl: meta.iconUrl || undefined,
    categorySlug: meta.categorySlug || "",
    contactEmail: meta.contactEmail || "",
    confirmedEmail: confirmedStripeEmail(session) ?? undefined,
    availableFrom: meta.availableFrom || new Date().toISOString().slice(0, 10),
    capacity: meta.capacity || "2-3",
  };
}

export async function applyFromStripeSession(session: Stripe.Checkout.Session) {
  try {
    return await applyPayment(payloadFromSession(session));
  } catch (error) {
    if (error instanceof OwnerEmailMismatchError) {
      console.error("Ownership check failed for Stripe session", session.id, error.message);
      return null;
    }
    throw error;
  }
}
