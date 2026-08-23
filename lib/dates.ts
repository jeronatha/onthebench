const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isAvailableNow(availableFrom: Date | string, now = new Date()): boolean {
  const from = typeof availableFrom === "string" ? new Date(availableFrom) : availableFrom;
  return startOfDay(from).getTime() <= startOfDay(now).getTime();
}

export function formatAvailable(availableFrom: Date | string, now = new Date()): string {
  if (isAvailableNow(availableFrom, now)) return "Available now";
  const from = typeof availableFrom === "string" ? new Date(availableFrom) : availableFrom;
  return `Available ${from.getDate()} ${MONTHS[from.getMonth()]}`;
}

export function formatCapacity(capacity: string): string {
  if (capacity === "1") return "1 day/wk";
  if (capacity === "2-3") return "2–3 days/wk";
  if (capacity === "4-5") return "4–5 days/wk";
  return capacity;
}

export function todayInputValue(now = new Date()): string {
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${m}-${d}`;
}
