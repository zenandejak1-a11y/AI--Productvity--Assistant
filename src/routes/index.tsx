import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Sparkles, ShieldCheck } from "lucide-react";
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
          "Write emails, summarize meetings, plan tasks and research topics in one AI workplace productivity platform.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Work smarter. Save time. Get more done with AI.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-elevated sm:p-9">
        <div
          className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-gradient-brand opacity-15 blur-3xl"
          aria-hidden
        />
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <Sparkles className="size-3.5" /> Your AI workplace copilot
        </span>
        <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
          Work smarter. Save time.{" "}
          <span className="text-gradient-brand">Get more done with AI.</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          One integrated platform for the repetitive parts of your workday. Draft professional
          emails, turn raw meeting notes into decisions and action items, prioritize your task
          list, research work topics, and ask a workplace assistant anything — without switching
          between five different apps.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/email">
              Start with an email <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/chat">Ask the assistant</Link>
          </Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5 text-primary" /> Minutes instead of hours
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-primary" /> Never invents facts you didn't give
          </span>
        </div>
      </section>

      <h2 className="mb-4 mt-10 text-lg font-semibold">Your AI tools</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TOOLS.map((tool) => (
          <article
            key={tool.to}
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated"
          >
            <span className="grid size-11 place-items-center rounded-2xl bg-accent text-accent-foreground transition-colors group-hover:bg-gradient-brand group-hover:text-primary-foreground">
              <tool.icon className="size-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold">{tool.label}</h3>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
              {tool.description}
            </p>
            <Button asChild variant="outline" className="mt-5 w-full">
              <Link to={tool.to}>
                Open Tool <ArrowRight className="size-4" />
              </Link>
            </Button>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
