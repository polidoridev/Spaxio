import type { Metadata } from "next";
import CreatorServices from "@/components/CreatorServices";

export const metadata: Metadata = {
  title: "Now Creating AI Content",
  description: "Polidori Dev has shifted from web services to AI content creation, cinematic visuals, and brand films.",
  alternates: { canonical: "https://polidori.dev/services" },
  robots: { index: false, follow: true },
};

export default function PreviousServicePage() { return <CreatorServices previousService="website hosting" />; }
