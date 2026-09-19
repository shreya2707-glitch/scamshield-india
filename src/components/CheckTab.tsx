import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { analyzeMessage, type AnalyzeResult } from "@/lib/scamshield.functions";
import { EXAMPLES, MAX_TEXT, type Dict, type Lang } from "@/lib/i18n";

export function CheckTab({ t, lang }: { t: Dict; lang: Lang }) {
  const analyze = useServerFn(analyzeMessage);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = text.trim().length > 0 && !loading;

  async function submit() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await analyze({ data: { text: text.trim(), language: lang } });
      setResult(res);
    } catch {
      setError(t.errorBody);
    } finally {
      setLoading(false);
    }
  }

  const examples: [string, string][] = [
    [t.exampleKyc, EXAMPLES[lang].kyc],
    [t.exampleJob, EXAMPLES[lang].job],
    [t.exampleParcel, EXAMPLES[lang].parcel],
  ];

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">{t.checkTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.checkHelp}</p>
      </section>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <label htmlFor="message" className="block text-sm font-medium text-foreground">
          {t.messageLabel}
        </label>
        <textarea
          id="message"
          value={text}
          maxLength={MAX_TEXT}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.messagePlaceholder}
          rows={7}
          className="mt-2 w-full resize-y rounded-xl border border-input bg-background p-3 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p className="mt-1 text-right text-xs text-muted-foreground">
          {t.charCount(text.length, MAX_TEXT)}
        </p>

        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={t.tryExample}>
          <span className="self-center text-xs text-muted-foreground">{t.tryExample}:</span>
          {examples.map(([label, sample]) => (
            <button
              key={label}
              type="button"
              onClick={() => setText(sample.slice(0, MAX_TEXT))}
              className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {label}
            </button>
          ))}
        </div>


        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-40"
        >
          {loading ? t.checking : t.checkNow}
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4" role="alert">
          <h2 className="font-semibold text-foreground">{t.errorTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <button
            type="button"
            onClick={submit}
            className="mt-3 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t.retry}
          </button>
        </div>
      )}

      {result && <ResultCard t={t} result={result} />}
    </div>
  );
}

function ResultCard({ t, result }: { t: Dict; result: AnalyzeResult }) {
  const styles: Record<string, string> = {
    low: "bg-risk-low-soft text-risk-low border-risk-low/30",
    medium: "bg-risk-medium-soft text-risk-medium border-risk-medium/30",
    high: "bg-risk-high-soft text-risk-high border-risk-high/30",
  };
  const label =
    result.risk_level === "low" ? t.riskLow : result.risk_level === "medium" ? t.riskMedium : t.riskHigh;

  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className={`rounded-xl border p-4 ${styles[result.risk_level]}`}>
        <p className="text-lg font-bold sm:text-xl">{label}</p>
        <p className="mt-0.5 text-sm font-medium opacity-90">{result.scam_type}</p>
      </div>

      {result.summary && <p className="text-base leading-relaxed text-foreground">{result.summary}</p>}

      {result.red_flags.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t.redFlags}
          </h3>
          <ul className="mt-2 space-y-2">
            {result.red_flags.map((f, i) => (
              <li key={i} className="flex gap-2 text-sm text-foreground">
                <span aria-hidden className="mt-0.5 text-risk-high">
                  ✓
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {result.what_to_do.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {t.whatToDo}
          </h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-foreground">
            {result.what_to_do.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ol>
        </section>
      )}

      <section className="rounded-xl bg-secondary p-4">
        <h3 className="text-sm font-semibold text-foreground">{t.reportIt}</h3>
        <ul className="mt-2 space-y-1 text-sm">
          <li>
            <a
              href="tel:1930"
              className="font-medium text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t.reportHelpline}
            </a>
          </li>
          <li>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium text-primary underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t.reportPortal}
            </a>
          </li>
        </ul>
      </section>

      {result.confidence_note && (
        <p className="text-xs italic text-muted-foreground">{result.confidence_note}</p>
      )}
    </div>
  );
}
