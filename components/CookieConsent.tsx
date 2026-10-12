"use client";

import { useCallback, useEffect, useState } from "react";

type Lang = "fr" | "en";

type ConsentState = {
  analytics: boolean;
  marketing: boolean;
};

const text = {
  fr: {
    title: "Respect de votre vie privee",
    body: "Ce site utilise des temoins (cookies) pour ameliorer votre experience et analyser le trafic. Conformement a la Loi 25 du Quebec, nous demandons votre consentement avant d'activer tout temoin non essentiel.",
    acceptAll: "Tout accepter",
    rejectAll: "Tout refuser",
    manage: "Gerer les preferences",
    save: "Sauvegarder",
    back: "Retour",
    analytics: "Analytiques",
    analyticsDesc: "Nous aident a comprendre comment vous utilisez le site (ex. Google Analytics).",
    marketing: "Marketing",
    marketingDesc: "Permettent de vous presenter des publicites pertinentes.",
    essential: "Essentiels",
    essentialDesc: "Necessaires au fonctionnement du site. Toujours actifs.",
    privacy: "Politique de confidentialite",
  },
  en: {
    title: "Your Privacy",
    body: "This site uses cookies to improve your experience and analyze traffic. In compliance with Quebec's Law 25, we ask for your consent before enabling any non-essential cookies.",
    acceptAll: "Accept All",
    rejectAll: "Reject All",
    manage: "Manage Preferences",
    save: "Save Preferences",
    back: "Back",
    analytics: "Analytics",
    analyticsDesc: "Help us understand how you use the site (e.g. Google Analytics).",
    marketing: "Marketing",
    marketingDesc: "Allow us to show you relevant advertisements.",
    essential: "Essential",
    essentialDesc: "Required for the site to function. Always active.",
    privacy: "Privacy Policy",
  },
};

const CONSENT_KEY = "polidoridev_cookie_consent";

export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent(): boolean {
  return getConsent()?.analytics === true;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [managing, setManaging] = useState(false);
  const [lang, setLang] = useState<Lang>("fr");
  const [prefs, setPrefs] = useState<ConsentState>({ analytics: false, marketing: false });

  useEffect(() => {
    const existing = getConsent();
    if (!existing) {
      setVisible(true);
    }
    // Detect language from <html> lang attribute
    const htmlLang = document.documentElement.lang;
    if (htmlLang?.startsWith("en")) setLang("en");
  }, []);

  const save = useCallback((consent: ConsentState) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    setVisible(false);
    setManaging(false);
    // Dispatch event so analytics scripts can listen
    window.dispatchEvent(new CustomEvent("cookie-consent-update", { detail: consent }));
    // If analytics accepted, load GA now
    if (consent.analytics) {
      loadGA();
    }
  }, []);

  const acceptAll = () => save({ analytics: true, marketing: true });
  const rejectAll = () => save({ analytics: false, marketing: false });
  const savePrefs = () => save(prefs);

  const t = text[lang];

  if (!visible) return null;

  return (
    <div className="cc-overlay" role="dialog" aria-modal="true" aria-label={t.title}>
      <div className="cc-backdrop" />
      <div className="cc-modal">
        {/* Language toggle */}
        <button
          className="cc-lang-toggle"
          onClick={() => setLang(lang === "fr" ? "en" : "fr")}
          aria-label={lang === "fr" ? "EN - Switch to English" : "FR - Passer au francais"}
        >
          {lang === "fr" ? "EN" : "FR"}
        </button>

        {!managing ? (
          <>
            <h2 className="cc-title">{t.title}</h2>
            <p className="cc-body">{t.body}</p>
            <div className="cc-buttons">
              <button className="cc-btn cc-btn-accept" onClick={acceptAll}>{t.acceptAll}</button>
              <button className="cc-btn cc-btn-reject" onClick={rejectAll}>{t.rejectAll}</button>
              <button className="cc-btn cc-btn-manage" onClick={() => setManaging(true)}>{t.manage}</button>
            </div>
          </>
        ) : (
          <>
            <h2 className="cc-title">{t.manage}</h2>

            <div className="cc-pref-list">
              {/* Essential — always on */}
              <div className="cc-pref-item">
                <div className="cc-pref-header">
                  <span className="cc-pref-name">{t.essential}</span>
                  <span className="cc-toggle cc-toggle-on cc-toggle-locked">
                    <span className="cc-toggle-knob" />
                  </span>
                </div>
                <p className="cc-pref-desc">{t.essentialDesc}</p>
              </div>

              {/* Analytics */}
              <div className="cc-pref-item">
                <div className="cc-pref-header">
                  <span className="cc-pref-name">{t.analytics}</span>
                  <button
                    className={`cc-toggle ${prefs.analytics ? "cc-toggle-on" : ""}`}
                    onClick={() => setPrefs({ ...prefs, analytics: !prefs.analytics })}
                    role="switch"
                    aria-checked={prefs.analytics}
                    aria-label={t.analytics}
                  >
                    <span className="cc-toggle-knob" />
                  </button>
                </div>
                <p className="cc-pref-desc">{t.analyticsDesc}</p>
              </div>

              {/* Marketing */}
              <div className="cc-pref-item">
                <div className="cc-pref-header">
                  <span className="cc-pref-name">{t.marketing}</span>
                  <button
                    className={`cc-toggle ${prefs.marketing ? "cc-toggle-on" : ""}`}
                    onClick={() => setPrefs({ ...prefs, marketing: !prefs.marketing })}
                    role="switch"
                    aria-checked={prefs.marketing}
                    aria-label={t.marketing}
                  >
                    <span className="cc-toggle-knob" />
                  </button>
                </div>
                <p className="cc-pref-desc">{t.marketingDesc}</p>
              </div>
            </div>

            <div className="cc-buttons">
              <button className="cc-btn cc-btn-accept" onClick={savePrefs}>{t.save}</button>
              <button className="cc-btn cc-btn-manage" onClick={() => setManaging(false)}>{t.back}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── GA loader — only called after consent ── */
function loadGA() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  if (!GA_ID) return;
  if (document.getElementById("ga-script")) return;

  const script = document.createElement("script");
  script.id = "ga-script";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    gtag("js", new Date());
    gtag("config", GA_ID);
  };
}
