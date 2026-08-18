import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, MessagesSquare, Send, Trash2, User, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { runAiChat } from "@/lib/ai.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chatbot — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Chat with a professional workplace productivity assistant about planning, communication and work habits.",
      },
      { property: "og:title", content: "AI Workplace Chatbot" },
      {
        property: "og:description",
        content: "Ask workplace productivity questions and get professional guidance.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "How do I run a shorter, more focused weekly team meeting?",
  "Help me structure my inbox routine so I check email twice a day.",
  "What's a good way to say no to extra work politely?",
];

function ChatPage() {
  const call = useServerFn(runAiChat);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await call({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (e) {
      setError(
        e instanceof Error && e.message
          ? `Couldn't reach the assistant: ${e.message}`
          : "Couldn't reach the assistant. Please try again in a moment.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        icon={MessagesSquare}
        title="AI Workplace Chatbot"
        description="Your professional productivity assistant."
        instructions="Ask about prioritization, communication, meetings, delegation or work habits. Keep confidential details out of the conversation."
      />

      <section className="flex h-[62vh] min-h-[440px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-semibold">Conversation</span>
          <Button
            variant="ghost"
            size="sm"
            disabled={loading || messages.length === 0}
            onClick={() => {
              setMessages([]);
              setError(null);
            }}
          >
            <Trash2 className="size-4" /> Clear conversation
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
          {messages.length === 0 ? (
            <div className="mx-auto max-w-md space-y-4 py-6 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-gradient-brand shadow-card">
                <Sparkles className="size-5 text-primary-foreground" />
              </span>
              <p className="text-sm text-muted-foreground">
                Ask anything about working more productively. Try one of these:
              </p>
              <div className="flex flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <Button
                    key={s}
                    variant="outline"
                    className="h-auto whitespace-normal py-2 text-left text-sm"
                    onClick={() => void send(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}
              >
                {m.role === "assistant" ? (
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <Sparkles className="size-4" />
                  </span>
                ) : null}
                <div
                  className={cn(
                    "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {m.content}
                </div>
                {m.role === "user" ? (
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                    <User className="size-4" />
                  </span>
                ) : null}
              </div>
            ))
          )}

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> The assistant is thinking…
            </div>
          ) : null}

          {error ? (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <div ref={endRef} />
        </div>

        <form
          className="flex items-center gap-2 border-t border-border px-3 py-3"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a workplace productivity question…"
            aria-label="Message"
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Send">
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </Button>
        </form>
      </section>
    </AppShell>
  );
}
