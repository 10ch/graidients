import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Graidients - AI Ethics Polling",
  description: "Interactive polling app for AI ethics presentations",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
