import Link from "next/link";

export const metadata = {
  title: "Privacy - Align on the Line AI Ethics Polling",
  description: "Privacy notice for Align on the Line AI Ethics Polling app",
};

export default function PrivacyPage() {
  return (
    <div className="flex-1 bg-gray-50">
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
            Align on the Line is anonymous. You don&apos;t sign in, we don&apos;t know who you are,
            and nothing here tracks you across the web. Here&apos;s exactly what we save to make the
            app work.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-3">What we collect</h2>
          <p className="text-gray-700 mb-3">
            <strong>What we save when you vote</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>The rating (1–5)</li>
            <li>The question you voted on</li>
            <li>The time you voted</li>
            <li>
              A random ID stored in your browser (like{" "}
              <code className="text-sm bg-gray-100 px-1 rounded">device_1713800000_a8f3k2p</code>)so
              the same device can&apos;t vote twice on the same question. It isn&apos;t tied to your
              identity and doesn&apos;t follow you to other sites.
            </li>
          </ul>
          <p className="text-gray-700 mb-3">
            <strong>What we save when a teacher creates a session</strong>
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>A session ID and timestamp</li>
            <li>The text of each question the teacher types in</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-3">What we never collect</h2>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>Names, emails, phone numbers, or accounts</li>
            <li>
              IP addresses in our database (IPs are briefly used in memory for rate limiting, then
              discarded)
            </li>
            <li>Device, browser, or location fingerprints</li>
            <li>Google Analytics, Meta Pixel, Mixpanel, or any other tracker.)</li>
            <li>Cross-session or cross-site tracking</li>
          </ul>

          <p className="text-gray-700 mb-3">
            <strong>How we use what we save</strong> Only to show live results during a session,
            generate summaries and charts, and prevent duplicate votes. We don&apos;t sell, share,
            or hand off data to anyone for marketing.
          </p>

          <p className="text-gray-700 mb-3">
            <strong>Where the data lives</strong> In a secure database hosted in the United States.
            Sessions are visible to anyone with the session link, so treat them as public.
          </p>

          <p className="text-gray-700 mb-3">
            <strong>A heads-up for teachers</strong>Anything you type as a question gets saved and
            is visible to anyone with the session link. Please don&apos;t include confidential
            information or identifying details about specific people.
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

          <h2 className="text-xl font-semibold mt-8 mb-3">Keeping things secure</h2>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>All traffic is encrypted with HTTPS</li>
            <li>Rate limits block abuse</li>
            <li>Questions cannot be edited after creation, preserving vote integrity</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-3">Changes to this notice</h2>
          <p className="text-gray-700 mb-4">
            If we update it in a meaningful way, we'll change the date at the top.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-3">Contact</h2>
          <p className="text-gray-700 mb-4">
            Questions or data requests:{" "}
            <a href="mailto:beck_tench@harvard.edu" className="text-blue-600 hover:underline">
              beck_tench@harvard.edu
            </a>
          </p>
        </article>
      </main>
    </div>
  );
}
