import { useServerFn } from "@tanstack/react-start";
import { useCallback, useRef, useState } from "react";
import { runAiTool } from "@/lib/ai.functions";

type Kind = "email" | "meeting" | "tasks" | "research";

export function useAiTool(kind: Kind) {
  const call = useServerFn(runAiTool);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastInput = useRef<Record<string, string> | null>(null);

  const generate = useCallback(
    async (input: Record<string, string>) => {
      lastInput.current = input;
      setLoading(true);
      setError(null);
      try {
        const res = await call({ data: { kind, input } });
        setOutput(res.text);
      } catch (e) {
        setError(
          e instanceof Error && e.message
            ? `Something went wrong: ${e.message}. Please try again.`
            : "Something went wrong. Please try again in a moment.",
        );
      } finally {
        setLoading(false);
      }
    },
    [call, kind],
  );

  const regenerate = useCallback(() => {
    if (lastInput.current) void generate(lastInput.current);
  }, [generate]);

  const clear = useCallback(() => {
    setOutput("");
    setError(null);
  }, []);

  return { output, setOutput, loading, error, generate, regenerate, clear, hasRun: !!lastInput.current };
}
