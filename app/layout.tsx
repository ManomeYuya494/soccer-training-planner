import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "サッカートレーニング計画ツール",
  description: "AIがジュニアサッカーの練習メニューを提案し、A4 PDFを自動生成します",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
