import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Set your name, default email tone and AI preferences for the workplace assistant.",
      },
      { property: "og:title", content: "Settings" },
      {
        property: "og:description",
        content: "Personalize your AI workplace productivity assistant.",
      },
    ],
  }),
  component: SettingsPage,
});

type Prefs = { name: string; role: string; tone: string; compact: boolean };

const DEFAULTS: Prefs = { name: "", role: "", tone: "Professional", compact: false };
const KEY = "aiwpa-prefs";

function SettingsPage() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        setPrefs({ ...DEFAULTS, ...(JSON.parse(raw) as Partial<Prefs>) });
      } catch {
        /* ignore malformed preferences */
      }
    }
  }, []);

  const update = (patch: Partial<Prefs>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  return (
    <AppShell>
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        description="Personalize how the assistant works for you."
        instructions="These preferences are stored on this device only. Changes save automatically."
      />

      <div className="space-y-5">
        <section className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card">
          <h2 className="text-sm font-semibold">Profile</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                value={prefs.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="e.g. Zenande Jack"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Job role</Label>
              <Input
                id="role"
                value={prefs.role}
                onChange={(e) => update({ role: e.target.value })}
                placeholder="e.g. Operations Manager"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card">
          <h2 className="text-sm font-semibold">AI preferences</h2>
          <div className="space-y-2 sm:max-w-xs">
            <Label htmlFor="default-tone">Default email tone</Label>
            <Select value={prefs.tone} onValueChange={(tone) => update({ tone })}>
              <SelectTrigger id="default-tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Formal", "Friendly", "Professional", "Persuasive", "Concise"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/60 px-4 py-3">
            <div>
              <p className="text-sm font-medium">Prefer shorter responses</p>
              <p className="text-xs text-muted-foreground">
                Ask the assistant to keep answers brief and to the point.
              </p>
            </div>
            <Switch
              checked={prefs.compact}
              onCheckedChange={(compact) => update({ compact })}
              aria-label="Prefer shorter responses"
            />
          </div>
        </section>

        <section className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-card">
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-primary" />
          <div className="space-y-1 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Responsible use</p>
            <p>
              Do not enter sensitive, confidential or personal information into any AI tool in this
              app. Always review and verify AI-generated content before using it for workplace
              decisions or communication.
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
