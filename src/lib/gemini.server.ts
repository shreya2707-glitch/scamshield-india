/** Change the model here — single source of truth. */
export const GEMINI_MODEL = "gemini-2.0-flash";

const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

export type GeminiPart = { text: string } | { inlineData: { mimeType: string; data: string } };

export class GeminiError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

export async function callGemini(opts: {
  system: string;
  parts: GeminiPart[];
  json?: boolean;
}): Promise<string> {
  const apiKey = process.env["GEMINI_API_KEY"];
  if (!apiKey) throw new GeminiError("The AI service is not configured yet.", 503);

  const res = await fetch(`${ENDPOINT}/${GEMINI_MODEL}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: opts.system }] },
      contents: [{ role: "user", parts: opts.parts }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        ...(opts.json ? { responseMimeType: "application/json" } : {}),
      },
    }),
  });

  if (!res.ok) {
    // Never log user content; only the upstream status.
    throw new GeminiError(`The AI service is busy right now (${res.status}).`, 502);
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  if (!text.trim()) throw new GeminiError("The AI service returned an empty response.", 502);
  return text;
}

export function parseJsonSafely<T>(raw: string): T {
  let s = raw.trim();
  if (s.startsWith("```")) s = s.replace(/^```[a-zA-Z]*\s*/, "").replace(/```\s*$/, "");
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start === -1 || end === -1) throw new GeminiError("We couldn't read the AI response.", 502);
  try {
    return JSON.parse(s.slice(start, end + 1)) as T;
  } catch {
    throw new GeminiError("We couldn't read the AI response.", 502);
  }
}
