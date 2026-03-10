import type { NextRequest } from "next/server";

const DEFAULT_BASE_URL = "https://api.openai.com/v1";

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured." }, { status: 503 });
  }

  let body: { prompt?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    return Response.json(
      { error: "Missing or empty prompt." },
      { status: 400 },
    );
  }

  const baseUrl = (process.env.OPENAI_BASE_URL ?? DEFAULT_BASE_URL).replace(
    /\/$/,
    "",
  );
  const url = `${baseUrl}/chat/completions`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024,
      }),
    });

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string };
    };

    if (!res.ok) {
      const message = data?.error?.message ?? `API error (${res.status})`;
      return Response.json(
        { error: message },
        { status: res.status >= 500 ? 502 : 400 },
      );
    }

    const content = data?.choices?.[0]?.message?.content?.trim() ?? "";
    return Response.json({ content });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Something went wrong.";
    return Response.json({ error: message }, { status: 502 });
  }
}
