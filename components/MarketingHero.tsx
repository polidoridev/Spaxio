"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { mountCinema } from "@/lib/luxury/mount-cinema";

export default function MarketingHero({ children, language }: { children: ReactNode; language: "en" | "fr" }) {
  const root = useRef<HTMLDivElement>(null);
  const status = useRef<HTMLDivElement>(null);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!motion || !root.current || !status.current) return;
    return mountCinema(root.current, status.current);
  }, [motion]);

  return <div id="top" ref={root} className="aim-hero-track" data-motion={motion}
    data-loading={language === "fr" ? "Préparation du film" : "Preparing film"}
    data-error={language === "fr" ? "Film indisponible. Rechargez pour réessayer." : "Film unavailable. Reload to retry."}>
    <section className="cr-luxury-scene aim-hero-scene">
      <div className="aim-hero">
        <div className="cr-luxury-visual" aria-hidden="true"><Image src="/luxury/film-01.jpg" alt="" fill priority sizes="100vw" /></div>
        {children}
        <div ref={status} className="aim-hero-status" role="status" hidden />
      </div>
    </section>
  </div>;
}
