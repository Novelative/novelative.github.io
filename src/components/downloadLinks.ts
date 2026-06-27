import { Apple, MonitorDown } from "lucide-react";

export const winDownloadUrl =
  "https://github.com/Novelative/Win-User-Releases/releases/latest/download/Novelative-Setup.exe";

export const macDownloadUrl =
  "https://github.com/Novelative/Mac-User-Releases/releases/latest/download/Novelative-Setup-arm64.dmg";

export const downloadBuilds = [
  {
    platform: "Windows Installer",
    file: "Novelative-Setup.exe",
    size: "113.7 MB",
    href: winDownloadUrl,
    icon: MonitorDown,
  },
  {
    platform: "macOS Installer",
    file: "Novelative-Setup-arm64.dmg",
    size: "127.8 MB",
    href: macDownloadUrl,
    icon: Apple,
  },
];
