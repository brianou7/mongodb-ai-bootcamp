import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { getDb } from "../db/client";
import { getConfig } from "../config";

/**
 * Returns a summary of a customer's recent activity in galatea-central-repository:
 * transaction counts by channel, success/failure breakdown, and total amount moved
 * in successful monetary transactions.
 */
export const customerSummaryTool = tool(
  async ({ documentNumber }): Promise<string> => {
    const cfg = getConfig();
    const db = await getDb();
    const col = db.collection(cfg.EVENTS_COLLECTION);

    const [summary] = await col
      .aggregate([
        { $match: { documentNumber } },
        {
          $facet: {
            byChannel: [
              { $group: { _id: "$channel", count: { $sum: 1 } } },
              { $sort: { count: -1 } },
            ],
            byState: [
              { $group: { _id: "$transactionState", count: { $sum: 1 } } },
            ],
            monetaryTotal: [
              {
                $match: {
                  transactionType: "Monetaria",
                  transactionState: "Exitosa",
                },
              },
              {
                $group: {
                  _id: null,
                  totalCOP: { $sum: "$transactionValule" },
                  count: { $sum: 1 },
                },
              },
            ],
            customerInfo: [
              { $sort: { timestamp: -1 } },
              { $limit: 1 },
              { $project: { customerName: 1, documentType: 1, _id: 0 } },
            ],
          },
        },
      ])
      .toArray();

    if (!summary) {
      return JSON.stringify({ error: "No transactions found for that document number." });
    }

    const info = summary.customerInfo?.[0] ?? {};
    const monetary = summary.monetaryTotal?.[0] ?? { totalCOP: 0, count: 0 };

    return JSON.stringify({
      documentNumber,
      customerName: info.customerName ?? null,
      documentType: info.documentType ?? null,
      byChannel: summary.byChannel,
      byState: summary.byState,
      monetaryTransactions: {
        successfulCount: monetary.count,
        totalCOP: monetary.totalCOP,
      },
    });
  },
  {
    name: "get_customer_summary",
    description:
      "Returns an activity summary for a bank customer identified by their document number. " +
      "Includes transaction counts broken down by channel (APP, NEG, SVP), success/failure state, " +
      "and the total amount (COP) moved in successful monetary transactions. " +
      "Use this tool when a support agent needs a quick overview of a customer's behavior before resolving a case.",
    schema: z.object({
      documentNumber: z
        .string()
        .min(1)
        .describe(
          "The customer's identity document number, e.g. '79456123'. " +
            "Matches the documentNumber field in galatea-central-repository.",
        ),
    }),
  },
);
