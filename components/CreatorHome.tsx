"use client";

import { useState } from "react";
import Image from "next/image";
import LuxuryJourney from "./LuxuryJourney";
import InquiryForm from "./InquiryForm";
import "./creator.css";

const INSTAGRAM = "https://www.instagram.com/polidori.dev/";
const COURSE = "https://whop.com/polidori-dev-3c24/polidori-dev-full-guide/";
const reels = [
  { code: "DeUth1xx0ue", views: "8.4M" },
  { code: "DeR3-ebRqdE", views: "1.1M" },
  { code: "DeNlonwxppy", views: "1M" },
  { code: "DeUVp0CRqN0", views: "506K" },
];
const copy = {
  en: {
    work: "Work", story: "About", contact: "Let’s create", eyebrow: "Stefano Polidori / AI content creator",
    headline: "Impossible ideas. Real attention.", lead: "Cinematic worlds, luxury visuals, and AI content that makes people stop scrolling.", explore: "Explore the work",
    impact: "Made to be seen.", views: "views in 30 days", audience: "Instagram followers", date: "Instagram snapshot · October 11, 2026", milestone: "From nearly 7,000 followers to a community of 20,700. The next chapter is already in motion.",
    selected: "An idea is only the beginning.", selectedBody: "Original AI films created with Higgsfield. Architecture, atmosphere, and the details that make a world feel real.",
    amalfi: "Private residences", amalfiType: "Architecture / AI film", coastal: "A different kind of escape.", coastalBody: "A coastal mansion. One continuous journey. Move through the film as you move through the page.", coastalLabel: "Coastal mansion / AI film",
    reelsTitle: "The work finds its audience.", reelsBody: "Four of the most-watched reels among the latest posts on @polidori.dev.", watch: "Watch reel", load: "Load Instagram video", thirdParty: "Loads Instagram’s embedded player. Instagram may use cookies.", open: "Open on Instagram", viewLabel: "views", profile: "More on Instagram",
    aboutTitle: "A developer’s mind. A creator’s eye.", aboutBody: "I’m Stefano. I started in website design and development. Now I use that same instinct for building things to create AI films, visual worlds, and content people want to share.", aboutSecond: "From the first concept to the final frame, I bring the creative direction and the tools together.",
    service1: "AI content creation", desc1: "Original short-form videos built around an idea worth watching.", service2: "Luxury visual storytelling", desc2: "Cinematic property, automotive, and lifestyle concepts.", service3: "Product & brand films", desc3: "Distinctive visual stories for products and the people behind them.",
    learn: "Want to make your own?", learnBody: "Learn the AI workflows behind the work.", course: "Explore the course", cta: "Let’s make something worth watching.", ctaBody: "Have a brand, a product, or an idea in mind? Tell me about it.", email: "Start a conversation", footer: "AI content. Human direction.", privacy: "Privacy", theme: "Change color theme", nav: "Main navigation", skip: "Skip to work",
  },
  fr: {
    work: "Créations", story: "À propos", contact: "Créons ensemble", eyebrow: "Stefano Polidori / Créateur de contenu IA",
    headline: "L’impossible prend vie.", lead: "Des univers cinématographiques, des visuels de luxe et du contenu IA qui capte l’attention.", explore: "Voir les créations",
    impact: "Fait pour être vu.", views: "vues en 30 jours", audience: "abonnés Instagram", date: "Données Instagram · 11 octobre 2026", milestone: "De près de 7 000 abonnés à une communauté de 20 700. Le prochain chapitre est déjà en mouvement.",
    selected: "Une idée n’est que le début.", selectedBody: "Des films IA originaux créés avec Higgsfield. L’architecture, l’atmosphère et les détails qui donnent vie à un univers.",
    amalfi: "Résidences privées", amalfiType: "Architecture / Film IA", coastal: "Une autre façon de s’évader.", coastalBody: "Une villa côtière. Un voyage continu. Avancez dans le film en faisant défiler la page.", coastalLabel: "Villa côtière / Film IA",
    reelsTitle: "Les créations trouvent leur public.", reelsBody: "Quatre des reels les plus regardés parmi les dernières publications de @polidori.dev.", watch: "Voir le reel", load: "Charger la vidéo Instagram", thirdParty: "Charge le lecteur Instagram. Instagram peut utiliser des cookies.", open: "Ouvrir sur Instagram", viewLabel: "vues", profile: "Plus sur Instagram",
    aboutTitle: "L’esprit développeur. Le regard créateur.", aboutBody: "Moi, c’est Stefano. J’ai commencé dans la conception de sites web. Aujourd’hui, j’utilise ce même instinct pour créer des films IA, des univers visuels et du contenu qu’on a envie de partager.", aboutSecond: "Du premier concept à la dernière image, je réunis la direction créative et les outils.",
    service1: "Création de contenu IA", desc1: "Des vidéos originales pensées autour d’une idée qui mérite d’être vue.", service2: "Narration visuelle de luxe", desc2: "Des concepts cinématographiques pour l’immobilier, l’automobile et l’art de vivre.", service3: "Films de marque et de produit", desc3: "Des histoires visuelles pour les produits et les personnes qui les créent.",
    learn: "Envie de créer à votre tour ?", learnBody: "Découvrez les méthodes IA derrière les créations.", course: "Découvrir la formation", cta: "Créons quelque chose qui mérite d’être vu.", ctaBody: "Une marque, un produit ou une idée en tête ? Parlons-en.", email: "Lancer la conversation", footer: "Contenu IA. Direction humaine.", privacy: "Confidentialité", theme: "Changer le thème", nav: "Navigation principale", skip: "Aller aux créations",
  },
};

export default function CreatorHome() {
  const [lang, setLang] = useState<"en" | "fr">("en");
  const [theme, setTheme] = useState<"light" | "dark" | undefined>();
  const [activeReels, setActiveReels] = useState<string[]>([]);
  const t = copy[lang];
  return (
    <main className="cr-page" data-theme={theme}>
      <a className="cr-skip" href="#work">{t.skip}</a>
      <header className="cr-header">
        <a href="#top" className="cr-brand" aria-label="Polidori Dev"><Image src="/logo.png" alt="" width={32} height={32} /><span>Polidori Dev</span></a>
        <nav aria-label={t.nav}>
          <a href="#work">{t.work}</a><a href="#about">{t.story}</a><a className="cr-nav-contact" href="#contact">{t.contact} <span aria-hidden="true">↗</span></a>
          <button onClick={() => { const next = lang === "en" ? "fr" : "en"; setLang(next); document.documentElement.lang = next; }} aria-label={lang === "en" ? "FR - Passer en français" : "EN - Switch to English"}>{lang === "en" ? "FR" : "EN"}</button>
          <button className="cr-theme" aria-label={t.theme} onClick={() => setTheme((theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")) === "dark" ? "light" : "dark")}>◐</button>
        </nav>
      </header>
      <LuxuryJourney language={lang}>
          <div className="cr-hero-inner">
            <p className="cr-eyebrow">{t.eyebrow}</p>
            <h1>{t.headline}</h1>
            <div className="cr-hero-bottom"><p>{t.lead}</p><a className="cr-button cr-button-light" href="#work">{t.explore} <span aria-hidden="true">↗</span></a></div>
          </div>
        </LuxuryJourney>
      <section className="cr-impact cr-wrap" aria-labelledby="impact-title">
        <h2 id="impact-title">{t.impact}</h2>
        <div className="cr-stats"><div><strong>23M</strong><p>{t.views}</p></div><div><strong>20.7K</strong><p>{t.audience}</p></div></div>
        <div className="cr-impact-notes"><p>{t.milestone}</p><small>{t.date}</small></div>
      </section>
      <section id="work" className="cr-work cr-wrap" aria-labelledby="work-title">
        <div className="cr-section-intro"><h2 id="work-title">{t.selected}</h2><p>{t.selectedBody}</p></div>
        <div className="cr-film-caption"><h3>{t.amalfi}</h3><span>{t.amalfiType}</span></div>
        <a href="#top" className="cr-work-image" aria-label={`${t.amalfi}: ${t.explore}`}><Image src="/luxury/film-02.jpg" alt={lang === "en" ? "AI-created private residence from the Polidori Private Equity film collection" : "Résidence privée créée par IA pour la collection Polidori Private Equity"} width={1600} height={900} sizes="(max-width: 768px) 100vw, 90vw"/><span className="cr-image-action" aria-hidden="true">↗</span></a>
      </section>
      <section id="reels" className="cr-reels cr-wrap" aria-labelledby="reels-title">
        <div className="cr-section-intro"><h2 id="reels-title">{t.reelsTitle}</h2><p>{t.reelsBody}</p></div>
        <div className="cr-reel-grid">{reels.map(reel => <article className="cr-reel" key={reel.code}>
          <div className="cr-reel-media">{activeReels.includes(reel.code) ? <iframe src={`https://www.instagram.com/reel/${reel.code}/embed/`} title={`${t.watch}: ${reel.views} ${t.viewLabel}`} allow="autoplay; encrypted-media; picture-in-picture" loading="lazy" /> : <button className="cr-reel-preview" aria-label={`${t.watch}: ${reel.views} ${t.viewLabel}. ${t.load}`} onClick={() => setActiveReels(r => [...r, reel.code])}><Image src={`/films/reel-${reel.code}.jpg`} alt={`@polidori.dev Instagram reel, ${reel.views} ${t.viewLabel}`} width={540} height={960} sizes="(max-width: 767px) 85vw, 25vw"/><span className="cr-reel-load">{t.watch} <span aria-hidden="true">↗</span></span></button>}</div>
          <div className="cr-reel-caption"><strong>{reel.views} <span>{t.viewLabel}</span></strong><a href={`${INSTAGRAM}reel/${reel.code}/`} target="_blank" rel="noreferrer" aria-label={`${t.open}: ${reel.views} ${t.viewLabel}`}>↗</a></div>
        </article>)}</div>
        <div className="cr-reel-footer"><small>{t.thirdParty}<br/>{t.date}</small><a className="cr-text-link" href={INSTAGRAM} target="_blank" rel="noreferrer">{t.profile} ↗</a></div>
      </section>
      <section id="about" className="cr-about cr-wrap" aria-labelledby="about-title"><h2 id="about-title">{t.aboutTitle}</h2><div className="cr-about-body"><p>{t.aboutBody}</p><p>{t.aboutSecond}</p><div className="cr-services">{[[t.service1,t.desc1],[t.service2,t.desc2],[t.service3,t.desc3]].map(([title,desc])=><div key={title}><h3>{title}</h3><p>{desc}</p></div>)}</div></div></section>
      <aside className="cr-learn cr-wrap"><div><h2>{t.learn}</h2><p>{t.learnBody}</p></div><a className="cr-text-link" href={COURSE} target="_blank" rel="noreferrer">{t.course} ↗</a></aside>
      <section id="contact" className="cr-contact cr-wrap"><h2>{t.cta}</h2><p>{t.ctaBody}</p><InquiryForm language={lang} /><a className="cr-email" href="mailto:contact@polidori.dev">contact@polidori.dev</a></section>
      <footer className="cr-footer cr-wrap"><a href="#top" className="cr-footer-brand">Polidori Dev</a><p>{t.footer}</p><div><a href={INSTAGRAM} target="_blank" rel="noreferrer">Instagram ↗</a><a href="/privacy">{t.privacy}</a><span>© 2026</span></div></footer>
    </main>
  );
}
