import Link from "next/link";
import { redirect } from "next/navigation";
import { Masthead } from "@/components/SiteChrome";
import { applyFromStripeSession } from "@/lib/apply-session";
import { liveValue } from "@/lib/decay";
import { fetchBoard } from "@/lib/listings";
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
        <main className="prose">
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
  const gate = ranked.findIndex((l) => l.id === result.listing.id) + 1;
  const position = gate > 0 ? gate : ranked.length + 1;

  return (
    <>
      <Masthead
        kicker="You're on the list"
        tag={`Gate ${String(position).padStart(2, "0")}. Live value burns 10% a day from here.`}
        actionHref={`/f/${result.listing.handle}`}
        actionLabel="Your profile"
      />
      <main className="prose">
        <p>
          Live value is <code>${current.toFixed(2)}</code>
          {result.toppedUp ? " after the top-up." : "."} You&apos;re not ranked anymore only if: zéro.
        </p>
        <p>
          <Link href="/">Back to the board</Link>
        </p>
      </main>
    </>
  );
}
