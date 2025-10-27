import FAQ from "@/components/FAQ";
import Link from "next/link";

export const metadata = {
  title: "FAQ - Align on the Line AI Ethics Polling",
  description: "Frequently asked questions about using Align on the Line AI Ethics Polling app",
};

export default function FAQPage() {
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
        <FAQ />
      </main>
    </div>
  );
}
