import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <p className="mb-10 text-center text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          A small experiment exploring how generative AI can power interactive
          technical learning experiences.
        </p>

        <h2 className="mb-6 text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Table of contents
        </h2>
        <ul className="space-y-4">
          <li>
            <Link
              href="/learn"
              className="block rounded-lg border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/80"
            >
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                Learn Prompt Engineering in 3 Minutes
              </span>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Use the Role Prompt pattern to get better answers from AI.
              </p>
            </Link>
          </li>
          <li>
            <Link
              href="/lab"
              className="block rounded-lg border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/80"
            >
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                AI Hands-On Lab Simulator
              </span>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Fix broken code and get adaptive AI feedback.
              </p>
            </Link>
          </li>
        </ul>
      </main>
    </div>
  );
}
