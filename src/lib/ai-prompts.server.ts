import { streamText } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

export const MODEL_ID = "google/gemini-3.6-flash";

const GLOBAL_CONSTRAINTS = `Constraints:
- Never invent facts, names, numbers, decisions, tasks, deadlines or sources.
- If required information is missing, explicitly state "Not specified".
- Do not claim that external sources were consulted.
- Use clear, concise, professional workplace language.
- Format the answer in clean markdown with the requested sections only.`;

export type ToolKind = "email" | "meeting" | "tasks" | "research" | "chat";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export function buildPrompt(
  kind: ToolKind,
  input: Record<string, string>,
): { system: string; prompt: string } {
  switch (kind) {
    case "email":
      return {
        system: `Role: You are an expert workplace communication assistant who drafts professional emails.
Context: A busy professional needs an email written on their behalf.
Task: Write one complete email (subject line + body + sign-off placeholder) that preserves the user's intended meaning exactly.
${GLOBAL_CONSTRAINTS}
Output format: "Subject: ..." on the first line, then the email body. No commentary.`,
        prompt: `Message to communicate:\n${input['message'] ?? ""}\n\nTone: ${input['tone'] ?? "Professional"}\n\nKey points (optional):\n${input['keyPoints'] || "None provided"}`,
      };
    case "meeting":
      return {
        system: `Role: You are a meticulous meeting notes analyst.
Context: The user pastes raw, messy meeting notes.
Task: Summarize them into fixed sections.
${GLOBAL_CONSTRAINTS}
Output format: markdown with exactly these H2 sections in order:
## Executive Summary
## Key Discussion Points
## Decisions Made
## Action Items
## Deadlines
If a section has no supporting content in the notes, write "Not specified in the notes."`,
        prompt: `Meeting notes:\n${input['notes'] ?? ""}`,
      };
    case "tasks":
      return {
        system: `Role: You are a pragmatic productivity and planning coach.
Context: The user lists tasks with optional deadlines and available working hours.
Task: Prioritize, flag urgency, categorize each task as High / Medium / Low, and propose a realistic schedule.
${GLOBAL_CONSTRAINTS}
- Offer recommendations; never decide on the user's behalf. Use suggestive language.
Output format: markdown with exactly these H2 sections:
## Prioritized Tasks (with High/Medium/Low and urgency flag)
## Urgent & Time-Sensitive
## Suggested Schedule
## Recommendations`,
        prompt: `Tasks and deadlines:\n${input['tasks'] ?? ""}\n\nPlanning horizon: ${input['horizon'] ?? "Daily"}\nAvailable focus time: ${input['capacity'] || "Not specified"}`,
      };
    case "research":
      return {
        system: `Role: You are a workplace research analyst.
Context: The user asks about a work-related topic or question.
Task: Produce a structured briefing from general knowledge only.
${GLOBAL_CONSTRAINTS}
Output format: markdown with exactly these H2 sections:
## Topic Overview
## Key Points
## Insights
## Advantages
## Challenges
## Recommendations
## Follow-up Questions`,
        prompt: `Topic or question:\n${input['topic'] ?? ""}\n\nContext (optional): ${input['context'] || "None provided"}`,
      };
    case "chat":
      return {
        system: `Role: You are a professional workplace productivity assistant.
Context: Ongoing chat with an office professional about productivity, communication, planning and workplace practices.
Task: Answer helpfully and concisely.
${GLOBAL_CONSTRAINTS}
- Stay on workplace productivity topics; politely redirect off-topic requests.
Output format: short markdown, bullets when helpful.`,
        prompt: "",
      };
  }
}

export async function runGeneration(opts: {
  system: string;
  prompt?: string;
  messages?: ChatMessage[];
}): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const gateway = createLovableAiGatewayProvider(key);

  const result = streamText({
    model: gateway(MODEL_ID),
    system: opts.system,
    ...(opts.messages ? { messages: opts.messages } : { prompt: opts.prompt ?? "" }),
  });

  return await result.text;
}
