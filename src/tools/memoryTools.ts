import { tool } from "@langchain/core/tools";
import { getStore, getConfig } from "@langchain/langgraph";
import { z } from "zod";
import { saveUserMemory } from "../memory/store";

/**
 * The `remember` tool: write to long-term, cross-thread memory.
 *
 * The read side is automatic (the graph injects known user context into the
 * system prompt each turn), so this tool only handles the write side: it lets
 * the agent persist a lightweight, durable fact about the user. It reads the
 * active store and the current user_id from the LangGraph run context.
 *
 * Reference discipline: the schema pushes toward short summaries and record
 * ids, not raw record contents. See src/memory/store.ts.
 */
export const remember = tool(
  async ({ key, kind, summary, references }): Promise<string> => {
    const store = getStore();
    const userId = getConfig().configurable?.user_id as string | undefined;
    if (!store) return "Long-term memory store is not available in this context.";
    if (!userId) return "No user_id in the run context; cannot persist user memory.";

    await saveUserMemory(store, userId, key, { kind, summary, references: references ?? [] });
    return `Remembered "${key}" for this user.`;
  },
  {
    name: "remember",
    description:
      "Persist a SHORT, durable fact or reference about the current user across sessions. " +
      "Call it when the user states something worth recalling (team, role, preferences, ids of records they care about). " +
      "ALSO call it proactively when you detect a suspicious or out-of-policy operation: save the event ids in " +
      "'references' and a brief operational context in 'summary' (no account numbers, no customer names, no raw amounts). " +
      "Do NOT store raw record contents or sensitive personal data.",
    schema: z.object({
      key: z.string().describe("A short stable key for this memory, e.g. 'team', 'watched_cases', or 'alert_2026-08-08'."),
      kind: z
        .enum(["profile", "preference", "reference", "alert"])
        .describe(
          "profile = who the user is; preference = how they like to work; " +
          "reference = ids they care about; alert = suspicious or out-of-policy operation detected.",
        ),
      summary: z
        .string()
        .describe(
          "One short sentence of lightweight context. For alerts: describe the anomaly type and date, " +
          "never account numbers, customer names, or raw monetary amounts.",
        ),
      references: z
        .array(z.string())
        .optional()
        .describe("Record ids this memory refers to (e.g. ['rcc_00482', 'rcc_00483'])."),
    }),
  },
);
