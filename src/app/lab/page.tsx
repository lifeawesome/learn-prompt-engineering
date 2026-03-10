"use client";

import Link from "next/link";
import { useState } from "react";
import { type LabScenario, labScenarios } from "@/data/lab-scenarios";

function checkSolution(code: string, scenario: LabScenario): boolean {
  const normalized = code.replace(/\s+/g, " ").trim();
  if (scenario.checkType === "regex") {
    return scenario.pattern.test(normalized);
  }
  return scenario.requiredSubstrings.every((sub) => code.includes(sub));
}

const COACH_SYSTEM_PROMPT = `You are an AI coding coach. Give concise, educational feedback. Include:
1) Confirm correctness (one sentence).
2) Why the fix works (conceptual explanation in 2-3 sentences).
3) Optional next-step challenge (one idea).
4) One alternate valid approach (one sentence).
Keep the total response under 150 words. Use clear, friendly language.`;

export default function LabPage() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const scenario = labScenarios[scenarioIndex];
  const [userCode, setUserCode] = useState(scenario.starterCode);
  const [checkResult, setCheckResult] = useState<{
    passed: boolean;
    message?: string;
  } | null>(null);
  const [coachFeedback, setCoachFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalChallenges = labScenarios.length;
  const currentChallenge = scenarioIndex + 1;
  const canGoNext = scenarioIndex < totalChallenges - 1;

  function resetForScenario(s: LabScenario) {
    setUserCode(s.starterCode);
    setCheckResult(null);
    setCoachFeedback(null);
    setShowHint(false);
    setError(null);
  }

  function handleTryAgain() {
    resetForScenario(scenario);
  }

  function handleNextChallenge() {
    if (!canGoNext) return;
    const next = labScenarios[scenarioIndex + 1];
    setScenarioIndex(scenarioIndex + 1);
    resetForScenario(next);
  }

  function handleShowHint() {
    setShowHint(true);
  }

  async function handleExplainConcept() {
    setError(null);
    setLoading(true);
    setCoachFeedback(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${COACH_SYSTEM_PROMPT}\n\nScenario: ${scenario.title}. The learner asked to explain the concept. Explain the key idea in 2-3 short paragraphs.`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setCoachFeedback(data.content ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    setError(null);
    const passed = checkSolution(userCode, scenario);
    setCheckResult({
      passed,
      message: passed
        ? "Correct!"
        : "Not quite. Check the instructions and try again.",
    });

    if (!passed) {
      setCoachFeedback(null);
      return;
    }

    setLoading(true);
    setCoachFeedback(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${COACH_SYSTEM_PROMPT}\n\nScenario: ${scenario.title}. The learner's solution was correct.\n\nLearner's code:\n\`\`\`\n${userCode}\n\`\`\`\n\nProvide the feedback (correctness, explanation, next step, alternate approach).`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setCoachFeedback(data.content ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Table of contents
        </Link>

        <header className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            AI Hands-On Lab Simulator
          </h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            A prototype exploring how AI can guide learners through technical
            troubleshooting tasks with adaptive feedback.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column — challenge */}
          <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-2 text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Challenge {currentChallenge}
            </h3>
            <p className="mb-4 text-zinc-800 dark:text-zinc-200">
              {scenario.brief}
            </p>
            <h4 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Instructions
            </h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              {scenario.instructions.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
            <div className="mt-4">
              <button
                type="button"
                onClick={handleShowHint}
                className="text-sm font-medium text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Show hint
              </button>
              {showHint && (
                <p className="mt-2 rounded border border-zinc-200 bg-zinc-50 p-2 text-sm text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {scenario.hint}
                </p>
              )}
            </div>
          </section>

          {/* Center — editor */}
          <section className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="border-b border-zinc-200 px-4 py-2 text-sm font-medium uppercase tracking-wider text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              Editor
            </h3>
            <textarea
              className="h-64 w-full resize-none bg-zinc-900 p-4 font-mono text-sm text-zinc-100 focus:outline-none dark:bg-zinc-900"
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder="Enter your fix..."
              spellCheck={false}
            />
            {checkResult && (
              <p
                className={`px-4 py-2 text-sm ${
                  checkResult.passed
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                }`}
              >
                {checkResult.message}
              </p>
            )}
          </section>

          {/* Right column — AI coach */}
          <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-2 text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              AI Coach
            </h3>
            {loading && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Thinking…
              </p>
            )}
            {coachFeedback && !loading && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  Feedback
                </h4>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {coachFeedback}
                </p>
                <h4 className="pt-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  Why this matters
                </h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {scenario.whyItMatters}
                </p>
              </div>
            )}
            {!coachFeedback && !loading && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Submit your fix to get feedback from the AI coach.
              </p>
            )}
          </section>
        </div>

        {error && (
          <p
            className="mt-4 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Bottom bar */}
        <footer className="mt-8 flex flex-wrap items-center gap-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            Challenge {currentChallenge} of {totalChallenges}
          </span>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Check solution
          </button>
          <button
            type="button"
            onClick={handleTryAgain}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={handleShowHint}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Show hint
          </button>
          <button
            type="button"
            onClick={handleExplainConcept}
            disabled={loading}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Explain concept
          </button>
          <button
            type="button"
            onClick={handleNextChallenge}
            disabled={!canGoNext}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800 disabled:dark:opacity-50"
          >
            Next challenge
          </button>
        </footer>
      </main>
    </div>
  );
}
