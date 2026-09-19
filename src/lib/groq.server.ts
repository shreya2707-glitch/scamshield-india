/**
 * Change the model here — single source of truth.
 * Note: "llama-3.3-70b-versatile" is not available on this API key
 * (Groq returns model_not_found), so we use an available Groq model.
 */
export const GROQ_MODEL = "openai/gpt-oss-120b";

const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

export class GroqError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

export async function callGroq(opts: {
  system: string;
  user: string;
  json?: boolean;
}): Promise<string> {
  const apiKey = process.env["GROQ_API_KEY"];
  if (!apiKey) throw new GroqError("The AI service is not configured yet.", 503);

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.7,
      max_tokens: 2048,
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: opts.user },
      ],
      ...(opts.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    // Never log user content; only the upstream status.
    throw new GroqError(`The AI service is busy right now (${res.status}).`, 502);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content ?? "";
  if (!text.trim()) throw new GroqError("The AI service returned an empty response.", 502);
  return text;
}

export function parseJsonSafely<T>(raw: string): T {
  let s = raw.trim();
  if (s.startsWith("```")) s = s.replace(/^```[a-zA-Z]*\s*/, "").replace(/```\s*$/, "");
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start === -1 || end === -1) throw new GroqError("We couldn't read the AI response.", 502);
  try {
    return JSON.parse(s.slice(start, end + 1)) as T;
  } catch {
    throw new GroqError("We couldn't read the AI response.", 502);
  }
}
