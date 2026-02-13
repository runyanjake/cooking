import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "PWS Recipes",
  description: "A content-first recipe site with delicious recipes and cooking tips.",
  keywords: ["recipes", "cooking", "food", "kitchen"],
  authors: [{ name: "Cooking" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://recipes.whitney.rip",
    siteName: "PWS Recipes",
    title: "PWS Recipes",
    description: "A content-first recipe site with delicious recipes and cooking tips",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
