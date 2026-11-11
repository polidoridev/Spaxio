import Image from "next/image";
import MarketingOffer from "./MarketingOffer";
import InquiryForm from "./InquiryForm";
import "./creator.css";

export default function CreatorServices({ previousService }: { previousService?: string }) {
  return <main className="cr-page cr-services-page">
    <header className="cr-services-header cr-wrap"><a className="cr-brand" href="/">Polidori Dev</a><a className="cr-text-link" href="/#work">Explore the work ↗</a></header>
    <section className="cr-wrap cr-services-intro">
      {previousService && <p className="cr-service-notice">Looking for {previousService}? My focus has moved from web services to AI content marketing for companies.</p>}
      <h1>AI content.<br/>Built for business.</h1><p>AI advertising creative, social content, and brand films. I work directly with companies on custom monthly retainers.</p>
      <a className="cr-button" href="#inquiry">Discuss a monthly retainer ↗</a>
    </section>
    <section className="cr-wrap cr-services-detail" aria-label="AI content services">
      <Image src="/films/amalfi-detail.jpg" alt="AI-created Mediterranean villa" width={1600} height={900} sizes="(max-width: 767px) 100vw, 55vw" />
      <div className="cr-services">
        <div><h2>AI advertising creative</h2><p>Campaign concepts, short-form video ads, and visual variations for your marketing team to test.</p></div>
        <div><h2>Ongoing social content</h2><p>A regular flow of branded videos and visuals, planned around your audience, channels, and upcoming campaigns.</p></div>
        <div><h2>Product & brand films</h2><p>Cinematic storytelling for products, launches, and websites, with a visual direction grounded in your brand.</p></div>
      </div>
    </section>
    <MarketingOffer contactHref="#inquiry" />
    <section id="inquiry" className="cr-wrap cr-services-inquiry"><h2>Let’s plan your monthly content.</h2><InquiryForm /></section>
    <footer className="cr-footer cr-wrap"><a className="cr-footer-brand" href="/">Polidori Dev</a><a href="mailto:contact@polidori.dev">contact@polidori.dev</a><a href="/privacy-policy">Privacy</a></footer>
  </main>;
}
