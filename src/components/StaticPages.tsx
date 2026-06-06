import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Check, Copy, Mail } from "lucide-react";
import { ParticleCanvas } from "./shared";

interface StaticPageSection {
  title: string;
  body?: string;
  items?: string[];
}

const downloadHelpSections: StaticPageSection[] = [
  {
    title: "Windows",
    items: [
      "Download Novelative-Setup.exe from the download page.",
      "Run the installer and allow Windows to confirm the app came from GitHub releases.",
      "Launch Novelative from the Start Menu after setup completes.",
      "If you already purchased a license, paste your key into the activation window when prompted.",
    ],
  },
  {
    title: "macOS",
    items: [
      "Download Novelative-Setup.dmg from the download page.",
      "Open the DMG and move Novelative into your Applications folder.",
      "If macOS warns that the app was downloaded from the internet, confirm that you want to open it.",
      "If Gatekeeper blocks the app, open System Settings > Privacy & Security and allow the app to launch.",
    ],
  },
  {
    title: "Trial & Licensing",
    body: "The beta includes a 30-days-of-use free trial with no sign-up required. Trial expiration does not delete local project files. Purchased license keys are delivered by email and can be reused on up to three personal devices. If you need activation help, use the license help page or contact support.",
  },
  {
    title: "Common Issues",
    body: "If a download stalls, retry from the platform-specific GitHub release page linked on Release Notes. If the installer is blocked by antivirus or system policy, verify that you downloaded the current beta build directly from Novelative's release links. If you still need help, contact support with your operating system and the exact message you saw.",
  },
];

const privacySections: StaticPageSection[] = [
  {
    title: "1. Overview",
    body: "Novelative is an offline-first desktop application. We designed it with the philosophy that your creative work is personal and private. Unlike cloud-based writing platforms, we do not store, process, or have access to the novels, notes, or world-building data you create within the application.",
  },
  {
    title: "2. Data Storage",
    body: "Local Storage: All content you create in Novelative, including projects, chapters, characters, and graphs, is stored locally on your computer's hard drive in standard JSON and text file formats. Novelative does not automatically sync your data to our servers. If you use Dropbox, Google Drive, OneDrive, iCloud, or another service, we have no access to those accounts.",
  },
  {
    title: "3. Data Collection",
    body: "We collect minimal data only for licensing and software improvement.",
    items: [
      "License validation: Our server verifies your license key and a hardware identifier to manage device limits.",
      "Crash reports: If enabled, anonymous crash details may be sent to help diagnose issues. These reports do not include manuscript text.",
      "Website analytics: With your consent, the website uses Google Analytics to understand traffic, pages viewed, and download activity.",
      "Advertising measurement: With your consent, the website may use Reddit Pixel and Lemon Squeezy affiliate tracking to measure ad performance, referrals, and purchases.",
    ],
  },
  {
    title: "4. Payment Information",
    body: "Payments are processed by Stripe and Lemon Squeezy. We do not store or have access to your credit card number.",
  },
  {
    title: "5. Cookies and Tracking Choices",
    body: "Optional analytics, advertising, and affiliate tracking are off until you accept them in the website's privacy choices. You can reject optional tracking, choose categories, or change your choice later from the Your Privacy Choices link in the footer. If your browser sends Global Privacy Control, we treat it as an opt-out of marketing and cross-context advertising tracking.",
  },
  {
    title: "6. Third-Party Services",
    body: "Google, Reddit, Stripe, Lemon Squeezy, EmailJS, and related service providers may process limited website, payment, support, or delivery data according to their own policies and our configuration of those services. We do not sell manuscript, note, or project content.",
  },
  {
    title: "7. Updates",
    body: "The app may check Novelative servers for new versions. This check sends the current version number and does not send personal writing data.",
  },
  {
    title: "8. Contact Us",
    body: "If you have any questions about this Privacy Policy, contact us at support@novelative.com.",
  },
];

const termsSections: StaticPageSection[] = [
  {
    title: "1. License Grant",
    body: "Purchasing Novelative grants you a personal, non-transferable license to install and use the app on up to three personal devices, provided those devices are controlled by the same user.",
  },
  {
    title: "2. Trial Use",
    body: "The beta can be used free for 30 days of use without sign-up. When the trial ends, the app may require a paid license for continued use, but your locally stored project files remain on your device.",
  },
  {
    title: "3. Ownership",
    body: "You own the stories, notes, tags, outlines, and project data you create in Novelative. Novelative retains ownership of the software, branding, and related website content.",
  },
  {
    title: "4. Acceptable Use",
    body: "You may not redistribute the app, resell license keys, bypass licensing controls, reverse engineer the software for commercial cloning, or abuse Novelative infrastructure.",
  },
  {
    title: "5. Updates & Beta Status",
    body: "Novelative is actively developed. Beta releases may change quickly, and some features may evolve before general release. Purchased licenses continue to receive future updates under the current lifetime-access model unless stated otherwise at purchase time.",
  },
  {
    title: "6. Warranty Disclaimer",
    body: "Novelative is provided as-is during beta. The app includes local backups and export tools, but you are responsible for keeping independent backups of important project files.",
  },
  {
    title: "7. Support",
    body: "Support is available through the support page and the community Discord. Response times may vary during beta.",
  },
];

export function DownloadHelpPage() {
  return (
    <HelpPage
      eyebrow="Install Help"
      title="Download Help"
      description="Installer guidance for Windows, macOS, trial activation, and common download issues."
      sections={downloadHelpSections}
    />
  );
}

export function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      description="Your stories belong to you."
      lastUpdated="June 2026"
      sections={privacySections}
    />
  );
}

export function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms & EULA"
      description="Clear rules for using Novelative during the beta and after purchase."
      lastUpdated="April 26, 2026"
      sections={termsSections}
    />
  );
}

function HelpPage({
  eyebrow,
  title,
  description,
  sections,
}: {
  eyebrow: string;
  title: string;
  description: string;
  sections: StaticPageSection[];
}) {
  return (
    <>
      <SimpleHero eyebrow={eyebrow} title={title} description={description} />
      <section className="queued-page-body">
        <div className="container queued-card-grid">
          {sections.map((section) => (
            <StaticInfoCard section={section} key={section.title} />
          ))}
        </div>
      </section>
    </>
  );
}

export function LicenseHelpPage() {
  const licenseKey = new URLSearchParams(window.location.search).get(
    "license_key",
  );
  const [copied, setCopied] = useState(false);

  const copyLicenseKey = async () => {
    if (!licenseKey) return;
    await navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="license-page">
      <ParticleCanvas />
      <div className="support-gradient" />
      <div className="license-card">
        {licenseKey ? (
          <>
            <div className="license-status-icon success">
              <Check size={38} />
            </div>
            <h1>You're In.</h1>
            <p>
              Thank you for purchasing Novelative. Your journey to a finished
              manuscript begins now.
            </p>
            <span>Click below to copy your key</span>
            <button
              type="button"
              className={`license-key-box ${copied ? "copied" : ""}`}
              onClick={copyLicenseKey}
            >
              <code>{licenseKey}</code>
              <small>
                <Copy size={14} />
                {copied ? "Copied!" : "Tap to copy"}
              </small>
            </button>
            {copied && (
              <div className="license-next-steps">
                <h2>You're all set!</h2>
                <p>
                  Launch the Novelative app on your computer and paste the key
                  into the activation window to unlock your full writing studio.
                </p>
                <a href="/download">Don't have the app? Download here</a>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="license-status-icon">
              <Mail size={38} />
            </div>
            <h1>Check Your Email</h1>
            <p>
              We couldn't automatically detect a license key in this link. If
              you have purchased Novelative, check your email inbox and spam
              folder for your receipt. Your license key will be listed there.
            </p>
            <div className="license-actions">
              <a className="primary-button" href="/">
                Return Home
              </a>
              <a className="download-secondary-button" href="/support">
                Contact Support
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function LegalPage({
  eyebrow,
  title,
  description,
  lastUpdated,
  sections,
}: {
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: StaticPageSection[];
}) {
  return (
    <>
      <SimpleHero eyebrow={eyebrow} title={title} description={description} />
      <section className="queued-page-body">
        <article className="legal-document">
          <p className="legal-updated">Last Updated: {lastUpdated}</p>
          {sections.map((section) => (
            <StaticDocumentSection section={section} key={section.title} />
          ))}
        </article>
      </section>
    </>
  );
}

function SimpleHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="simple-page-hero">
      {!shouldReduceMotion && <ParticleCanvas />}
      <div className="support-gradient" />
      <div className="simple-page-hero-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}

function StaticInfoCard({ section }: { section: StaticPageSection }) {
  return (
    <article className="queued-info-card">
      <h2>{section.title}</h2>
      {section.body && <p>{section.body}</p>}
      {section.items && (
        <ol>
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      )}
    </article>
  );
}

function StaticDocumentSection({ section }: { section: StaticPageSection }) {
  return (
    <section>
      <h2>{section.title}</h2>
      {section.body && <p>{section.body}</p>}
      {section.items && (
        <ul>
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
