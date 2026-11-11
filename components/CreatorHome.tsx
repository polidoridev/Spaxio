"use client";

import { useState } from "react";
import Image from "next/image";
import MarketingHero from "./MarketingHero";
import MarketingOffer from "./MarketingOffer";
import InquiryForm from "./InquiryForm";
import "./creator.css";

const INSTAGRAM = "https://www.instagram.com/polidori.dev/";
const reels = [
  { code: "DeUth1xx0ue", views: "8.4M" },
  { code: "DeR3-ebRqdE", views: "1.1M" },
  { code: "DeNlonwxppy", views: "1M" },
  { code: "DeUVp0CRqN0", views: "506K" },
];
const copy = {
  en: {
    work: "Work", story: "About", contact: "Let’s create", eyebrow: "AI content marketing for companies",
    headline: "Your brand. More possibilities.", lead: "AI advertising and social content for your business, creatively directed by Stefano Polidori. Available on monthly retainers.", explore: "Explore AI content services",
    impact: "Creative experience. Real reach.", views: "views in the past 30 days", audience: "Instagram followers", date: "Instagram snapshot · November 10, 2026", reelDate: "Instagram snapshot · October 11, 2026", milestone: "Results from my own creator account, showing the audience my AI content has reached. These are not client campaign results or a promise of future performance.",
    selected: "Imagine what your brand could show.", selectedBody: "An original AI concept exploring architecture, atmosphere, and brand storytelling. A creative demonstration, not a commissioned client campaign.",
    amalfi: "Private residences", amalfiType: "Architecture / AI film", coastal: "A different kind of escape.", coastalBody: "A coastal mansion. One continuous journey. Move through the film as you move through the page.", coastalLabel: "Coastal mansion / AI film",
    reelsTitle: "AI content, out in the world.", reelsBody: "Four of the most-watched reels among the latest posts on @polidori.dev.", watch: "Watch reel", load: "Load Instagram video", thirdParty: "Loads Instagram’s embedded player. Instagram may use cookies.", open: "Open on Instagram", viewLabel: "views", profile: "More on Instagram",
    aboutTitle: "Your brand, with a creative partner.", aboutBody: "I’m Stefano Polidori. I help companies turn their products, services, and ideas into AI-powered advertising and social content. You work directly with me, from the first brief to the final delivery.", aboutSecond: "My background in development brings technical precision to the creative process. I combine AI production with human direction to build content around your brand and business goals.",
    service1: "AI advertising creative", desc1: "Short-form videos and campaign visuals, with hooks and variations for your team to test.", service2: "Ongoing social content", desc2: "A consistent flow of branded videos and visuals for your social channels.", service3: "Product & brand films", desc3: "Cinematic product and brand stories for launches, campaigns, and your website.",
    cta: "Let’s build your next month of content.", ctaBody: "Tell me about your company, your marketing goals, and the content you need. I’ll help define a monthly retainer that fits.", email: "Start a conversation", footer: "AI content marketing. Human direction.", privacy: "Privacy", theme: "Change color theme", nav: "Main navigation", skip: "Skip to work",
  },
  fr: {
    work: "Créations", story: "À propos", contact: "Créons ensemble", eyebrow: "Marketing de contenu IA pour entreprises",
    headline: "Votre marque. Plus de possibilités.", lead: "Publicités et contenu social IA pour votre entreprise, sous la direction de Stefano Polidori. Forfaits mensuels disponibles.", explore: "Découvrir les services IA",
    impact: "Une expérience créative. Une audience réelle.", views: "vues au cours des 30 derniers jours", audience: "abonnés Instagram", date: "Données Instagram · 10 novembre 2026", reelDate: "Données Instagram · 11 octobre 2026", milestone: "Résultats de mon propre compte créateur. Ils illustrent la portée de mon contenu IA, sans représenter des résultats clients ni garantir une performance future.",
    selected: "Imaginez ce que votre marque pourrait montrer.", selectedBody: "Un concept IA original autour de l’architecture et de la narration de marque. Une démonstration créative, et non une campagne commandée par un client.",
    amalfi: "Résidences privées", amalfiType: "Architecture / Film IA", coastal: "Une autre façon de s’évader.", coastalBody: "Une villa côtière. Un voyage continu. Avancez dans le film en faisant défiler la page.", coastalLabel: "Villa côtière / Film IA",
    reelsTitle: "Les créations trouvent leur public.", reelsBody: "Quatre des reels les plus regardés parmi les dernières publications de @polidori.dev.", watch: "Voir le reel", load: "Charger la vidéo Instagram", thirdParty: "Charge le lecteur Instagram. Instagram peut utiliser des cookies.", open: "Ouvrir sur Instagram", viewLabel: "vues", profile: "Plus sur Instagram",
    aboutTitle: "Un partenaire créatif pour votre marque.", aboutBody: "Je suis Stefano Polidori. J’aide les entreprises à transformer leurs produits, services et idées en publicités et contenu social IA. Vous travaillez directement avec moi, du brief à la livraison.", aboutSecond: "Mon expérience en développement apporte une précision technique à la création. Je combine production IA et direction humaine au service de vos objectifs.",
    service1: "Création publicitaire IA", desc1: "Des vidéos courtes et des visuels publicitaires, avec différentes accroches à tester.", service2: "Contenu social régulier", desc2: "Un flux régulier de vidéos et de visuels cohérents pour vos réseaux sociaux.", service3: "Films de marque et de produit", desc3: "Des films pour vos produits, lancements, campagnes et votre site web.",
    cta: "Préparons votre prochain mois de contenu.", ctaBody: "Présentez votre entreprise, vos objectifs et vos besoins en contenu. Nous définirons un forfait mensuel adapté.", email: "Lancer la conversation", footer: "Marketing de contenu IA. Direction humaine.", privacy: "Confidentialité", theme: "Changer le thème", nav: "Navigation principale", skip: "Aller aux créations",
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
          <a href="#work">{t.work}</a><a className="aim-nav-extra" href="#retainers">{lang === "en" ? "Monthly retainers" : "Forfaits mensuels"}</a><a href="#about">{t.story}</a><a className="cr-nav-contact" href="#contact">{t.contact} <span aria-hidden="true">↗</span></a>
          <button onClick={() => { const next = lang === "en" ? "fr" : "en"; setLang(next); document.documentElement.lang = next; }} aria-label={lang === "en" ? "FR - Passer en français" : "EN - Switch to English"}>{lang === "en" ? "FR" : "EN"}</button>
          <button className="cr-theme" aria-label={t.theme} onClick={() => setTheme((theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")) === "dark" ? "light" : "dark")}>◐</button>
        </nav>
      </header>
      <MarketingHero language={lang}>
          <div className="cr-hero-inner">
            <p className="cr-eyebrow">{t.eyebrow}</p>
            <h1>{t.headline}</h1>
            <div className="cr-hero-bottom"><p>{t.lead}</p><a className="cr-button cr-button-light" href="#about">{t.explore} <span aria-hidden="true">↗</span></a></div>
          </div>
        </MarketingHero>
      <section id="about" className="cr-about cr-wrap" aria-labelledby="about-title"><h2 id="about-title">{t.aboutTitle}</h2><div className="cr-about-body"><p>{t.aboutBody}</p><p>{t.aboutSecond}</p><div className="cr-services">{[[t.service1,t.desc1],[t.service2,t.desc2],[t.service3,t.desc3]].map(([title,desc])=><div key={title}><h3>{title}</h3><p>{desc}</p></div>)}</div></div></section>
      <MarketingOffer language={lang} />
      <section className="cr-impact cr-wrap" aria-labelledby="impact-title">
        <h2 id="impact-title">{t.impact}</h2>
        <div className="cr-stats"><div><strong>90M</strong><p>{t.views}</p></div><div><strong>39K</strong><p>{t.audience}</p></div></div>
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
          <div className="cr-reel-caption"><strong>{reel.views} <span>{t.viewLabel}</span></strong><a href={`https://www.instagram.com/reel/${reel.code}/`} target="_blank" rel="noreferrer" aria-label={`${t.open}: ${reel.views} ${t.viewLabel}`}>↗</a></div>
        </article>)}</div>
        <div className="cr-reel-footer"><small>{t.thirdParty}<br/>{t.reelDate}</small><a className="cr-text-link" href={INSTAGRAM} target="_blank" rel="noreferrer">{t.profile} ↗</a></div>
      </section>
      <section id="contact" className="cr-contact cr-wrap"><h2>{t.cta}</h2><p>{t.ctaBody}</p><InquiryForm language={lang} /><a className="cr-email" href="mailto:contact@polidori.dev">contact@polidori.dev</a></section>
      <footer className="cr-footer cr-wrap"><a href="#top" className="cr-footer-brand">Polidori Dev</a><p>{t.footer}</p><div><a href={INSTAGRAM} target="_blank" rel="noreferrer">Instagram ↗</a><a href="/privacy-policy">{t.privacy}</a><span>© 2026</span></div></footer>
    </main>
  );
}
