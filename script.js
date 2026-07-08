(function () {
  const consentStorageKey = "novelativeCookieConsent";
  const consentVersion = 1;
  const redditPixelId = (window.NOVELATIVE_REDDIT_PIXEL_ID || "").trim();
  let googleConsentInitialized = false;
  let redditConfigured = false;

  function hasGlobalPrivacyControl() {
    return navigator.globalPrivacyControl === true;
  }

  function normalizeConsentPreferences(preferences) {
    const globalPrivacyControl = hasGlobalPrivacyControl();
    return {
      version: consentVersion,
      updatedAt: preferences.updatedAt || new Date().toISOString(),
      analytics: Boolean(preferences.analytics),
      marketing: globalPrivacyControl ? false : Boolean(preferences.marketing),
      globalPrivacyControl,
    };
  }

  function createDefaultConsentPreferences() {
    return normalizeConsentPreferences({
      version: consentVersion,
      updatedAt: new Date().toISOString(),
      analytics: false,
      marketing: false,
      globalPrivacyControl: hasGlobalPrivacyControl(),
    });
  }

  function getStoredConsentPreferences() {
    try {
      const stored = localStorage.getItem(consentStorageKey);
      if (!stored) return null;

      const preferences = JSON.parse(stored);
      if (preferences.version !== consentVersion) return null;

      return normalizeConsentPreferences(preferences);
    } catch (error) {
      return null;
    }
  }

  function saveConsentPreferences(input) {
    const preferences = normalizeConsentPreferences({
      version: consentVersion,
      updatedAt: new Date().toISOString(),
      analytics: input.analytics,
      marketing: input.marketing,
      globalPrivacyControl: hasGlobalPrivacyControl(),
    });

    localStorage.setItem(consentStorageKey, JSON.stringify(preferences));
    applyConsentPreferences(preferences);
    return preferences;
  }

  function applyConsentPreferences(preferences) {
    const normalized = normalizeConsentPreferences(preferences);
    initializeGoogleConsent();
    updateGoogleConsent(normalized);

    if (!normalized.analytics) {
      deleteCookies(["_ga", "_gid", "_gat", "_gac", "_gcl"]);
    }

    if (normalized.marketing) {
      loadRedditPixel();
      loadLemonSqueezyAffiliate();
    } else {
      deleteCookies(["_rdt", "_rdt_uuid", "rdt_uuid", "lms"]);
    }
  }

  function initializeGoogleConsent() {
    if (googleConsentInitialized) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag() {
        window.dataLayer.push(arguments);
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

  function updateGoogleConsent(preferences) {
    if (!window.gtag) return;

    window.gtag("consent", "update", {
      ad_storage: preferences.marketing ? "granted" : "denied",
      ad_user_data: preferences.marketing ? "granted" : "denied",
      ad_personalization: preferences.marketing ? "granted" : "denied",
      analytics_storage: preferences.analytics ? "granted" : "denied",
    });
    window.gtag("set", "allow_google_signals", preferences.marketing);
    window.gtag("set", "allow_ad_personalization_signals", preferences.marketing);
  }

  function loadRedditPixel() {
    if (!redditPixelId || redditConfigured) return;

    if (!window.rdt) {
      const rdt = function () {
        if (rdt.sendEvent) {
          rdt.sendEvent.apply(rdt, arguments);
          return;
        }
        rdt.callQueue.push(Array.prototype.slice.call(arguments));
      };
      rdt.callQueue = [];
      window.rdt = rdt;
    }

    loadScript("novelative-reddit-pixel", "https://www.redditstatic.com/ads/pixel.js", true);
    window.rdt("init", redditPixelId);
    window.rdt("track", "PageVisit");
    redditConfigured = true;
  }

  function loadLemonSqueezyAffiliate() {
    window.lemonSqueezyAffiliateConfig = { store: "novelative" };
    loadScript("novelative-lemonsqueezy-affiliate", "https://lmsqueezy.com/affiliate.js", true);
  }

  function loadScript(id, src, async) {
    if (document.getElementById(id)) return;

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = Boolean(async);
    script.defer = !async;
    document.head.appendChild(script);
  }

  function deleteCookies(namePrefixes) {
    const hostParts = window.location.hostname.split(".");
    const domainCandidates = hostParts.map(function (_, index) {
      return hostParts.slice(index).join(".");
    });

    document.cookie.split(";").forEach(function (cookie) {
      const name = cookie.split("=")[0] && cookie.split("=")[0].trim();
      if (!name || !namePrefixes.some(function (prefix) { return name.indexOf(prefix) === 0; })) {
        return;
      }

      expireCookie(name);
      domainCandidates.forEach(function (domain) {
        expireCookie(name, domain);
      });
    });
  }

  function expireCookie(name, domain) {
    document.cookie =
      name +
      "=; Max-Age=0; path=/; SameSite=Lax" +
      (domain ? "; domain=" + domain : "");
  }

  function createCookieMarkup(view, preferences) {
    if (view === "settings") {
      return (
        '<div class="cookie-modal-backdrop">' +
          '<section class="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title">' +
            '<div class="cookie-modal-header">' +
              '<div>' +
                '<p class="eyebrow">Privacy Choices</p>' +
                '<h2 id="cookie-settings-title">Cookie settings</h2>' +
              "</div>" +
              '<button type="button" data-cookie-close>Close</button>' +
            "</div>" +
            '<div class="cookie-option-list">' +
              cookieOption("Strictly necessary", "Required to remember privacy choices.", true, true, "necessary") +
              cookieOption("Analytics", "Allows Google Analytics to measure visits, pages, and downloads.", preferences.analytics, false, "analytics") +
              cookieOption("Marketing and affiliate measurement", "Allows Reddit Pixel and Lemon Squeezy affiliate tracking.", preferences.marketing, preferences.globalPrivacyControl, "marketing") +
            "</div>" +
            (preferences.globalPrivacyControl
              ? '<p class="cookie-gpc-note">Global Privacy Control is enabled in this browser. Marketing tracking cannot be turned on while that signal is present.</p>'
              : "") +
            '<div class="cookie-modal-actions">' +
              '<button type="button" data-cookie-reject>Reject optional</button>' +
              '<button type="button" class="cookie-primary" data-cookie-save>Save choices</button>' +
            "</div>" +
          "</section>" +
        "</div>"
      );
    }

    return (
      '<section class="cookie-banner" aria-label="Cookie choices">' +
        '<div class="cookie-banner-inner">' +
        '<div class="cookie-banner-copy">' +
          '<p>This site uses cookies to ensure you get the best experience. ' +
            '<button type="button" class="cookie-learn-more" data-cookie-learn>Learn more</button>' +
          "</p>" +
          (preferences.globalPrivacyControl
            ? '<p class="cookie-gpc-note">Your browser privacy signal is honored.</p>'
            : "") +
        "</div>" +
        '<div class="cookie-banner-actions">' +
          '<button type="button" data-cookie-reject>No thanks</button>' +
          '<button type="button" class="cookie-primary" data-cookie-accept>Got it</button>' +
        "</div>" +
        "</div>" +
      "</section>"
    );
  }

  function cookieOption(title, description, checked, disabled, name) {
    return (
      '<label class="cookie-option' + (disabled ? " disabled" : "") + '">' +
        "<span>" +
          "<strong>" + title + "</strong>" +
          "<small>" + description + "</small>" +
        "</span>" +
        '<input type="checkbox" data-cookie-toggle="' + name + '"' +
          (checked ? " checked" : "") +
          (disabled ? " disabled" : "") +
        ">" +
      "</label>"
    );
  }

  function setupCookieConsent() {
    let preferences = getStoredConsentPreferences() || createDefaultConsentPreferences();
    let draft = Object.assign({}, preferences);
    let view = getStoredConsentPreferences() ? null : "banner";
    const mount = document.createElement("div");
    mount.id = "cookie-consent-root";
    document.body.appendChild(mount);

    function render() {
      applyConsentPreferences(preferences);
      mount.innerHTML = view ? createCookieMarkup(view, draft) : "";
      bindCookieControls();
    }

    function closeSettings() {
      view = getStoredConsentPreferences() ? null : "banner";
      render();
    }

    function commit(nextPreferences) {
      preferences = saveConsentPreferences(nextPreferences);
      draft = Object.assign({}, preferences);
      view = null;
      render();
    }

    function rejectOptional() {
      commit({ analytics: false, marketing: false });
    }

    function acceptAllOptional() {
      commit({
        analytics: true,
        marketing: !preferences.globalPrivacyControl,
      });
    }

    function bindCookieControls() {
      const learn = mount.querySelector("[data-cookie-learn]");
      const close = mount.querySelector("[data-cookie-close]");
      const reject = mount.querySelectorAll("[data-cookie-reject]");
      const accept = mount.querySelector("[data-cookie-accept]");
      const save = mount.querySelector("[data-cookie-save]");

      if (learn) {
        learn.addEventListener("click", function () {
          draft = Object.assign({}, preferences, {
            analytics: true,
            marketing: !preferences.globalPrivacyControl,
          });
          view = "settings";
          render();
        });
      }

      if (close) close.addEventListener("click", closeSettings);
      reject.forEach(function (button) {
        button.addEventListener("click", rejectOptional);
      });

      if (accept) {
        accept.addEventListener("click", acceptAllOptional);
      }

      if (save) {
        save.addEventListener("click", function () {
          const analytics = mount.querySelector('[data-cookie-toggle="analytics"]');
          const marketing = mount.querySelector('[data-cookie-toggle="marketing"]');
          commit({
            analytics: Boolean(analytics && analytics.checked),
            marketing: Boolean(marketing && marketing.checked),
          });
        });
      }
    }

    document.querySelectorAll("[data-cookie-settings]").forEach(function (button) {
      button.addEventListener("click", function () {
        draft = Object.assign({}, preferences);
        view = "settings";
        render();
      });
    });

    render();
  }

  function setupPurchasePage() {
    if (!document.querySelector(".lemonsqueezy-button")) return;
    loadScript("novelative-lemonsqueezy-checkout", "https://assets.lemonsqueezy.com/lemon.js", false);

    const button = document.getElementById("purchase-btn-tracking");
    if (!button) return;

    button.addEventListener("click", function () {
      if (!window.gtag) return;
      window.gtag("event", "PurchaseClicked", {
        event_category: "engagement",
        event_label: "purchase_button_click",
      });
    });
  }

  setupCookieConsent();
  setupPurchasePage();
})();
