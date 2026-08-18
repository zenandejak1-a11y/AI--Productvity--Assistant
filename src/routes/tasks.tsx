import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Wand2 } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Prioritize tasks by urgency and get a realistic daily or weekly schedule suggestion.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Prioritize your workload and get a realistic schedule you can edit.",
      },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState("Daily");
  const [capacity, setCapacity] = useState("");
  const { output, setOutput, loading, error, generate, regenerate, clear } = useAiTool("tasks");

  return (
    <AppShell>
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Prioritized tasks and a realistic schedule."
        instructions="List one task per line with an optional deadline. The AI categorizes each task as High, Medium or Low, flags what's urgent, and suggests a schedule — recommendations only, the final call is yours."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
          <div className="space-y-2">
            <Label htmlFor="tasks">Tasks and deadlines</Label>
            <Textarea
              id="tasks"
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder={
                "e.g.\nFinish Q3 budget draft — due Thursday\nReply to supplier emails\nPrepare board slides — due next Monday\nOne-on-one with Sam"
              }
              className="min-h-[240px]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="horizon">Planning horizon</Label>
              <Select value={horizon} onValueChange={setHorizon}>
                <SelectTrigger id="horizon">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Available focus time (optional)</Label>
              <Input
                id="capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g. 5 hours per day"
              />
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={loading || !tasks.trim()}
            onClick={() => void generate({ tasks, horizon, capacity })}
          >
            <Wand2 className="size-4" />
            {loading ? "Planning…" : "Plan My Tasks"}
          </Button>
        </section>

        <OutputPanel
          title="Suggested plan"
          value={output}
          onChange={setOutput}
          onRegenerate={tasks.trim() ? regenerate : undefined}
          onClear={clear}
          loading={loading}
          error={error}
          emptyHint="Your prioritized task list and suggested schedule will appear here, ready to edit."
        />
      </div>
    </AppShell>
  );
}
