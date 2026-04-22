import Link from "next/link";

export const metadata = {
  title: "Privacy - Align on the Line AI Ethics Polling",
  description: "Privacy notice for Align on the Line AI Ethics Polling app",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-gray-700">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="py-8">
        <article className="max-w-3xl mx-auto p-6 prose prose-gray">
          <h1 className="text-3xl font-bold mb-2">Privacy Notice</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: April 22, 2026</p>

          <p className="mb-6 text-gray-700">
            Align on the Line is an anonymous polling tool for AI ethics presentations. We&apos;ve
            tried to collect as little as possible. This note explains exactly what we do and
            don&apos;t store.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-3">What we collect</h2>
          <p className="text-gray-700 mb-3">
            <strong>When you vote, we store:</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>Your rating (1–5) for the question</li>
            <li>The question and session you voted on</li>
            <li>A timestamp</li>
            <li>
              A random device ID generated in your browser&apos;s local storage (e.g.,{" "}
              <code className="text-sm bg-gray-100 px-1 rounded">device_1713800000_a8f3k2p</code>).
              This is <em>not</em> browser fingerprinting — it&apos;s a random string we create once
              and reuse, solely to prevent the same device from voting twice on the same question.
              It is not linked to your identity and does not follow you across other websites.
            </li>
          </ul>
          <p className="text-gray-700 mb-3">
            <strong>When a presenter creates a session, we store:</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>A session ID and timestamp</li>
            <li>The text of each question the presenter types in</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-3">What we do not collect</h2>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>No names, emails, phone numbers, or accounts</li>
            <li>
              No IP addresses in our database (IPs are briefly used in memory for rate limiting,
              then discarded)
            </li>
            <li>No device, browser, or location fingerprinting</li>
            <li>
              No third-party analytics, trackers, or advertising cookies (no Google Analytics, no
              Meta Pixel, no Mixpanel, etc.)
            </li>
            <li>No cross-session or cross-site tracking</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-3">How your data is used</h2>
          <p className="text-gray-700 mb-3">Vote data is used only to:</p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>Show live results to the presenter and audience during the session</li>
            <li>Generate session summaries and aggregate charts</li>
            <li>Prevent duplicate votes from the same device</li>
          </ul>
          <p className="text-gray-700 mb-4">
            We do not sell, share, or transfer data to third parties for marketing.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-3">Where your data lives</h2>
          <p className="text-gray-700 mb-4">
            Data is stored in Supabase (Postgres database) on infrastructure hosted in the United
            States. The app itself runs on Vercel. Votes and session data are visible to anyone who
            has the session link — treat sessions as public.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-3">Your choices</h2>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>
              Clearing your browser data (local storage for app.graidients.ai) removes your device
              ID. You may then be able to vote again on a previously voted question.
            </li>
            <li>
              You can vote without providing any personal information — that&apos;s the default.
            </li>
            <li>To request deletion of a specific session&apos;s data, contact us (below).</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-3">Security</h2>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>All traffic is encrypted via HTTPS</li>
            <li>Rate limiting protects against abuse</li>
            <li>Input is sanitized to prevent common web vulnerabilities</li>
            <li>Questions cannot be edited after creation, preserving vote integrity</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-3">A note for presenters</h2>
          <p className="text-gray-700 mb-4">
            Anything you type as a question is stored and visible to anyone with the session link.
            Please don&apos;t include personal information, confidential material, or identifying
            details about individuals in your question text.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-3">Changes to this notice</h2>
          <p className="text-gray-700 mb-4">
            We may update this notice as the app evolves. Material changes will be reflected by
            updating the date above.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-3">Contact</h2>
          <p className="text-gray-700 mb-4">
            Questions or data requests:{" "}
            <a href="mailto:beck@becktench.com" className="text-blue-600 hover:underline">
              beck@becktench.com
            </a>
          </p>
        </article>
      </main>
    </div>
  );
}
