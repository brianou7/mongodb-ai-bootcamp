import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { getDb } from "../db/client";
import { getConfig } from "../config";

// Thresholds for alert signals
const HIGH_AMOUNT_COP = 10_000_000;  // COP $10,000,000
const NIGHTTIME_HOUR_MAX = "05";     // 00:00–05:59 considered nighttime

/**
 * Detects suspicious signals for a customer or session:
 * consecutive auth failures, nighttime high-value transfers,
 * reversed transactions, and multiple IPs in the same session.
 */
export const suspiciousSessionTool = tool(
  async ({ documentNumber, sessionId }): Promise<string> => {
    const cfg = getConfig();
    const db = await getDb();
    const col = db.collection(cfg.EVENTS_COLLECTION);

    const match: Record<string, unknown> = {};
    if (documentNumber) match["documentNumber"] = documentNumber;
    if (sessionId) match["sessionId"] = sessionId;

    if (!documentNumber && !sessionId) {
      return JSON.stringify({ error: "Provide at least one of documentNumber or sessionId." });
    }

    const events = await col
      .aggregate([
        { $match: match },
        {
          $project: {
            _id: 1,
            sessionId: 1,
            documentNumber: 1,
            customerName: 1,
            transactionState: 1,
            transactionType: 1,
            transactionValule: 1,
            authenticationType: 1,
            initialTrxHour: 1,
            throwbackId: 1,
            ip: 1,
            channel: 1,
            transactionCodeDesc: 1,
            initialYearTrx: 1,
            initialMonthTrx: 1,
            initialDayTrx: 1,
          },
        },
        { $sort: { initialYearTrx: 1, initialMonthTrx: 1, initialDayTrx: 1, initialTrxHour: 1 } },
      ])
      .toArray();

    if (events.length === 0) {
      return JSON.stringify({ message: "No events found for the given filters." });
    }

    const alerts: string[] = [];

    // 1. Multiple consecutive failed authentication attempts
    let consecutiveFails = 0;
    let maxConsecutiveFails = 0;
    for (const e of events) {
      if (e["transactionState"] === "No exitosa") {
        consecutiveFails++;
        maxConsecutiveFails = Math.max(maxConsecutiveFails, consecutiveFails);
      } else {
        consecutiveFails = 0;
      }
    }
    if (maxConsecutiveFails >= 3) {
      alerts.push(`${maxConsecutiveFails} consecutive failed transactions detected.`);
    }

    // 2. High-value monetary transfers during nighttime hours
    const nighttimeHighValue = events.filter(
      (e) =>
        e["transactionType"] === "Monetaria" &&
        e["transactionState"] === "Exitosa" &&
        typeof e["transactionValule"] === "number" &&
        e["transactionValule"] >= HIGH_AMOUNT_COP &&
        typeof e["initialTrxHour"] === "string" &&
        e["initialTrxHour"].slice(0, 2) <= NIGHTTIME_HOUR_MAX,
    );
    if (nighttimeHighValue.length > 0) {
      alerts.push(
        `${nighttimeHighValue.length} high-value monetary transfer(s) (>= COP $10,000,000) during nighttime hours (00:00–05:59).`,
      );
    }

    // 3. Reversed transactions (throwbackId = 1)
    const reversed = events.filter((e) => e["throwbackId"] === 1);
    if (reversed.length > 0) {
      alerts.push(`${reversed.length} reversed transaction(s) found (throwbackId = 1).`);
    }

    // 4. Multiple distinct IPs within the same session
    const sessionIpMap = new Map<string, Set<string>>();
    for (const e of events) {
      const sid: string = e["sessionId"] as string;
      const ip: string = e["ip"] as string;
      if (sid && ip) {
        if (!sessionIpMap.has(sid)) sessionIpMap.set(sid, new Set());
        sessionIpMap.get(sid)!.add(ip);
      }
    }
    const multiIpSessions = [...sessionIpMap.entries()].filter(([, ips]) => ips.size > 1);
    if (multiIpSessions.length > 0) {
      alerts.push(
        `${multiIpSessions.length} session(s) with multiple distinct IPs: ` +
          multiIpSessions.map(([sid, ips]) => `${sid} (${[...ips].join(", ")})`).join("; "),
      );
    }

    const customerName =
      (events.find((e) => e["customerName"])?.["customerName"] as string | undefined) ?? null;

    return JSON.stringify({
      documentNumber: documentNumber ?? null,
      sessionId: sessionId ?? null,
      customerName,
      totalEvents: events.length,
      alertCount: alerts.length,
      alerts: alerts.length > 0 ? alerts : ["No suspicious signals detected."],
      details: {
        maxConsecutiveFails,
        nighttimeHighValueCount: nighttimeHighValue.length,
        reversedCount: reversed.length,
        multiIpSessionCount: multiIpSessions.length,
      },
    });
  },
  {
    name: "detect_suspicious_sessions",
    description:
      "Detects suspicious activity signals for a bank customer or session. " +
      "Checks for: 3 or more consecutive failed transactions, high-value monetary transfers " +
      "(>= COP $10,000,000) during nighttime hours (00:00–05:59), reversed transactions " +
      "(throwbackId = 1), and multiple distinct IP addresses within the same session. " +
      "Provide documentNumber to analyze all sessions of a customer, or sessionId to inspect a single session. " +
      "Use this tool for fraud investigation or security anomaly detection.",
    schema: z.object({
      documentNumber: z
        .string()
        .optional()
        .describe("Customer identity document number, e.g. '79456123'. Use to inspect all sessions of a customer."),
      sessionId: z
        .string()
        .optional()
        .describe("Session UUID to inspect a single session, e.g. 'a1b2c3d4-...'. Use for a targeted session review."),
    }),
  },
);
