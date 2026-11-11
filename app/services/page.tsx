import type { Metadata } from "next";
import CreatorServices from "@/components/CreatorServices";

export const metadata: Metadata = {
  title: "AI Content Marketing & Monthly Retainers",
  description: "AI advertising creative, ongoing social content, and brand films for companies. Explore custom monthly retainers with Stefano Polidori.",
  alternates: { canonical: "https://polidori.dev/services" },
  openGraph: { title: "AI Content Marketing & Monthly Retainers | Polidori Dev", description: "AI advertising and social content for companies on monthly retainers.", url: "https://polidori.dev/services" },
};

export default function ServicesPage() { return <CreatorServices />; }
