import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildPrompt, runGeneration, type ToolKind } from "./ai-prompts.server";

const ToolInput = z.object({
  kind: z.enum(["email", "meeting", "tasks", "research"]),
  input: z.record(z.string()),
});

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1),
      }),
    )
    .min(1),
});

export const runAiTool = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ToolInput.parse(data))
  .handler(async ({ data }) => {
    const { system, prompt } = buildPrompt(data.kind as ToolKind, data.input);
    const text = await runGeneration({ system, prompt });
    return { text };
  });

export const runAiChat = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ChatInput.parse(data))
  .handler(async ({ data }) => {
    const { system } = buildPrompt("chat", {});
    const text = await runGeneration({ system, messages: data.messages });
    return { text };
  });
