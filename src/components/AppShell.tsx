import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Sparkles, ShieldAlert } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { NAV_ITEMS, DISCLAIMER } from "@/lib/tools";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-card"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon
              className={cn(
                "size-[18px] shrink-0 transition-transform group-hover:scale-110",
                active && "text-sidebar-primary",
              )}
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 px-1 py-1">
      <span className="grid size-9 place-items-center rounded-xl bg-gradient-brand shadow-card">
        <Sparkles className="size-[18px] text-primary-foreground" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-sm font-bold">AI Workplace</span>
        <span className="block text-xs text-muted-foreground">Productivity Assistant</span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[270px] flex-col justify-between border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex">
        <div className="space-y-6">
          <Brand />
          <NavLinks />
        </div>
        <div className="rounded-xl bg-muted/70 p-3 text-[11px] leading-relaxed text-muted-foreground">
          <ShieldAlert className="mb-1.5 size-4 text-primary" />
          Avoid entering sensitive or confidential information. Always verify AI output.
        </div>
      </aside>

      <div className="lg:pl-[270px]">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open navigation">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-sidebar px-4 py-5">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="space-y-6">
                <Brand />
                <NavLinks onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
          <Brand />
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          {children}
          <p className="mt-10 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
            {DISCLAIMER}
          </p>
        </main>
      </div>
    </div>
  );
}
