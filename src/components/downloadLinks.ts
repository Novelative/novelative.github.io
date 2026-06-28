import { Apple, MonitorDown } from "lucide-react";
import releaseInfo from "../content/releaseInfo.json";

export const winDownloadUrl =
  releaseInfo.platforms.windows.downloadUrl;

export const macDownloadUrl =
  releaseInfo.platforms.mac.downloadUrl;

export const downloadBuilds = [
  {
    platform: releaseInfo.platforms.windows.installerLabel,
    file: releaseInfo.platforms.windows.file,
    size: releaseInfo.platforms.windows.size,
    href: winDownloadUrl,
    version: releaseInfo.platforms.windows.version,
    icon: MonitorDown,
  },
  {
    platform: releaseInfo.platforms.mac.installerLabel,
    file: releaseInfo.platforms.mac.file,
    size: releaseInfo.platforms.mac.size,
    href: macDownloadUrl,
    version: releaseInfo.platforms.mac.version,
    icon: Apple,
  },
];

export { releaseInfo };
