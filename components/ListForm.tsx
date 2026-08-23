"use client";

import { useMemo, useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { MIN_PAYMENT } from "@/lib/decay";
import { todayInputValue } from "@/lib/dates";

type Lookup = {
  exists: true;
  name: string;
  handle: string;
  maskedEmail: string;
  liveValue: number;
  gate: number | null;
};

type Props = {
  initialRank?: number;
};

export function ListForm({ initialRank = 1 }: Props) {
  const [amount, setAmount] = useState(12);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [rank, setRank] = useState(initialRank);
  const [match, setMatch] = useState<Lookup | null>(null);

  const today = useMemo(() => todayInputValue(), []);

  async function refreshRank(nextAmount: number) {
    try {
      const res = await fetch(`/api/preview?amount=${nextAmount}`);
      const data = (await res.json()) as { rank?: number };
      if (data.rank) setRank(data.rank);
    } catch {
      /* keep last rank */
    }
  }

  async function lookupLink(link: string) {
    if (link.trim().length < 2) {
      setMatch(null);
      return;
    }
    try {
      const res = await fetch(`/api/lookup?link=${encodeURIComponent(link)}`);
      const data = (await res.json()) as Lookup | { exists?: false };
      setMatch(data.exists ? data : null);
      setEmailError(null);
    } catch {
      setMatch(null);
    }
  }

  async function verifyEmail(link: string, contactEmail: string) {
    if (!match || !contactEmail.trim()) {
      setEmailError(null);
      return true;
    }
    try {
      const res = await fetch("/api/verify-owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link, contactEmail }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        reason?: string;
        maskedEmail?: string;
      };
      if (data.ok) {
        setEmailError(null);
        return true;
      }
      if (data.reason === "mismatch" && data.maskedEmail) {
        setEmailError(`That email does not match this listing. Use ${data.maskedEmail}.`);
        return false;
      }
      setEmailError("Could not verify ownership. Try again.");
      return false;
    } catch {
      return true;
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());
    const link = String(body.link ?? "");
    const contactEmail = String(body.contactEmail ?? "");

    const ownerOk = await verifyEmail(link, contactEmail);
    if (!ownerOk) {
      setPending(false);
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error || "Could not start checkout.");
        setPending(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Try again.");
      setPending(false);
    }
  }

  return (
    <form className="form" id="list" onSubmit={onSubmit}>
      <h2>Get on the list</h2>

      <div className="field">
        <label htmlFor="name">Display name</label>
        <input id="name" name="name" required maxLength={80} placeholder="Alex Mercer" />
      </div>

      <div className="field">
        <label htmlFor="link">Website URL</label>
        <input
          id="link"
          name="link"
          required
          maxLength={200}
          inputMode="url"
          autoComplete="url"
          placeholder="yoursite.com or https://yoursite.com"
          onBlur={(e) => lookupLink(e.target.value)}
        />
        {match ? (
          <p className="notice">
            <b>{match.name}</b> is already listed
            {match.gate ? ` at gate ${String(match.gate).padStart(2, "0")}` : ""}. To top up, use the
            same URL and enter <b>{match.maskedEmail}</b>. A different email cannot touch this
            listing. Live value is ${match.liveValue.toFixed(2)}.
          </p>
        ) : (
          <p className="hint">
            <b>Already listed?</b> Same website URL and the email you used before. That&apos;s how we
            know it&apos;s you — no password.
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="iconUrl">Icon URL — optional</label>
        <input
          id="iconUrl"
          name="iconUrl"
          type="url"
          maxLength={400}
          placeholder="https://…/avatar.png"
        />
      </div>

      <div className="field">
        <label htmlFor="oneLine">Short description</label>
        <textarea
          id="oneLine"
          name="oneLine"
          required
          maxLength={90}
          placeholder="What you do, plainly. 90 characters."
        />
      </div>

      <div className="field">
        <label htmlFor="categorySlug">Category</label>
        <select id="categorySlug" name="categorySlug" required defaultValue="">
          <option value="" disabled>
            Choose one
          </option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid-2">
        <div className="field">
          <label htmlFor="contactEmail">Contact email</label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            required
            placeholder={match ? match.maskedEmail : "you@studio.com"}
            onBlur={async (e) => {
              const link = (document.getElementById("link") as HTMLInputElement | null)?.value ?? "";
              await verifyEmail(link, e.target.value);
            }}
          />
          {emailError ? <p className="err">{emailError}</p> : null}
          {match && !emailError ? (
            <p className="hint">
              Must match {match.maskedEmail}. We never show the full address.
            </p>
          ) : null}
        </div>
        <div className="field">
          <label htmlFor="availableFrom">Available from</label>
          <input id="availableFrom" name="availableFrom" type="date" required defaultValue={today} />
        </div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label htmlFor="capacity">Capacity</label>
          <select id="capacity" name="capacity" required defaultValue="2-3">
            <option value="1">1 day / week</option>
            <option value="2-3">2–3 days / week</option>
            <option value="4-5">4–5 days / week</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="amount">Amount, whole dollars</label>
          <input
            id="amount"
            name="amount"
            type="number"
            min={MIN_PAYMENT}
            step={1}
            required
            value={amount}
            onChange={(e) => {
              const v = Math.max(0, Math.round(Number(e.target.value) || 0));
              setAmount(v);
              refreshRank(v);
            }}
          />
        </div>
      </div>

      {error ? <p className="err">{error}</p> : null}

      <div className="form-foot">
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "Redirecting…" : `Pay $${amount || MIN_PAYMENT} →`}
        </button>
        <span className="pos">
          Gate <b>#{rank}</b> at this amount. Live value burns 10% a day from payment.
        </span>
      </div>
    </form>
  );
}
