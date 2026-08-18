import { Check, Copy, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onRegenerate?: (() => void) | undefined;
  onClear: () => void;
  loading: boolean;
  error?: string | null | undefined;
  emptyHint: string;
  title?: string | undefined;
};

export function OutputPanel({
  value,
  onChange,
  onRegenerate,
  onClear,
  loading,
  error,
  emptyHint,
  title = "AI output",
}: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">{title}</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={copy} disabled={!value || loading}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          {onRegenerate ? (
            <Button variant="outline" size="sm" onClick={onRegenerate} disabled={loading}>
              <RefreshCw className="size-4" />
              Regenerate
            </Button>
          ) : null}
          <Button variant="ghost" size="sm" onClick={onClear} disabled={loading || !value}>
            <Trash2 className="size-4" />
            Clear
          </Button>
        </div>
      </div>

      {error ? (
        <p className="mb-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="space-y-3 py-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Generating with AI…
          </div>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ) : value ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Editable AI output"
          className="min-h-[320px] resize-y bg-background text-sm leading-relaxed"
        />
      ) : (
        <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          {emptyHint}
        </p>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        The output is fully editable — refine it before you use it.
      </p>
    </section>
  );
}
