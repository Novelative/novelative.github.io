import type { MouseEvent } from "react";
import type { DownloadPlatform } from "./components/downloadLinks";

export type DownloadTrackingSource =
  | "download_page"
  | "homepage"
  | "purchase_page";

export type DownloadTrackingButton =
  | "hero"
  | "release_card"
  | "final_cta"
  | "purchase_download_panel";

type DownloadTrackingInput = {
  platform: DownloadPlatform;
  source: DownloadTrackingSource;
  button: DownloadTrackingButton;
  url: string;
  fileName: string;
  version: string;
  linkText: string;
};

const sourceLabels: Record<DownloadTrackingSource, string> = {
  download_page: "download page",
  homepage: "homepage",
  purchase_page: "purchase page",
};

const platformLabels: Record<DownloadPlatform, string> = {
  windows: "Windows",
  mac: "Mac",
};

const navigationDelayMs = 700;

export function trackDownloadClick(
  {
    platform,
    source,
    button,
    url,
    fileName,
    version,
    linkText,
  }: DownloadTrackingInput,
  onComplete?: () => void,
) {
  if (typeof window === "undefined") return;

  const dataLayer = (window.dataLayer = window.dataLayer || []);
  const fileExtension = fileName.includes(".")
    ? fileName.split(".").pop()?.toLowerCase()
    : undefined;
  const downloadLabel = `Download for ${platformLabels[platform]} via the ${sourceLabels[source]}`;
  const payload: Record<string, unknown> = {
    event: "download_click",
    download_platform: platform,
    download_source: source,
    download_button: button,
    download_label: downloadLabel,
    download_url: url,
    file_name: fileName,
    file_extension: fileExtension,
    version,
    link_url: url,
    link_text: linkText,
  };

  if (onComplete) {
    payload.event_callback = onComplete;
    payload.event_timeout = navigationDelayMs;
  }

  dataLayer.push(payload);
}

export function trackDownloadLinkClick(
  event: MouseEvent<HTMLAnchorElement>,
  input: DownloadTrackingInput,
) {
  const isPlainLeftClick =
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey;
  const target = event.currentTarget.target;
  const opensInCurrentTab = !target || target === "_self";

  if (!isPlainLeftClick || !opensInCurrentTab) {
    trackDownloadClick(input);
    return;
  }

  event.preventDefault();

  const href = event.currentTarget.href;
  let hasNavigated = false;
  const continueNavigation = () => {
    if (hasNavigated) return;
    hasNavigated = true;
    window.location.href = href;
  };

  trackDownloadClick(input, continueNavigation);
  window.setTimeout(continueNavigation, navigationDelayMs);
}