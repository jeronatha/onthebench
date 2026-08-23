# onthebench.lol — product spec & design

**One line:** A public board of freelancers ranked by what they've paid, where the payment burns down 10% a day — so the top of the board is always whoever is most actively looking for work right now.

**Status:** spec v1, written 2026-08-23. Name: `onthebench.lol`. Direction: **D — paper standby / gate list.** Canonical mockup: `doc/onthebench-mockup.html`. Build target: one weekend.

---

## 1. The name

**onthebench.lol**

Industry slang for *available* — not on a project, ready to be picked. Funny enough to be a `.lol`, clear enough that a client understands the board in one glance. The whole list is the bench. Paying sits you higher on it.

> **On the bench.** Ranked by what you've paid. Burns 10% a day, so the top is whoever's actually free.

**Do not call the free tier "the bench."** That word is now the product. Free listings are **open** (still live, not ranked).

**Backups, in order:** `billable.lol` (the decay metaphor is stronger; the availability metaphor is weaker), `freeagent.lol`, `hireme.lol`, `ratecard.lol`, `nextgig.lol`.

**Check before committing:** `designerbid.lol` and `toppl.lol` already exist in this wave, so the adjacent namespace is being taken fast. Register the same night you decide.

---

## 2. Why this isn't another clone

Three things separate it from the ~240 boards currently live.

**The payment means "available," not "best."** This is the whole trick. On a product board, paying to rank reads as confidence. On a talent board, paying to rank reads as *desperate* — and everyone scrolling knows it. Decay fixes the semantics: a high live value means someone paid *recently*, which means they have capacity *now*. That's the single hardest thing for a client to find out, and it's the reason every freelance directory rots — nobody prunes dead profiles. Decay prunes automatically.

**Categories are freelancer-declared.** Not a fixed taxonomy invented by the operator. A freelancer types what they do, and the board discovers its own shape. A category page goes live once three people claim it. This is the difference between a directory and a market.

**The published metric is inquiries, not clicks.** Every board in this wave reports clicks. A freelancer deciding whether to spend $20 does not care about impressions — they care whether anyone emailed. Nobody reports that. It makes renewals automatic, because the number is the proof.

**The honest risk:** the boards that worked did so because bidders and audience were the same people watching each other spend money on X. Freelancers are on X; most of their clients are not. Mitigation is in §9 — go narrow, target categories the indie-hacker crowd actively hires.

---

## 3. Core mechanics

### 3.1 Ranking

Rank is `live_value`, descending. Nothing else. No votes, no editorial, no algorithm.

### 3.2 Decay

```
live_value = last_value × 0.90 ^ (hours_since_last_payment / 24)
```

- **10% per day**, computed continuously — not a nightly cron. The number ticks down visibly on the page.
- Half-life ≈ **6.6 days**. A listing paid a week ago is worth half what it was.
- Faster than lastspot.lol's 5%/day, deliberately: availability is a sharper signal than product relevance and needs to go stale faster.

### 3.3 Top-ups

Paying again **adds to current live value** rather than replacing it:

```
new_value = live_value_now + payment_amount
```

**Identity key is the link — URL or @handle**, normalised (lowercase, strip protocol/`www.`/trailing slash, strip `@`). Entering a link that already exists tops up that listing instead of creating a duplicate. No login required to top up; the payment itself is the authorisation.

On the payment form, directly under the link field:

> **Already on the list?** Enter the same URL or @handle and up your bid. We'll add it to your current live value instead of starting you over.

Email stays on the record for editing the listing and routing inquiries, but it is not what matches a top-up. Matching on the link is what makes the flow one field and no password.

### 3.4 Floors and the open list

| Live value | State |
|---|---|
| ≥ $1.00 | **Ranked.** Appears on the paid board, in position order. |
| $0.50 – $0.99 | **Fading.** Still ranked, shown with a fade indicator. Prompt to top up. |
| < $0.50 | **Open.** Drops off the ranked board. Profile stays live forever, sorted by last activity. |

The open list matters more than it looks. A board with 12 paid listings looks dead; a board with 300 open profiles and 12 paid ones on top looks like a market. The open listing also carries a dofollow link — payment buys *position*, not the link. That's the SEO-safe structure, and it's the one thing keeping this out of Google's paid-link territory.

### 3.5 Entry

- Minimum payment: **$3**, whole dollars.
- No cap on the board size. (lastspot.lol's 100-slot cap creates scarcity for products; for a talent market, a bigger board is a *better* board — clients want selection.)
- Ties break in favour of the older listing.

### 3.6 What a payment buys

- Position on the board for as long as the value lasts
- One announcement post on the @onthebench X account
- A permanent profile page (open listings get this too)

---

## 4. The listing

Deliberately short. A freelancer should be listed in 90 seconds.

| Field | Required | Notes |
|---|---|---|
| Name | ✅ | Real name or studio name |
| One line | ✅ | Max 90 chars. What you do, plainly. |
| Category | ✅ | Free text with autocomplete — see §5 |
| Link | ✅ | Site, portfolio, or X profile |
| Contact | ✅ | Email or DM link. Routed, so inquiries are countable. |
| Available from | ✅ | Date picker. "Now" is a valid answer. |
| Capacity | ✅ | Days per week: 1 / 2–3 / 4–5 |
| Rate | ⬜ | Optional, and shown as a range. Optional on purpose — forcing it halves signups. |
| Location / timezone | ⬜ | Timezone only. No addresses. |

**Verification:** email confirmation. That's it. Anything heavier kills the funnel, and the payment is its own filter.

---

## 5. Categories

Freelancer-declared, self-organising.

- **Typing a category** offers autocomplete from existing ones. Picking an existing one is one tap; typing a new one is allowed.
- **A category page goes live at 3 listings.** Below that the tag shows on the profile but has no page. This is what stops the board fragmenting into 200 categories of one person each.
- **Each live category gets its own board** at `onthebench.lol/c/[slug]`, with its own #1. Someone can be #40 overall and #1 in *AI agent builders* — and #1 in a category is a screenshottable thing, which is the share loop.
- **Merging.** Operator can alias near-duplicates (`webflow` → `Webflow`, `react dev` → `React`). Manual for the first few months; it's five minutes a week.
- **Seed list** (pre-loaded for autocomplete, chosen for who *hires* them):
  AI agent builders · Webflow · Framer · React · Next.js · Technical SEO · Landing page design · Brand identity · iOS · Copywriting · Data engineering · Shopify · Video editing · Automation (n8n/Zapier)

---

## 6. Pages

```
/                     Live board. All categories, ranked by live value.
/c/[slug]             Category board. Same mechanic, scoped.
/f/[handle]           Profile page. Permanent. Dofollow outbound link.
/list                 Create or top up a listing.
/rules                Decay math, in full, with a worked example.
/stats                Public traffic + total inquiries routed. Radical honesty.
```

### 6.1 The board row

Each row carries, left to right. Rank is a **gate number**, not a hash.

```
GATE 07   ALEX MERCER                                     $4.20 ▓▓▓▓▓░░░░
          Ships production Next.js apps in two-week sprints.    burning
          AI agent builders · Available now · 4–5 days/wk       3 inquiries
```

The **burn bar** is the signature element. Everything else is quiet. #1 gets a filled navy gate and a faint red wash. Nothing else moves.

### 6.2 The profile page

Header, one line, category, availability, rate, contact button, and a small **payment history graph** — the sawtooth of top-ups and decay over time. That graph is a credibility artifact: a jagged line means someone who keeps showing up.

---

## 7. Design

**Locked: paper standby / gate list.** Canonical mockup: `doc/onthebench-mockup.html`.

The board is a paper standby list — cream cardstock, navy ticket stub, perforated edge, gate numbers. Rank is who boards next. Decay is time left. Availability is the whole aesthetic.

This is the closest direction to a "status board," which is where the `.lol` clones already live. The guard rail: **it stays paper.** Cream, navy, tan, one airline red. No LED, no split-flap, no dark background, no neon.

Airline language is **chrome, not vocabulary.** A STANDBY stamp and GATE 07 are visual. Product copy still says pay, top up, ranked, open. Do not call the free tier "standby." Do not say "now boarding" in emails, X posts, or `/rules`.

Rejected: A invoice (money-native, wrong name), B team sheet (name-native, costume risk), C classifieds (kept as the closest runner-up).

### 7.1 Colour

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F5F0E6` | Page background. Boarding-pass cream. |
| `--ink` / `--navy` | `#1B2A4A` | Text, ticket header, gate boxes, rules. |
| `--ink-soft` | `#5C6578` | Meta, stats, one-liners. |
| `--rule` | `#C9BFA8` | Hairlines, dashed dividers. |
| `--tan` | `#D4C4A0` | Ticket kicker, #1 gate caption. |
| `--red` | `#C8102E` | Burn bars, buttons, STANDBY stamp, "available now." The only warm colour. |
| `--track` | `#DDD4C2` | Burn-bar track. |

`--red` is the decay colour. `--navy` is the structure. Nothing else.

### 7.2 Type

| Role | Face | Notes |
|---|---|---|
| Display | **Bebas Neue** | Wordmark, gate numbers, form titles. Destination-board condensed. |
| Body | **IBM Plex Sans** | Names, one-liners, UI. |
| Data | **IBM Plex Mono** | Money, meta, stats, labels, inquiry counts. Tabular figures on, always. |

Scale: `11 / 14 / 16 / 18 / 32 / 64`. Gate numbers at 28 in Bebas. Money at 18 in mono. Everything else 14–16.

### 7.3 The signature: the burn bar

Every ranked row has a horizontal bar showing what fraction of the original payment remains. It depletes continuously — a `requestAnimationFrame` tick, not a page-refresh update — in `--red`. Sitting on the page for ten seconds, you watch value leave the board.

`prefers-reduced-motion` → the bar renders at its correct static width and updates on page load only.

### 7.4 Layout

```
┌────────────────────────────────────────────────────────┐
│ ████ TICKET (navy) ████████████████  [List yourself]  │
│ STANDBY · FINAL CALL                                   │
│ ON THE BENCH                                           │  ← perforated edge
├────────────────────────────────────────────────────────┤
│  Ranked 84   Open 311   Inquiries 127   10%/24h        │
├────────────────────────────────────────────────────────┤
│  All  │ AI agents │ Webflow │ React │ SEO │ +          │
├────────────────────────────────────────────────────────┤
│ GATE 01  NAME           one line           $22 ▓▓▓▓▓▓ │  ← navy gate + red wash
│          category · available · capacity    4 inquiries│
├────────────────────────────────────────────────────────┤
│ GATE 02  NAME           one line           $14 ▓▓▓▓░░ │
├────────────────────────────────────────────────────────┤
│ ...                                                     │
├────────────────────────────────────────────────────────┤
│  OPEN LISTINGS — free, most recent first                │
│  name · category · available    name · category ·  ...  │
└────────────────────────────────────────────────────────┘
```

Single column, max-width 880px. Mobile: the burn bar moves under the one-liner; capacity and category stay on one line.

The listing form is a bordered navy card with a red **STANDBY** stamp on the top-right edge.

### 7.5 Copy rules

- Sentence case everywhere. No exclamation marks.
- Never say "bid." Say **pay** and **top up**. Exception: the top-up prompt in §3.3 uses "up your bid" for people arriving from outbid.lol.
- Empty category page: *"Nobody's claimed this category yet. Three listings and it gets its own board."*
- Open state: *"Your listing dropped below $0.50 and left the ranked board. It's still live and still linked — top up to rank again."* No apology, no guilt.
- Payment confirmation: *"You're #6. It'll burn 10% a day from here."*
- Footer lockup: *"Gate closes at $0.50."*

---

## 8. Data model

```sql
listing
  id, handle, name, one_line, link, contact_email,
  category_slug, available_from, capacity, rate_low, rate_high, timezone,
  last_value        decimal   -- value at moment of last payment
  last_paid_at      timestamp
  created_at, verified_at

payment
  id, listing_id, amount, stripe_id, value_before, value_after, created_at

inquiry
  id, listing_id, created_at, source   -- routed contact clicks, counted not stored

category
  slug, label, listing_count, is_live  -- is_live flips at 3
```

`live_value` is **never stored** — always computed from `last_value` and `last_paid_at` at read time. One formula, one source of truth, no cron job to drift out of sync.

---

## 9. Cold start

The hard part. In order:

1. **Seed 40 real freelancers before launch, free.** DM people whose work you already know. A board that opens with 40 names is a product; an empty board with a payment button is a dead page. Do not skip this.
2. **Launch into three categories, not fourteen.** Pick the ones the X/indie-hacker crowd actually hires this month: AI agent builders, Framer/Webflow, technical SEO. Let the rest arrive on their own.
3. **List onthebench.lol on the boards themselves.** outbid.lol, lastspot.lol, biddirectory.lol. That's where the attention currently is, it costs $5–20, and it's on-brand: a board buying rank on a board.
4. **Give the first 20 paid listings a free top-up match.** Cheap, and it gets the board to a value distribution that looks alive.
5. **Post the /stats page from day one.** Total inquiries routed, publicly, updated live. That number is the entire pitch to freelancer #100.

---

## 10. Unit economics

Rough, deliberately conservative:

| | Listings ranked | Avg top-up | Cadence | Weekly revenue |
|---|---|---|---|---|
| Bad | 20 | $6 | every 10 days | ~$85 |
| Base | 80 | $9 | weekly | ~$720 |
| Good | 250 | $12 | weekly | ~$3,000 |

Costs: domain ~$1 first year, Stripe ~3%, hosting ~$0 at this scale. Break-even is roughly listing #2.

This will not do $125k in 48 hours. It shouldn't try to. The product-launch boards spike because the mechanic is novel; a freelance board earns slowly because it solves a problem that still exists in November. Decay is what turns one-time payments into a subscription nobody has to remember to renew.

---

## 11. Build scope

**Weekend one — ship this and nothing else:**

- Board (all categories), sorted by computed live value
- Listing form + Stripe checkout + top-up on the same **link** (not email — see §3.3)
- Decay formula, burn bars, ranked / fading / open
- Profile pages, dofollow links
- `/rules` with the worked example

**Week two, in priority order:**

- Category pages at the 3-listing threshold
- Routed contact links + inquiry counting
- `/stats`
- Auto-post to X on each new #1
- Payment history sawtooth on profiles

**Stack:** Next.js + Postgres + Stripe Checkout + Resend. No auth system — magic-link on email for editing a listing. Resist every feature that isn't on this list.

---

## 12. Risks, honestly

| Risk | Severity | Mitigation |
|---|---|---|
| Freelancer clients aren't on X, so no viral loop | **High** | Narrow categories where the client *is* the X crowd. Accept slow growth; decay makes slow growth compound. |
| Board reads as "desperate people" anyway | Medium | Copy discipline (§7) plus the availability framing. Watch the first 50 signups for this and be ready to reposition around "available now" harder. |
| Sports reading of "bench" = second-string | Medium | Freelance slang wins in copy. Never contrast "starting" vs "benched." The whole list is available. |
| Standby look collapses into generic status-board / LED clone | Medium | Stay paper. No dark ground, no split-flap, no neon. Airline words are chrome only (§7). |
| The whole .lol wave dies in three weeks | Medium | Fine — the domain is cheap and the mechanic isn't tied to the trend. Rename to a .com later if the TLD becomes a liability. |
| Google treats it as a paid-link scheme | Low | Open listings carry the dofollow; payment only moves position. Structurally the safest model in this wave. |
| Someone clones it in an evening | High, unavoidable | Everyone clones everything here. The moat is the seeded freelancers and the inquiry data, neither of which copies. |

---

## 13. The one-sentence test

If a freelancer can't explain the product to another freelancer in one sentence, it's wrong. The sentence is:

> *Pay a few dollars to sit higher on the bench. It burns 10% a day, so the top is whoever's actually free.*
