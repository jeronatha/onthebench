type Props = {
  name: string;
  iconUrl?: string | null;
  className?: string;
};

export function Avatar({ name, iconUrl, className = "avatar" }: Props) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  if (iconUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img className={className} src={iconUrl} alt="" />
    );
  }

  return (
    <span className={`${className} fallback avatar-fallback`} aria-hidden>
      {initials}
    </span>
  );
}
