import type { Metadata } from "next";
import { Masthead } from "@/components/SiteChrome";
import { FADING_HINT, MIN_PAYMENT, ZERO_EPSILON } from "@/lib/decay";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Rules",
  description:
    "How ranking, decay, top-ups, and ownership work on onthebench.lol. Live value burns 10% a day. You leave the ranked board only at zéro.",
  path: "/rules",
});

export default function RulesPage() {
  return (
    <>
      <Masthead
        kicker="The rules"
        tag="Rank is live value. Burns 10% a day. You leave the ranked board only at zéro."
        actionHref="/list"
        actionLabel="List yourself"
      />

      <article className="prose rules anim-prose">
        <p className="rules-lede">
          OnTheBench is a public board of freelancers and small agencies. There is no editorial
          pick, no votes, and no algorithm. You pay to sit higher. Live value decays 10% every 24
          hours, so the top is whoever paid most recently — which, on a talent board, reads as
          available now.
        </p>

        <div className="rules-callout">
          <span className="rules-callout-label">The one rule that matters</span>
          <p>
            You stay on the ranked board at any live value above zero. Below $
            {FADING_HINT.toFixed(2)} the row fades — you are still ranked. You leave the ranked
            board only at <strong>zéro</strong>.
          </p>
        </div>

        <h2>How ranking works</h2>
        <ul>
          <li>
            Rank is <code>live_value</code>, descending. Nothing else. Exact ties favor the older
            successful payment.
          </li>
          <li>
            There is no cap on board size. Unlike product boards with fixed slots, a talent board
            benefits from selection — every listing with live value above zero ranks.
          </li>
          <li>
            Payments use whole US dollars. Minimum is ${MIN_PAYMENT} for a new listing or top-up.
          </li>
          <li>
            A listing&apos;s live value compounds down continuously by 10% every 24 hours. There is
            no floor above zero — value keeps approaching $0.00 until you top up.
          </li>
          <li>
            Top-ups add to the value remaining at payment time. For example, a $6 top-up on a $4.20
            live value becomes $10.20, and decay continues from $10.20.
          </li>
          <li>
            Ranking compares exact live values before display rounding. To move to #1 immediately,
            your combined live value after payment must be strictly above #1&apos;s live value.
          </li>
          <li>
            At ${ZERO_EPSILON.toFixed(2)} or below, the listing moves to the open list. It stays
            live, still linked, still on your profile. Payment buys position, not the URL.
          </li>
        </ul>

        <h2>Decay</h2>
        <p>Computed continuously from the moment of the last successful payment:</p>
        <div className="example">
          live_value = last_value × 0.90 ^ (hours_since_last_payment / 24)
        </div>
        <p>
          Half-life is about 6.6 days. A $12 listing paid a week ago is worth roughly half. The
          number on the board ticks down while you watch.
        </p>

        <h2>A worked example</h2>
        <div className="example">
          You pay $12 at noon on Monday.
          <br />
          Tuesday noon: $12 × 0.90 = $10.80
          <br />
          Wednesday noon: $10.80 × 0.90 = $9.72
          <br />
          After 7 days: $12 × 0.90^7 ≈ $5.74
          <br />
          <br />
          You top up $6 when live value is $5.74.
          <br />
          New live value = $5.74 + $6 = $11.74. Decay restarts from there.
          <br />
          <br />
          If you never top up again, the value keeps burning toward $0.00. Only at zéro do you leave
          the ranked board.
        </div>

        <h2>Checkout</h2>
        <p>
          The board can change while you are in Stripe Checkout. After Stripe confirms payment, we
          recalculate any existing live value, add the payment, and write the listing. If metadata
          is missing or the session cannot be applied, contact us with your receipt — we do not keep
          rank without a recorded payment.
        </p>
        <p>
          If you are topping up an existing listing, the payment always adds to your current live
          value at confirmation time. New listings always enter the ranked board when payment
          succeeds.
        </p>

        <h2>Listings and URLs</h2>
        <ul>
          <li>
            Submit one public website URL — portfolio, agency site, or LinkedIn profile page. Must be
            reachable over HTTP or HTTPS. @handles and bare usernames are not accepted.
          </li>
          <li>
            <b>Identity is the URL.</b> The same canonical website URL has one listing. Any later
            payment tops up its current live value instead of creating a duplicate.
          </li>
          <li>
            Tracking query strings and fragments are stripped on match. Path segments required for
            profile pages (e.g. LinkedIn) are preserved. OnTheBench may add its own attribution
            parameter on outbound clicks.
          </li>
          <li>
            Optional icon URL must be a direct image link you control. We do not host uploads.
          </li>
          <li>
            Chat and invite links are not allowed — Telegram, WhatsApp, Discord, Signal, and
            similar. The board is for people and studios, not group chats.
          </li>
          <li>
            Illegal, deceptive, phishing, malware, explicit sexual, or abusive listings are
            prohibited.
          </li>
        </ul>

        <h2>Categories</h2>
        <p>
          Pick one category at checkout. Category pages list everyone in that niche, sorted the same
          way — by live value. Someone can be #40 overall and #1 in a category.
        </p>

        <h2>Edits and ownership</h2>
        <ul>
          <li>
            <b>Identity is the URL.</b> One website URL per listing. Email is the lock — no
            password, no account.
          </li>
          <li>
            To top up, enter the same URL and the same contact email you used on the first payment.
            We check before checkout and again against the email Stripe collects at payment.
          </li>
          <li>
            A different email cannot add value to someone else&apos;s listing, even if they know the
            URL.
          </li>
          <li>
            Top-ups only add live value and refresh availability. They cannot change your name,
            description, URL, icon, or category. Those are set on first listing.
          </li>
          <li>
            Your public profile is at <code>/f/your-handle</code>. The handle is set on first
            payment and does not change when you top up.
          </li>
          <li>
            Lost access to the email on file? Contact us with proof of ownership. We do not hand
            listings over on a form request alone.
          </li>
        </ul>

        <h2>Moderation</h2>
        <p>
          We may remove listings that violate these rules or create a safety risk. Policy-violating
          listings are not guaranteed a refund. Refunds, partial refunds, reversals, and disputes
          remove their corresponding ranking contribution.
        </p>

        <h2>What payment does not include</h2>
        <p>
          Payment purchases placement on this board under these rules. It does not guarantee
          impressions, traffic, clicks, inquiries, engagements, hires, revenue, return on spend,
          rank duration, or permanent placement. No ownership interest, cash, or financial return is
          offered.
        </p>

        <p className="rules-note">
          Inspired by the clarity of{" "}
          <a href="https://outbid.lol/rules" rel="noopener noreferrer">
            outbid.lol
          </a>{" "}
          and{" "}
          <a href="https://lastspot.lol/rules" rel="noopener noreferrer">
            lastspot.lol
          </a>
          . Different product — availability, not products — but the rules should be this explicit.
        </p>
      </article>
    </>
  );
}
