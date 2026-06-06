export type ConsentPreferences = {
  version: number;
  updatedAt: string;
  analytics: boolean;
  marketing: boolean;
  globalPrivacyControl: boolean;
};

type ConsentInput = Pick<ConsentPreferences, "analytics" | "marketing">;
type RedditPixel = ((...args: unknown[]) => void) & {
  callQueue?: unknown[][];
  sendEvent?: (...args: unknown[]) => void;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    rdt?: RedditPixel;
    lemonSqueezyAffiliateConfig?: { store: string };
  }

  interface Navigator {
    globalPrivacyControl?: boolean;
  }
}

const CONSENT_STORAGE_KEY = "novelativeCookieConsent";
const CONSENT_VERSION = 1;
const GOOGLE_ANALYTICS_ID = "G-T9DS3YHVV6";
const REDDIT_PIXEL_ID =
  ((import.meta as ImportMeta & { env?: Record<string, string | undefined> })
    .env?.VITE_REDDIT_PIXEL_ID ?? "").trim();

let googleConsentInitialized = false;
let googleConfigured = false;
let redditConfigured = false;

export function hasGlobalPrivacyControl() {
  return navigator.globalPrivacyControl === true;
}

export function createDefaultConsentPreferences(): ConsentPreferences {
  return normalizeConsentPreferences({
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
    analytics: false,
    marketing: false,
    globalPrivacyControl: hasGlobalPrivacyControl(),
  });
}

export function getStoredConsentPreferences() {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;

    const preferences = JSON.parse(stored) as ConsentPreferences;
    if (preferences.version !== CONSENT_VERSION) return null;

    return normalizeConsentPreferences(preferences);
  } catch {
    return null;
  }
}

export function saveConsentPreferences(input: ConsentInput) {
  const preferences = normalizeConsentPreferences({
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
    analytics: input.analytics,
    marketing: input.marketing,
    globalPrivacyControl: hasGlobalPrivacyControl(),
  });

  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preferences));
  applyConsentPreferences(preferences);

  return preferences;
}

export function applyConsentPreferences(preferences: ConsentPreferences) {
  const normalized = normalizeConsentPreferences(preferences);

  initializeGoogleConsent();
  updateGoogleConsent(normalized);

  if (normalized.analytics) {
    loadGoogleAnalytics(normalized);
  } else {
    deleteCookies(["_ga", "_gid", "_gat", "_gac", "_gcl"]);
  }

  if (normalized.marketing) {
    loadRedditPixel();
    loadLemonSqueezyAffiliate();
  } else {
    deleteCookies(["_rdt", "_rdt_uuid", "rdt_uuid", "lms"]);
  }
}

function normalizeConsentPreferences(
  preferences: ConsentPreferences,
): ConsentPreferences {
  const globalPrivacyControl = hasGlobalPrivacyControl();

  return {
    ...preferences,
    version: CONSENT_VERSION,
    analytics: Boolean(preferences.analytics),
    marketing: globalPrivacyControl ? false : Boolean(preferences.marketing),
    globalPrivacyControl,
  };
}

function initializeGoogleConsent() {
  if (googleConsentInitialized) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });
  window.gtag("set", "ads_data_redaction", true);

  googleConsentInitialized = true;
}

function updateGoogleConsent(preferences: ConsentPreferences) {
  window.gtag?.("consent", "update", {
    ad_storage: preferences.marketing ? "granted" : "denied",
    ad_user_data: preferences.marketing ? "granted" : "denied",
    ad_personalization: preferences.marketing ? "granted" : "denied",
    analytics_storage: preferences.analytics ? "granted" : "denied",
  });
}

function loadGoogleAnalytics(preferences: ConsentPreferences) {
  loadScript(
    "novelative-google-analytics",
    `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`,
    true,
  );

  if (!googleConfigured) {
    window.gtag?.("js", new Date());
    googleConfigured = true;
  }

  window.gtag?.("config", GOOGLE_ANALYTICS_ID, {
    allow_google_signals: preferences.marketing,
    allow_ad_personalization_signals: preferences.marketing,
  });
}

function loadRedditPixel() {
  if (!REDDIT_PIXEL_ID || redditConfigured) return;

  if (!window.rdt) {
    const rdt: RedditPixel = (...args: unknown[]) => {
      if (rdt.sendEvent) {
        rdt.sendEvent(...args);
        return;
      }

      rdt.callQueue?.push(args);
    };

    rdt.callQueue = [];
    window.rdt = rdt;
  }

  loadScript(
    "novelative-reddit-pixel",
    "https://www.redditstatic.com/ads/pixel.js",
    true,
  );

  window.rdt("init", REDDIT_PIXEL_ID);
  window.rdt("track", "PageVisit");
  redditConfigured = true;
}

function loadLemonSqueezyAffiliate() {
  window.lemonSqueezyAffiliateConfig = { store: "novelative" };
  loadScript(
    "novelative-lemonsqueezy-affiliate",
    "https://lmsqueezy.com/affiliate.js",
    true,
  );
}

function loadScript(id: string, src: string, async = false) {
  if (document.getElementById(id)) return;

  const script = document.createElement("script");
  script.id = id;
  script.src = src;
  script.async = async;
  script.defer = !async;
  document.head.appendChild(script);
}

function deleteCookies(namePrefixes: string[]) {
  const hostParts = window.location.hostname.split(".");
  const domainCandidates = hostParts.map((_, index) =>
    hostParts.slice(index).join("."),
  );

  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0]?.trim();
    if (!name || !namePrefixes.some((prefix) => name.startsWith(prefix))) {
      return;
    }

    expireCookie(name);
    domainCandidates.forEach((domain) => expireCookie(name, domain));
  });
}

function expireCookie(name: string, domain?: string) {
  document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${
    domain ? `; domain=${domain}` : ""
  }`;
}
