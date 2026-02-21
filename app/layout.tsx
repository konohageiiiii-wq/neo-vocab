import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'NeoVocab — AI×間隔反復で語学学習',
    template: '%s | NeoVocab',
  },
  description: '単語を登録するだけでAIが例文を自動生成。SM-2間隔反復アルゴリズムで英語・スペイン語を効率よく学習できるフラッシュカードアプリ。',
  openGraph: {
    siteName: 'NeoVocab',
    type: 'website',
    locale: 'ja_JP',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
