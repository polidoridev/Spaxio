import type { Metadata } from "next";
import CreatorServices from "@/components/CreatorServices";

export const metadata: Metadata = {
  title: "AI Content Creation & Brand Films",
  description: "Original AI content, luxury visual storytelling, and product films by Stefano Polidori. Discuss your next creative project.",
  alternates: { canonical: "https://polidori.dev/services" },
  openGraph: { title: "AI Content Creation & Brand Films | Polidori Dev", description: "AI content creation, luxury visual storytelling, and brand films.", url: "https://polidori.dev/services" },
};

export default function ServicesPage() { return <CreatorServices />; }
