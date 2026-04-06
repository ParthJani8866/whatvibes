import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";

const satoshi = localFont({
  src: [
    { path: "./Fonts/WEB/fonts/Satoshi-Regular.woff2", weight: "400" },
    { path: "./Fonts/WEB/fonts/Satoshi-Medium.woff2", weight: "500" },
    { path: "./Fonts/WEB/fonts/Satoshi-Bold.woff2", weight: "700" },
  ],
  variable: "--font-satoshi",
})


export const metadata: Metadata = {
  title: "Dream House Sale",
  description: "Dream House Sale",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://bioforig.com" />
        
        <meta
          name="google-site-verification"
          content="E0_UBnY8hLEbEq4LdXqMEIeM5CACikQtSVyAW3sKEuQ"
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-G06PPN0QRV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-G06PPN0QRV');
          `}
        </Script>
      </head>
      <body
        className={`${satoshi.variable} font-sans bg-slate-50 text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
