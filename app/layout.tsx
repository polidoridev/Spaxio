import type { Metadata } from "next";
import "./globals.css";
import { Instrument_Serif, Inter, Geist_Mono, Manrope } from "next/font/google";
import CookieConsent from "@/components/CookieConsent";

const creator = Manrope({ subsets: ["latin"], variable: "--font-creator" });
const display = Instrument_Serif({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], preload: false, variable: "--font-display" });
const sans = Inter({ subsets: ["latin"], preload: false, variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], preload: false, variable: "--font-mono" });

const SITE_URL = "https://polidori.dev";
const SITE_NAME = "Polidori Dev";
const SITE_TAGLINE = "AI Content Creator & Cinematic Visual Storytelling";
const SITE_DESCRIPTION =
  "AI content creation by Stefano Polidori. Cinematic luxury films, brand visuals, and viral social content. 23 million views in 30 days.";
const SITE_DESCRIPTION_SHORT =
  "Explore original AI films and viral content by Stefano Polidori. Luxury visual storytelling, brand films, and 23 million views in 30 days.";
const PHONE = "+1-514-516-0515";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_TAGLINE} | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  keywords: ["AI content creator", "AI video production", "Luxury brand films", "Cinematic AI video", "Higgsfield", "Stefano Polidori", "Polidori Dev"],
  authors: [{ name: "Stefano Polidori", url: SITE_URL }],
  creator: "Stefano Polidori",
  publisher: SITE_NAME,
  category: "AI content creation",
  applicationName: SITE_NAME,
  alternates: {
    canonical: SITE_URL
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_CA",
    alternateLocale: ["fr_CA"],
    title: `${SITE_TAGLINE} | ${SITE_NAME}`,
    description: SITE_DESCRIPTION_SHORT,
    images: [
      {
        url: "/films/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - AI content creator`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_TAGLINE} | ${SITE_NAME}`,
    description: SITE_DESCRIPTION_SHORT,
    images: ["/films/og-cover.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1
    }
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: "/favicon.png",
    apple: "/favicon.png"
  },
  referrer: "origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false }
};

const ADDRESS = {
  "@type": "PostalAddress",
  addressCountry: "CA"
};

const AREA_SERVED = [{ "@type": "Country", name: "Canada" }];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      founder: { "@type": "Person", name: "Stefano Polidori" },
      email: "contact@polidori.dev",
      telephone: PHONE,
      address: ADDRESS,
      areaServed: AREA_SERVED,
      sameAs: ["https://www.instagram.com/polidori.dev/"]
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}#organization` },
      inLanguage: ["en-CA", "fr-CA"]
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}#creator`,
      name: "Stefano Polidori",
      url: SITE_URL,
      jobTitle: "AI Content Creator",
      sameAs: ["https://www.instagram.com/polidori.dev/"],
      knowsAbout: ["AI content creation", "Cinematic visual storytelling", "AI video production"]
    }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} ${mono.variable} ${creator.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
