"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { CONTACT_EMAIL, PROJECT_TYPES } from "@/lib/contact";

const copy = {
  en: { name: "Your name", email: "Email address", project: "What do you have in mind?", message: "Tell me about your project", placeholder: "Your idea, the content you need, and any timing you have in mind. At least 10 characters.", options: ["AI content creation", "Luxury visuals", "Product or brand film", "Something else"], send: "Send inquiry", sending: "Sending…", success: "Your inquiry has been sent. I’ll reply to the email address you provided.", error: "Your inquiry could not be confirmed. Your message is still here. Please email contact@polidori.dev directly.", note: "Your details are used to respond to your inquiry.", privacy: "Privacy policy", another: "Send another inquiry" },
  fr: { name: "Votre nom", email: "Adresse courriel", project: "Qu’avez-vous en tête ?", message: "Parlez-moi de votre projet", placeholder: "Votre idée, le contenu souhaité et votre échéancier. Au moins 10 caractères.", options: ["Création de contenu IA", "Visuels de luxe", "Film de produit ou de marque", "Autre projet"], send: "Envoyer la demande", sending: "Envoi…", success: "Votre demande a été envoyée. Je répondrai à l’adresse courriel que vous avez indiquée.", error: "L’envoi n’a pas pu être confirmé. Votre message est toujours ici. Écrivez directement à contact@polidori.dev.", note: "Vos renseignements servent à répondre à votre demande.", privacy: "Confidentialité", another: "Envoyer une autre demande" },
};

export default function InquiryForm({ language = "en" }: { language?: "en" | "fr" }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const busy = useRef(false);
  const t = copy[language];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    busy.current = true;
    setStatus("sending");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data)),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error("Inquiry not confirmed");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    } finally {
      clearTimeout(timeout);
      busy.current = false;
    }
  }

  return <div className="cr-inquiry">
    {status === "sent" ? <div className="cr-inquiry-success" role="status"><p>{t.success}</p><button className="cr-text-link" onClick={() => setStatus("idle")}>{t.another} ↗</button></div> :
      <form onSubmit={submit} aria-label={t.send} aria-busy={status === "sending"}>
        <fieldset disabled={status === "sending"}>
          <div className="cr-inquiry-row"><label>{t.name}<input name="name" autoComplete="name" required maxLength={120} /></label><label>{t.email}<input name="email" type="email" autoComplete="email" required maxLength={254} /></label></div>
          <label>{t.project}<select name="projectType">{PROJECT_TYPES.map((value, i) => <option key={value} value={value}>{t.options[i]}</option>)}</select></label>
          <label>{t.message}<textarea name="message" rows={5} minLength={10} maxLength={5000} required placeholder={t.placeholder} /></label>
          <div className="cr-inquiry-trap" aria-hidden="true"><label>Leave this field empty<input name="companyWebsite" tabIndex={-1} autoComplete="off" /></label></div>
          <div className="cr-inquiry-actions"><p>{t.note} <a href="/privacy">{t.privacy}</a>.</p><button className="cr-button" type="submit">{status === "sending" ? t.sending : t.send} <span aria-hidden="true">↗</span></button></div>
        </fieldset>
        {status === "error" && <p className="cr-inquiry-error" role="alert">{t.error} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL} ↗</a></p>}
      </form>}
  </div>;
}
