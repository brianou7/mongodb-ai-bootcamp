import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { getDb } from "../db/client";
import { getConfig } from "../config";

/**
 * Aggregates failed transactions grouped by technical error code and channel.
 * Accepts an optional technical code filter and/or a date range (YYYYMMDD integers).
 */
export const failedTransactionsTool = tool(
  async ({ technicalCode, fromYear, fromMonth, fromDay, toYear, toMonth, toDay }): Promise<string> => {
    const cfg = getConfig();
    const db = await getDb();
    const col = db.collection(cfg.EVENTS_COLLECTION);

    const match: Record<string, unknown> = {
      transactionState: "No exitosa",
    };

    if (technicalCode) {
      match["technicalCode"] = technicalCode;
    }

    // Date range filter using the three integer fields
    if (fromYear !== undefined && fromMonth !== undefined && fromDay !== undefined) {
      match["$or"] = [
        { initialYearTrx: { $gt: fromYear } },
        {
          initialYearTrx: fromYear,
          initialMonthTrx: { $gt: fromMonth },
        },
        {
          initialYearTrx: fromYear,
          initialMonthTrx: fromMonth,
          initialDayTrx: { $gte: fromDay },
        },
      ];
    }

    if (toYear !== undefined && toMonth !== undefined && toDay !== undefined) {
      const toFilter = {
        $or: [
          { initialYearTrx: { $lt: toYear } },
          {
            initialYearTrx: toYear,
            initialMonthTrx: { $lt: toMonth },
          },
          {
            initialYearTrx: toYear,
            initialMonthTrx: toMonth,
            initialDayTrx: { $lte: toDay },
          },
        ],
      };
      match["$and"] = [{ $or: match["$or"] }, toFilter];
      delete match["$or"];
    }

    const results = await col
      .aggregate([
        { $match: match },
        {
          $group: {
            _id: {
              technicalCode: "$technicalCode",
              responseCode: "$responseCode",
              responseCodeDesc: "$responseCodeDesc",
              channel: "$channel",
            },
            count: { $sum: 1 },
            exampleTransactionCode: { $first: "$transactionCode" },
            exampleTransactionCodeDesc: { $first: "$transactionCodeDesc" },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 20 },
        {
          $project: {
            _id: 0,
            technicalCode: "$_id.technicalCode",
            responseCode: "$_id.responseCode",
            responseCodeDesc: "$_id.responseCodeDesc",
            channel: "$_id.channel",
            count: 1,
            exampleTransactionCode: 1,
            exampleTransactionCodeDesc: 1,
          },
        },
      ])
      .toArray();

    if (results.length === 0) {
      return JSON.stringify({ message: "No failed transactions found for the given filters." });
    }

    return JSON.stringify({ totalGroups: results.length, failedTransactions: results });
  },
  {
    name: "analyze_failed_transactions",
    description:
      "Analyzes failed transactions (transactionState = 'No exitosa') grouped by technical error code, " +
      "response code, and channel. Useful for diagnosing systemic incidents or recurring errors. " +
      "Accepts an optional technical error code (e.g. 'BP12900037') and an optional date range " +
      "expressed as separate year/month/day integers. Returns up to 20 groups sorted by frequency.",
    schema: z.object({
      technicalCode: z
        .string()
        .optional()
        .describe("Optional technical error code to filter by, e.g. 'BP12900037'."),
      fromYear: z.number().int().optional().describe("Start year, e.g. 2026."),
      fromMonth: z.number().int().min(1).max(12).optional().describe("Start month (1–12)."),
      fromDay: z.number().int().min(1).max(31).optional().describe("Start day (1–31)."),
      toYear: z.number().int().optional().describe("End year, e.g. 2026."),
      toMonth: z.number().int().min(1).max(12).optional().describe("End month (1–12)."),
      toDay: z.number().int().min(1).max(31).optional().describe("End day (1–31)."),
    }),
  },
);
