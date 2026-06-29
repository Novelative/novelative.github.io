import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  downloadBuilds,
  macDownloadUrl,
  releaseInfo,
  winDownloadUrl,
} from "./downloadLinks";
import { trackDownloadLinkClick } from "../downloadAnalytics";
import type { Theme } from "./shared";
import {
  MotionCard,
  ParticleCanvas,
  reveal,
} from "./shared";

const downloadNotes = [
  {
    title: "System Notes",
    body: "Novelative is a desktop app for Windows and macOS. Plan for roughly 300 MB of free space for install overhead, updates, and local project storage.",
  },
  {
    title: "Offline Accuracy",
    body: "Core writing, project storage, and organization are local-first. Internet is mainly needed for downloading builds, checking updates, and Word Explorer / thesaurus lookups.",
  },
  {
    title: "Need Help?",
    body: "Installation guidance, release history, and support are available before and after you install.",
  },
];

export function DownloadPage({ theme }: { theme: Theme }) {
  const shouldReduceMotion = useReducedMotion();
  const preferredPlatform = usePreferredPlatform();
  const logo =
    theme === "light"
      ? "/assets/lightmodeicon.png"
      : "/assets/darkmodeicon.png";
  const mainDownload =
    preferredPlatform === "mac" ? macDownloadUrl : winDownloadUrl;
  const mainLabel =
    preferredPlatform === "mac"
      ? releaseInfo.platforms.mac.buttonLabel
      : releaseInfo.platforms.windows.buttonLabel;
  const mainReleaseVersion =
    preferredPlatform === "mac"
      ? releaseInfo.platforms.mac.version
      : releaseInfo.platforms.windows.version;
  const mainFile =
    preferredPlatform === "mac"
      ? releaseInfo.platforms.mac.file
      : releaseInfo.platforms.windows.file;
  const mainVersion =
    preferredPlatform === "mac"
      ? `${releaseInfo.platforms.mac.label} ${mainReleaseVersion}`
      : `${releaseInfo.platforms.windows.label} ${mainReleaseVersion}`;
  const mainSize =
    preferredPlatform === "mac"
      ? releaseInfo.platforms.mac.size
      : releaseInfo.platforms.windows.size;

  useEffect(() => {
    document.title = "Download | Novelative";
  }, []);

  return (
    <>
      <section className="download-hero">
        {!shouldReduceMotion && <ParticleCanvas />}
        <div className="download-hero-gradient" />
        <motion.div
          className="download-hero-content"
          initial="hidden"
          animate="show"
          variants={reveal}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <img src={logo} className="download-logo" alt="Novelative Logo" />
          <h1>
            Begin Your <span>Masterpiece.</span>
          </h1>
          <p>
            Download the latest version of Novelative.
            <br />
            You get 30 days of use <strong>FREE</strong>.
          </p>
          <a
            className="download-main-button"
            href={mainDownload}
            onClick={(event) =>
              trackDownloadLinkClick(event, {
                platform: preferredPlatform,
                source: "download_page",
                button: "hero",
                url: mainDownload,
                fileName: mainFile,
                version: mainReleaseVersion,
                linkText: mainLabel,
              })
            }
          >
            <span>{mainLabel}</span>
            <ArrowRight size={19} />
          </a>
          <div className="download-version">
            <span>{mainVersion}</span>
            <span />
            <span>{mainSize}</span>
          </div>
          <div className="download-proof-row">
            <span>Windows + macOS</span>
            <span>30 Days-Of-Use Free</span>
            <span>No Sign-Up... Ever</span>
            <span>One-Time Purchase of $50</span>
          </div>
        </motion.div>
      </section>

      <section className="download-details">
        <div className="download-details-gradient" />
        <div className="container download-details-inner">
          <div className="download-release-grid">
            <MotionCard className="download-panel download-release-panel">
              <p className="eyebrow">Latest Release</p>
              <div className="download-release-heading">
                <h2>{releaseInfo.currentRelease.title}</h2>
                <span>Published {releaseInfo.currentRelease.publishedDate}</span>
              </div>
              <p>{releaseInfo.currentRelease.summary}</p>
              <div className="download-build-grid">
                {downloadBuilds.map((build) => (
                  <a
                    className="download-build-card"
                    href={build.href}
                    key={build.platform}
                    onClick={(event) =>
                      trackDownloadLinkClick(event, {
                        platform: build.platformKey,
                        source: "download_page",
                        button: "release_card",
                        url: build.href,
                        fileName: build.file,
                        version: build.version,
                        linkText: build.platform,
                      })
                    }
                  >
                    <div>
                      <strong>{build.platform}</strong>
                      <build.icon size={22} />
                    </div>
                    <span>{build.file}</span>
                    <span>{build.size}</span>
                  </a>
                ))}
              </div>
            </MotionCard>

            <MotionCard
              className="download-panel download-summary-panel"
              delay={0.08}
            >
              <h2>What You Get</h2>
              <dl>
                <div>
                  <dt>Trial</dt>
                  <dd>30 days of use free</dd>
                </div>
                <div>
                  <dt>Activation</dt>
                  <dd>No sign-up ever</dd>
                </div>
                <div>
                  <dt>Purchase Model</dt>
                  <dd>One-time payment</dd>
                </div>
                <div>
                  <dt>Storage</dt>
                  <dd>Local-first projects</dd>
                </div>
                <div>
                  <dt>Release Status</dt>
                  <dd>Active beta</dd>
                </div>
              </dl>
            </MotionCard>
          </div>

          <div className="download-note-grid">
            {downloadNotes.map((note, index) => (
              <MotionCard
                className="download-panel download-note-card"
                delay={index * 0.08}
                key={note.title}
              >
                <h3>{note.title}</h3>
                <p>{note.body}</p>
                {note.title === "Need Help?" && (
                  <div className="download-help-links">
                    <a href="/download-help">Download Help</a>
                    <a href="/release-notes">Release Notes</a>
                    <a href="/contact">Support</a>
                  </div>
                )}
              </MotionCard>
            ))}
          </div>

          <MotionCard className="download-panel download-next-panel">
            <div>
              <p className="eyebrow">Next Step</p>
              <h2>Install the beta, then decide after real writing time.</h2>
              <p>
                Start with the free 30-days-of-use trial, draft and plot inside one
                project, then move to the purchase page only when you want to
                keep the app beyond the trial.
              </p>
            </div>
            <div className="download-next-actions">
              <a className="download-secondary-primary" href="/purchase">
                See Purchase Details
              </a>
              <a className="download-secondary-button" href="/features">
                Review Features
              </a>
            </div>
          </MotionCard>
        </div>
      </section>
    </>
  );
}

function usePreferredPlatform() {
  const [platform, setPlatform] = useState<"windows" | "mac">("windows");

  useEffect(() => {
    const platformText = `${navigator.platform} ${navigator.userAgent}`;
    setPlatform(/Mac|Mac OS/i.test(platformText) ? "mac" : "windows");
  }, []);

  return platform;
}
