import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { BlogPage } from "./components/BlogPage";
import { CookieConsent } from "./components/CookieConsent";
import { DownloadPage } from "./components/DownloadPage";
import { downloadBuilds } from "./components/downloadLinks";
import { PurchasePage } from "./components/PurchasePage";
import { ReleaseNotesPage } from "./components/ReleaseNotesPage";
import { SupportPage } from "./components/SupportPage";
import {
  DownloadHelpPage,
  LicenseHelpPage,
  PrivacyPage,
  TermsPage,
} from "./components/StaticPages";
import { MotionCard, ParticleCanvas, reveal } from "./components/shared";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Box,
  Braces,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Compass,
  Crown,
  Download,
  Eye,
  EyeOff,
  Feather,
  FileArchive,
  FileKey,
  FileOutput,
  FileText,
  FolderTree,
  Flame,
  HardDrive,
  Image,
  Link,
  MapPin,
  Menu,
  Moon,
  MousePointer2,
  Network,
  SunDim,
  Scroll,
  NotebookTabs,
  Shield,
  SlidersHorizontal,
  Sparkles,
  SpellCheck,
  Sun,
  Sword,
  Tags,
  Trash2,
  UserRound,
  User,
  Castle,
  Wallet,
  ShieldAlert,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";

type Theme = "light" | "dark";
type NodecardSide = "top" | "bottom" | "left" | "right";
type SitePage =
  | "home"
  | "features"
  | "download"
  | "purchase"
  | "blog"
  | "support"
  | "releaseNotes"
  | "downloadHelp"
  | "licenseHelp"
  | "privacy"
  | "terms";

interface NodecardConnection {
  from: { card: string; side: NodecardSide };
  to: { card: string; side: NodecardSide };
}

const navItems = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Download", href: "/download" },
  { label: "Purchase", href: "/purchase" },
  { label: "Blog", href: "/blog" },
  { label: "Support", href: "/support" },
];

const jumpLinks = [
  { label: "Why it works", href: "#compare" },
  { label: "Workflow", href: "#workflow" },
  { label: "Visualize Tags", href: "#worldbuilding" },
  { label: "What it holds", href: "#project-layers" },
  { label: "Ownership", href: "#ownership" },
];

const featureSections = [
  {
    id: "projects",
    navLabel: "#projects",
    title: "Projects",
    notes: [
      "Contains the full workflow: file tree, writing views, canvas, visualize, compile, and backups.",
      "Useful for keeping separate books, series, and worlds cleanly separated.",
    ],
    media: [{
      dark: "/assets/feature-screenshots/projects-dark.png",
      light: "/assets/feature-screenshots/projects-light.png",
      alt: "Novelative project manager interface",
    }],
  },
  {
    id: "wikilinks",
    navLabel: "#wikilinks",
    title: "Wiki-Links",
    notes: [
      "Connects manuscript text to worldbuilding pages.",
      "Helps create the relationships shown in link-based visualization.",
    ],
    media: [{
      dark: "/assets/feature-screenshots/wikilinks-dark.png",
      light: "/assets/feature-screenshots/wikilinks-light.png",
      alt: "Novelative worldbuilding document with linked references",
    }],
  },
  {
    id: "canvas",
    navLabel: "#canvas",
    title: "Infinite Canvas",
    notes: [
      "A spatial workspace for loose scenes, references, timelines, and structural notes.",
      "Useful before ideas are ready to become chapters.",
    ],
    media: [{
      dark: "/assets/feature-screenshots/canvas-dark.png",
      light: "/assets/feature-screenshots/canvas-light.png",
      alt: "Novelative canvas view with connected story cards",
    }],
  },
  {
    id: "tags",
    navLabel: "#tags",
    title: "Intelligent Tagging",
    notes: [
      "Connects from the file tree to the visualize view.",
      "Helps organize what appears during compile.",
      "Useful for tracking themes, arcs, characters, locations, or draft status.",
    ],
    media: [{
      dark: "/assets/feature-screenshots/tags-dark.png",
      light: "/assets/feature-screenshots/tags-light.png",
      alt: "Novelative tag view showing project items grouped by tags",
    }],
  },
  {
    id: "graph-view",
    navLabel: "#graph-view",
    title: "Dynamic Graph View",
    notes: [
      "Turns links and tags into a project map.",
      "Useful for spotting clusters, dependencies, and neglected story areas.",
    ],
    media: [{
      dark: "/assets/feature-screenshots/graph-view-dark.png",
      light: "/assets/feature-screenshots/graph-view-light.png",
      alt: "Novelative graph view showing story relationships",
    }],
  },
  {
    id: "comments",
    navLabel: "#comments",
    title: "Word Comment Links",
    notes: [
      "Attaches revision context to exact prose.",
      "Useful for line questions, continuity reminders, and future edits.",
    ],
    media: [{
      dark: "/assets/feature-screenshots/comments-dark.png",
      light: "/assets/feature-screenshots/comments-light.png",
      alt: "Novelative word comment links in the editor",
    }],
  },
  {
    id: "split-view",
    navLabel: "#split-view",
    title: "Split View",
    notes: [
      "Shows a draft beside supporting material.",
      "Useful for outlines, character sheets, research, and worldbuilding notes.",
    ],
    media: [{
      dark: "/assets/feature-screenshots/split-view-dark.png",
      light: "/assets/feature-screenshots/split-view-light.png",
      alt: "Novelative split view writing interface",
    }],
  },
  {
    id: "compile-export",
    navLabel: "#compile-export",
    title: "Compile & Export",
    notes: [
      "Uses project structure and tags to control what gets included.",
      "Exports to DOCX, PDF, EPUB, TXT, Markdown, and HTML.",
    ],
    media: [
      {
        dark: "/assets/feature-screenshots/compile-export-dark.png",
        light: "/assets/feature-screenshots/compile-export-light.png",
        alt: "Novelative compile settings panel",
      },
      {
        dark: "/assets/feature-screenshots/compile-export-2-dark.png",
        light: "/assets/feature-screenshots/compile-export-2-light.png",
        alt: "Novelative compile export format settings",
      },
    ],
  },
  {
    id: "themes",
    navLabel: "#themes",
    title: "Custom Themes",
    notes: [
      "Changes the writing environment itself.",
      "Useful for long sessions, visual comfort, and different lighting setups.",
    ],
    media: [{
      dark: "/assets/feature-screenshots/themes-dark.png",
      light: "/assets/feature-screenshots/themes-light.png",
      alt: "Novelative custom theme controls",
    }],
  },
  {
    id: "backups",
    navLabel: "#backups",
    title: "Backups & Storage",
    notes: [
      "Supports the local-first model.",
      "Keeps project files and snapshots on your device.",
      "Useful for managing your own backups directly.",
    ],
    media: [{
      dark: "/assets/feature-screenshots/backups-dark.png",
      light: "/assets/feature-screenshots/backups-light.png",
      alt: "Novelative storage settings panel",
    }],
  },
] as const;

const coreViews = [
  {
    title: "Plot",
    animation: "plot",
    chips: [
      { label: "Infinite canvas", icon: Braces },
      { label: "Connection routing", icon: Network },
      { label: "Image-aware boards", icon: Image },
    ],
  },
  {
    title: "Write",
    animation: "write",
    chips: [
      { label: "Paged + continuous", icon: FileText },
      { label: "Split view", icon: Columns3 },
      { label: "Custom dictionary", icon: SpellCheck },
    ],
  },
  {
    title: "Visualize",
    animation: "visualize",
    chips: [
      { label: "Tags mode", icon: Tags },
      { label: "Links mode", icon: Link },
      { label: "Multiple layouts", icon: Network },
    ],
  },
];

const storyNodes = [
  { id: "scene", x: 106, y: 354, size: "core", phase: 0 },
  { id: "characters", x: 238, y: 250, size: "branch", phase: 1 },
  { id: "location", x: 374, y: 306, size: "branch", phase: 2 },
  { id: "lore", x: 502, y: 178, size: "branch", phase: 3 },
  { id: "theme", x: 648, y: 96, size: "branch", phase: 4 },
  { id: "char1", x: 168, y: 182, size: "leaf", phase: 1.35 },
  { id: "char2", x: 310, y: 222, size: "leaf", phase: 1.55 },
  { id: "loc1", x: 296, y: 366, size: "leaf", phase: 2.28 },
  { id: "loc2", x: 422, y: 386, size: "leaf", phase: 2.45 },
  { id: "loc3", x: 452, y: 286, size: "leaf", phase: 2.62 },
  { id: "loc4", x: 338, y: 228, size: "leaf", phase: 2.8 },
  { id: "lore1", x: 438, y: 102, size: "leaf", phase: 3.35 },
  { id: "theme1", x: 584, y: 34, size: "leaf", phase: 4.22 },
  { id: "theme2", x: 710, y: 40, size: "leaf", phase: 4.38 },
  { id: "theme3", x: 722, y: 128, size: "leaf", phase: 4.56 },
  { id: "theme4", x: 616, y: 174, size: "leaf", phase: 4.76 },
  { id: "theme5", x: 676, y: 220, size: "leaf", phase: 4.96 },
];

const storyLinks = [
  { from: "scene", to: "characters", phase: 1 },
  { from: "characters", to: "location", phase: 2 },
  { from: "location", to: "lore", phase: 3 },
  { from: "lore", to: "theme", phase: 4 },
  { from: "characters", to: "char1", phase: 1.35 },
  { from: "characters", to: "char2", phase: 1.55 },
  { from: "location", to: "loc1", phase: 2.28 },
  { from: "location", to: "loc2", phase: 2.45 },
  { from: "location", to: "loc3", phase: 2.62 },
  { from: "location", to: "loc4", phase: 2.8 },
  { from: "lore", to: "lore1", phase: 3.35 },
  { from: "theme", to: "theme1", phase: 4.22 },
  { from: "theme", to: "theme2", phase: 4.38 },
  { from: "theme", to: "theme3", phase: 4.56 },
  { from: "theme", to: "theme4", phase: 4.76 },
  { from: "theme", to: "theme5", phase: 4.96 },
];

const visualizeGraphNodes = [
  {
    id: "theshatteredsun",
    label: "The Shattered Sun",
    x: 43,
    y: 48,
    icon: SunDim,
    color: "yellow",
  },
  {
    id: "vanntheexile",
    label: "Vann, The Exile",
    x: 32,
    y: 24,
    icon: User,
    color: "blue",
  },
  {
    id: "kineticresonance",
    label: "Kinetic Resonance",
    x: 62,
    y: 39,
    icon: Zap,
    color: "amber",
  },
  {
    id: "thespireofdawn",
    label: "The Spire of Dawn",
    x: 70,
    y: 8,
    icon: Castle,
    color: "emerald",
  },
  {
    id: "highinquisitormalakor",
    label: "High Inquisitor Malakor",
    x: 93,
    y: 40,
    icon: ShieldAlert,
    color: "red",
  },
  {
    id: "thefirstcovenant",
    label: "The First Covenant",
    x: 88,
    y: 55,
    icon: Scroll,
    color: "purple",
  },
  {
    id: "thesilentorder",
    label: "The Silent Order",
    x: 58,
    y: 64,
    icon: EyeOff,
    color: "slate",
  },
  {
    id: "theedgeofthemap",
    label: "The Edge of the Map",
    x: 43,
    y: 88,
    icon: Compass,
    color: "cyan",
  },
  {
    id: "reignitingthehearth",
    label: "Re-igniting the Hearth",
    x: 23,
    y: 42,
    icon: Flame,
    color: "orange",
  },
  {
    id: "thestareatermyth",
    label: "The Star-Eater Myth",
    x: 7,
    y: 78,
    icon: Sparkles,
    color: "indigo",
  },
  {
    id: "noahsechoinheritance",
    label: "Noah's Echo Inheritance",
    x: 51,
    y: 30,
    icon: Crown,
    color: "amber",
  },
  {
    id: "essencemarket",
    label: "Essence Market",
    x: 75,
    y: 28,
    icon: Wallet,
    color: "orange",
  },
  {
    id: "rusekingdom",
    label: "Ruse Kingdom",
    x: 72,
    y: 70,
    icon: Shield,
    color: "emerald",
  },
  {
    id: "sakarkingdom",
    label: "Sakar Kingdom",
    x: 86,
    y: 72,
    icon: Castle,
    color: "red",
  },
  {
    id: "bonemarrow",
    label: "Bone & Marrow",
    x: 18,
    y: 62,
    icon: FileKey,
    color: "slate",
  },
  {
    id: "actone",
    label: "Act I",
    x: 38,
    y: 67,
    icon: BookOpen,
    color: "emerald",
  },
  {
    id: "acttwo",
    label: "Act II",
    x: 53,
    y: 78,
    icon: BookOpen,
    color: "cyan",
  },
  {
    id: "actthree",
    label: "Act III",
    x: 68,
    y: 84,
    icon: BookOpen,
    color: "purple",
  },
  {
    id: "powergrammar",
    label: "Power Grammar",
    x: 80,
    y: 15,
    icon: Braces,
    color: "blue",
  },
  {
    id: "manifestednames",
    label: "Manifested Names",
    x: 91,
    y: 22,
    icon: Tags,
    color: "indigo",
  },
  {
    id: "thecinderroute",
    label: "The Cinder Route",
    x: 12,
    y: 30,
    icon: MapPin,
    color: "orange",
  },
  {
    id: "glassharbor",
    label: "Glass Harbor",
    x: 18,
    y: 18,
    icon: Compass,
    color: "cyan",
  },
  {
    id: "roughstoryline",
    label: "Rough Story Line",
    x: 28,
    y: 84,
    icon: NotebookTabs,
    color: "slate",
  },
  {
    id: "villaintohero",
    label: "Villain to Hero",
    x: 13,
    y: 90,
    icon: UserRound,
    color: "purple",
  },
  {
    id: "dustarchive",
    label: "Dust Archive",
    x: 58,
    y: 13,
    icon: HardDrive,
    color: "slate",
  },
  {
    id: "stormatlas",
    label: "Storm Atlas",
    x: 94,
    y: 84,
    icon: Image,
    color: "blue",
  },
  {
    id: "chapterechoes",
    label: "Chapter Echoes",
    x: 49,
    y: 91,
    icon: Link,
    color: "cyan",
  },
  {
    id: "redgate",
    label: "Red Gate",
    x: 7,
    y: 52,
    icon: Sword,
    color: "red",
  },
  {
    id: "quietphysics",
    label: "Quiet Physics",
    x: 63,
    y: 20,
    icon: SlidersHorizontal,
    color: "emerald",
  },
  {
    id: "eclipsecalendar",
    label: "Eclipse Calendar",
    x: 34,
    y: 10,
    icon: Moon,
    color: "purple",
  },
  {
    id: "lostsyntax",
    label: "Lost Syntax",
    x: 83,
    y: 90,
    icon: SpellCheck,
    color: "amber",
  },
  {
    id: "memoryvault",
    label: "Memory Vault",
    x: 5,
    y: 12,
    icon: Box,
    color: "slate",
  },
];

const visualizeGraphLinks = [
  ["theshatteredsun", "vanntheexile"],
  ["theshatteredsun", "kineticresonance"],
  ["theshatteredsun", "thespireofdawn"],
  ["theshatteredsun", "theedgeofthemap"],
  ["theshatteredsun", "thestareatermyth"],
  ["theshatteredsun", "noahsechoinheritance"],
  ["theshatteredsun", "memoryvault"],
  ["theshatteredsun", "eclipsecalendar"],
  ["theshatteredsun", "glassharbor"],
  ["theshatteredsun", "thecinderroute"],
  ["theshatteredsun", "dustarchive"],
  ["vanntheexile", "thecinderroute"],
  ["vanntheexile", "glassharbor"],
  ["vanntheexile", "noahsechoinheritance"],
  ["kineticresonance", "thespireofdawn"],
  ["thespireofdawn", "dustarchive"],
  ["theedgeofthemap", "noahsechoinheritance"],
  ["thestareatermyth", "memoryvault"],
  ["thestareatermyth", "eclipsecalendar"],
  ["memoryvault", "eclipsecalendar"],
  ["actone", "acttwo"],
  ["actone", "actthree"],
  ["actone", "roughstoryline"],
  ["actone", "villaintohero"],
  ["actone", "chapterechoes"],
  ["actone", "redgate"],
  ["actone", "bonemarrow"],
  ["actone", "reignitingthehearth"],
  ["acttwo", "actthree"],
  ["actthree", "chapterechoes"],
  ["roughstoryline", "villaintohero"],
  ["villaintohero", "redgate"],
  ["redgate", "bonemarrow"],
  ["reignitingthehearth", "bonemarrow"],
  ["sakarkingdom", "highinquisitormalakor"],
  ["sakarkingdom", "thefirstcovenant"],
  ["sakarkingdom", "thesilentorder"],
  ["sakarkingdom", "rusekingdom"],
  ["sakarkingdom", "stormatlas"],
  ["sakarkingdom", "lostsyntax"],
  ["sakarkingdom", "manifestednames"],
  ["highinquisitormalakor", "thefirstcovenant"],
  ["thefirstcovenant", "thesilentorder"],
  ["thefirstcovenant", "manifestednames"],
  ["rusekingdom", "stormatlas"],
  ["manifestednames", "lostsyntax"],
  ["essencemarket", "powergrammar"],
  ["essencemarket", "manifestednames"],
  ["essencemarket", "quietphysics"],
  ["essencemarket", "dustarchive"],
  ["quietphysics", "powergrammar"],
] as const;

const studioConnections = [
  {
    label: "Drafting",
    title: "Manuscript beside notes",
    body: "Chapters, scenes, comments, and references stay in the same project.",
    icon: FileText,
  },
  {
    label: "World bible",
    title: "Links keep context close",
    body: "Characters, locations, lore, and research remain one click from the draft.",
    icon: BookOpen,
  },
  {
    label: "Planning",
    title: "Structure stays visible",
    body: "Cards, canvas layouts, tags, and graphs show relationships as the book grows.",
    icon: Network,
  },
  {
    label: "Delivery",
    title: "Export from the source",
    body: "Compile the finished manuscript without rebuilding it in another app.",
    icon: FileOutput,
  },
];

const workflowSteps = [
  {
    title: "Capture",
    body: "Start with premise notes, scene ideas, research, and rough structure before the book has a clean shape.",
    icon: NotebookTabs,
    details: [
      { text: "Book or series projects", icon: FolderTree, href: "/features" },
      { text: "Quick notes", icon: NotebookTabs, href: "/features" },
    ],
  },
  {
    title: "Build",
    body: "Turn fragments into linked pages for characters, places, factions, timelines, systems, and lore rules.",
    icon: BookOpen,
    details: [
      { text: "Global tags", icon: Tags, href: "/features" },
      { text: "Wiki-links", icon: Link, href: "/features" },
    ],
  },
  {
    title: "Draft",
    body: "Write chapters with reference material close by in paged, continuous, or split layouts.",
    icon: Feather,
    details: [
      {
        text: "Split references",
        icon: Columns3,
        href: "/features",
      },
      { text: "Focus and markup modes", icon: Eye, href: "/features" },
    ],
  },
  {
    title: "Reshape",
    body: "Use canvas and graph views when arcs, clusters, and dependencies need more room than folders.",
    icon: Braces,
    details: [
      { text: "Canvas planning", icon: Braces, href: "/features" },
      { text: "Graph inspection", icon: Network, href: "/features" },
    ],
  },
  {
    title: "Deliver",
    body: "Compile the manuscript without rebuilding the book in a second program just to get it out the door.",
    icon: FileOutput,
    details: [
      {
        text: "DOCX, PDF, EPUB, Markdown, HTML, TXT",
        icon: FileOutput,
        href: "/features",
      },
      { text: "Contained pipeline", icon: WandSparkles, href: "/features" },
    ],
  },
];

const projectLayers = [
  {
    title: "Manuscript",
    body: "Draft chapters, scenes, and supporting prose in paged, continuous, or split layouts.",
    icon: Feather,
  },
  {
    title: "Story Bible",
    body: "Keep characters, places, lore, research, and continuity references reachable through tags and links.",
    icon: BookOpen,
  },
  {
    title: "Planning Board",
    body: "Arrange scenes, notes, and references spatially when linear outlines stop helping.",
    icon: Braces,
  },
  {
    title: "Relationship Map",
    body: "Use graph view to inspect clusters, link density, and story architecture at a glance.",
    icon: Network,
  },
  {
    title: "Writing Environment",
    body: "Use focus modes, markup views, themes, search, and language tools without leaving the project.",
    icon: SlidersHorizontal,
  },
  {
    title: "Output Path",
    body: "Compile and export to DOCX, PDF, EPUB, Markdown, HTML, and TXT when the draft is ready.",
    icon: FileOutput,
  },
];

const principles = [
  {
    title: "Context stays attached",
    body: "Notes, world pages, links, and manuscript work stay part of the same creative object.",
  },
  {
    title: "Less tool switching",
    body: "The workflow gets faster when you stop rebuilding the same ideas across separate apps.",
  },
  {
    title: "Visible complexity",
    body: "Connections, clusters, and structural pressure points should be inspectable, not hidden.",
  },
  {
    title: "Local ownership",
    body: "A private desktop writing app should respect that the work belongs on the author's device.",
  },
];

const writerPoints = [
  "User feedback shapes the roadmap. We focus feature updates on the workflows writers actually ask for, then keep listening as those workflows change.",
  "Novelative is built to feel clear from the first project, with writing, notes, planning, and export kept in one usable workspace.",
  "Novelative began because too many writers are stuck wrestling with messy tools instead of building the story in front of them.",
  "Long-form fiction needs room for drafts, worldbuilding, structure, and revision without forcing the book into someone else's system.",
  "Your manuscript should stay yours: private, local-first, and ready to move or back up on your terms.",
];

const trustCards = [
  {
    title: "Local-first storage",
    body: "Your writing, notes, and structure live on your device unless you move copies elsewhere.",
    icon: HardDrive,
  },
  {
    title: "No account gate",
    body: "Download and try the beta without creating an account before you touch the app.",
    icon: Shield,
  },
  {
    title: "Backup-aware projects",
    body: "Rolling backups and portable project files make independent copies easier to keep.",
    icon: FileArchive,
  },
  {
    title: "One-time purchase",
    body: "After the trial, Novelative is built around a one-time purchase instead of a subscription.",
    icon: Wallet,
  },
];

const stats = [
  { value: "30", label: "Day Trial" },
  { value: "2", label: "Desktop platforms" },
  { value: "6", label: "Export formats" },
  { value: "1", label: "Project workspace" },
];

const faqs = [
  {
    question: "Is my writing stored in the cloud?",
    answer:
      "No. Novelative is local-first. Your writing, notes, and project structure live on your device unless you choose to back them up somewhere else.",
  },
  {
    question: "Does Novelative work offline?",
    answer:
      "The core writing, storage, plotting, and project-management workflow is offline-first. Some lookup features such as Word Explorer / thesaurus may require internet access.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. The beta is free to use for 30 days of use, with no sign-up required before installing.",
  },
  {
    question: "Is it a subscription?",
    answer:
      "No. Novelative uses a one-time purchase model after the trial instead of monthly subscription billing.",
  },
  {
    question: "What platforms are supported?",
    answer: "Novelative currently supports Windows and macOS.",
  },
  {
    question: "Can I export my work?",
    answer:
      "Yes. Novelative includes compile and export tools for DOCX, PDF, EPUB, Markdown, HTML, and TXT.",
  },
  {
    question: "What happens when my trial ends?",
    answer:
      "The app may require a paid license for continued use, but your local project files remain yours and stay on your device.",
  },
  {
    question: "Can I move or back up my projects manually?",
    answer:
      "Yes. Novelative supports portable local project files, manual copies, and built-in backup behavior so you can keep independent copies of your work.",
  },
  {
    question: "Does it support updates?",
    answer:
      "Yes. Novelative includes auto-update support so new builds are easier to keep current during beta and beyond.",
  },
];

function getCurrentPage(): SitePage {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  if (path === "/" || path === "/index.html") return "home";
  if (path === "/features" || path === "/features.html") return "features";
  if (path === "/download" || path === "/download.html") return "download";
  if (path === "/purchase" || path === "/purchase.html") return "purchase";
  if (path === "/blog" || path === "/blog.html") return "blog";
  if (path === "/release-notes" || path === "/release-notes.html") {
    return "releaseNotes";
  }
  if (path === "/support" || path === "/contact" || path === "/contact.html") {
    return "support";
  }
  if (path === "/download-help" || path === "/download-help.html") {
    return "downloadHelp";
  }
  if (
    path === "/licensekey" ||
    path === "/licensekey.html" ||
    path === "/license-help"
  ) {
    return "licenseHelp";
  }
  if (
    path === "/privacy" ||
    path === "/privacypolicy" ||
    path === "/privacypolicy.html"
  ) {
    return "privacy";
  }
  if (path === "/terms" || path === "/terms.html" || path === "/eula") {
    return "terms";
  }

  return "home";
}

function App() {
  const [theme, setTheme] = useStoredTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cookieSettingsOpen, setCookieSettingsOpen] = useState(false);
  const page: SitePage = getCurrentPage();

  useEffect(() => {
    document.title =
      page === "download"
        ? "Download | Novelative"
        : page === "features"
          ? "Features | Novelative"
          : page === "purchase"
            ? "Purchase | Novelative"
            : page === "blog"
              ? "Blog | Novelative"
              : page === "support"
                ? "Support | Novelative"
                : page === "releaseNotes"
                  ? "Release Notes | Novelative"
                  : page === "downloadHelp"
                    ? "Download Help | Novelative"
                    : page === "licenseHelp"
                      ? "License Status | Novelative"
                      : page === "privacy"
                        ? "Privacy Policy | Novelative"
                        : page === "terms"
                          ? "Terms & EULA | Novelative"
                          : "Novelative | The Writers Studio";
  }, [page]);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  return (
    <div className="app-shell">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        currentPage={page}
      />
      <main>
        {page === "download" ? (
          <DownloadPage theme={theme} />
        ) : page === "features" ? (
          <FeaturesPage theme={theme} />
        ) : page === "purchase" ? (
          <PurchasePage />
        ) : page === "blog" ? (
          <BlogPage />
        ) : page === "support" ? (
          <SupportPage />
        ) : page === "releaseNotes" ? (
          <ReleaseNotesPage />
        ) : page === "downloadHelp" ? (
          <DownloadHelpPage />
        ) : page === "licenseHelp" ? (
          <LicenseHelpPage />
        ) : page === "privacy" ? (
          <PrivacyPage />
        ) : page === "terms" ? (
          <TermsPage />
        ) : (
          <>
            <Hero theme={theme} />
            <StoryShiftSection />
            {/* <JumpNav /> */}
            {/* <CoreViews /> */}
            <WhyExists />
            <NodeCardShowcase />
            <VisualizeStoryMap />
            <WorldBuilding theme={theme} />
            <Compare />
            <ProjectLayers />
            <WritersSection />
            <BetaPrinciples />
            <Ownership />
            <Faq />
            <CommunityCta />
            <DownloadCta />
          </>
        )}
      </main>
      <Footer
        theme={theme}
        onOpenCookieSettings={() => setCookieSettingsOpen(true)}
      />
      <FloatingActions onToggleTheme={toggleTheme} theme={theme} />
      <CookieConsent
        settingsOpen={cookieSettingsOpen}
        onSettingsClosed={() => setCookieSettingsOpen(false)}
      />
    </div>
  );
}

function useStoredTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("themePreference");
    return saved === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("light-mode", theme === "light");
    document.documentElement.classList.toggle("dark-mode", theme === "dark");
    localStorage.setItem("themePreference", theme);
  }, [theme]);

  return [theme, setTheme] as const;
}

function Header({
  theme,
  onToggleTheme,
  menuOpen,
  onToggleMenu,
  currentPage,
}: {
  theme: Theme;
  onToggleTheme: () => void;
  menuOpen: boolean;
  onToggleMenu: () => void;
  currentPage: SitePage;
}) {
  return (
    <header className="site-header">
      <nav className="nav-container" aria-label="Primary navigation">
        <a className="brand" href="/" aria-label="Novelative home">
          <img
            src={
              theme === "light"
                ? "/assets/lightmodeicon.png"
                : "/assets/darkmodeicon.png"
            }
            alt=""
            className="brand-mark"
          />
          <span>Novelative</span>
        </a>
        <div className="desktop-nav">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={
                isActiveNavItem(item.href, currentPage) ? "active" : ""
              }
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <IconButton
            label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
            onClick={onToggleTheme}
            icon={theme === "light" ? Moon : Sun}
          />
          <a className="small-cta" href="/download">
            <Download size={16} />
            Download Beta
          </a>
          <IconButton
            label={menuOpen ? "Close menu" : "Open menu"}
            onClick={onToggleMenu}
            icon={menuOpen ? X : Menu}
            className="mobile-menu-button"
          />
        </div>
      </nav>
      {menuOpen && (
        <div className="mobile-nav">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={
                isActiveNavItem(item.href, currentPage) ? "active" : ""
              }
            >
              {item.label}
            </a>
          ))}
          <a className="mobile-download" href="/download">
            <Download size={16} />
            Download Beta
          </a>
        </div>
      )}
    </header>
  );
}

function isActiveNavItem(href: string, currentPage: SitePage) {
  return (
    (currentPage === "home" && href === "/") ||
    (currentPage === "features" && href === "/features") ||
    (currentPage === "download" && href === "/download") ||
    (currentPage === "purchase" && href === "/purchase") ||
    (currentPage === "blog" && href === "/blog") ||
    (currentPage === "support" && href === "/support")
  );
}

function Hero({ theme }: { theme: Theme }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="hero-section" className="hero-section">
      <img
        src={
          theme === "light"
            ? "/assets/herobg -light.png"
            : "/assets/herobg -dark.png"
        }
        alt=""
        className="hero-bg"
      />
      {!shouldReduceMotion && <ParticleCanvas />}
      <div className="hero-content">
        <motion.div
          initial="hidden"
          animate="show"
          variants={reveal}
          transition={{ duration: 0.75, ease: "easeOut" }}
          className="hero-copy"
        >
          <h1>
            The best place <br />
            to <span>write your novel</span>.
          </h1>
          <p>
            Novelative. Created by a single writer, for <em>every</em> single
            writer. Made to kill the messy writing environment.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="/download">
              Beta is now available! -&gt;
            </a>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.25, ease: "easeOut" }}
          className="hero-product"
        >
          <img
            src={
              theme === "light"
                ? "/assets/intro -light.png"
                : "/assets/intro -dark.png"
            }
            alt="Novelative app interface showing split view"
          />
        </motion.div>
      </div>
    </section>
  );
}

function JumpNav() {
  return (
    <section className="jump-section">
      <div className="container">
        <div className="jump-links">
          {jumpLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoryShiftSection() {
  const shouldReduceMotion = useReducedMotion();
  const storyShiftLines: Array<{ text: string; featureItems?: string[] }> = [
    {
      text: "Todays novel writing tools don't cut it. It’s time for something groundbreaking.",
    },
    {
      text: "Authors easily lose track of complex story details over time. We fix that.",
    },
    {
      text: "Our tools give authors a true bird’s-eye view of their story.",
      featureItems: [
        "Visualize view",
        "infinite Canvas's",
        "visualize-able files by wiki-links",
        "visualize-able files by tags",
        "cross-linkable editor notes",
        "file cards in the canvas snap together",
        "or link file cards to each other",
      ],
    },
  ];
  const lineMotion = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0.28, y: 34, filter: "blur(8px)" },
        show: { opacity: 1, y: 0, filter: "blur(0px)" },
      };
  const textSweepMotion = shouldReduceMotion
    ? undefined
    : {
        hidden: {
          clipPath: "polygon(-24% 0, -8% 0, -8% 100%, -24% 100%)",
          opacity: 0,
        },
        show: {
          clipPath: [
            "polygon(-24% 0, -8% 0, -8% 100%, -24% 100%)",
            "polygon(40% 0, 64% 0, 64% 100%, 40% 100%)",
            "polygon(108% 0, 124% 0, 124% 100%, 108% 100%)",
          ],
          opacity: [0, 1, 0],
        },
      };

  return (
    <section className="section story-shift-section">
      <div className="container story-shift-copy">
        {storyShiftLines.map((line) => {
          const featureItems = line.featureItems;

          return (
            <motion.p
              className="story-shift-line"
              key={line.text}
              initial={shouldReduceMotion ? false : "hidden"}
              whileInView={shouldReduceMotion ? undefined : "show"}
              viewport={{
                once: true,
                amount: 0.5,
                margin: "0px 0px -45% 0px",
              }}
              variants={lineMotion}
              transition={{ duration: 0.74, ease: "easeOut" }}
            >
              <span className="story-shift-line-text">
                <span className="story-shift-line-base">{line.text}</span>
                {!shouldReduceMotion && (
                  <motion.span
                    aria-hidden="true"
                    className="story-shift-line-sweep"
                    variants={textSweepMotion}
                    transition={{
                      duration: 1.02,
                      delay: 0.06,
                      ease: "easeInOut",
                      times: [0.1, 0.5, 1],
                    }}
                  >
                    {line.text}
                  </motion.span>
                )}
                {featureItems && (
                  <span
                    className="story-shift-feature-list"
                    style={
                      {
                        "--feature-count": featureItems.length,
                      } as CSSProperties
                    }
                  >
                    {featureItems.map((feature, index) => (
                      <span
                        className="story-shift-feature-item"
                        key={feature}
                        style={
                          {
                            "--feature-index": index,
                            "--feature-delay": `${
                              (index * 6) / featureItems.length
                            }s`,
                          } as CSSProperties
                        }
                      >
                        {feature}
                      </span>
                    ))}
                  </span>
                )}
              </span>
            </motion.p>
          );
        })}
      </div>
    </section>
  );
}

function FeaturesPage({ theme }: { theme: Theme }) {
  const shouldReduceMotion = useReducedMotion();
  const [fullscreenImage, setFullscreenImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const [carouselIndexes, setCarouselIndexes] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    if (!fullscreenImage) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFullscreenImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullscreenImage]);

  const setCarouselIndex = (
    featureId: string,
    mediaCount: number,
    nextIndex: number,
  ) => {
    setCarouselIndexes((current) => ({
      ...current,
      [featureId]: (nextIndex + mediaCount) % mediaCount,
    }));
  };

  return (
    <>
      <section className="features-page-hero">
        {!shouldReduceMotion && <ParticleCanvas />}
        <div className="support-gradient" />
        <div className="features-page-hero-copy">
          <p className="eyebrow">Features</p>
          <h1>The Novelative workspace.</h1>
        </div>
        <nav className="features-index" aria-label="Feature shortcuts">
          {featureSections.map((feature) => (
            <a key={feature.id} href={`#${feature.id}`}>
              <span>{feature.navLabel}</span>
              <small>{feature.title}</small>
            </a>
          ))}
        </nav>
      </section>

      <div className="features-scroll-list">
        {featureSections.map((feature) => {
          const activeMediaIndex = carouselIndexes[feature.id] ?? 0;
          const activeMedia = feature.media[activeMediaIndex] ?? feature.media[0];
          const mediaSrc =
            theme === "light" ? activeMedia.light : activeMedia.dark;
          const hasCarousel = feature.media.length > 1;

          return (
            <motion.section
              id={feature.id}
              className="feature-detail-section"
              key={feature.id}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.22 }}
              variants={reveal}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              <div className="feature-detail-copy">
                <h2>{feature.title}</h2>
                <ul className="feature-detail-notes">
                  {feature.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
              <figure className="feature-detail-media">
                <button
                  type="button"
                  className="feature-image-button"
                  onClick={() =>
                    setFullscreenImage({
                      src: mediaSrc,
                      alt: activeMedia.alt,
                    })
                  }
                  aria-label={`View ${feature.title} screenshot fullscreen`}
                >
                  <img src={mediaSrc} alt={activeMedia.alt} loading="lazy" />
                </button>
                {hasCarousel && (
                  <div
                    className="feature-carousel-controls"
                    aria-label={`${feature.title} screenshots`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setCarouselIndex(
                          feature.id,
                          feature.media.length,
                          activeMediaIndex - 1,
                        )
                      }
                      aria-label="Previous compile screenshot"
                    >
                      <ChevronLeft size={19} />
                    </button>
                    <span>
                      {activeMediaIndex + 1} / {feature.media.length}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCarouselIndex(
                          feature.id,
                          feature.media.length,
                          activeMediaIndex + 1,
                        )
                      }
                      aria-label="Next compile screenshot"
                    >
                      <ChevronRight size={19} />
                    </button>
                  </div>
                )}
              </figure>
            </motion.section>
          );
        })}
      </div>

      {fullscreenImage && (
        <div
          className="feature-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen feature screenshot"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            type="button"
            className="feature-lightbox-close"
            onClick={(event) => {
              event.stopPropagation();
              setFullscreenImage(null);
            }}
            aria-label="Close fullscreen image"
          >
            <X size={30} />
          </button>
          <div
            className="feature-lightbox-image-frame"
            onClick={(event) => event.stopPropagation()}
          >
            <img src={fullscreenImage.src} alt={fullscreenImage.alt} />
          </div>
        </div>
      )}

      <DownloadCta />
    </>
  );
}

function WhyExists() {
  const rawText =
    "The rain lashed against the cracked cobblestones of [[Aethelgard]]. \n\nElias pulled his coat tight, feeling the heavy hum of the [[Sunfire Relic]] in his pocket. He needed to check the [[Timeline Map]] before he was caught. \n\nWith Novelative, you aren't just drafting a scene. You are weaving a connected universe.";
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { amount: 0.45, once: true });
  const [text, setText] = useState("");

  useEffect(() => {
    if (!inView) return;
    let index = 0;
    let timer = 0;

    const tick = () => {
      setText(rawText.slice(0, index + 1));
      const character = rawText[index];
      index += 1;
      if (index >= rawText.length) return;
      const base =
        character === "."
          ? 380
          : character === ","
            ? 210
            : character === "\n"
              ? 300
              : 24;
      timer = window.setTimeout(tick, base + Math.random() * 32);
    };

    timer = window.setTimeout(tick, 500);
    return () => window.clearTimeout(timer);
  }, [inView]);

  return (
    <section
      className="section quiet-section why-wikilinks-section"
      id="why-exists-section"
      ref={ref}
    >
      <div className="container why-wikilinks-grid">
        <motion.div
          className="why-wikilinks-copy"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={reveal}
          transition={{ duration: 0.65 }}
        >
          <p className="eyebrow">Wiki-links</p>
          <h2>Turn references into links.</h2>
          <p>
            Link characters, relics, places, and timelines directly inside the
            prose, then follow those mentions back into the wider story when the
            world gets dense.
          </p>
        </motion.div>

        <div className="wikilink-demo-panel">
          <WritingArc position="top" />
          <div className="typing-frame">
            <div className="typing-text">
              <ParsedTypingText text={text} />
              <span className="cursor" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ParsedTypingText({ text }: { text: string }) {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return (
    <>
      {parts.map((part, index) => {
        const match = part.match(/^\[\[(.+)\]\]$/);
        if (match) {
          return (
            <span className="typed-link" key={`${match[1]}-${index}`}>
              [[ {match[1]} ]]
            </span>
          );
        }
        return part.split("\n").map((line, lineIndex, lines) => (
          <span key={`${index}-${lineIndex}`}>
            {line}
            {lineIndex < lines.length - 1 ? <br /> : null}
          </span>
        ));
      })}
    </>
  );
}

function WritingArc({ position }: { position: "top" | "bottom" }) {
  return (
    <div className={`writing-arc ${position}`}>
      <svg viewBox="0 0 340 340" aria-hidden="true">
        {Array.from({ length: 7 }).map((_, index) => (
          <circle
            key={index}
            className={`arc-ring ring-${index + 1}`}
            cx="170"
            cy="170"
            r={54 + index * 15}
            strokeDasharray={`${28 + index * 8} ${78 + index * 9}`}
          />
        ))}
      </svg>
    </div>
  );
}

function CoreViews() {
  return (
    <section className="section surface-section core-views-section">
      <div className="container card-grid three">
        {coreViews.map((view, index) => (
          <MotionCard
            className="media-card core-view-card"
            key={view.title}
            delay={index * 0.08}
          >
            <CoreViewAnimation type={view.animation} />
            <div className="card-body">
              <h3>{view.title}</h3>
              <ChipRow chips={view.chips} />
            </div>
          </MotionCard>
        ))}
      </div>
    </section>
  );
}

function CoreViewAnimation({ type }: { type: string }) {
  if (type === "write") return <WriteTypingAnimation />;
  if (type === "plot") return <PlotSnapAnimation />;
  return <VisualizeMiniGraph />;
}

function WriteTypingAnimation() {
  return (
    <div className="core-animation write-animation" aria-hidden="true">
      <div className="mini-editor-line">
        <span>Home was a long way behind.</span>
      </div>
    </div>
  );
}

function PlotSnapAnimation() {
  return (
    <div className="core-animation plot-animation" aria-hidden="true">
      <motion.div
        className="mini-nodecard mini-nodecard-left"
        animate={{ x: [0, 8, 14, 18, 16, 16, 0] }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          repeatDelay: 1.1,
          ease: "easeInOut",
          times: [0, 0.28, 0.46, 0.58, 0.66, 0.82, 1],
        }}
      >
        <span />
      </motion.div>
      <motion.div
        className="mini-nodecard mini-nodecard-right"
        animate={{ x: [0, -8, -14, -18, -16, -16, 0] }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          repeatDelay: 1.1,
          ease: "easeInOut",
          times: [0, 0.28, 0.46, 0.58, 0.66, 0.82, 1],
        }}
      >
        <span />
      </motion.div>
    </div>
  );
}

function VisualizeMiniGraph() {
  const nodes = [
    { x: 52, y: 76, delay: 0 },
    { x: 102, y: 38, delay: 0.2 },
    { x: 158, y: 80, delay: 0.4 },
    { x: 122, y: 118, delay: 0.6 },
    { x: 72, y: 128, delay: 0.8 },
  ];
  const lines = [
    [0, 1],
    [1, 2],
    [1, 3],
    [3, 4],
    [0, 4],
  ];

  return (
    <div className="core-animation graph-animation" aria-hidden="true">
      <svg viewBox="0 0 210 160">
        {lines.map(([fromIndex, toIndex], index) => {
          const from = nodes[fromIndex];
          const to = nodes[toIndex];
          return (
            <motion.line
              key={`${fromIndex}-${toIndex}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 5.5,
                delay: 0.25 + index * 0.26,
                repeat: Infinity,
                repeatDelay: 1.2,
                times: [0, 0.32, 0.78, 1],
                ease: "easeInOut",
              }}
            />
          );
        })}
        {nodes.map((node, index) => (
          <motion.circle
            key={`${node.x}-${node.y}`}
            cx={node.x}
            cy={node.y}
            r={index === 1 ? 9 : 6}
            animate={{
              y: [0, -4, 3, 0],
              scale: [0.88, 1, 1, 0.88],
              opacity: [0.6, 1, 1, 0.6],
            }}
            transition={{
              duration: 5.5,
              delay: node.delay,
              repeat: Infinity,
              repeatDelay: 1.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

function VisualizeStoryMap() {
  const graphRef = useRef<HTMLDivElement | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [hoverNodeId, setHoverNodeId] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<
    Record<string, { x: number; y: number }>
  >(() =>
    Object.fromEntries(
      visualizeGraphNodes.map((node) => [node.id, { x: node.x, y: node.y }]),
    ),
  );
  const nodeVelocityRef = useRef<Record<string, { vx: number; vy: number }>>(
    Object.fromEntries(
      visualizeGraphNodes.map((node) => [node.id, { vx: 0, vy: 0 }]),
    ),
  );

  useEffect(() => {
    if (!activeNodeId) return;

    const moveNode = (event: PointerEvent) => {
      const graph = graphRef.current;
      if (!graph) return;

      const rect = graph.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      nodeVelocityRef.current[activeNodeId] = { vx: 0, vy: 0 };

      setNodePositions((current) => ({
        ...current,
        [activeNodeId]: {
          x: Math.min(96, Math.max(4, x)),
          y: Math.min(92, Math.max(8, y)),
        },
      }));
    };

    const releaseNode = () => setActiveNodeId(null);

    window.addEventListener("pointermove", moveNode);
    window.addEventListener("pointerup", releaseNode);
    window.addEventListener("pointercancel", releaseNode);

    return () => {
      window.removeEventListener("pointermove", moveNode);
      window.removeEventListener("pointerup", releaseNode);
      window.removeEventListener("pointercancel", releaseNode);
    };
  }, [activeNodeId]);

  const linkDegree = useMemo(() => {
    const degree = new Map(visualizeGraphNodes.map((node) => [node.id, 0]));

    visualizeGraphLinks.forEach(([fromId, toId]) => {
      degree.set(fromId, (degree.get(fromId) ?? 0) + 1);
      degree.set(toId, (degree.get(toId) ?? 0) + 1);
    });

    return degree;
  }, []);
  const maxLinkDegree = Math.max(1, ...Array.from(linkDegree.values()));
  const nodeVisualSizes = useMemo(
    () =>
      Object.fromEntries(
        visualizeGraphNodes.map((node) => {
          const degree = linkDegree.get(node.id) ?? 0;
          const normalized = degree / maxLinkDegree;
          return [node.id, 8 + Math.pow(normalized, 1.18) * 38];
        }),
      ) as Record<string, number>,
    [linkDegree, maxLinkDegree],
  );

  useEffect(() => {
    let frameId = 0;

    const applyForce = (
      nodeId: string,
      fx: number,
      fy: number,
      velocities: Record<string, { vx: number; vy: number }>,
    ) => {
      if (nodeId === activeNodeId) return;
      const velocity = velocities[nodeId] ?? { vx: 0, vy: 0 };
      velocity.vx += fx;
      velocity.vy += fy;
      velocities[nodeId] = velocity;
    };

    const tick = () => {
      setNodePositions((current) => {
        const velocities = nodeVelocityRef.current;
        const next = Object.fromEntries(
          visualizeGraphNodes.map((node) => {
            const position = current[node.id] ?? { x: node.x, y: node.y };
            return [node.id, { x: position.x, y: position.y }];
          }),
        ) as Record<string, { x: number; y: number }>;

        visualizeGraphNodes.forEach((node) => {
          if (!velocities[node.id]) velocities[node.id] = { vx: 0, vy: 0 };
        });

        for (let i = 0; i < visualizeGraphNodes.length; i += 1) {
          const a = visualizeGraphNodes[i];
          for (let j = i + 1; j < visualizeGraphNodes.length; j += 1) {
            const b = visualizeGraphNodes[j];
            const aPos = next[a.id];
            const bPos = next[b.id];
            let dx = bPos.x - aPos.x;
            let dy = bPos.y - aPos.y;
            let distSq = dx * dx + dy * dy;

            if (distSq < 0.01) {
              dx = 0.4;
              dy = 0.4;
              distSq = dx * dx + dy * dy;
            }

            const dist = Math.sqrt(distSq);
            const nx = dx / dist;
            const ny = dy / dist;
            const minDist =
              6.2 +
              ((nodeVisualSizes[a.id] ?? 18) + (nodeVisualSizes[b.id] ?? 18)) *
                0.2;
            const repulsion = 2.15 / Math.max(distSq, 2.2);

            applyForce(a.id, -nx * repulsion, -ny * repulsion, velocities);
            applyForce(b.id, nx * repulsion, ny * repulsion, velocities);

            if (dist < minDist) {
              const overlap = (minDist - dist) * 0.052;
              applyForce(a.id, -nx * overlap, -ny * overlap, velocities);
              applyForce(b.id, nx * overlap, ny * overlap, velocities);
            }
          }
        }

        visualizeGraphLinks.forEach(([fromId, toId]) => {
          const from = next[fromId];
          const to = next[toId];
          if (!from || !to) return;

          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 0.01);
          const desired =
            8.5 +
            ((nodeVisualSizes[fromId] ?? 18) + (nodeVisualSizes[toId] ?? 18)) *
              0.075;
          const force = (dist - desired) * 0.018;

          applyForce(fromId, (dx / dist) * force, (dy / dist) * force, velocities);
          applyForce(toId, -(dx / dist) * force, -(dy / dist) * force, velocities);
        });

        let changed = false;

        visualizeGraphNodes.forEach((node) => {
          const position = next[node.id];
          const velocity = velocities[node.id];

          if (node.id !== activeNodeId) {
            velocity.vx += (50 - position.x) * 0.00065;
            velocity.vy += (52 - position.y) * 0.00065;
            velocity.vx *= 0.8;
            velocity.vy *= 0.8;

            const speed = Math.sqrt(
              velocity.vx * velocity.vx + velocity.vy * velocity.vy,
            );

            if (speed > 0.58) {
              const limit = 0.58 / speed;
              velocity.vx *= limit;
              velocity.vy *= limit;
            }

            position.x += velocity.vx;
            position.y += velocity.vy;

            if (position.x < 4 || position.x > 96) {
              position.x = Math.min(96, Math.max(4, position.x));
              velocity.vx *= -0.3;
            }

            if (position.y < 8 || position.y > 92) {
              position.y = Math.min(92, Math.max(8, position.y));
              velocity.vy *= -0.3;
            }
          }

          const currentPosition = current[node.id];
          if (
            !currentPosition ||
            Math.abs(currentPosition.x - position.x) > 0.01 ||
            Math.abs(currentPosition.y - position.y) > 0.01
          ) {
            changed = true;
          }
        });

        return changed ? next : current;
      });

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [activeNodeId, nodeVisualSizes]);

  const interactionNodeId = activeNodeId ?? hoverNodeId;
  const connectedNodeIds = useMemo(() => {
    if (!interactionNodeId) return new Set<string>();

    const connected = new Set<string>([interactionNodeId]);
    visualizeGraphLinks.forEach(([fromId, toId]) => {
      if (fromId === interactionNodeId) connected.add(toId);
      if (toId === interactionNodeId) connected.add(fromId);
    });

    return connected;
  }, [interactionNodeId]);

  const beginDrag = (nodeId: string, event: ReactPointerEvent) => {
    event.preventDefault();
    setActiveNodeId(nodeId);
    setHoverNodeId(nodeId);
  };

  return (
    <section className="section surface-section story-map-section">
      <motion.div
        className="container story-map-showcase"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        variants={reveal}
        transition={{ duration: 0.65, delay: 0.12 }}
      >
        <div className="story-map-copy">
          <p className="eyebrow">Visualize: Links</p>
          <h3>Sorting by wikilinks.</h3>
          <p>
            Links, tags, and references become a map you can rearrange as the
            world grows.
          </p>
        </div>
        <div
          className="story-map-panel"
          ref={graphRef}
          aria-label="Interactive Novelative links graph with draggable link nodes"
        >
          <div className="story-map-toolbar">
            <span>Links</span>
            <span>Connections</span>
            <span>{visualizeGraphNodes.length} nodes</span>
          </div>
          <svg
            className="story-map-lines"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {visualizeGraphLinks.map(([fromId, toId]) => {
              const from = nodePositions[fromId];
              const to = nodePositions[toId];
              const isHighlighted =
                interactionNodeId === fromId || interactionNodeId === toId;
              return (
                <line
                  key={`${fromId}-${toId}`}
                  className={`story-link ${
                    isHighlighted ? "highlighted" : ""
                  } ${interactionNodeId && !isHighlighted ? "dimmed" : ""}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                />
              );
            })}
          </svg>
          {visualizeGraphNodes.map((node, index) => {
            const position = nodePositions[node.id];
            const degree = linkDegree.get(node.id) ?? 0;
            const nodeSize = nodeVisualSizes[node.id] ?? 14;
            const isConnected = connectedNodeIds.has(node.id);
            const isDimmed = interactionNodeId !== null && !isConnected;
            const showsLabel = degree >= 6;
            return (
              <motion.button
                type="button"
                className={`story-tag-node ${node.color} ${
                  activeNodeId === node.id ? "dragging" : ""
                } ${isConnected ? "highlighted" : ""} ${
                  isDimmed ? "dimmed" : ""
                } ${showsLabel ? "label-visible" : ""}
                }`}
                key={node.id}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  x: "-50%",
                  y: "-50%",
                  "--node-size": `${nodeSize}px`,
                } as CSSProperties}
                onPointerDown={(event) => beginDrag(node.id, event)}
                onPointerEnter={() => setHoverNodeId(node.id)}
                onPointerLeave={() => setHoverNodeId(null)}
                onFocus={() => setHoverNodeId(node.id)}
                onBlur={() => setHoverNodeId(null)}
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                whileHover={{ scale: 1.07 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.28, delay: index * 0.04 }}
                aria-label={`Move ${node.label} link node`}
              >
                <span>{node.label}</span>
                <node.icon size={18} strokeWidth={2.15} />
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

function NodeCardShowcase() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const [connectionPaths, setConnectionPaths] = useState<string[]>([]);
  const snapDuration = 8.8;
  const snapCardTimes = [0, 0.18, 0.34, 0.5, 0.64, 0.86, 1];
  const snapGroupMotionTimes = [0, 0.8, 0.86, 0.92, 0.98, 1];
  const snapGroupX = [0, 0, 28, 0, -28, 0];
  const snapGroupY = [0, 0, -14, -30, -14, 0];
  const snapCursorTimes = [0, 0.64, 0.68, 0.74, 0.8, 0.999, 1];
  const snapCursorPark = { x: 484, y: 380 };
  const snapCursorBase = { x: 150, y: 72 };
  const snapCards = [
    {
      id: "bridge",
      title: "Bridge Ambush",
      body: "The chase spills onto the lower bridge after Elias finds the relic.",
      className: "nodecard-one",
      x: [0, 0, 0, 0, 0, 0, 0],
      y: [0, 0, 0, 0, 0, 0, 0],
      finalX: 0,
      finalY: 0,
    },
    {
      id: "embers",
      title: "Embers in the Frost",
      body: "A quiet aftermath scene where the relic's heat exposes a hidden trail.",
      className: "nodecard-four",
      x: [360, 360, 270, 270, 270, 270, 270],
      y: [0, 0, 0, 0, 0, 0, 0],
      finalX: 270,
      finalY: 0,
    },
    {
      id: "frost-vault",
      title: "Dead Men Tell No Tales",
      body: "The rival student is found dead at the bottom of the campus bell tower the night before exposing them.",
      className: "nodecard-five",
      x: [86, 86, 86, 86, 0, 0, 0],
      y: [280, 280, 280, 280, 180, 180, 180],
      finalX: 0,
      finalY: 180,
    },
  ];
  const connectionCards = [
    {
      id: "line-bridge",
      title: "Bridge Ambush",
      body: "The scene card links to the relic and the faction pursuing it.",
      className: "nodecard-one",
      x: 0,
      y: 0,
    },
    {
      id: "line-relic",
      title: "Sunfire Relic",
      body: "An object page for the relic, its cost, and every scene where it appears.",
      className: "nodecard-two",
      x: 310,
      y: 0,
    },
    {
      id: "line-order",
      title: "Glass Order",
      body: "Faction notes, motives, and the pressure they create across the act.",
      className: "nodecard-three",
      x: 155,
      y: 224,
    },
  ];
  const connections: NodecardConnection[] = [
    {
      from: { card: "line-bridge", side: "right" },
      to: { card: "line-relic", side: "left" },
    },
    {
      from: { card: "line-bridge", side: "bottom" },
      to: { card: "line-order", side: "top" },
    },
    {
      from: { card: "line-relic", side: "bottom" },
      to: { card: "line-order", side: "top" },
    },
  ];

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const getNoduleCenter = (card: string, side: NodecardSide) => {
      const nodule = stage.querySelector<HTMLElement>(
        `[data-nodecard="${card}"][data-side="${side}"]`,
      );
      if (!nodule) return null;

      const stageRect = stage.getBoundingClientRect();
      const noduleRect = nodule.getBoundingClientRect();

      return {
        x: noduleRect.left + noduleRect.width / 2 - stageRect.left,
        y: noduleRect.top + noduleRect.height / 2 - stageRect.top,
      };
    };

    const pathBetween = (
      start: { x: number; y: number },
      startSide: NodecardSide,
      end: { x: number; y: number },
      endSide: NodecardSide,
    ) => {
      if (
        (startSide === "left" || startSide === "right") &&
        (endSide === "left" || endSide === "right")
      ) {
        const midX = (start.x + end.x) / 2;
        return `M ${start.x} ${start.y} H ${midX} V ${end.y} H ${end.x}`;
      }

      if (
        (startSide === "top" || startSide === "bottom") &&
        (endSide === "top" || endSide === "bottom")
      ) {
        const midY = (start.y + end.y) / 2;
        return `M ${start.x} ${start.y} V ${midY} H ${end.x} V ${end.y}`;
      }

      const corner =
        startSide === "top" || startSide === "bottom"
          ? { x: start.x, y: end.y }
          : { x: end.x, y: start.y };

      return `M ${start.x} ${start.y} L ${corner.x} ${corner.y} L ${end.x} ${end.y}`;
    };

    const measure = () => {
      const nextPaths = connections.flatMap((connection) => {
        const start = getNoduleCenter(
          connection.from.card,
          connection.from.side,
        );
        const end = getNoduleCenter(connection.to.card, connection.to.side);
        if (!start || !end) return [];

        return [
          pathBetween(start, connection.from.side, end, connection.to.side),
        ];
      });

      setConnectionPaths(nextPaths);
    };

    const frame = window.requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    stage.querySelectorAll("[data-nodecard][data-side]").forEach((element) => {
      observer.observe(element);
    });

    window.addEventListener("resize", measure);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section className="section nodecard-section">
      <div className="container nodecard-showcase">
        <motion.div
          className="nodecard-showcase-copy"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={reveal}
          transition={{ duration: 0.65 }}
        >
          <p className="eyebrow">Canvas</p>
          <h2>Plot with file cards.</h2>
          <p>
            Drop scenes, characters, and objects onto the canvas, then snap them
            into the structure you need.
          </p>
        </motion.div>

        <div className="nodecard-demo-grid">
          <motion.div
            className="nodecard-demo-panel nodecard-snap-panel"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            variants={reveal}
            transition={{ duration: 0.65 }}
          >
            <div className="nodecard-world">
              <motion.div
                className="nodecard-snap-group"
                animate={
                  shouldReduceMotion
                    ? { x: 0, y: 0 }
                    : {
                        x: snapGroupX,
                        y: snapGroupY,
                      }
                }
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : {
                        duration: snapDuration,
                        repeat: Infinity,
                        repeatDelay: 0.35,
                        times: snapGroupMotionTimes,
                        ease: "easeInOut",
                      }
                }
              >
                {snapCards.map((card) => (
                  <motion.div
                    className={`nodecard-motion ${card.className}`}
                    key={card.id}
                    animate={
                      shouldReduceMotion
                        ? { x: card.finalX, y: card.finalY }
                        : { x: card.x, y: card.y }
                    }
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            duration: snapDuration,
                            repeat: Infinity,
                            repeatDelay: 0.35,
                            times: snapCardTimes,
                            ease: "easeInOut",
                          }
                    }
                  >
                    <AppNodeCardPreview
                      id={card.id}
                      title={card.title}
                      body={card.body}
                    />
                  </motion.div>
                ))}
                {!shouldReduceMotion && (
                  <motion.div
                    className="nodecard-cursor"
                    aria-hidden="true"
                    animate={{
                      x: [
                        snapCursorPark.x,
                        snapCursorPark.x,
                        snapCursorPark.x,
                        snapCursorBase.x,
                        snapCursorBase.x,
                        snapCursorBase.x,
                        snapCursorBase.x,
                      ],
                      y: [
                        snapCursorPark.y,
                        snapCursorPark.y,
                        snapCursorPark.y,
                        snapCursorBase.y,
                        snapCursorBase.y,
                        snapCursorBase.y,
                        snapCursorBase.y,
                      ],
                      opacity: [1],
                      scale: [0.96, 0.96, 1, 0.9, 0.9, 0.9, 0.9],
                    }}
                    transition={{
                      duration: snapDuration,
                      repeat: Infinity,
                      repeatDelay: 0.35,
                      times: snapCursorTimes,
                      ease: "easeInOut",
                    }}
                  >
                    <MousePointer2 size={34} />
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            ref={stageRef}
            className="nodecard-demo-panel nodecard-stage"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            variants={reveal}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            <svg className="nodecard-stage-lines" aria-hidden="true">
              {connectionPaths.map((path, index) => (
                <motion.path
                  key={`${path}-${index}`}
                  d={path}
                  initial={{ pathLength: shouldReduceMotion ? 1 : 0, opacity: 0 }}
                  whileInView={{
                    pathLength: shouldReduceMotion ? 1 : [0, 1, 1, 0],
                    opacity: shouldReduceMotion ? 1 : [0, 1, 1, 0],
                  }}
                  viewport={{ once: false, amount: 0.45 }}
                  transition={{
                    duration: 8.5,
                    delay: 0.45 + index * 0.45,
                    repeat: shouldReduceMotion ? 0 : Infinity,
                    repeatDelay: 1.4,
                    times: shouldReduceMotion ? undefined : [0, 0.34, 0.78, 1],
                    ease: "easeInOut",
                  }}
                />
              ))}
            </svg>

            <div className="nodecard-world">
              {connectionCards.map((card) => (
                <div
                  className={`nodecard-motion ${card.className}`}
                  key={card.id}
                  style={{ left: card.x, top: card.y }}
                >
                  <AppNodeCardPreview
                    id={card.id}
                    title={card.title}
                    body={card.body}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AppNodeCardPreview({
  id = "preview",
  title = "Bridge Ambush",
  body = "The chase spills onto the lower bridge after Elias finds the Sunfire Relic.",
}: {
  id?: string;
  title?: string;
  body?: string;
}) {
  return (
    <div
      className="app-nodecard-preview"
      aria-label="Novelative app node card preview"
    >
      <div
        className="app-nodecard-nodule top"
        data-nodecard={id}
        data-side="top"
      />
      <div
        className="app-nodecard-nodule bottom"
        data-nodecard={id}
        data-side="bottom"
      />
      <div
        className="app-nodecard-nodule left"
        data-nodecard={id}
        data-side="left"
      />
      <div
        className="app-nodecard-nodule right"
        data-nodecard={id}
        data-side="right"
      />
      <div className="app-nodecard-header">
        <div className="app-nodecard-title">
          <FileText size={16} />
          <span className="app-nodecard-tag" />
          <strong>{title}</strong>
        </div>
        <div className="app-nodecard-actions">
          <Link size={13} />
          <Trash2 size={13} />
        </div>
      </div>
      <div className="app-nodecard-body">{body}</div>
      <svg
        className="app-nodecard-resize"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path d="M14 20l6-6" />
        <path d="M8 20l12-12" />
      </svg>
    </div>
  );
}

function Compare() {
  return (
    <section id="compare" className="section one-studio-section">
      <div className="container one-studio-grid">
        <motion.div
          className="one-studio-copy"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={reveal}
          transition={{ duration: 0.65 }}
        >
          <p className="eyebrow">One Studio</p>
          <h2>Your manuscript and story system belong in the same room.</h2>
          <p>
            Novelative keeps drafting, notes, world-building, planning, links,
            tags, and export inside one private desktop project, so every
            revision keeps its context.
          </p>
          <a className="text-link" href="/features">
            Explore the workflow
            <ArrowRight size={17} />
          </a>
        </motion.div>
        <MotionCard className="one-studio-board" delay={0.08}>
          <div className="studio-board-header">
            <span>Scattered tools</span>
            <ArrowRight size={18} />
            <strong>One Novelative project</strong>
          </div>
          <div className="studio-connection-list">
            {studioConnections.map((item) => (
              <div className="studio-connection" key={item.title}>
                <span className="studio-connection-icon">
                  <item.icon size={18} />
                </span>
                <div>
                  <span>{item.label}</span>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="studio-tool-strip">
            <ChipRow
              chips={[
                { label: "Wiki-links", icon: Link },
                { label: "Global tags", icon: Tags },
                { label: "Split view", icon: Columns3 },
                { label: "Backups", icon: FileArchive },
              ]}
            />
          </div>
        </MotionCard>
      </div>
    </section>
  );
}

function WorldBuilding({ theme }: { theme: Theme }) {
  return (
    <section id="worldbuilding" className="section visualize-tags-section">
      <div className="container">
        <SectionHeader
          eyebrow="Visualize: Tags"
          title="Sorting by tags."
        >
          Group story files by tag on the same canvas the app uses, with
          colored clusters, inherited tag dividers, search, and layout controls
          visible in one real project view.
        </SectionHeader>

        <motion.figure
          className="visualize-tags-showcase"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.24 }}
          variants={reveal}
          transition={{ duration: 0.65 }}
        >
          <img
            src={`/assets/Visualize-TagsView-${theme}.png`}
            alt="Novelative Visualize Tags view showing tagged story groups on a canvas"
            loading="lazy"
          />
        </motion.figure>
      </div>
    </section>
  );
}

function ProjectLayers() {
  return (
    <section id="project-layers" className="section surface-section">
      <SectionHeader
        eyebrow="Inside Each Project"
        title="A project holds the working parts of the book."
      >
        Novelative keeps the manuscript, world bible, planning space, visual
        map, writing environment, and export path in one local workspace.
      </SectionHeader>
      <div className="container card-grid six">
        {projectLayers.map((layer, index) => (
          <MotionCard
            className="icon-card"
            key={layer.title}
            delay={index * 0.05}
          >
            <IconBadge icon={layer.icon} />
            <h3>{layer.title}</h3>
            <p>{layer.body}</p>
          </MotionCard>
        ))}
      </div>
    </section>
  );
}

function WritersSection() {
  return (
    <section className="section writers-section">
      <div className="container writers-grid">
        <motion.div
          className="writers-copy"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.28 }}
          variants={reveal}
          transition={{ duration: 0.65 }}
        >
          <p className="eyebrow">For writers</p>
          <h2>Novelative is for writers.</h2>
          <p>
            The product is shaped around the practical work of building a book:
            drafting, organizing, revising, and keeping story context close.
          </p>
        </motion.div>

        <motion.ul
          className="writer-point-list"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.22 }}
          variants={reveal}
          transition={{ duration: 0.65, delay: 0.08 }}
        >
          {writerPoints.map((point, index) => (
            <li className="writer-point" key={point}>
              <span className="writer-point-marker">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p>{point}</p>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

function BetaPrinciples() {
  return (
    <section className="section">
      <div className="container beta-grid">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={reveal}
          transition={{ duration: 0.65 }}
        >
          <p className="eyebrow">Built in Beta</p>
          <h2>Built around the friction writers actually hit.</h2>
          <p>
            Long-form fiction gets messy when drafting, notes, continuity, and
            visual structure live in different systems. Beta feedback is focused
            on reducing that friction inside real projects.
          </p>
          <ChipRow
            chips={[
              { label: "Designed for long-form fiction", icon: Feather },
              {
                label: "Optimized for structure-heavy projects",
                icon: Network,
              },
              { label: "Beta feedback shapes priorities", icon: Sparkles },
            ]}
          />
        </motion.div>
        <div className="compact-grid">
          {principles.map((card, index) => (
            <MotionCard
              className="small-panel"
              key={card.title}
              delay={index * 0.06}
            >
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </MotionCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function Ownership() {
  return (
    <section id="ownership" className="section surface-section">
      <SectionHeader
        eyebrow="Ownership & Trust"
        title="Private desktop software still matters for drafts."
      >
        The local-first model is part of the product promise: your draft, notes,
        and story data should stay under your control.
      </SectionHeader>
      <div className="container trust-grid">
        {trustCards.map((card, index) => (
          <MotionCard
            className="icon-card"
            key={card.title}
            delay={index * 0.06}
          >
            <IconBadge icon={card.icon} />
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </MotionCard>
        ))}
      </div>
      <div className="container stat-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="section surface-section">
      <SectionHeader eyebrow="Questions" title="Frequently Asked Questions">
        Clear answers on storage, trial terms, export, updates, and platform
        support.
      </SectionHeader>
      <div className="narrow-container faq-list">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div className="faq-item" key={faq.question}>
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <ChevronDown className={isOpen ? "rotated" : ""} size={22} />
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: isOpen ? "auto" : 0,
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.24 }}
                className="faq-answer"
              >
                <p>{faq.answer}</p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CommunityCta() {
  return (
    <section className="community-section">
      <div className="container">
        <MotionCard className="community-card">
          <div>
            <p className="eyebrow discord">Discord</p>
            <h2>Join the Community</h2>
            <p>
              Compare workflows with other writers, share beta feedback, and get
              product updates as Novelative changes.
            </p>
          </div>
          <a
            className="discord-button"
            href="https://discord.gg/TUyzpVTXUS"
            target="_blank"
            rel="noreferrer"
          >
            Join Server
            <ArrowUpRight size={18} />
          </a>
        </MotionCard>
      </div>
    </section>
  );
}

function DownloadCta() {
  return (
    <section id="download" className="section final-cta">
      <div className="narrow-container">
        <h2>
          Start the next draft in a workspace built for the book around it.
        </h2>
        <p>
          Try Novelative free for 30 days of use on Windows or macOS. No sign-up, and your projects stay on your device.
        </p>
        <div className="final-download-actions">
          <div className="final-download-buttons">
            {downloadBuilds.map((build) => (
              <a
                className="final-download-button"
                href={build.href}
                key={build.platform}
              >
                <build.icon size={20} />
                <span>Download for {build.platform.split(" ")[0]}</span>
              </a>
            ))}
          </div>
          <a className="final-download-page-link" href="/download">
            View download page
            <ArrowRight size={16} />
          </a>
          <span className="final-download-note">
            One-time purchase after trial. Your projects stay local.
          </span>
        </div>
      </div>
    </section>
  );
}

function Footer({
  theme,
  onOpenCookieSettings,
}: {
  theme: Theme;
  onOpenCookieSettings: () => void;
}) {
  const footerLogo =
    theme === "light"
      ? "/assets/lightmodeicon.png"
      : "/assets/darkmodeicon.png";

  return (
    <footer className="footer">
      <div className="container footer-wrap">
        <div className="footer-main">
          <div className="footer-about">
            <a className="brand footer-brand" href="/">
              <img src={footerLogo} alt="" className="brand-mark" />
              <span>Novelative</span>
            </a>
            <p>
              A private desktop writing studio for authors who need to draft,
              organize, plot, and visualize complex story worlds in one place.
            </p>
            <div className="footer-proof">
              <span>Windows + macOS</span>
              <span>30 days of use free</span>
              <span>One-time purchase</span>
            </div>
          </div>

          <nav className="footer-column" aria-label="Explore">
            <h2>Explore</h2>
            <a href="/download">Download</a>
            <a href="/features">Features</a>
            <a href="/purchase">Purchase</a>
            <a href="/blog">Blog</a>
            <a href="/release-notes">Release Notes</a>
          </nav>

          <nav className="footer-column" aria-label="Support">
            <h2>Support</h2>
            <a href="/support">Support / Contact</a>
            <a href="/download-help">Download Help</a>
            <a href="/license-help">License Help</a>
            <a href="/privacy">Privacy Policy</a>
            <button type="button" onClick={onOpenCookieSettings}>
              Your Privacy Choices
            </button>
            <a href="/terms">Terms / EULA</a>
          </nav>

          <nav className="footer-column" aria-label="Community">
            <h2>Community</h2>
            <a
              href="https://discord.gg/TUyzpVTXUS"
              target="_blank"
              rel="noreferrer"
            >
              Discord
            </a>
            <a href="/blog">Product Updates</a>
            <a href="/support">Bug Reports</a>
          </nav>
        </div>

        <div className="footer-bottom">
          <p>© Novelative 2026. Built by a writer for writers.</p>
          <p>
            Your projects stay on your device. Core writing and storage are
            local-first.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FloatingActions({
  onToggleTheme,
  theme,
}: {
  onToggleTheme: () => void;
  theme: Theme;
}) {
  return (
    <div className="floating-actions" aria-label="Quick actions">
      <IconButton
        label="Back to top"
        icon={ArrowUp}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
      <IconButton
        label={
          theme === "light" ? "Switch to dark mode" : "Switch to light mode"
        }
        icon={theme === "light" ? Moon : Sun}
        onClick={onToggleTheme}
      />
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: string;
}) {
  return (
    <motion.div
      className="section-header"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.35 }}
      variants={reveal}
      transition={{ duration: 0.65 }}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </motion.div>
  );
}

function ChipRow({
  chips,
}: {
  chips: Array<{ label: string; icon: LucideIcon }>;
}) {
  return (
    <div className="chip-row">
      {chips.map((chip) => (
        <span className="feature-chip" key={chip.label}>
          <chip.icon size={15} />
          {chip.label}
        </span>
      ))}
    </div>
  );
}

function InlineIcon({
  icon: Icon,
  href,
  children,
}: {
  icon: LucideIcon;
  href?: string;
  children: ReactNode;
}) {
  if (href) {
    return (
      <a className="inline-icon" href={href}>
        <Icon size={16} />
        <span>{children}</span>
      </a>
    );
  }

  return (
    <div className="inline-icon">
      <Icon size={16} />
      <span>{children}</span>
    </div>
  );
}

function IconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="icon-badge">
      <Icon size={22} />
    </div>
  );
}

function SmallPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="small-panel">
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

function IconButton({
  label,
  icon: Icon,
  onClick,
  className = "",
}: {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      className={`icon-button ${className}`}
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <Icon size={19} />
    </button>
  );
}

export default App;
