import type { Metadata } from "next";
import { ListForm } from "@/components/ListForm";
import { Masthead } from "@/components/SiteChrome";
import { pageMetadata } from "@/lib/seo";
import { previewRank } from "@/lib/listings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "List yourself",
  description:
    "Pay to join the ranked board or top up your live value. Same website URL and email as your first listing.",
  path: "/list",
});

export default async function ListPage() {
  const rank = await previewRank(12).catch(() => 1);

  return (
    <>
      <Masthead
        kicker="List yourself"
        tag="Pay to sit higher on the ranked board. Same URL tops up your live value. Minimum $3."
        actionHref="/"
        actionLabel="Back to the board"
      />
      <ListForm initialRank={rank} />
    </>
  );
}
