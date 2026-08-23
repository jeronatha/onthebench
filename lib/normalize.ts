export function normalizeLink(input: string): string {
  let s = input.trim().toLowerCase();
  if (s.startsWith("@")) return "";

  s = s.replace(/^https?:\/\//, "");
  s = s.replace(/^www\./, "");
  s = s.replace(/\/+$/, "");
  s = s.split("#")[0] ?? s;
  const [path, query] = s.split("?");
  if (!query) return path ?? s;

  const host = (path ?? "").split("/")[0];
  if (host === "linkedin.com" || host.endsWith(".linkedin.com")) {
    return path ?? s;
  }
  return path ?? s;
}

/** Listings require a public website URL — not @handles or bare usernames. */
export function isValidListingUrl(input: string): boolean {
  const raw = input.trim();
  if (!raw || raw.startsWith("@")) return false;

  const key = normalizeLink(raw);
  if (!key || key.length < 4) return false;

  const host = (key.split("/")[0] ?? "").split(":")[0] ?? "";
  if (!host.includes(".")) return false;
  if (!/^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(host) && !/^[a-z0-9]+$/.test(host.split(".")[0] ?? "")) {
    return false;
  }

  return /^[a-z0-9./_-]+$/.test(key);
}

export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "listing"
  );
}

export function handleFromLink(linkKey: string): string {
  const key = linkKey.split("?")[0] ?? linkKey;

  try {
    const url = new URL(`https://${key}`);
    const host = url.hostname.replace(/^www\./, "");
    const parts = url.pathname.split("/").filter(Boolean);

    if (host === "linkedin.com" || host.endsWith(".linkedin.com")) {
      return slugify(parts[parts.length - 1] || "linkedin");
    }
    return slugify(host.split(".")[0] || host);
  } catch {
    return slugify(key);
  }
}

export function hrefFromLink(link: string): string {
  const trimmed = link.trim();
  if (!trimmed) return "#";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function displayLink(link: string): string {
  return normalizeLink(link) || link.trim();
}
