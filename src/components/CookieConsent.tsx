import { useEffect, useState } from "react";
import {
  applyConsentPreferences,
  createDefaultConsentPreferences,
  getStoredConsentPreferences,
  saveConsentPreferences,
  type ConsentPreferences,
} from "../analyticsConsent";

type ConsentView = "banner" | "settings" | null;
const BANNER_SCROLL_THRESHOLD = 0.5;
const BANNER_FALLBACK_DELAY = 12000;

export function CookieConsent({
  settingsOpen,
  onSettingsClosed,
}: {
  settingsOpen: boolean;
  onSettingsClosed: () => void;
}) {
  const [preferences, setPreferences] = useState<ConsentPreferences>(() => {
    return getStoredConsentPreferences() ?? createDefaultConsentPreferences();
  });
  const [draft, setDraft] = useState(preferences);
  const [hasSavedChoice, setHasSavedChoice] = useState(
    () => getStoredConsentPreferences() !== null,
  );
  const [view, setView] = useState<ConsentView>(null);

  useEffect(() => {
    applyConsentPreferences(preferences);
  }, [preferences]);

  useEffect(() => {
    if (!settingsOpen) return;
    setDraft(preferences);
    setView("settings");
  }, [preferences, settingsOpen]);

  useEffect(() => {
    if (hasSavedChoice || settingsOpen || view) return;

    const showBanner = () => {
      setView((currentView) => currentView ?? "banner");
    };

    const handleScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollableHeight <= 0) return;

      const scrollProgress = window.scrollY / scrollableHeight;
      if (scrollProgress >= BANNER_SCROLL_THRESHOLD) {
        showBanner();
      }
    };

    const fallbackTimer = window.setTimeout(
      showBanner,
      BANNER_FALLBACK_DELAY,
    );

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasSavedChoice, settingsOpen, view]);

  const closeSettings = () => {
    setView(getStoredConsentPreferences() ? null : "banner");
    onSettingsClosed();
  };

  const commitPreferences = (
    nextPreferences: Pick<ConsentPreferences, "analytics" | "marketing">,
  ) => {
    const savedPreferences = saveConsentPreferences(nextPreferences);
    setPreferences(savedPreferences);
    setDraft(savedPreferences);
    setHasSavedChoice(true);
    closeSettings();
  };

  const rejectOptional = () => {
    commitPreferences({ analytics: false, marketing: false });
  };

  const acceptAll = () => {
    commitPreferences({
      analytics: true,
      marketing: !preferences.globalPrivacyControl,
    });
  };

  const saveDraft = () => {
    commitPreferences({
      analytics: draft.analytics,
      marketing: draft.marketing,
    });
  };

  if (!view) return null;

  return (
    <>
      {view === "banner" && (
        <section
          className="cookie-banner"
          aria-labelledby="cookie-banner-title"
        >
          <div className="cookie-banner-copy">
            <p className="eyebrow">Privacy Choices</p>
            <h2 id="cookie-banner-title">Choose optional cookies</h2>
            <p>
              We use Google Analytics to understand site traffic and, with your
              permission, Reddit and affiliate tracking to measure ads and
              purchases. Optional tracking stays off unless you accept it.
            </p>
            {preferences.globalPrivacyControl && (
              <p className="cookie-gpc-note">
                Your browser is sending Global Privacy Control, so marketing
                tracking is turned off.
              </p>
            )}
          </div>
          <div className="cookie-banner-actions">
            <button type="button" onClick={rejectOptional}>
              Reject optional
            </button>
            <button type="button" onClick={() => setView("settings")}>
              Customize
            </button>
            <button type="button" className="cookie-primary" onClick={acceptAll}>
              Accept all
            </button>
          </div>
          <a className="cookie-privacy-link" href="/privacy">
            Privacy Policy
          </a>
        </section>
      )}

      {view === "settings" && (
        <div className="cookie-modal-backdrop">
          <section
            className="cookie-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-settings-title"
          >
            <div className="cookie-modal-header">
              <div>
                <p className="eyebrow">Privacy Choices</p>
                <h2 id="cookie-settings-title">Cookie settings</h2>
              </div>
              <button type="button" onClick={closeSettings}>
                Close
              </button>
            </div>

            <div className="cookie-option-list">
              <CookieOption
                title="Strictly necessary"
                description="Required to remember privacy and theme choices."
                checked
                disabled
              />
              <CookieOption
                title="Analytics"
                description="Allows Google Analytics to measure visits, pages, and downloads."
                checked={draft.analytics}
                onChange={(analytics) => setDraft({ ...draft, analytics })}
              />
              <CookieOption
                title="Marketing and affiliate measurement"
                description="Allows Reddit Pixel and Lemon Squeezy affiliate tracking."
                checked={draft.marketing}
                disabled={draft.globalPrivacyControl}
                onChange={(marketing) => setDraft({ ...draft, marketing })}
              />
            </div>

            {draft.globalPrivacyControl && (
              <p className="cookie-gpc-note">
                Global Privacy Control is enabled in this browser. Marketing
                tracking cannot be turned on while that signal is present.
              </p>
            )}

            <div className="cookie-modal-actions">
              <button type="button" onClick={rejectOptional}>
                Reject optional
              </button>
              <button type="button" className="cookie-primary" onClick={saveDraft}>
                Save choices
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function CookieOption({
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <label className={`cookie-option ${disabled ? "disabled" : ""}`}>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        readOnly={disabled || !onChange}
        onChange={(event) => onChange?.(event.currentTarget.checked)}
      />
    </label>
  );
}
