import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script"; // 追加
import "./globals.css";
import { Suspense } from "react"; // 追加

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "おくすりぱっくん - 小児用医薬品の飲み合わせ・味の相性検索 | Kusuri Compass",
  description: "苦いお薬を何に混ぜれば飲みやすくなるか、食べ物との相性を簡単にチェック。お子様の服薬を楽しくサポートする、薬剤師監修の飲み合わせ検索アプリです。",
  keywords: ["おくすりぱっくん", "飲み合わせ", "味", "小児", "薬局", "薬剤師", "Kusuri Compass"],
  robots: "index, follow",
  alternates: {
    canonical: "https://okusuri-pakkun-app.pages.dev/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VXSZGE4HP7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-VXSZGE4HP7');
          `}
        </Script>
        <Suspense fallback={<div>Loading...</div>}> {/* 追加 */}
          {children}
        </Suspense> {/* 追加 */}
      </body>
    </html>
  );
}
