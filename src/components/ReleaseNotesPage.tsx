import { motion, useReducedMotion } from "framer-motion";
import {
  Apple,
  Download,
  FileClock,
  MonitorDown,
  Newspaper,
  Wrench,
} from "lucide-react";
import { releaseInfo } from "./downloadLinks";
import { MotionCard, ParticleCanvas, reveal } from "./shared";

const releaseLinks = [
  {
    label: releaseInfo.platforms.windows.releaseLabel,
    href: releaseInfo.platforms.windows.releaseUrl,
    icon: MonitorDown,
    primary: true,
  },
  {
    label: releaseInfo.platforms.mac.releaseLabel,
    href: releaseInfo.platforms.mac.releaseUrl,
    icon: Apple,
    primary: false,
  },
];

const releaseFacts = [
  { label: "Status", value: releaseInfo.status },
  { label: "Trial", value: releaseInfo.trial },
  { label: "Pricing Model", value: releaseInfo.pricingModel },
  {
    label: "Latest Builds",
    value: `${releaseInfo.platforms.windows.label} ${releaseInfo.platforms.windows.version}, ${releaseInfo.platforms.mac.label} ${releaseInfo.platforms.mac.version}`,
  },
];

const releaseCards = [
  {
    title: "Download Sources",
    body: "Use the direct platform installers from the download page or the GitHub release pages above.",
    href: "/download",
    link: "Open download page",
    icon: Download,
  },
  {
    title: "Install Help",
    body: "Need help with installer prompts or macOS security warnings? Start with Download Help.",
    href: "/download-help",
    link: "Read download help",
    icon: Wrench,
  },
  {
    title: "Product Updates",
    body: "Broader product announcements and writing-focused updates continue on the blog.",
    href: "/blog",
    link: "Visit the blog",
    icon: Newspaper,
  },
];

export function ReleaseNotesPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      <section className="release-hero">
        {!shouldReduceMotion && <ParticleCanvas />}
        <div className="support-gradient" />
        <motion.div
          className="release-hero-copy"
          initial="hidden"
          animate="show"
          variants={reveal}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="eyebrow">Changelog</p>
          <h1>Release Notes</h1>
          <p>
            Track current beta builds, download sources, and product update
            history.
          </p>
        </motion.div>
      </section>

      <section className="release-body">
        <div className="container release-body-inner">
          <div className="release-top-grid">
            <MotionCard className="release-card release-current-card">
              <p className="eyebrow">Current Release</p>
              <h2>{releaseInfo.currentRelease.title}</h2>
              <p>
                Published {releaseInfo.currentRelease.publishedDate} for{" "}
                {releaseInfo.currentRelease.platform}.{" "}
                {releaseInfo.currentRelease.summary}
              </p>
              <div className="release-action-row">
                {releaseLinks.map((link) => (
                  <a
                    key={link.label}
                    className={
                      link.primary
                        ? "release-primary-link"
                        : "release-secondary-link"
                    }
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <link.icon size={19} />
                    {link.label}
                  </a>
                ))}
              </div>
            </MotionCard>

            <MotionCard className="release-card release-facts-card" delay={0.08}>
              <FileClock size={28} />
              <h2>Release Facts</h2>
              <dl>
                {releaseFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </MotionCard>
          </div>

          <div className="release-info-grid">
            {releaseCards.map((card, index) => (
              <MotionCard
                key={card.title}
                className="release-card release-info-card"
                delay={index * 0.08}
              >
                <card.icon size={28} />
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <a href={card.href}>{card.link}</a>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
