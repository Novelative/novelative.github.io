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

const releaseChangelog = [
  {
    version: releaseInfo.currentRelease.version,
    title: releaseInfo.currentRelease.title,
    date: releaseInfo.currentRelease.publishedDate,
    platform: releaseInfo.currentRelease.platform,
    changes: [
      "Added the first implementation of Scrivener project import.",
      "Added Google Docs import for bringing in externally drafted work.",
      "Improved paste handling for styled text and clearer pasted-font toolbar feedback.",
      "Included the latest stability fixes for the current beta builds.",
    ],
  },
  {
    version: "v0.1.7-beta",
    title: "Novelative v0.1.7-beta",
    date: "June 20, 2026",
    platform: "Windows and macOS",
    changes: [
      "Updated the public beta release promoted from the download page.",
      "Refreshed release notes and download links for the v0.1.7 beta cycle.",
      "Kept macOS release availability visible while platform builds were being published.",
    ],
  },
  {
    version: "v0.1.6-beta",
    title: "Novelative v0.1.6-beta",
    date: "June 5, 2026",
    platform: "Windows and macOS",
    changes: [
      "Promoted the next public beta build for both desktop platforms.",
      "Kept GitHub release links and download messaging aligned with the public installers.",
      "Improved the canvas node cards animation section on the website alongside the release update.",
    ],
  },
  {
    version: "v0.1.5-beta",
    title: "Novelative v0.1.5-beta",
    date: "May 7, 2026",
    platform: "Windows and macOS",
    changes: [
      "Established the React release notes page around the current public beta.",
      "Added Windows and macOS release links, release facts, and download-source guidance.",
      "Preserved the original changelog structure from the old static release notes page.",
    ],
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

          <section className="release-changelog" aria-labelledby="version-history">
            <div className="release-section-heading">
              <p className="eyebrow">Version History</p>
              <h2 id="version-history">Changelog</h2>
              <p>
                A release-by-release record of public beta updates published
                for Novelative.
              </p>
            </div>

            <div className="release-changelog-list">
              {releaseChangelog.map((release, index) => (
                <MotionCard
                  key={release.version}
                  className="release-card release-changelog-card"
                  delay={index * 0.06}
                >
                  <div className="release-changelog-meta">
                    <span>{release.date}</span>
                    <span>{release.platform}</span>
                  </div>
                  <h3>{release.title}</h3>
                  <ul>
                    {release.changes.map((change) => (
                      <li key={change}>{change}</li>
                    ))}
                  </ul>
                </MotionCard>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
