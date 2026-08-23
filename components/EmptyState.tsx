import Link from "next/link";

type Props = {
  title: string;
  children: React.ReactNode;
  action?: { href: string; label: string };
  variant?: "default" | "error";
};

export function EmptyState({ title, children, action, variant = "default" }: Props) {
  return (
    <div className={`empty-state${variant === "error" ? " empty-state-error" : ""}`}>
      <p className="empty-state-title">{title}</p>
      <p className="empty-state-body">{children}</p>
      {action ? (
        <Link className="btn empty-state-action" href={action.href}>
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
