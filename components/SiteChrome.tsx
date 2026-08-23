import Link from "next/link";

type Props = {
  kicker?: string;
  title?: string;
  tag?: string;
  actionHref?: string;
  actionLabel?: string;
  children?: React.ReactNode;
};

export function Masthead({
  kicker = "Standby · final call",
  title = "ON THE BENCH",
  tag = "Freelancers and agencies, ranked by live value. Burns 10% a day — the top is whoever's actually free.",
  actionHref = "/list",
  actionLabel = "List yourself",
  children,
}: Props) {
  return (
    <header className="mast">
      <div className="ticket anim-ticket">
        <div className="top-row">
          <div>
            <div className="kicker anim-kicker">{kicker}</div>
            <h1 className="wordmark anim-wordmark">
              <Link href="/">{title}</Link>
            </h1>
            <p className="tag anim-tag">{tag}</p>
          </div>
          <Link className="btn anim-btn" href={actionHref}>
            {actionLabel}
          </Link>
        </div>
      </div>
      {children}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site">
      <div className="site-row">
        <span>Payments by Stripe</span>
        <Link href="/rules">Rules</Link>
        <Link href="/list">List</Link>
        <span className="site-row-end">You&apos;re not ranked anymore only if: zéro</span>
      </div>
      <p className="site-note">
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
    </footer>
  );
}
