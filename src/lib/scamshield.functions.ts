import { createServerFn } from "@tanstack/react-start";

const MAX_TEXT = 2000;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_HISTORY = 20;

export type RiskLevel = "low" | "medium" | "high";

export type AnalyzeResult = {
  risk_level: RiskLevel;
  scam_type: string;
  summary: string;
  red_flags: string[];
  what_to_do: string[];
  confidence_note: string;
};

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type ScoreResult = {
  score: number;
  verdict: string;
  flags_spotted: string[];
  flags_missed: string[];
  tips: string[];
};

class InputError extends Error {}

function asLang(v: unknown): string {
  return v === "hi" || v === "mr" ? (v as string) : "en";
}

function strArray(v: unknown, fallback: string[] = []): string[] {
  return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 10) : fallback;
}

export const analyzeMessage = createServerFn({ method: "POST" })
  .inputValidator((input: { text?: string; imageBase64?: string; language?: string }) => {
    const text = typeof input?.text === "string" ? input.text.trim() : "";
    const imageBase64 = typeof input?.imageBase64 === "string" ? input.imageBase64 : "";
    if (text.length > MAX_TEXT) throw new InputError(`Please keep the message under ${MAX_TEXT} characters.`);
    if (imageBase64) {
      const bytes = Math.floor((imageBase64.split(",").pop() ?? "").length * 0.75);
      if (bytes > MAX_IMAGE_BYTES) throw new InputError("Please use an image smaller than 4 MB.");
    }
    if (!text && !imageBase64) throw new InputError("Please add a message or a screenshot.");
    return { text, imageBase64, language: asLang(input?.language) };
  })
  .handler(async ({ data }): Promise<AnalyzeResult> => {
    const { callGemini, parseJsonSafely, type GeminiPart } = await import("./gemini.server");
    const { ANALYZE_SYSTEM_PROMPT, languageInstruction } = await import("./prompts.server");

    const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
    parts.push({
      text:
        `${languageInstruction(data.language)}\n\n` +
        "<<<UNTRUSTED_USER_CONTENT_START>>>\n" +
        (data.text || "(no text provided; see attached screenshot)") +
        "\n<<<UNTRUSTED_USER_CONTENT_END>>>",
    });

    if (data.imageBase64) {
      const [meta, payload] = data.imageBase64.split(",");
      const mimeType = /image\/(png|jpeg|jpg)/.exec(meta ?? "")?.[0] ?? "image/png";
      if (payload) parts.push({ inlineData: { mimeType, data: payload } });
    }

    const raw = await callGemini({ system: ANALYZE_SYSTEM_PROMPT, parts, json: true });
    const parsed = parseJsonSafely<Partial<AnalyzeResult>>(raw);
    const level = parsed.risk_level;
    return {
      risk_level: level === "low" || level === "medium" || level === "high" ? level : "medium",
      scam_type: typeof parsed.scam_type === "string" ? parsed.scam_type : "Unclear",
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      red_flags: strArray(parsed.red_flags),
      what_to_do: strArray(parsed.what_to_do),
      confidence_note: typeof parsed.confidence_note === "string" ? parsed.confidence_note : "",
    };
  });

export const trainTurn = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      scenarioId?: string;
      history?: ChatMessage[];
      language?: string;
      mode?: "chat" | "score";
    }) => {
      const scenarioId = typeof input?.scenarioId === "string" ? input.scenarioId : "";
      if (!["bank-kyc", "job-offer", "digital-arrest"].includes(scenarioId))
        throw new InputError("Please pick a valid scenario.");
      const history = Array.isArray(input?.history) ? input.history : [];
      if (history.length > MAX_HISTORY)
        throw new InputError("This round is too long. Please start a new one.");
      for (const m of history) {
        if (typeof m?.content !== "string" || m.content.length > MAX_TEXT)
          throw new InputError(`Please keep each reply under ${MAX_TEXT} characters.`);
      }
      return {
        scenarioId,
        history: history.map((m) => ({
          role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
          content: m.content,
        })),
        language: asLang(input?.language),
        mode: input?.mode === "score" ? ("score" as const) : ("chat" as const),
      };
    },
  )
  .handler(async ({ data }): Promise<{ reply: string } | ScoreResult> => {
    const { callGemini, parseJsonSafely } = await import("./gemini.server");
    const {
      TRAIN_CHAT_SYSTEM_PROMPT,
      TRAIN_SCORE_SYSTEM_PROMPT,
      SCENARIO_PROMPTS,
      languageInstruction,
    } = await import("./prompts.server");

    const transcript = data.history
      .map((m) => `${m.role === "user" ? "TRAINEE" : "SCAMMER"}: ${m.content}`)
      .join("\n");

    if (data.mode === "score") {
      const raw = await callGemini({
        system: `${TRAIN_SCORE_SYSTEM_PROMPT}\n\n${languageInstruction(data.language)}`,
        parts: [
          {
            text:
              `Scenario: ${SCENARIO_PROMPTS[data.scenarioId] ?? data.scenarioId}\n\n` +
              "<<<UNTRUSTED_TRANSCRIPT_START>>>\n" +
              (transcript || "(no replies)") +
              "\n<<<UNTRUSTED_TRANSCRIPT_END>>>",
          },
        ],
        json: true,
      });
      const p = parseJsonSafely<Partial<ScoreResult>>(raw);
      const n = typeof p.score === "number" ? Math.max(0, Math.min(100, Math.round(p.score))) : 0;
      return {
        score: n,
        verdict: typeof p.verdict === "string" ? p.verdict : "",
        flags_spotted: strArray(p.flags_spotted),
        flags_missed: strArray(p.flags_missed),
        tips: strArray(p.tips),
      };
    }

    const reply = await callGemini({
      system:
        `${TRAIN_CHAT_SYSTEM_PROMPT}\n\nScenario: ${SCENARIO_PROMPTS[data.scenarioId] ?? ""}\n\n` +
        languageInstruction(data.language),
      parts: [
        {
          text:
            "<<<UNTRUSTED_TRANSCRIPT_START>>>\n" +
            (transcript || "(the conversation is starting; send your opening line)") +
            "\n<<<UNTRUSTED_TRANSCRIPT_END>>>",
        },
      ],
    });
    return { reply: reply.trim() };
  });
