import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckTab } from "@/components/CheckTab";
import { TrainTab } from "@/components/TrainTab";
import { dictionaries, LANGUAGES, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ScamShield — Spot scam messages in India" },
      {
        name: "description",
        content:
          "Paste a suspicious SMS, WhatsApp or email and get a plain-language risk check, plus practice rounds against a pretend scammer.",
      },
      { property: "og:title", content: "ScamShield — Spot scam messages in India" },
      {
        property: "og:description",
        content:
          "Check suspicious messages for scams and practise resisting them. English, Hindi and Marathi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6 text-primary" fill="currentColor">
      <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Zm-1 13.4-3.2-3.2 1.4-1.4 1.8 1.8 4-4 1.4 1.4-5.4 5.4Z" />
    </svg>
  );
}

function Index() {
  const [lang, setLang] = useState<Lang>("en");
  const [tab, setTab] = useState<"check" | "train">("check");
  const t = dictionaries[lang];

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <ShieldIcon />
            <div>
              <p className="text-lg font-bold tracking-tight text-foreground">{t.brand}</p>
              <p className="hidden text-xs text-muted-foreground sm:block">{t.tagline}</p>
            </div>
          </div>
          <div>
            <label htmlFor="lang" className="sr-only">
              {t.languageLabel}
            </label>
            <select
              id="lang"
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 pb-3">
          <div role="tablist" aria-label={t.brand} className="flex gap-1 rounded-xl bg-secondary p-1">
            {(
              [
                ["check", t.tabCheck],
                ["train", t.tabTrain],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  tab === id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        {tab === "check" ? <CheckTab t={t} lang={lang} /> : <TrainTab t={t} lang={lang} />}
      </main>

      <footer className="border-t border-border bg-secondary/50">
        <p className="mx-auto max-w-3xl px-4 py-5 text-center text-xs leading-relaxed text-muted-foreground">
          {t.disclaimer}
        </p>
      </footer>
    </div>
  );
}
