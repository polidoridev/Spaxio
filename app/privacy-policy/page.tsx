"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Lang = "en" | "fr";

const LANG_KEY = "polidoridev_lang";

const content = {
  "en": {
    "title": "Privacy Policy",
    "lastUpdated": "Last updated: November 10, 2026",
    "backHome": "Back to home",
    "sections": [
      {
        "heading": "1. Information We Collect",
        "body": "Polidori Dev, operated by Stefano Polidori, collects information you provide through our website contact form, email, or Meta lead ads and Instant Forms on Facebook or Instagram.\n\nDepending on the form, this may include your name, email address, phone number, company name, website, project type, budget, and answers about your marketing needs. Meta may prefill information from your profile; you can review it before submitting. We receive the information you choose to submit, along with available form or campaign details and consent records.\n\nOur hosting provider may process technical information such as IP addresses and request logs. Optional analytics and embedded content are described below. Please do not submit sensitive personal information in your inquiry."
      },
      {
        "heading": "2. Meta Lead Ads and Follow-Up",
        "body": "When you submit a Facebook or Instagram lead form requesting information about our services, we use your details to respond, discuss your needs, arrange a consultation, prepare a proposal, and follow up on that request. We contact you through the channels you provide and authorize, such as email or phone.\n\nSubmitting an inquiry does not automatically subscribe you to a newsletter or give unlimited permission for promotional messages. We send additional marketing communications about our AI content marketing services only with your consent or another basis permitted by applicable law. Any separate consent choices shown on the lead form apply to those communications. This policy does not replace those choices.\n\nYou can ask us to stop marketing follow-up at any time by replying to a message, using an unsubscribe option where provided, or emailing contact@polidori.dev. We honour withdrawal and unsubscribe requests in accordance with applicable law. We may still send communications needed to fulfil services you requested or meet legal obligations.\n\nWe do not sell, rent, or trade your personal information or Meta lead data."
      },
      {
        "heading": "3. Retention and Security",
        "body": "We retain inquiry and lead information for up to 12 months from your inquiry, unless an ongoing business relationship or a legal obligation requires longer retention. Information no longer needed is deleted or anonymized. We may keep limited consent and unsubscribe records to demonstrate consent and respect your preferences.\n\nWe use reasonable technical and organizational safeguards and limit access to people and service providers who need the information for the purposes described here. No internet transmission or storage system can be guaranteed completely secure."
      },
      {
        "heading": "4. Service Providers and International Processing",
        "body": "We disclose information only as needed to operate our services, respond to inquiries, or comply with legal obligations:\n\n• **Meta (Facebook and Instagram)** hosts lead forms and provides submitted lead information to us. Meta also processes information under its own [Privacy Policy](https://www.facebook.com/privacy/policy/).\n• **Email and communications providers** deliver and store website inquiries and our correspondence. Our website contact form sends your submission to our business email through an email delivery service.\n• **Vercel** hosts our website and may process IP addresses and technical logs. See [Vercel’s Privacy Policy](https://vercel.com/legal/privacy-policy).\n• **Google Analytics**, when configured and enabled with your analytics consent, processes website usage and device information. See [Google’s Privacy Policy](https://policies.google.com/privacy).\n\nProviders may process or store information outside Quebec or Canada, where it may be subject to local laws and lawful access by authorities. Contact us with questions about service providers or processing locations."
      },
      {
        "heading": "5. Cookies and Embedded Content",
        "body": "We store language and cookie preferences in your browser’s local storage. Where Google Analytics is configured, it is loaded only after you accept analytics cookies. You can decline optional cookies in the consent banner and clear this site’s browser storage to choose again on your next visit.\n\nInstagram videos load only when you choose to load an embedded player. Loading a player connects your browser to Meta, which may receive technical information and use cookies under its own policy. You can instead open the linked reel directly on Instagram.\n\nCookie choices are separate from consent to receive email or phone follow-up. Submitting a Meta lead form does not itself enable advertising trackers on this website."
      },
      {
        "heading": "6. Your Rights and Data Deletion",
        "body": "Subject to applicable law, you may request access to your personal information, correction of inaccurate information, deletion, or withdrawal of consent. To make a request or raise a privacy concern, email contact@polidori.dev. We may need to verify your identity before responding.\n\nWe respond within 30 days, or advise you of any extension permitted by law. Some records may need to be retained for legal obligations or to honour an unsubscribe request. Withdrawing consent does not affect processing already carried out lawfully."
      },
      {
        "heading": "7. Contact: Privacy Officer",
        "body": "**Stefano Polidori**\nPrivacy Officer, Polidori Dev\nEmail: [contact@polidori.dev](mailto:contact@polidori.dev)\nWebsite: [polidori.dev](https://polidori.dev)"
      },
      {
        "heading": "8. Changes to This Policy",
        "body": "We may update this policy as our services or practices change. The current version is published at /privacy-policy with its revision date. The former /privacy address redirects to this same policy."
      }
    ]
  },
  "fr": {
    "title": "Politique de confidentialité",
    "lastUpdated": "Dernière mise à jour : 10 novembre 2026",
    "backHome": "Retour à l’accueil",
    "sections": [
      {
        "heading": "1. Renseignements recueillis",
        "body": "Polidori Dev, exploité par Stefano Polidori, recueille les renseignements que vous fournissez par notre formulaire de contact, par courriel ou par les publicités à formulaire et formulaires instantanés Meta sur Facebook ou Instagram.\n\nSelon le formulaire, ces renseignements peuvent comprendre votre nom, adresse courriel, numéro de téléphone, entreprise, site web, type de projet, budget et réponses concernant vos besoins marketing. Meta peut préremplir des renseignements de votre profil; vous pouvez les vérifier avant l’envoi. Nous recevons les renseignements soumis ainsi que les détails disponibles du formulaire ou de la campagne et les preuves de consentement.\n\nNotre hébergeur peut traiter des renseignements techniques, comme les adresses IP et les journaux de requêtes. Les outils analytiques facultatifs et les contenus intégrés sont décrits ci-dessous. Ne transmettez pas de renseignements personnels sensibles dans votre demande."
      },
      {
        "heading": "2. Publicités à formulaire Meta et suivi",
        "body": "Lorsque vous soumettez un formulaire Facebook ou Instagram pour obtenir des renseignements sur nos services, nous utilisons vos coordonnées pour répondre, discuter de vos besoins, organiser une consultation, préparer une proposition et assurer le suivi de cette demande. Nous vous contactons par les moyens que vous fournissez et autorisez, comme le courriel ou le téléphone.\n\nUne demande ne vous abonne pas automatiquement à une infolettre et ne constitue pas une autorisation illimitée de recevoir des promotions. Nous envoyons d’autres communications marketing sur nos services de contenu IA uniquement avec votre consentement ou sur une autre base permise par la loi. Les choix de consentement distincts présentés dans le formulaire s’appliquent à ces communications. Cette politique ne remplace pas ces choix.\n\nVous pouvez demander l’arrêt du suivi marketing en répondant à un message, en utilisant le mécanisme de désabonnement proposé ou en écrivant à contact@polidori.dev. Nous respectons les retraits de consentement et désabonnements conformément à la loi. Nous pouvons continuer les communications nécessaires aux services demandés ou à nos obligations légales.\n\nNous ne vendons, ne louons ni n’échangeons vos renseignements personnels ou les données de prospects Meta."
      },
      {
        "heading": "3. Conservation et sécurité",
        "body": "Nous conservons les renseignements des demandes et prospects pendant un maximum de 12 mois à compter de votre demande, sauf si une relation d’affaires en cours ou une obligation légale exige une conservation prolongée. Les renseignements devenus inutiles sont supprimés ou anonymisés. Nous pouvons conserver des preuves limitées de consentement et de désabonnement pour respecter vos préférences.\n\nNous appliquons des mesures techniques et organisationnelles raisonnables et limitons l’accès aux personnes et fournisseurs qui en ont besoin aux fins décrites. Aucune transmission ou conservation sur Internet ne peut être garantie entièrement sécurisée."
      },
      {
        "heading": "4. Fournisseurs et traitement international",
        "body": "Nous communiquons les renseignements uniquement dans la mesure nécessaire au fonctionnement de nos services, aux réponses aux demandes ou au respect de nos obligations légales :\n\n• **Meta (Facebook et Instagram)** héberge les formulaires et nous transmet les renseignements soumis. Meta traite également des renseignements selon sa propre [Politique de confidentialité](https://www.facebook.com/privacy/policy/).\n• **Fournisseurs de courriel et de communications** : ils acheminent et conservent les demandes et notre correspondance. Le formulaire du site transmet votre demande à notre adresse professionnelle par un service de livraison de courriels.\n• **Vercel** héberge notre site et peut traiter des adresses IP et journaux techniques. Consultez la [Politique de Vercel](https://vercel.com/legal/privacy-policy).\n• **Google Analytics**, lorsqu’il est configuré et activé avec votre consentement analytique, traite des données d’utilisation et d’appareil. Consultez la [Politique de Google](https://policies.google.com/privacy).\n\nCes fournisseurs peuvent traiter ou conserver des renseignements hors du Québec ou du Canada, où les lois locales et l’accès légal des autorités peuvent s’appliquer. Contactez-nous pour toute question sur les fournisseurs ou les lieux de traitement."
      },
      {
        "heading": "5. Témoins et contenus intégrés",
        "body": "Nous conservons vos préférences linguistiques et de témoins dans le stockage local de votre navigateur. Lorsque Google Analytics est configuré, il se charge uniquement après votre acceptation des témoins analytiques. Vous pouvez refuser les témoins facultatifs dans la bannière et effacer les données de ce site dans votre navigateur pour choisir à nouveau lors de votre prochaine visite.\n\nLes vidéos Instagram se chargent uniquement lorsque vous choisissez d’activer leur lecteur intégré. Ce chargement connecte votre navigateur à Meta, qui peut recevoir des données techniques et utiliser des témoins selon sa politique. Vous pouvez plutôt ouvrir le lien directement sur Instagram.\n\nLes choix de témoins sont distincts du consentement au suivi par courriel ou téléphone. L’envoi d’un formulaire Meta n’active pas en soi de traceurs publicitaires sur ce site."
      },
      {
        "heading": "6. Vos droits et la suppression",
        "body": "Sous réserve de la loi applicable, vous pouvez demander l’accès à vos renseignements, leur correction, leur suppression ou retirer votre consentement. Écrivez à contact@polidori.dev pour exercer ces droits ou soulever une préoccupation. Nous pouvons devoir vérifier votre identité.\n\nNous répondons dans les 30 jours ou vous informons de toute prolongation permise par la loi. Certains dossiers peuvent être conservés pour respecter une obligation légale ou un désabonnement. Le retrait du consentement ne remet pas en cause le traitement effectué légalement avant ce retrait."
      },
      {
        "heading": "7. Responsable de la confidentialité",
        "body": "**Stefano Polidori**\nResponsable de la confidentialité, Polidori Dev\nCourriel : [contact@polidori.dev](mailto:contact@polidori.dev)\nSite web : [polidori.dev](https://polidori.dev)"
      },
      {
        "heading": "8. Modifications de cette politique",
        "body": "Nous pouvons mettre à jour cette politique selon l’évolution de nos services ou pratiques. La version actuelle est publiée à /privacy-policy avec sa date de révision. L’ancienne adresse /privacy redirige vers cette même politique."
      }
    ]
  }
};

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Convert **bold** to <strong>
    let raw = line;

    // Convert [text](url) to <a>
    raw = raw.replace(/\[([^\]]+)\]\((mailto:[^)]+)\)/g, '<a href="$2" class="pp-link">$1</a>');
    raw = raw.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="pp-link">$1</a>');

    // Now handle bold
    const boldRegex = /\*\*(.*?)\*\*/g;
    const processed = raw.replace(boldRegex, '<strong>$1</strong>');

    if (line.trim() === "") {
      return <br key={i} />;
    }

    return (
      <span key={i} dangerouslySetInnerHTML={{ __html: processed }} />
    );
  });
}

export default function PrivacyPolicyPage() {
  const [lang, setLang] = useState<Lang>("en");
  const t = content[lang];

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromUrl = params.get("lang");
      if (fromUrl === "fr" || fromUrl === "en") {
        setLang(fromUrl);
        return;
      }
      const stored = window.localStorage.getItem(LANG_KEY);
      if (stored === "fr" || stored === "en") {
        setLang(stored);
        return;
      }
      if ((navigator.language || "").toLowerCase().startsWith("fr")) {
        setLang("fr");
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(LANG_KEY, lang);
      document.documentElement.lang = lang === "fr" ? "fr-CA" : "en";
    } catch {}
  }, [lang]);

  return (
    <div className="pp-page">
      <nav className="site-nav">
        <button
          onClick={() => setLang(lang === "en" ? "fr" : "en")}
          className="lang-btn"
          aria-label={lang === "en" ? "Passer au français" : "Switch to English"}
        >
          {lang === "en" ? "FR" : "EN"}
        </button>
      </nav>

      <div className="pp-container">
        <Link href="/" className="pp-back">
          &larr; {t.backHome}
        </Link>

        <h1 className="pp-title">{t.title}</h1>
        <p className="pp-updated">{t.lastUpdated}</p>

        {t.sections.map((section, i) => (
          <section key={i} className="pp-section">
            <h2 className="pp-heading">{section.heading}</h2>
            <div className="pp-body">
              {renderMarkdown(section.body)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
