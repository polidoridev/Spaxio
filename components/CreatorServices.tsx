import Image from "next/image";
import InquiryForm from "./InquiryForm";
import "./creator.css";

export default function CreatorServices({ previousService }: { previousService?: string }) {
  return <main className="cr-page cr-services-page">
    <header className="cr-services-header cr-wrap"><a className="cr-brand" href="/">Polidori Dev</a><a className="cr-text-link" href="/#work">Explore the work ↗</a></header>
    <section className="cr-wrap cr-services-intro">
      {previousService && <p className="cr-service-notice">Looking for {previousService}? My focus has moved from web services to AI content creation.</p>}
      <h1>AI films.<br/>Human direction.</h1><p>Cinematic visuals and original content, from the first concept to the final frame.</p>
      <a className="cr-button" href="#inquiry">Discuss a project ↗</a>
    </section>
    <section className="cr-wrap cr-services-detail" aria-label="AI content services">
      <Image src="/films/amalfi-detail.jpg" alt="AI-created Mediterranean villa" width={1600} height={900} sizes="(max-width: 767px) 100vw, 55vw" />
      <div className="cr-services">
        <div><h2>AI content creation</h2><p>Original short-form videos and visual concepts for social channels. A clear idea, creative direction, and a finished cut.</p></div>
        <div><h2>Luxury visual storytelling</h2><p>Cinematic worlds for property, automotive, and lifestyle concepts, built with AI and a considered visual direction.</p></div>
        <div><h2>Product & brand films</h2><p>Product studies and brand stories that make the details worth watching. Tell me what you want people to see and feel.</p></div>
      </div>
    </section>
    <section id="inquiry" className="cr-wrap cr-services-inquiry"><h2>Tell me about your idea.</h2><InquiryForm /></section>
    <footer className="cr-footer cr-wrap"><a className="cr-footer-brand" href="/">Polidori Dev</a><a href="mailto:contact@polidori.dev">contact@polidori.dev</a><a href="/privacy">Privacy</a></footer>
  </main>;
}
