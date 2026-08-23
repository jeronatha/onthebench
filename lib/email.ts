import type Stripe from "stripe";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function emailsMatch(a: string, b: string): boolean {
  return normalizeEmail(a) === normalizeEmail(b);
}

export function maskEmail(email: string): string {
  const [user, domain] = normalizeEmail(email).split("@");
  if (!user || !domain) return "the email on the listing";
  const head = user.slice(0, 1);
  return `${head}***@${domain}`;
}

/** Email Stripe collected at checkout — stronger than form metadata alone. */
export function confirmedStripeEmail(session: Stripe.Checkout.Session): string | null {
  const email =
    session.customer_details?.email ?? session.customer_email ?? session.metadata?.contactEmail ?? null;
  return email ? normalizeEmail(email) : null;
}

export function assertListingOwner(
  listingEmail: string,
  formEmail: string,
  paidEmail?: string | null,
): void {
  if (!emailsMatch(listingEmail, formEmail)) {
    throw new OwnerEmailMismatchError();
  }
  if (paidEmail && !emailsMatch(listingEmail, paidEmail)) {
    throw new OwnerEmailMismatchError(
      "Checkout email does not match this listing. Use the same address you used the first time.",
    );
  }
}

export class OwnerEmailMismatchError extends Error {
  constructor(message = "This link is already listed. Use the email on that listing to top up.") {
    super(message);
    this.name = "OwnerEmailMismatchError";
  }
}
