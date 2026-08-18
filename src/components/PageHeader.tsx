import { AlertTriangle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DISCLAIMER } from "@/lib/tools";

export function PageHeader({
  icon: Icon,
  title,
  description,
  instructions,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  instructions?: string;
}) {
  return (
    <header className="mb-6 space-y-4">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-brand shadow-card">
          <Icon className="size-5 text-primary-foreground" />
        </span>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {instructions ? (
        <p className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-card">
          {instructions}
        </p>
      ) : null}
      <div className="flex items-start gap-2 rounded-xl bg-accent/60 px-4 py-3 text-xs leading-relaxed text-accent-foreground">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
        <span>{DISCLAIMER}</span>
      </div>
    </header>
  );
}
