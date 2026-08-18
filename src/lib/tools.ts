import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  Search,
  MessagesSquare,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  description?: string;
};

export const TOOLS: Required<NavItem>[] = [
  {
    label: "Smart Email Generator",
    to: "/email",
    icon: Mail,
    description: "Draft clear, on-tone workplace emails from a few notes.",
  },
  {
    label: "Meeting Notes Summarizer",
    to: "/meetings",
    icon: FileText,
    description: "Turn messy notes into summaries, decisions and action items.",
  },
  {
    label: "AI Task Planner",
    to: "/tasks",
    icon: ListChecks,
    description: "Prioritize your workload and get a realistic schedule.",
  },
  {
    label: "AI Research Assistant",
    to: "/research",
    icon: Search,
    description: "Structured briefings on any workplace topic or question.",
  },
  {
    label: "AI Workplace Chatbot",
    to: "/chat",
    icon: MessagesSquare,
    description: "Ask productivity questions and get professional guidance.",
  },
];

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  ...TOOLS.map(({ label, to, icon }) => ({ label, to, icon })),
  { label: "Settings", to: "/settings", icon: Settings },
];

export const DISCLAIMER =
  "AI-generated content may contain errors or omissions. Review and verify important information before using it for workplace decisions or communication.";
