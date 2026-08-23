# onthebench.lol

Public board of freelancers ranked by live payment value. Burns 10% a day. Built for Vercel.

## Stack

Next.js · Postgres (Neon or Vercel Postgres) · Prisma · Stripe Checkout

## Local

```bash
cp .env.example .env
# set DATABASE_URL to a Postgres URL
npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

To list without Stripe while developing:

```
ALLOW_FREE_LIST=1
```

## Vercel

1. Create a [Neon](https://neon.tech) or Vercel Postgres database.
2. Create a Stripe account. Use test keys first.
3. `vercel` then set env vars on the project:

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Postgres URL, available at **build** and runtime |
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` (or the `.lol` domain) |
| `STRIPE_SECRET_KEY` | `sk_live_…` or `sk_test_…` |
| `STRIPE_WEBHOOK_SECRET` | From the webhook endpoint below |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional, checkout is hosted by Stripe |
| `ALLOW_FREE_LIST` | Leave empty in production |

4. In Stripe, add a webhook:

```
https://your-domain/api/webhooks/stripe
```

Listen for `checkout.session.completed`.

5. Redeploy after env vars are set. `npm run build` runs `prisma migrate deploy` then `next build`.

6. Optional seed (once):

```bash
vercel env pull
npx prisma db seed
```

## Categories

Fixed list of 20, chosen for freelancers and small agencies:

Brand identity · Product design · Web design · Webflow · Framer · Shopify · React / Next.js · Landing pages · Technical SEO · Copywriting · Content & newsletters · AI agents · Automation · Video & motion · Illustration · iOS / Android · Backend & APIs · Data engineering · Paid ads & growth · Strategy / fractional

## Pages

```
/            live board
/c/[slug]    category board
/f/[handle]  profile (dofollow outbound link)
/list        create or top up
/rules       decay math
```
