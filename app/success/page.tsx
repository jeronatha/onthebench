import Link from "next/link";
import { redirect } from "next/navigation";
import { Masthead } from "@/components/SiteChrome";
import { PaymentConfetti } from "@/components/PaymentConfetti";
import { applyFromStripeSession } from "@/lib/apply-session";
import { liveValue } from "@/lib/decay";
import { fetchBoard, gateForListingId } from "@/lib/listings";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  if (!session_id) redirect("/list");

  const session = await getStripe().checkout.sessions.retrieve(session_id);
  if (session.payment_status !== "paid" && session.status !== "complete") {
    redirect("/list");
  }

  const result = await applyFromStripeSession(session);
  if (!result) {
    return (
      <>
        <Masthead
          kicker="Payment received"
          tag="We could not match this payment to your listing email."
          actionHref="/list"
          actionLabel="Try again"
        />
        <main className="prose anim-main">
          <p>
            Your payment went through, but the email used at checkout did not match the listing on
            file. Contact us with your Stripe receipt and we will sort it out.
          </p>
          <p>
            <Link href="/">Back to the board</Link>
          </p>
        </main>
      </>
    );
  }

  const { ranked } = await fetchBoard();
  const current = liveValue(Number(result.listing.lastValue), result.listing.lastPaidAt);
  const gate = gateForListingId(result.listing.id, ranked);
  const position = gate ?? ranked.length + 1;
  const gateLabel = String(position).padStart(2, "0");

  return (
    <>
      <PaymentConfetti />
      <Masthead
        kicker={result.toppedUp ? "Top-up accepted" : "Payment accepted"}
        tag={`#${gateLabel} on the board. Live value burns 10% a day from here.`}
        actionHref={`/f/${result.listing.handle}`}
        actionLabel="Your profile"
      />
      <main className="success-panel anim-main">
        <div className="success-gate">
          <span className="gate">GATE</span>
          {gateLabel}
        </div>
        <p className="success-lede">
          {result.toppedUp ? (
            <>
              <b>{result.listing.name}</b> topped up. Live value is now{" "}
              <code>${current.toFixed(2)}</code>.
            </>
          ) : (
            <>
              <b>{result.listing.name}</b> is on the ranked board. Live value starts at{" "}
              <code>${current.toFixed(2)}</code>.
            </>
          )}
        </p>
        <p className="success-note">You&apos;re not ranked anymore only if: zéro.</p>
        <div className="profile-actions">
          <Link className="btn" href={`/f/${result.listing.handle}`}>
            View profile
          </Link>
          <Link className="btn btn-ghost" href="/" style={{ color: "var(--navy)", borderColor: "var(--navy)" }}>
            Back to the board
          </Link>
        </div>
      </main>
    </>
  );
}
