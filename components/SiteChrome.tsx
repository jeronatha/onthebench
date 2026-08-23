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
      <span>Payments by Stripe</span>
      <Link href="/rules">Rules</Link>
      <Link href="/list">List</Link>
      <span style={{ marginLeft: "auto" }}>You&apos;re not ranked anymore only if: zéro</span>
    </footer>
  );
}
