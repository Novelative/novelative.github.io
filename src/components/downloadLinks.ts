import { Apple } from "lucide-react";
import { createElement, type SVGProps } from "react";

type PlatformIconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function WindowsIcon({
  size = 24,
  width,
  height,
  ...props
}: PlatformIconProps) {
  return createElement(
    "svg",
    {
      ...props,
      width: width ?? size,
      height: height ?? size,
      viewBox: "0 0 448 512",
      role: "img",
      "aria-hidden": props["aria-hidden"] ?? true,
      focusable: "false",
      fill: "currentColor",
    },
    createElement("path", {
      d: "M0 93.7l183.6-25.3 0 177.4-183.6 0 0-152.1zM0 418.3l183.6 25.3 0-175.2-183.6 0 0 149.9zm203.8 28l244.2 33.7 0-211.6-244.2 0 0 177.9zm0-380.6l0 180.1 244.2 0 0-213.8-244.2 33.7z",
    }),
  );
}

export const winDownloadUrl =
  "https://github.com/Novelative/Win-User-Releases/releases/latest/download/Novelative-Setup.exe";

export const macDownloadUrl =
  "https://github.com/Novelative/Mac-User-Releases/releases/latest/download/Novelative-Setup.dmg";

export const downloadBuilds = [
  {
    platform: "Windows Installer",
    file: "Novelative-Setup.exe",
    size: "108.9 MB",
    href: winDownloadUrl,
    icon: WindowsIcon,
  },
  {
    platform: "macOS Installer",
    file: "Novelative-Setup.dmg",
    size: "127.8 MB",
    href: macDownloadUrl,
    icon: Apple,
  },
];
