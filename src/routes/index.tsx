import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Clock, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { TOOLS } from "@/lib/tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant — Dashboard" },
      {
        name: "description",
        content:
          "Your personal AI workspace: write emails, summarize meetings, plan tasks and research smarter in one place.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Automate emails, summarize meetings, plan your week and research smarter.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const STATS = [
  { icon: Clock, value: "8.5h", label: "Hours saved per week" },
  { icon: Zap, value: "12×", label: "Faster response time" },
  { icon: ShieldCheck, value: "100%", label: "Reliable & private" },
];

function greeting(h: number) {
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
}

function useGreeting() {
  const [text, setText] = useState("Hello, there 👋");

  useEffect(() => {
    let name = "there";
    try {
      const raw = localStorage.getItem("aiwpa-prefs");
      if (raw) {
        const parsed = JSON.parse(raw) as { name?: string };
        const first = parsed.name?.trim().split(/\s+/)[0];
        if (first) name = first;
      }
    } catch {
      /* ignore malformed preferences */
    }
    setText(`${greeting(new Date().getHours())}, ${name} 👋`);
  }, []);

  return text;
}

function Dashboard() {
  const tools = TOOLS.slice(0, 3);
  const greetingText = useGreeting();

  return (
    <AppShell>
      <section className="mb-6">
        <h1 className="text-xl font-bold sm:text-2xl">{greeting()}, Zenande 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ready to get some work done? Let your AI workplace assistant handle the repetitive stuff.
        </p>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-sidebar-border bg-sidebar p-6 text-sidebar-foreground shadow-elevated sm:p-9">
        <div
          className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-gradient-brand opacity-40 blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-sidebar-accent px-3 py-1 text-xs font-medium text-sidebar-accent-foreground">
            <Sparkles className="size-3.5 text-sidebar-primary" /> AI workspace
          </span>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight text-sidebar-accent-foreground sm:text-4xl">
            Your AI workplace assistant
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sidebar-foreground/80 sm:text-base">
            Automate emails, summarize meetings, plan your week, and research smarter — all from one
            beautifully simple workspace.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/email">
                Start with Email <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-sidebar-border bg-transparent text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Link to="/chat">Open AI Chat</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground">
              <stat.icon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-2xl font-bold leading-none">{stat.value}</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-4 mt-10 text-lg font-semibold">Productivity Tools</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <article
            key={tool.to}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground transition-colors group-hover:bg-gradient-brand group-hover:text-primary-foreground">
              <tool.icon className="size-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold">{tool.label}</h3>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
              {tool.description}
            </p>
            <Link
              to={tool.to}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              Open tool <ArrowRight className="size-4" />
            </Link>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
