import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeInfo,
  BadgePercent,
  ChevronDown,
  CircleCheck,
  CreditCard,
  Download,
  Laptop,
} from "lucide-react";
import {
  MotionCard,
  ParticleCanvas,
  reveal,
} from "./shared";
import { downloadBuilds } from "./downloadLinks";

const purchaseUrl =
  "https://novelative.lemonsqueezy.com/checkout/buy/58b937de-134c-4bdb-ab55-90896c503fa2?embed=1&media=0&desc=0";

const purchaseBenefits = [
  {
    title: "Pay once",
    body: "No monthly renewal or subscription billing.",
  },
  {
    title: "Lifetime access",
    body: "Keep using the licensed app indefinitely.",
  },
  {
    title: "Updates included",
    body: "Future app updates remain included under the current model.",
  },
  {
    title: "Three devices",
    body: "Install on up to three personal computers.",
  },
];

const purchaseDownloadSteps = [
  "Buy once or use your trial",
  "Download the Windows or macOS installer",
  "Paste the emailed license key when prompted",
];

const purchaseFaqs = [
  {
    question: "Is this really a one-time purchase?",
    answer:
      "Yes. Novelative uses a one-time purchase model. There are no recurring subscription charges tied to the Lifetime plan.",
  },
  {
    question: "Can I install Novelative on multiple computers?",
    answer:
      "Yes. The current license allows up to three personal-device installs for the same user, which covers common desktop and laptop setups.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. The beta includes 30 days of free use with no sign-up required. If you decide to continue after that, you can purchase a lifetime license.",
  },
  {
    question: "What happens if I don't buy after the trial?",
    answer:
      "Your local project files remain on your device. Trial expiration does not delete your work, so you can still back it up or purchase later without losing your data.",
  },
  {
    question: "Do updates stay included?",
    answer:
      "Under the current lifetime model, future app updates are included with your purchase. That is one of the main reasons the site emphasizes install-first confidence before asking you to buy.",
  },
  {
    question: "Can I export my work?",
    answer:
      "Yes. Novelative includes compile and export tools for formats like DOCX, PDF, EPUB, Markdown, HTML, and TXT, so you are not locked into the app when your manuscript is ready to move.",
  },
];

export function PurchasePage() {
  const shouldReduceMotion = useReducedMotion();
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    if (
      document.querySelector(
        'script[src="https://assets.lemonsqueezy.com/lemon.js"]',
      )
    ) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://assets.lemonsqueezy.com/lemon.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const trackPurchaseClick = () => {
    (
      window as unknown as {
        gtag?: (...args: unknown[]) => void;
      }
    ).gtag?.("event", "PurchaseClicked", {
      event_category: "engagement",
      event_label: "purchase_button_click",
    });
  };

  return (
    <>
      <section className="purchase-hero">
        {!shouldReduceMotion && <ParticleCanvas />}
        <div className="purchase-hero-gradient" />
        <motion.div
          className="purchase-hero-content"
          initial="hidden"
          animate="show"
          variants={reveal}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1>
            One Plan. <span>Unlimited Creativity.</span>
          </h1>
          <p>
            A simple one-time payment for lifetime access. Includes all features
            and future updates. No subscriptions, ever.
          </p>
        </motion.div>
      </section>

      <section className="purchase-pricing-section">
        <div className="container purchase-pricing-grid">
          <MotionCard className="purchase-card purchase-plan-card">
            <div className="purchase-plan-header">
              <div className="purchase-plan-kicker">
                <span className="purchase-badge">Beta Pricing</span>
                <span className="purchase-plan-pill">Lifetime license</span>
              </div>
              <h2>Novelative Lifetime</h2>
              <p>
                Own the full desktop app after your free trial. No subscription
                lock-in or monthly renewal.
              </p>
              <div className="purchase-price">
                <span>Beta lifetime price</span>
                <strong>
                  $25<small>.00</small>
                </strong>
                <div className="purchase-price-note">
                  <span>Normally $50</span>
                  <span>Pay once</span>
                </div>
              </div>
            </div>

            <ul className="purchase-benefit-list">
              {purchaseBenefits.map((item) => (
                <li key={item.title}>
                  <CircleCheck size={22} />
                  <span>
                    <strong>{item.title}</strong>
                    {item.body}
                  </span>
                </li>
              ))}
            </ul>

            <div className="purchase-trust-strip" aria-label="Purchase details">
              <span>
                <CircleCheck size={16} />
                30-day trial first
              </span>
              <span>
                <CircleCheck size={16} />
                License key by email
              </span>
            </div>

            <a
              id="purchase-btn-tracking"
              className="lemonsqueezy-button purchase-buy-button"
              href={purchaseUrl}
              onClick={trackPurchaseClick}
            >
              <CreditCard size={22} />
              Buy Lifetime for $25
              <ArrowRight size={20} />
            </a>
            <p className="purchase-cta-note">
              One-time payment. Your project files stay local.
            </p>
          </MotionCard>

          <div className="purchase-side-grid">
            <MotionCard
              className="purchase-card purchase-info-card"
              delay={0.08}
            >
              <BadgePercent size={28} />
              <h3>What lifetime access means</h3>
              <p>
                You are buying the full desktop app, not renting it monthly. The
                current beta pricing includes ongoing updates and the same core
                workspace: manuscript editor, whiteboard plotting, graph view,
                tags, links, and export tools.
              </p>
            </MotionCard>
            <MotionCard
              className="purchase-card purchase-info-card"
              delay={0.12}
            >
              <Laptop size={28} />
              <h3>Before you pay</h3>
              <div className="purchase-before-list">
                <p>
                  <strong>30-days-of-use free trial:</strong> Install first and test the
                  real workflow before purchasing.
                </p>
                <p>
                  <strong>Local-first files:</strong> Your project files stay on
                  your device and are not deleted when the trial ends.
                </p>
                <p>
                  <strong>Support:</strong> Purchase, install, and license help
                  are available through <a href="/contact">support</a>.
                </p>
              </div>
            </MotionCard>
            <MotionCard
              className="purchase-card purchase-info-card"
              delay={0.16}
            >
              <Download size={28} />
              <h3>Useful links</h3>
              <div className="purchase-link-row">
                <a href="/download">Download Beta</a>
                <a href="/release-notes">Release Notes</a>
                <a href="/download-help">Download Help</a>
                <a href="/features">Features</a>
              </div>
            </MotionCard>
          </div>
        </div>
      </section>

      <section className="purchase-download-section">
        <div className="container purchase-download-grid">
          <motion.div
            className="purchase-download-copy"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={reveal}
            transition={{ duration: 0.65 }}
          >
            <p className="eyebrow">Purchase + Download</p>
            <h2>Checkout should not slow down your install.</h2>
            <p>
              After purchase, keep moving: download the current beta, open the
              app, and use the license key delivered to your email.
            </p>
            <ol className="purchase-download-steps">
              {purchaseDownloadSteps.map((step) => (
                <li key={step}>
                  <CircleCheck size={18} />
                  {step}
                </li>
              ))}
            </ol>
          </motion.div>

          <MotionCard className="purchase-download-panel" delay={0.08}>
            <div className="purchase-download-panel-header">
              <Download size={28} />
              <div>
                <h3>Buy, then install Novelative</h3>
                <p>Purchase once, then choose your Windows or macOS installer.</p>
              </div>
            </div>

            <a
              className="lemonsqueezy-button purchase-download-buy"
              href={purchaseUrl}
              onClick={trackPurchaseClick}
            >
              Buy Lifetime for $25
              <ArrowRight size={18} />
            </a>

            <div className="purchase-download-builds">
              {downloadBuilds.map((build) => (
                <a href={build.href} key={build.platform}>
                  <span>
                    <strong>{build.platform}</strong>
                    <small>{build.file}</small>
                  </span>
                  <build.icon size={24} />
                </a>
              ))}
            </div>

            <div className="purchase-download-links">
              <a href="/download-help">Install help</a>
              <a href="/license-help">License help</a>
              <a href="/release-notes">Release notes</a>
            </div>
          </MotionCard>
        </div>
      </section>

      <section className="purchase-faq-section">
        <div className="narrow-container">
          <motion.h2
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            variants={reveal}
            transition={{ duration: 0.65 }}
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="purchase-faq-list">
            {purchaseFaqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div className="purchase-faq-item" key={faq.question}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span>
                      <BadgeInfo size={20} />
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={isOpen ? "rotated" : ""}
                      size={22}
                    />
                  </button>
                  <motion.div
                    className="purchase-faq-answer"
                    initial={false}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.24 }}
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
