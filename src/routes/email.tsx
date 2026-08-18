import { createFileRoute } from "@tanstack/react-router";
import { Mail, Wand2 } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAiTool } from "@/hooks/useAiTool";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace Assistant" },
      {
        name: "description",
        content: "Generate professional workplace emails in any tone from a few short notes.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Draft clear, on-tone workplace emails in seconds with AI.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Friendly", "Professional", "Persuasive", "Concise"];

function EmailPage() {
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("Professional");
  const [keyPoints, setKeyPoints] = useState("");
  const { output, setOutput, loading, error, generate, regenerate, clear } = useAiTool("email");

  return (
    <AppShell>
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Describe the message — the AI writes the email."
        instructions="Explain what you want to communicate, pick a tone, and optionally add key points that must be included. The AI keeps your meaning intact and won't invent details such as names, dates or numbers."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
          <div className="space-y-2">
            <Label htmlFor="message">What should the email communicate?</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Tell the client we need two extra days for the report because we're waiting on final figures, and confirm the new delivery date is Friday."
              className="min-h-[140px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="tone">
                <SelectValue placeholder="Choose a tone" />
              </SelectTrigger>
              <SelectContent>
                {TONES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="points">Key points (optional)</Label>
            <Textarea
              id="points"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder={"e.g.\n- Thank them for their patience\n- Offer a short call on Thursday"}
              className="min-h-[110px]"
            />
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={loading || !message.trim()}
            onClick={() => void generate({ message, tone, keyPoints })}
          >
            <Wand2 className="size-4" />
            {loading ? "Generating…" : "Generate Email"}
          </Button>
        </section>

        <OutputPanel
          title="Generated email"
          value={output}
          onChange={setOutput}
          onRegenerate={message.trim() ? regenerate : undefined}
          onClear={clear}
          loading={loading}
          error={error}
          emptyHint="Your generated email will appear here, ready to edit and copy."
        />
      </div>
    </AppShell>
  );
}
