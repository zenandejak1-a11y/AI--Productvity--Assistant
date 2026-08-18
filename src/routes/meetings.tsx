import { createFileRoute } from "@tanstack/react-router";
import { FileText, Wand2 } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAiTool } from "@/hooks/useAiTool";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into an executive summary, decisions, action items and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content: "Structured summaries, decisions and action items from messy meeting notes.",
      },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const { output, setOutput, loading, error, generate, regenerate, clear } = useAiTool("meeting");

  return (
    <AppShell>
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Paste raw notes, get a structured summary."
        instructions="Paste your notes exactly as they are — bullet points, transcript fragments or shorthand all work. The AI only uses what's in your notes; anything missing is marked as not specified."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
          <div className="space-y-2">
            <Label htmlFor="notes">Meeting notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                "e.g.\nQ3 planning call — Ana, Peter, Sam\n- Budget still under review, Peter to confirm by Wed\n- Agreed to delay the launch to 12 Oct\n- Sam: rewrite onboarding copy"
              }
              className="min-h-[380px]"
            />
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={loading || !notes.trim()}
            onClick={() => void generate({ notes })}
          >
            <Wand2 className="size-4" />
            {loading ? "Summarizing…" : "Summarize Notes"}
          </Button>
        </section>

        <OutputPanel
          title="Structured summary"
          value={output}
          onChange={setOutput}
          onRegenerate={notes.trim() ? regenerate : undefined}
          onClear={clear}
          loading={loading}
          error={error}
          emptyHint="Executive summary, key discussion points, decisions, action items and deadlines will appear here."
        />
      </div>
    </AppShell>
  );
}
