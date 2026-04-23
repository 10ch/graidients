import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
        <span>
          &copy; {new Date().getFullYear()}{" "}
          <a href="https://digitalthriving.gse.harvard.edu">Center for Digital Thriving</a>
        </span>
        <Link href="/privacy" className="hover:text-gray-900 hover:underline">
          Privacy
        </Link>
        <Link href="/faq" className="hover:text-gray-900 hover:underline">
          FAQ
        </Link>
      </div>
    </footer>
  );
}
