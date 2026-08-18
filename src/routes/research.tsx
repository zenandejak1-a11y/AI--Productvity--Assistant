import { createFileRoute } from "@tanstack/react-router";
import { Search, Wand2 } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAiTool } from "@/hooks/useAiTool";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Get a structured briefing on any workplace topic: key points, insights, challenges and recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Structured briefings on any workplace topic or question.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const { output, setOutput, loading, error, generate, regenerate, clear } = useAiTool("research");

  return (
    <AppShell>
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="A structured briefing on any work topic."
        instructions="Enter a workplace topic or question. The briefing is written from the model's general knowledge — it does not browse the web, so verify anything you plan to act on."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic or question</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. How do we run effective hybrid team retrospectives?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="context">Context (optional)</Label>
            <Textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. 12-person marketing team, three time zones, weekly cadence."
              className="min-h-[160px]"
            />
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={loading || !topic.trim()}
            onClick={() => void generate({ topic, context })}
          >
            <Wand2 className="size-4" />
            {loading ? "Researching…" : "Generate Briefing"}
          </Button>
        </section>

        <OutputPanel
          title="Research briefing"
          value={output}
          onChange={setOutput}
          onRegenerate={topic.trim() ? regenerate : undefined}
          onClear={clear}
          loading={loading}
          error={error}
          emptyHint="Overview, key points, insights, advantages, challenges, recommendations and follow-up questions will appear here."
        />
      </div>
    </AppShell>
  );
}
