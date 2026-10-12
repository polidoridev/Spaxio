"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { mountCinema } from "@/lib/luxury/mount-cinema";

const query = "(prefers-reduced-motion: reduce)";
const subscribe = (callback: () => void) => {
  const media = matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const chapters = {
  en: [
    ["Motoring & yachting", ""],
    ["Private residences", "Places you can feel."],
    ["Capital & legacy", "An idea. A whole world."],
    ["Fine timepieces", "Every detail matters."],
    ["Private aviation", "A wider perspective."],
    ["Yachting", "Beyond the shoreline."],
  ],
  fr: [
    ["Automobile et yachting", ""],
    ["Résidences privées", "Des lieux qui font rêver."],
    ["Capital et héritage", "Une idée. Tout un univers."],
    ["Haute horlogerie", "Chaque détail compte."],
    ["Aviation privée", "Une autre perspective."],
    ["Yachting", "Au-delà du rivage."],
  ],
};

export default function LuxuryJourney({ children, language }: { children: ReactNode; language: "en" | "fr" }) {
  const root = useRef<HTMLDivElement>(null);
  const status = useRef<HTMLDivElement>(null);
  const reduced = useSyncExternalStore(subscribe, () => matchMedia(query).matches, () => true);
  const [optIn, setOptIn] = useState(false);
  const enabled = !reduced || optIn;
  const french = language === "fr";
  useEffect(() => {
    if (!enabled || !root.current || !status.current) return;
    return mountCinema(root.current, status.current);
  }, [enabled]);
  return <div id="top" ref={root} className="cr-luxury" data-loading={french ? "Préparation des films" : "Preparing films"} data-error={french ? "Films indisponibles. Rechargez pour réessayer." : "Films could not load. Reload to retry."}>
    {chapters[language].map(([label, title], index) => <section key={index} id={`film-${index + 1}`} className="cr-luxury-scene" aria-label={label}>
      <div className="cr-luxury-visual" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/luxury/film-0${index + 1}.jpg`} alt="" fetchPriority={index === 0 ? "high" : "auto"} />
      </div>
      <div className="cr-luxury-shade" aria-hidden="true" />
      {index === 0 ? children : <div className="cr-luxury-copy"><p>{french ? "Polidori Dev / Film IA" : "Polidori Dev / AI film"}</p><h2>{title}</h2></div>}
      <div className="cr-luxury-caption"><span>{label}</span><span>0{index + 1} / 06</span></div>
      {index === 0 && <div className="cr-luxury-cue">{enabled ? (french ? "Défilez pour explorer ↓" : "Scroll to explore ↓") : <button type="button" onClick={() => setOptIn(true)}>{french ? "Activer les films au défilement ↓" : "Enable scroll films ↓"}</button>}</div>}
    </section>)}
    <div ref={status} className="cr-luxury-loading" role="status" hidden={!enabled}>{french ? "Préparation des films" : "Preparing films"}</div>
  </div>;
}
