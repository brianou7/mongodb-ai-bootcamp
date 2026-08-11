/**
 * Plain-language descriptions of the structured collections, fed to the model
 * so it generates better MongoDB pipelines. This is a PROMPT AID, not a gate:
 * it improves query quality; it does not validate or restrict anything.
 *
 * ---------------------------------------------------------------------------
 * ADAPTING THIS FILE TO YOUR DATA
 *
 * This is the highest-leverage file for a structured or hybrid team. The model
 * writes its pipeline from this text alone; it never sees your documents. A
 * vague description here produces confidently wrong answers, which is the
 * failure mode that costs the most time to notice.
 *
 * Replace the collection description with your own, and cover five things:
 *
 * 1. One line saying what a single document IS. "One document per support
 *    ticket" tells the model whether to count documents or group them.
 * 2. Every field the model may need, with its type. Call out Date fields and
 *    anything stored differently from how people say it: cents vs dollars,
 *    seconds vs milliseconds, ids vs display names.
 * 3. Enum values verbatim. The model cannot guess that you write "IN_PROGRESS"
 *    and not "in progress", and a wrong literal silently matches nothing.
 * 4. Guidance mapping the questions you actually expect to the fields that
 *    answer them. "Open tickets" means status in X and Y, not resolvedAt null.
 *    Two or three of these are worth more than any amount of field detail.
 * 5. The traps. Anything where the obvious pipeline is wrong: soft-deleted rows
 *    that must be filtered out, a status that looks final but is not, a field
 *    that is null for a whole class of records.
 *
 * Write it for a competent new colleague who has never seen your data. If a
 * sentence would not help them, it will not help the model.
 *
 * The Phase 1 prompts have Claude Code write this for you. Read what it wrote:
 * it can infer 1 through 3 from your data, but only your team knows 4 and 5.
 * ---------------------------------------------------------------------------
 *
 * The enums here are the single source of truth, imported by the synthetic data
 * generator so the data and the description never drift.
 *
 * BILINGUAL NOTE: this description stays in English in every language, on
 * purpose, not by oversight. It is almost entirely field names, enum values, and
 * pipeline guidance; models read it fine cross-lingually, and translating it
 * would risk drifting against the generator that imports these enums. Only the
 * surrounding prompt prose in src/query/prompts/ is localised, which is enough
 * to get a Spanish `explanation` back.
 */

// --- Enums (single source of truth, imported by the data generator) ----------

export const CHANNELS = ["APP", "NEG", "SVP"] as const;
export type Channel = (typeof CHANNELS)[number];

export const TRANSACTION_TYPES = ["Monetaria", "No monetaria", "Administrativa"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const TRANSACTION_STATES = ["Exitosa", "Técnicamente exitosa", "No exitosa"] as const;
export type TransactionState = (typeof TRANSACTION_STATES)[number];

export const DOCUMENT_TYPES = ["CC", "CD", "TI", "CE", "NIT", "PAS", "IEPN", "IEPJ", "FD", "RC"] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const PRODUCT_TYPES = ["CUENTA_DE_AHORRO", "CUENTA_CORRIENTES", "TARJETA_DE_CREDITO"] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

export const DESTINY_PRODUCT_RELATIONS = ["Propia", "Inscrita", "No inscrita", "Otros bancos", "Inscrita programada", "Programada"] as const;
export type DestinyProductRelation = (typeof DESTINY_PRODUCT_RELATIONS)[number];

export const TRANSACTION_MODES = ["Virtual", "Presencial nacional", "Presencial internacional", "Debito automático"] as const;
export type TransactionMode = (typeof TRANSACTION_MODES)[number];

export const AUTHENTICATION_TYPES = ["Credenciales", "Biometría huella", "Biometría faceid", "Token", "OTP"] as const;
export type AuthenticationType = (typeof AUTHENTICATION_TYPES)[number];

export const ENTITLEMENT_ROLES = ["Titular", "Titular Rep Legal"] as const;
export type EntitlementRole = (typeof ENTITLEMENT_ROLES)[number];

export const ENTITLEMENT_PRIVILEGES = ["Admon Autonomo", "Aprobador", "Preparador", "Preparador/Aprobador", "Consultor"] as const;
export type EntitlementPrivilege = (typeof ENTITLEMENT_PRIVILEGES)[number];

export const OPERATION_TYPES = ["Inscripción", "Modificación", "Eliminación"] as const;
export type OperationType = (typeof OPERATION_TYPES)[number];

export const APPROVAL_STATUSES = ["Aprobado", "Rechazado", "Preparado", "Cancelado"] as const;
export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

/** transactionValule is non-zero only when transactionType equals this value. */
export const MONETARY_TRANSACTION_TYPE = "Monetaria" as const;

// --- Collection description --------------------------------------------------

const GCR_DESCRIPTION = `Collection: galatea-central-repository
One document per transaction event processed by a bank channel. Covers both monetary
events (transfers, payments) and non-monetary events (balance queries, user
modifications, logins). One row = one event; aggregate to answer "how much / how many".

IDENTITY FIELDS:
  _id                          string  stable id, e.g. "rcc_00001"
  documentNumber               string  the account holder's ID number, e.g. "79456123"
  documentType                 string  one of: ${DOCUMENT_TYPES.join(", ")}
  customerName                 string  display name of the account holder, e.g. "Pedro Picapiedra"
  authorizedUserName           string  name of a DELEGATE who acted on behalf of the account
                                       holder; absent when the holder transacted directly
  authorizedUserdocumentNumber string  delegate's ID number; absent when no delegate
  channel                      string  one of: ${CHANNELS.join(", ")}

TRANSACTION CLASSIFICATION:
  transactionType            string  one of: ${TRANSACTION_TYPES.join(", ")}
  transactionState           string  one of: ${TRANSACTION_STATES.join(", ")}
  transactionCode            string  code for the transaction type, e.g. "0320", "0510"
  transactionCodeDesc        string  human description, e.g. "Transferencia entre cuentas propias"
  operationType              string  for administrative events only: ${OPERATION_TYPES.join(", ")}
  transactionStatusApproval  string  workflow state: ${APPROVAL_STATUSES.join(", ")}

AMOUNTS — Colombian pesos (COP), NOT minor units / cents:
  transactionValule  number  COP amount. Non-zero ONLY when transactionType="Monetaria".
                             IMPORTANT: the field name has a typo ("Valule" not "Value").
                             Use this field for ALL monetary aggregations.
  localAmount        number  identical to transactionValule for COP transactions; a display
                             copy only — always aggregate transactionValule.
  Example: transactionValule 2500000 means COP $2,500,000 (two and a half million pesos).

DATE AND TIME:
  timestamp        Date    BSON UTC Date at midnight of the transaction day (derived from
                           the three integer fields). USE THIS for all date-range queries
                           with $$NOW, $dateTrunc, or Extended JSON dates.
  initialYearTrx   number  4-digit year, e.g. 2026
  initialMonthTrx  number  month 1–12
  initialDayTrx    number  day 1–31
  initialTrxHour   string  8-char time string "HHmmssSS". First 2 chars = hour (00–23).
                           E.g. "02300000" = 02:30 AM, "09150312" = 09:15 AM.

PRODUCT FIELDS:
  originProductNumber   string  account number the transaction was executed FROM
  originProductType     string  one of: ${PRODUCT_TYPES.join(", ")}
  destinyProductNumber  string  destination account number
  destinyProductType    string  same enum as originProductType
  destinyProductRelation  string  one of: ${DESTINY_PRODUCT_RELATIONS.join(", ")}

SECURITY AND CONTROL:
  entitlementPrivilege  string  one of: ${ENTITLEMENT_PRIVILEGES.join(", ")}
  entitlementRol        string  one of: ${ENTITLEMENT_ROLES.join(", ")}
  isD2B                 string  "SI" or "NO" (string, NOT a boolean)
  ip                    string  originating IP address

BUSINESS CONTEXT FIELDS (present on KB-related events):
  originCity            string  sede or city where the transaction originated,
                                e.g. "Envigado" or "Guayabal". Use for sede-specific
                                threshold comparisons.
  reasonTransaction     string  free-text business reason, e.g. "Distribución de utilidades".
                                Present when the concept gives a specific motive.
  managementDescription string  operational note added at transaction time. May signal
                                a policy concern, e.g. role/account mismatch.
  transactionDesc       string  human-readable description of what was done.

QUESTION-TO-FIELD GUIDANCE — read this before writing any pipeline:

  "How much money did [person] move today / this week / this month"
    → {customerName: <name>}, transactionType:"Monetaria", transactionState:"Exitosa"
      For today: match all three integer fields (initialYearTrx, initialMonthTrx, initialDayTrx).
      For month/week ranges: timestamp >= start_of_period (use $dateTrunc or Extended JSON date).
      Sum transactionValule.

  "How many transfers did [person] make on [specific date]? What was the total? /
   ¿Cuántas transferencias realizó [persona] el [fecha] y cuál fue el monto total?"

  CRITICAL — COMMON WRONG PIPELINE (returns 0 results because fields do NOT exist):
    {$match: {user_name:"Diego López", event_type:"Monetaria Exitosa", event_date:{$gte:...}}}
    This is ALWAYS wrong. user_name, event_type, event_date, and transaction_amount do not exist.

  CORRECT PIPELINE for "Diego López" on July 8, 2026:
    {$match: {customerName:"Diego López", transactionType:"Monetaria", transactionState:"Exitosa",
              initialYearTrx:2026, initialMonthTrx:7, initialDayTrx:8}},
    {$group: {_id:null, count:{$sum:1}, totalCOP:{$sum:"$transactionValule"}}}

  Field mapping (MEMORIZE — do not substitute generic names):
    customerName    = the person's name        (NOT user_name, NOT nombre, NOT name)
    transactionType = "Monetaria"              (NOT event_type, NOT type; "Monetaria Exitosa" is NOT a valid value)
    transactionState = "Exitosa"               (SEPARATE field from transactionType)
    transactionValule = the COP amount         (NOT amount, NOT transaction_amount, NOT transactionValue)
    initialYearTrx, initialMonthTrx, initialDayTrx = integers for exact-day match  (NOT event_date, NOT date)

  "Rank users by total COP transferred on [date] / Ranquea usuarios por monto total el [fecha]"
    → transactionType:"Monetaria", transactionState:"Exitosa", date filter with integer fields.
      {$group: {_id: "$customerName", totalCOP: {$sum: "$transactionValule"}, count: {$sum: 1}}}
      {$sort: {totalCOP: -1}}

  "Who made movements on my accounts in the last week"
    → {originProductNumber: <account>}, timestamp within last 7 days.
      Project BOTH customerName (account owner who may have acted directly) and
      authorizedUserName (delegate who may have acted on their behalf). A transaction
      shows two actors when authorizedUserName is present.

  "What activities did [person] do yesterday / on [date]"
    → {customerName: <name>}, date match: all three integer fields OR timestamp range.
      Return ALL events regardless of transactionType — include No monetaria (logins,
      queries) and Monetaria (transfers) alike.

  "Who modified authorized users for payment approval"
    → {operationType: "Modificación"} and/or transactionCodeDesc containing "usuario autorizado".
      Return customerName (who performed the action), authorizedUserName (whose access was
      changed), and the date fields.

  "Which user made the largest transfer this month"
    → {transactionType:"Monetaria", transactionState:"Exitosa"}, timestamp within current
      calendar month ($dateTrunc unit "month" with $$NOW).
      Sort transactionValule descending, limit 1. Return customerName.

  "Are there unusual activities in my delegate access"
    → {authorizedUserName: {$exists: true, $ne: null}}. Flag records where:
      substring(initialTrxHour, 0, 2) <= "05" (nighttime hours), or
      transactionValule > 10000000 (high value), or
      ip differs from the customer's usual ip patterns.

  "Did the Jefe de Producción / a delegate operate the wrong account?"
    → {authorizedUserName: <name>, originProductNumber: <ventas_account>}.
      The delegate's role is business knowledge (KB); the query finds the record.
      Look for authorizedUserName present and originProductNumber matching the
      account that role should NOT operate. Return authorizedUserName, customerName,
      originProductNumber, transactionValule, and originCity.

  "Are there transfers that look like dividend payments while policy says dividendos = $0?"
    → Search for: {transactionType:"Monetaria", transactionState:"Exitosa"} AND
      (reasonTransaction contains "utilidad" OR "dividendo" OR
       transactionDesc contains "utilidad" OR "dividendo" OR
       managementDescription contains "Dividendos").
      Return documentNumber, customerName, beneficiaryName, transactionValule, timestamp.

  "Which production payments exceeded P99 / the threshold for a given sede?"
    → {transactionType:"Monetaria", transactionState:"Exitosa",
       originCity: <"Envigado"|"Guayabal">}
      Filter transactionValule > <threshold>. Thresholds (COP):
        Envigado P90: 373000, P99: 673450, max: 1235500.
        Guayabal P90: 1159970, P99: 1796580, max: 2227600.
      Return documentNumber, customerName, transactionValule, originCity, timestamp.

  "What is the difference in transaction sizes between sede Envigado and Guayabal?"
    → {transactionType:"Monetaria", transactionState:"Exitosa"}
      Group or filter by originCity. Compare transactionValule distributions or
      list records per sede. originCity holds "Envigado" or "Guayabal" when present.

TRAPS — a wrong assumption here silently returns an empty or wrong result:
  - "successful" = transactionState is "Exitosa". NEVER filter on a boolean or "SUCCESS" string.
  - "monetary transfer" = transactionType is "Monetaria". Do NOT use transactionValule > 0
    as a proxy for Monetaria.
  - The amount field is spelled transactionValule (typo). Never use "transactionValue".
  - Date filtering: prefer timestamp (BSON Date) for any range query. For exact-day match
    use the three integer fields. NEVER try to parse initialTrxHour as a date.
  - authorizedUserName is the DELEGATE; customerName is the ACCOUNT OWNER. When a delegate
    transacted, BOTH are present on the same record. "Who made movements" must return both.
  - There is NO userId field. Use documentNumber or customerName to identify the account holder.
  - isD2B stores strings "SI" / "NO", not booleans.
  - Optional fields (authorizedUserName, transactionValule, etc.) may be absent on some
    records. Use {$exists: true, $ne: null} guards when filtering on optional fields.
  - timestamp is UTC midnight. For time-of-day analysis, use initialTrxHour (string).

  WRONG FIELD NAMES — none of these exist in this collection; using them returns 0 documents:
  - user_name       → use customerName  (exact string, case-sensitive, accent-sensitive)
  - event_type      → use transactionType  AND separately  transactionState
  - event_date / date → use initialYearTrx + initialMonthTrx + initialDayTrx (integers) for exact day,
                        or timestamp with Extended JSON {"$date":"..."} for a range
  - transaction_amount / amount → use transactionValule  (note the "Valule" typo)
  - status          → use transactionState
  - type            → use transactionType
  - "Monetaria Exitosa" is NOT one field value. transactionType:"Monetaria" and
    transactionState:"Exitosa" are TWO SEPARATE fields inside a single $match stage.
  - customerName is case- AND accent-sensitive: "Diego López" ≠ "Diego Lopez".
    Copy the person's name exactly as it appears in the question.`;

/**
 * Return a plain-language description of the target collection for the query
 * prompt. Unknown collections get a generic note so teams can point the tool at
 * their own data without editing this file first.
 */
export function describeCollection(name: string): string {
  if (name === "galatea-central-repository") return GCR_DESCRIPTION;
  // Falling through to this generic note means the model is guessing at your
  // fields. Register your collection above, following the checklist at the top.
  return `Collection: ${name}\n(No schema description registered. Infer fields and types from the question; prefer a conservative read-only pipeline.)`;
}
