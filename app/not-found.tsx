import { Masthead } from "@/components/SiteChrome";

export default function NotFound() {
  return (
    <Masthead
      kicker="Not found"
      tag="That page isn't on the board. Check the URL or head back to the ranked list."
      actionHref="/"
      actionLabel="Back to the board"
    />
  );
}
