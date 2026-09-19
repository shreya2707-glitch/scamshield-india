import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { trainTurn, type ChatMessage, type ScoreResult } from "@/lib/scamshield.functions";
import { MAX_TEXT, MAX_USER_TURNS, type Dict, type Lang } from "@/lib/i18n";

type Stage = "pick" | "chat" | "scoring" | "result";

export function TrainTab({ t, lang }: { t: Dict; lang: Lang }) {
  const train = useServerFn(trainTurn);
  const [stage, setStage] = useState<Stage>("pick");
  const [scenarioId, setScenarioId] = useState<string>("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<ScoreResult | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const scenarios = [
    { id: "bank-kyc", title: t.scenarioKyc, desc: t.scenarioKycDesc, diff: t.easy },
    { id: "job-offer", title: t.scenarioJob, desc: t.scenarioJobDesc, diff: t.medium },
    { id: "digital-arrest", title: t.scenarioArrest, desc: t.scenarioArrestDesc, diff: t.hard },
  ];

  const userTurns = history.filter((m) => m.role === "user").length;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, busy]);

  async function start(id: string) {
    setScenarioId(id);
    setHistory([]);
    setScore(null);
    setError(null);
    setStage("chat");
    setBusy(true);
    try {
      const res = (await train({ data: { scenarioId: id, history: [], language: lang, mode: "chat" } })) as {
        reply: string;
      };
      setHistory([{ role: "assistant", content: res.reply }]);
    } catch {
      setError(t.errorBody);
    } finally {
      setBusy(false);
    }
  }

  async function send() {
    const content = input.trim();
    if (!content || busy) return;
    const next: ChatMessage[] = [...history, { role: "user", content }];
    setHistory(next);
    setInput("");
    setBusy(true);
    setError(null);
    try {
      const res = (await train({
        data: { scenarioId, history: next.slice(-20), language: lang, mode: "chat" },
      })) as { reply: string };
      const withReply: ChatMessage[] = [...next, { role: "assistant", content: res.reply }];
      setHistory(withReply);
      if (next.filter((m) => m.role === "user").length >= MAX_USER_TURNS) {
        void finish(withReply);
      }
    } catch {
      setError(t.errorBody);
    } finally {
      setBusy(false);
    }
  }

  async function finish(hist: ChatMessage[] = history) {
    setStage("scoring");
    setError(null);
    try {
      const res = (await train({
        data: { scenarioId, history: hist.slice(-20), language: lang, mode: "score" },
      })) as ScoreResult;
      setScore(res);
      setStage("result");
    } catch {
      setError(t.errorBody);
      setStage("chat");
    }
  }

  if (stage === "pick") {
    return (
      <div className="space-y-5">
        <section className="space-y-1">
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">{t.trainTitle}</h1>
          <p className="text-sm text-muted-foreground">{t.trainHelp}</p>
        </section>
        <div className="grid gap-3 sm:grid-cols-3">
          {scenarios.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => start(s.id)}
              className="rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="inline-block rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
                {t.difficulty}: {s.diff}
              </span>
              <h2 className="mt-2 font-semibold text-foreground">{s.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              <span className="mt-3 inline-block text-sm font-medium text-primary">
                {t.startScenario} →
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (stage === "result" && score) {
    const circumference = 2 * Math.PI * 52;
    return (
      <div className="space-y-5">
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">{t.resultsTitle}</h1>
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-5 shadow-sm">
          <svg viewBox="0 0 120 120" className="h-32 w-32" role="img" aria-label={`${score.score} / 100`}>
            <circle cx="60" cy="60" r="52" className="fill-none stroke-secondary" strokeWidth="12" />
            <circle
              cx="60"
              cy="60"
              r="52"
              className="fill-none stroke-primary"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - score.score / 100)}
              transform="rotate(-90 60 60)"
            />
            <text
              x="60"
              y="68"
              textAnchor="middle"
              className="fill-foreground text-2xl font-bold"
              style={{ fontSize: "26px" }}
            >
              {score.score}
            </text>
          </svg>
          {score.verdict && (
            <p className="mt-3 text-center text-base text-foreground">{score.verdict}</p>
          )}
        </div>

        <ListCard title={t.caught} items={score.flags_spotted} tone="low" />
        <ListCard title={t.missed} items={score.flags_missed} tone="high" />
        <ListCard title={t.tips} items={score.tips} tone="neutral" />

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => start(scenarioId)}
            className="flex-1 rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {t.playAgain}
          </button>
          <button
            type="button"
            onClick={() => setStage("pick")}
            className="flex-1 rounded-xl border border-border bg-background px-4 py-3 font-semibold text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t.anotherScenario}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setStage("pick")}
          className="rounded-lg px-2 py-1 text-sm font-medium text-primary hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          ← {t.back}
        </button>
        <span className="text-xs text-muted-foreground">
          {t.turnsLeft(Math.max(0, MAX_USER_TURNS - userTurns))}
        </span>
      </div>

      <p className="rounded-xl bg-risk-medium-soft px-3 py-2 text-xs font-medium text-risk-medium">
        {t.simulationBanner}
      </p>

      <div
        className="min-h-64 space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
        aria-live="polite"
      >
        {history.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <p
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {m.content}
            </p>
          </div>
        ))}
        {(busy || stage === "scoring") && (
          <p className="text-xs italic text-muted-foreground">
            {stage === "scoring" ? t.scoring : t.thinking}
          </p>
        )}
        <div ref={endRef} />
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <label htmlFor="reply" className="sr-only">
          {t.chatPlaceholder}
        </label>
        <input
          id="reply"
          value={input}
          maxLength={MAX_TEXT}
          disabled={stage === "scoring"}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void send();
          }}
          placeholder={t.chatPlaceholder}
          className="flex-1 rounded-xl border border-input bg-background px-3 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={busy || !input.trim() || stage === "scoring"}
          className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {t.send}
        </button>
      </div>

      <button
        type="button"
        onClick={() => void finish()}
        disabled={stage === "scoring" || userTurns === 0}
        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {t.endRound}
      </button>
    </div>
  );
}

function ListCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "low" | "high" | "neutral";
}) {
  if (items.length === 0) return null;
  const dot =
    tone === "low" ? "text-risk-low" : tone === "high" ? "text-risk-high" : "text-primary";
  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      <ul className="mt-2 space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm text-foreground">
            <span aria-hidden className={`mt-0.5 ${dot}`}>
              •
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
