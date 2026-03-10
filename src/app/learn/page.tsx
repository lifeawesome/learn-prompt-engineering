"use client";

import Link from "next/link";
import { useState } from "react";

const ROLE_PREFIX =
  "You are a patient instructor teaching a beginner. Answer in simple, clear terms: ";

function improvePrompt(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return ROLE_PREFIX + trimmed;
}

export default function LearnPage() {
  const [userPrompt, setUserPrompt] = useState("");
  const [improvedPrompt, setImprovedPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const trimmed = userPrompt.trim();
    if (!trimmed) {
      setError("Please enter a question.");
      return;
    }
    setError(null);
    const improved = improvePrompt(trimmed);
    setImprovedPrompt(improved);
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: improved }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setResponse(data.content ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <Link
          href="/"
          className="mb-8 inline-block text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Table of contents
        </Link>

        {/* Hero */}
        <header className="mb-12 text-center">
          <span className="rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
            3 min
          </span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Learn Prompt Engineering in 3 Minutes
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            A small experiment exploring how generative AI can power interactive
            technical learning experiences.
          </p>
        </header>

        {/* Step 1 — Concept */}
        <section className="mb-12" aria-labelledby="step1-heading">
          <h2
            id="step1-heading"
            className="mb-2 text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
          >
            1 — Concept
          </h2>
          <h3 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Prompt Engineering Pattern: The Role Prompt
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Instead of asking:
          </p>
          <pre className="mb-6 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-3 font-mono text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            <code>Explain Docker.</code>
          </pre>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">Try:</p>
          <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-3 font-mono text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
            <code>
              You are a DevOps instructor teaching a beginner. Explain Docker in
              simple terms.
            </code>
          </pre>
        </section>

        {/* Step 2 — Playground */}
        <section className="mb-12" aria-labelledby="step2-heading">
          <h2
            id="step2-heading"
            className="mb-2 text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
          >
            2 — Playground
          </h2>
          <label
            htmlFor="user-prompt"
            className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Ask the AI a question
          </label>
          <textarea
            id="user-prompt"
            className="mb-4 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 font-sans text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/20 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400"
            rows={3}
            placeholder="e.g. What is a container?"
            value={userPrompt}
            onChange={(e) => {
              setUserPrompt(e.target.value);
              setError(null);
            }}
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loading ? "Asking…" : "Improve & ask"}
          </button>
          {error && (
            <p
              className="mt-3 text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {error}
            </p>
          )}
          {improvedPrompt && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Improved prompt sent to the AI:
              </p>
              <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-3 font-mono text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                <code>{improvedPrompt}</code>
              </pre>
            </div>
          )}
        </section>

        {/* Step 3 — AI response */}
        <section aria-labelledby="step3-heading">
          <h2
            id="step3-heading"
            className="mb-2 text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
          >
            3 — Response
          </h2>
          {loading && (
            <p className="text-zinc-500 dark:text-zinc-400">
              Waiting for the AI…
            </p>
          )}
          {response !== null && !loading && (
            <>
              <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                <p className="whitespace-pre-wrap font-sans text-base leading-relaxed">
                  {response}
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-medium text-zinc-900 dark:text-zinc-50">
                  Why this worked
                </h4>
                <ul className="list-inside list-disc space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                  <li>Role prompting provides context</li>
                  <li>Clear instructions improve output</li>
                  <li>Structured prompts reduce ambiguity</li>
                </ul>
              </div>
            </>
          )}
          {!loading && response === null && !improvedPrompt && (
            <p className="text-zinc-500 dark:text-zinc-400">
              Submit a question above to see the AI response here.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
