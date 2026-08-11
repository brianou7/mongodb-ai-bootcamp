/**
 * Synthetic, deterministic RCC (Repositorio Central de Comportamiento) events
 * for the galatea-central-repository collection.
 *
 * A fixed seed produces an identical 500-document dataset on every run.
 * 13 anchor records seed the 6 verifiable facts from data/mock-input/collection.md.
 * Internal consistency is asserted before returning; a failed assert aborts the load.
 *
 * All values are synthetic. Amounts are COP pesos (NOT minor units / cents).
 */

import {
  CHANNELS,
  TRANSACTION_TYPES,
  TRANSACTION_STATES,
  DOCUMENT_TYPES,
  PRODUCT_TYPES,
  DESTINY_PRODUCT_RELATIONS,
  AUTHENTICATION_TYPES,
  ENTITLEMENT_ROLES,
  ENTITLEMENT_PRIVILEGES,
  OPERATION_TYPES,
  APPROVAL_STATUSES,
  MONETARY_TRANSACTION_TYPE,
  type Channel,
  type TransactionType,
  type TransactionState,
  type DocumentType,
  type ProductType,
  type DestinyProductRelation,
  type AuthenticationType,
  type EntitlementRole,
  type EntitlementPrivilege,
  type OperationType,
  type ApprovalStatus,
} from "../../src/query/schema";

// ============================================================
// Types
// ============================================================

export interface RccEvent {
  // Required
  _id: string;
  sessionId: string;
  transactionId: string;
  initialYearTrx: number;
  initialMonthTrx: number;
  initialDayTrx: number;
  initialTrxHour: string;
  finalTrxYear: number;
  finalTrxMonth: number;
  finalTrxDay: number;
  finalTrxHour: string;
  transactionCode: string;
  transactionCodeDesc: string;
  responseCode: string;
  responseCodeDesc: string;
  technicalCode: string;
  channel: Channel;
  deviceNameId: string;
  ip: string;
  transactionType: TransactionType;
  transactionState: TransactionState;
  documentTypeCode: string;
  documentType: DocumentType;
  documentNumber: string;
  excludeITC: boolean;
  isD2B: "SI" | "NO";
  /** UTC midnight of the transaction date; derived from the three integer fields. */
  timestamp: Date;

  // Optional
  authenticationType?: AuthenticationType;
  currency?: string;
  localAmount?: number;
  internationalAmount?: number;
  establishmentUniqueCode?: number;
  cardNumber?: string;
  originProductType?: ProductType;
  originProductNumber?: string;
  destinyProductType?: ProductType;
  destinyProductNumber?: string;
  destinyProductRelation?: DestinyProductRelation;
  transactionMode?: TransactionMode;
  transactionVoucherNumber?: number;
  destinyBankCode?: string;
  originBankCode?: string;
  agreementCode?: number;
  reference?: string;
  inputTransactionMode?: string;
  commission?: "SI" | "NO";
  transactionValule?: number;
  throwbackId?: number;
  latitude?: string;
  length?: string;
  customerName?: string;
  authorizedUserdocumentTypeCode?: string;
  authorizedUserdocumentType?: DocumentType;
  authorizedUserdocumentNumber?: string;
  authorizedUserName?: string;
  brandModel?: string;
  osVersion?: string;
  browser?: string;
  mobileOperator?: string;
  appVersion?: string;
  sharedKey?: string;
  agreementTermsConditions?: "SI" | "NO";
  versionTermsConditions?: string;
  agreementTermsConditionsDate?: number;
  token?: number;
  changeRate?: number;
  totalBatchRecords?: number;
  value4?: number;
  value5?: number;
  value6?: number;
  serialToken?: string;
  entitlement?: string;
  batchName?: string;
  loadMechanism?: string;
  paymentType?: string;
  transactionGroup?: string;
  targetCurrency?: string;
  field9?: string;
  transactionStatusApproval?: ApprovalStatus;
  managementDescription?: string;
  transactionTracker?: string;
  descriptionFunctions?: string;
  customizingProductName?: string;
  beneficiaryDocumentType?: string;
  beneficiaryDocumentNumber?: string;
  beneficiaryName?: string;
  operationType?: OperationType;
  originProductDesc?: string;
  destinationProductDesc?: string;
  destinationBankName?: string;
  originBankName?: string;
  transactionDesc?: string;
  authenticationTransaction?: AuthenticationType;
  entitlementRol?: EntitlementRole;
  entitlementPrivilege?: EntitlementPrivilege;

  // Advanced financial fields
  factor?: number;
  bankCharges?: string;
  bankChargesValue?: number;
  VATBankCharges?: number;
  totalAmountDebited?: number;
  originatingBankCode2?: string;
  destinationBankCode2?: string;
  customTransactionMessage?: string;
  reasonTransaction?: string;
  typeEntity?: string;
  depositNumber?: string;
  administratorId?: string;
  exchangeNumerals?: string;
  taxCompliance?: string;
  customsInformation?: "SI" | "NO";
  customsDocumentNumber?: string;
  originBankCountry?: string;
  beneficiaryBankCountry?: string;
  originBankCodeType?: string;
  originBankCode2Type?: string;
  beneficiaryBankCodeType?: string;
  beneficiaryBankCode2Type?: string;
  originOwnershipType?: string;
  beneficiaryOwnershipType?: string;
  countryResidenceBeneficiary?: string;
  countryResidenceOrigin?: string;
  originCity?: string;
  beneficiaryCity?: string;
  originAddres?: string;
  beneficiaryAddres?: string;
}

// TransactionMode is used inside RccEvent but imported lazily; re-export its type.
type TransactionMode = (typeof import("../../src/query/schema").TRANSACTION_MODES)[number];

// ============================================================
// Constants
// ============================================================

const SEED = 424242;
/** 483 filler + 13 existing anchors + 4 KB anchors + 5 Diego anchors = 505 total events. */
const FILLER_COUNT = 483;
const DAY_MS = 86_400_000;

/** Anchor amounts in COP pesos. All below ANA_SECOND_MONTH so the month ranking holds. */
const ANCHOR_AMOUNTS = {
  PEDRO_TODAY_1: 2_500_000,
  PEDRO_TODAY_2: 1_800_000,
  PEDRO_YEST_TRANSFER: 850_000,
  PEDRO_2DAYS_TRANSFER: 600_000,
  JUAN_LARGEST_MONTH: 45_000_000,
  ANA_SECOND_MONTH: 38_000_000,
  JUAN_LAST_MONTH: 50_000_000,
  CARLOS_DUAL: 18_500_000,
  // KB business anchors (Tamales de mi abuela — realistic COP amounts)
  KB_JEFE_VENTAS: 350_000,       // R001 violation: Jefe Producción → VENTAS; < P90 Envigado
  KB_DIVIDEND: 620_000,          // R005 violation: dividendos = $0; P90–P99 Envigado range
  KB_OPERACION_ANOMALY: 2_100_000, // quantitative anomaly: > P99 Guayabal ($1.796.580)
  KB_GUAYABAL_NORMAL: 1_050_000, // normal for Guayabal (<P90 $1.159.970); ALERTA ALTO for Envigado
  // Diego López — July 8, 2026 hybrid scenario (titular, Envigado, cuenta corriente operacional)
  // TX1 + TX2 + TX3 = 1.030.000 COP  > P99 Envigado ($673.450), < max ($1.235.500) → ALERTA ALTO → NEEDS_REVIEW
  DIEGO_TX1: 480_000,               // 09:15, SVP, code 0320
  DIEGO_TX2: 350_000,               // 14:30, APP, code 0381
  DIEGO_TX3: 200_000,               // 16:45, NEG, code 0320
  DIEGO_NEAR_MISS_NOTILDE: 300_000, // near-miss A: "Diego Lopez" (sin tilde), Jul 8 — excluded by exact name filter
  DIEGO_NEAR_MISS_NEXTDAY: 150_000, // near-miss B: "Diego López", Jul 9 — excluded by date filter
} as const;

/** All filler monetary amounts stay below 8 M to preserve the month ranking. */
const FILLER_MONETARY_MAX = 8_000_000;

// ============================================================
// Anchor identities
// ============================================================

const PEDRO_DOC = "79456123";
const PEDRO_NAME = "Pedro Picapiedra";
const PEDRO_ACCOUNT = "51134450001";
const PEDRO_ACC_TYPE: ProductType = "CUENTA_DE_AHORRO";
const PEDRO_IP = "181.60.14.137";

const JUAN_DOC = "1045678902";
const JUAN_NAME = "Juan Garcia Restrepo";
const JUAN_ACCOUNT = "25678912345";
const JUAN_ACC_TYPE: ProductType = "CUENTA_CORRIENTES";
const JUAN_IP = "10.30.45.210";

const ANA_DOC = "1023456789";
const ANA_NAME = "Ana Gutierrez Lopez";
const ANA_ACCOUNT = "68432156789";
const ANA_ACC_TYPE: ProductType = "CUENTA_DE_AHORRO";
const ANA_IP = "10.30.45.211";

const CARLOS_DOC = "1098765432";
const CARLOS_NAME = "Carlos Bedoya Martinez";
const CARLOS_UNUSUAL_IP = "200.118.47.220";

// ---- KB business actors: Tamales de mi abuela ----
// Carmen Rivera Mora — Socio, titular de la cuenta de ventas
const CARMEN_DOC = "43812567";
const CARMEN_NAME = "Carmen Rivera Mora";
const VENTAS_ACCOUNT = "28734590123";
const VENTAS_ACC_TYPE: ProductType = "CUENTA_CORRIENTES";
const CARMEN_IP = "181.60.22.148";

// Luis Herrera Cano — Jefe de Producción, titular de la cuenta de operación
const LUIS_DOC = "80123456";
const LUIS_NAME = "Luis Herrera Cano";
const OPERACION_ACCOUNT = "73910284500";
const OPERACION_ACC_TYPE: ProductType = "CUENTA_CORRIENTES";
const LUIS_IP = "181.60.31.209";

// Roberto Salazar Pinto — Socio, cuenta personal destino del pago de dividendos
const ROBERTO_DOC = "71245893";
const ROBERTO_NAME = "Roberto Salazar Pinto";
const ROBERTO_PERSONAL_ACCOUNT = "55612870034";

// Diego López — titular, cuenta corriente operacional, Envigado (hybrid scenario July 8, 2026)
const DIEGO_DOC = "1089234567";
const DIEGO_NAME = "Diego López";
const DIEGO_ACCOUNT = "62378901234";
const DIEGO_ACC_TYPE: ProductType = "CUENTA_CORRIENTES";
const DIEGO_IP = "10.30.46.118";
// Near-miss A: similar name without accent — distinct person, excluded by exact name match
const DIEGO_NOTILDE_DOC = "1089234568";
const DIEGO_NOTILDE_NAME = "Diego Lopez";
const DIEGO_NOTILDE_ACCOUNT = "62378901235";
// Fixed dates for Diego's deterministic scenario (July 8–9, 2026)
const DIEGO_YEAR = 2026;
const DIEGO_MONTH = 7;
const DIEGO_DAY_8 = 8;
const DIEGO_DAY_9 = 9;

// ============================================================
// PRNG and helpers
// ============================================================

function mulberry32(seed: number): () => number {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  const item = arr[Math.floor(rng() * arr.length)];
  if (item === undefined) throw new Error("pick from empty array");
  return item;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function toHourStr(h: number, m: number, s: number, cs: number): string {
  return `${pad2(h)}${pad2(m)}${pad2(s)}${pad2(cs)}`;
}

function addCentiseconds(base: string, extra: number): string {
  const h = parseInt(base.slice(0, 2));
  const m = parseInt(base.slice(2, 4));
  const s = parseInt(base.slice(4, 6));
  const cs = parseInt(base.slice(6, 8)) + extra;
  return toHourStr(h, m, (s + Math.floor(cs / 100)) % 60, cs % 100);
}

function pseudoHex(rng: () => number, len: number): string {
  let result = "";
  for (let i = 0; i < len; i++) {
    result += Math.floor(rng() * 16).toString(16);
  }
  return result;
}

function pseudoUuid(rng: () => number): string {
  return `${pseudoHex(rng, 8)}-${pseudoHex(rng, 4)}-${pseudoHex(rng, 4)}-${pseudoHex(rng, 4)}-${pseudoHex(rng, 12)}`;
}

function makeTimestamp(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

function startOfMonthUTC(now: Date): number {
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1);
}

function dateFromOffset(now: Date, daysBack: number): { year: number; month: number; day: number } {
  const d = new Date(now.getTime() - daysBack * DAY_MS);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

/** Clamp a past date to stay within the current calendar month. */
function clampToThisMonth(now: Date, daysBack: number): { year: number; month: number; day: number } {
  const som = startOfMonthUTC(now);
  const raw = now.getTime() - daysBack * DAY_MS;
  const d = new Date(Math.max(som + DAY_MS, raw));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

// ============================================================
// Customer catalog for filler
// ============================================================

interface CustomerEntry {
  documentNumber: string;
  documentType: DocumentType;
  customerName: string;
  account: string;
  accType: ProductType;
}

const CUSTOMERS: readonly CustomerEntry[] = [
  { documentNumber: PEDRO_DOC, documentType: "CC", customerName: PEDRO_NAME, account: PEDRO_ACCOUNT, accType: PEDRO_ACC_TYPE },
  { documentNumber: JUAN_DOC, documentType: "CC", customerName: JUAN_NAME, account: JUAN_ACCOUNT, accType: JUAN_ACC_TYPE },
  { documentNumber: ANA_DOC, documentType: "CC", customerName: ANA_NAME, account: ANA_ACCOUNT, accType: ANA_ACC_TYPE },
  { documentNumber: "1056789234", documentType: "CC", customerName: "Maria Rodriguez Silva", account: "41238965400", accType: "CUENTA_DE_AHORRO" },
  { documentNumber: "1078902345", documentType: "CC", customerName: "Carlos Mora Ramirez", account: "93456172000", accType: "CUENTA_CORRIENTES" },
  { documentNumber: "1034567890", documentType: "CC", customerName: "Laura Ospina Castro", account: "72345689100", accType: "CUENTA_DE_AHORRO" },
  { documentNumber: "900123456", documentType: "NIT", customerName: "Empresa XYZ Colombia SAS", account: "88712345678", accType: "CUENTA_CORRIENTES" },
  { documentNumber: "1067890123", documentType: "CC", customerName: "Andres Jimenez Vargas", account: "55893467200", accType: "CUENTA_DE_AHORRO" },
  // Tamales de mi abuela actors
  { documentNumber: CARMEN_DOC, documentType: "CC", customerName: CARMEN_NAME, account: VENTAS_ACCOUNT, accType: VENTAS_ACC_TYPE },
  { documentNumber: LUIS_DOC, documentType: "CC", customerName: LUIS_NAME, account: OPERACION_ACCOUNT, accType: OPERACION_ACC_TYPE },
  { documentNumber: ROBERTO_DOC, documentType: "CC", customerName: ROBERTO_NAME, account: ROBERTO_PERSONAL_ACCOUNT, accType: "CUENTA_CORRIENTES" },
  // Diego López hybrid scenario actors
  { documentNumber: DIEGO_DOC, documentType: "CC", customerName: DIEGO_NAME, account: DIEGO_ACCOUNT, accType: DIEGO_ACC_TYPE },
  { documentNumber: DIEGO_NOTILDE_DOC, documentType: "CC", customerName: DIEGO_NOTILDE_NAME, account: DIEGO_NOTILDE_ACCOUNT, accType: "CUENTA_CORRIENTES" },
];

// Transaction code catalog
interface TxEntry { code: string; desc: string }

const TX_CODES: Record<TransactionType, TxEntry[]> = {
  "Monetaria": [
    { code: "0320", desc: "Transferencia entre cuentas propias cuenta de ahorros" },
    { code: "0380", desc: "Transferencia nacional a terceros cuenta de ahorros" },
    { code: "0381", desc: "Transferencia nacional a terceros cuenta corriente" },
    { code: "0400", desc: "Pago de facturas y servicios" },
    { code: "0401", desc: "Pago de tarjeta de crédito" },
  ],
  "No monetaria": [
    { code: "0100", desc: "Consulta de saldo cuenta de ahorros" },
    { code: "0101", desc: "Consulta de saldo tarjeta de crédito" },
    { code: "0110", desc: "Consulta de extracto cuenta corriente" },
    { code: "0120", desc: "Inicio de sesión canal digital" },
    { code: "0130", desc: "Cierre de sesión canal digital" },
  ],
  "Administrativa": [
    { code: "0511", desc: "Inscripción de producto destino" },
    { code: "0520", desc: "Modificación de datos del perfil de usuario" },
    { code: "0521", desc: "Modificación límites de transacción" },
  ],
};

const APP_DEVICES: readonly { brand: string; os: string }[] = [
  { brand: "iPhone", os: "iOS" },
  { brand: "Samsung Galaxy", os: "Android" },
  { brand: "Huawei P40", os: "Android" },
  { brand: "Motorola Edge", os: "Android" },
];

const APP_VERSIONS = ["25.1.0", "25.2.0", "25.3.0", "24.8.1"] as const;

// ============================================================
// Filler builder
// ============================================================

function buildFillerRecord(rng: () => number, now: Date): Omit<RccEvent, "_id"> {
  const customer = pick(rng, CUSTOMERS);
  const txType: TransactionType = pick(rng, [
    "Monetaria", "Monetaria", "Monetaria",
    "No monetaria", "No monetaria",
    "Administrativa",
  ] as const);
  const state: TransactionState = pick(rng, [
    "Exitosa", "Exitosa", "Exitosa", "Exitosa", "Exitosa", "Exitosa", "Exitosa",
    "No exitosa", "No exitosa",
    "Técnicamente exitosa",
  ] as const);
  const txEntry = pick(rng, TX_CODES[txType]);
  const channel: Channel = pick(rng, CHANNELS);
  const daysBack = Math.floor(rng() * 89) + 1;
  const { year, month, day } = dateFromOffset(now, daysBack);
  const initH = 8 + Math.floor(rng() * 10);
  const initM = Math.floor(rng() * 60);
  const initS = Math.floor(rng() * 60);
  const initCS = Math.floor(rng() * 100);
  const initHour = toHourStr(initH, initM, initS, initCS);
  const finalHour = addCentiseconds(initHour, 5 + Math.floor(rng() * 60));
  const isMoney = txType === MONETARY_TRANSACTION_TYPE;
  const amount = isMoney && state === "Exitosa" ? 50_000 + Math.floor(rng() * FILLER_MONETARY_MAX) : 0;
  const ip =
    channel === "APP"
      ? `${pick(rng, ["181.60", "190.16", "181.129"] as const)}.${Math.floor(rng() * 256)}.${Math.floor(rng() * 256)}`
      : `10.30.${Math.floor(rng() * 256)}.${Math.floor(rng() * 256)}`;
  const auth: AuthenticationType =
    channel === "APP"
      ? pick(rng, ["Biometría huella", "Biometría faceid", "Credenciales"] as const)
      : pick(rng, ["Token", "Credenciales"] as const);
  const respCode = state === "Exitosa" ? "000" : state === "Técnicamente exitosa" ? "703" : "701";
  const respDesc =
    state === "Exitosa"
      ? "Transacción aprobada"
      : state === "Técnicamente exitosa"
        ? "Transacción procesada con advertencias técnicas"
        : pick(rng, ["Error procesando la transacción", "Transacción rechazada por límites", "Error de validación de datos"] as const);
  const techCode = state === "Exitosa" ? "BP00000000" : pick(rng, ["BP12900037", "BP22000001", "BP45600123"] as const);
  const isTransfer = isMoney && txEntry.code.startsWith("03");

  const rec: Omit<RccEvent, "_id"> = {
    sessionId: pseudoUuid(rng),
    transactionId: pseudoUuid(rng),
    initialYearTrx: year,
    initialMonthTrx: month,
    initialDayTrx: day,
    initialTrxHour: initHour,
    finalTrxYear: year,
    finalTrxMonth: month,
    finalTrxDay: day,
    finalTrxHour: finalHour,
    transactionCode: txEntry.code,
    transactionCodeDesc: txEntry.desc,
    responseCode: respCode,
    responseCodeDesc: respDesc,
    technicalCode: techCode,
    channel,
    deviceNameId: channel === "APP" ? "Dispositivo móvil" : channel,
    ip,
    authenticationType: auth,
    transactionType: txType,
    transactionState: state,
    documentTypeCode: "TIPDOC_FS001",
    documentType: customer.documentType,
    documentNumber: customer.documentNumber,
    customerName: customer.customerName,
    transactionMode: "Virtual",
    excludeITC: state !== "Exitosa",
    isD2B: "SI",
    timestamp: makeTimestamp(year, month, day),
    authenticationTransaction: auth,
    transactionDesc: txEntry.desc,
  };

  if (isMoney) {
    rec.currency = "COP";
    rec.localAmount = amount;
    rec.transactionValule = amount;
    rec.originProductType = customer.accType;
    rec.originProductNumber = customer.account;
  }
  if (isTransfer) {
    rec.destinyProductType = pick(rng, PRODUCT_TYPES);
    rec.destinyProductNumber = pseudoHex(rng, 11);
    rec.destinyProductRelation = pick(rng, DESTINY_PRODUCT_RELATIONS);
    rec.destinyBankCode = "5600078";
    rec.originBankCode = "5600078";
  }
  if (isMoney && state === "Exitosa") {
    rec.transactionVoucherNumber = 100_000 + Math.floor(rng() * 900_000);
    rec.commission = "NO";
    rec.entitlementRol = pick(rng, ENTITLEMENT_ROLES);
    rec.entitlementPrivilege = channel === "APP" ? "Admon Autonomo" : pick(rng, ENTITLEMENT_PRIVILEGES);
  }
  if (txType === "Administrativa") {
    rec.operationType = pick(rng, OPERATION_TYPES);
  }
  if (channel === "APP") {
    const dev = pick(rng, APP_DEVICES);
    rec.brandModel = dev.brand;
    rec.osVersion = dev.os;
    rec.appVersion = pick(rng, APP_VERSIONS);
  }

  return rec;
}

// ============================================================
// Anchor builders — one function per verifiable fact group
// ============================================================

/** Fact 1: Pedro moves $4,300,000 today (2 monetary transfers + 1 non-monetary query). */
function anchorsToday(now: Date): Array<Omit<RccEvent, "_id">> {
  const { year, month, day } = dateFromOffset(now, 0);
  const ts = makeTimestamp(year, month, day);
  const base = {
    finalTrxYear: year, finalTrxMonth: month, finalTrxDay: day,
    responseCode: "000", responseCodeDesc: "Transacción aprobada",
    technicalCode: "BP00000000", channel: "APP" as const,
    deviceNameId: "Dispositivo móvil", ip: PEDRO_IP,
    documentTypeCode: "TIPDOC_FS001", documentType: "CC" as const,
    documentNumber: PEDRO_DOC, customerName: PEDRO_NAME,
    transactionMode: "Virtual" as const, excludeITC: false, isD2B: "SI" as const,
    timestamp: ts, authenticationType: "Biometría huella" as const,
    authenticationTransaction: "Biometría huella" as const,
    entitlementRol: "Titular" as const, entitlementPrivilege: "Admon Autonomo" as const,
    currency: "COP", originProductType: PEDRO_ACC_TYPE, originProductNumber: PEDRO_ACCOUNT,
  };
  return [
    {
      ...base,
      sessionId: "f6127e10-f3e9-11ed-4d8e-438c4c9f4da1",
      transactionId: "20e34c70-66f2-11ee-43a5-478c42000101",
      initialYearTrx: year, initialMonthTrx: month, initialDayTrx: day,
      initialTrxHour: "09150000", finalTrxHour: "09150312",
      transactionCode: "0320", transactionCodeDesc: "Transferencia entre cuentas propias cuenta de ahorros",
      transactionType: "Monetaria", transactionState: "Exitosa",
      localAmount: ANCHOR_AMOUNTS.PEDRO_TODAY_1, transactionValule: ANCHOR_AMOUNTS.PEDRO_TODAY_1,
      destinyProductType: "CUENTA_DE_AHORRO" as const, destinyProductNumber: "31189907865",
      destinyProductRelation: "Propia" as const, commission: "NO" as const,
      transactionVoucherNumber: 724428,
      transactionDesc: "Transferencia a cuenta propia de ahorros",
    },
    {
      ...base,
      sessionId: "f6127e10-f3e9-11ed-4d8e-438c4c9f4da2",
      transactionId: "20e34c70-66f2-11ee-43a5-478c42000102",
      initialYearTrx: year, initialMonthTrx: month, initialDayTrx: day,
      initialTrxHour: "11420000", finalTrxHour: "11420521",
      transactionCode: "0380", transactionCodeDesc: "Transferencia nacional a terceros cuenta de ahorros",
      transactionType: "Monetaria", transactionState: "Exitosa",
      localAmount: ANCHOR_AMOUNTS.PEDRO_TODAY_2, transactionValule: ANCHOR_AMOUNTS.PEDRO_TODAY_2,
      destinyProductType: "CUENTA_DE_AHORRO" as const, destinyProductNumber: "98765000123",
      destinyProductRelation: "Inscrita" as const, commission: "NO" as const,
      transactionVoucherNumber: 819345,
      beneficiaryName: "Maria Londoño Uribe", beneficiaryDocumentType: "CC",
      beneficiaryDocumentNumber: "1002346789",
      transactionDesc: "Transferencia a cuenta inscrita de tercero",
    },
    {
      ...base,
      sessionId: "f6127e10-f3e9-11ed-4d8e-438c4c9f4da3",
      transactionId: "20e34c70-66f2-11ee-43a5-478c42000103",
      initialYearTrx: year, initialMonthTrx: month, initialDayTrx: day,
      initialTrxHour: "08350000", finalTrxHour: "08350152",
      transactionCode: "0100", transactionCodeDesc: "Consulta de saldo cuenta de ahorros",
      transactionType: "No monetaria", transactionState: "Exitosa",
      excludeITC: true, // non-monetary, no ITC replica needed
      transactionDesc: "Consulta de saldo cuenta de ahorros",
    },
  ];
}

/** Fact 3 (partial): Pedro had 3 activities yesterday. */
function anchorsYesterday(now: Date): Array<Omit<RccEvent, "_id">> {
  const { year, month, day } = dateFromOffset(now, 1);
  const ts = makeTimestamp(year, month, day);
  const base = {
    finalTrxYear: year, finalTrxMonth: month, finalTrxDay: day,
    responseCode: "000", responseCodeDesc: "Transacción aprobada",
    technicalCode: "BP00000000", channel: "APP" as const,
    deviceNameId: "Dispositivo móvil", ip: PEDRO_IP,
    documentTypeCode: "TIPDOC_FS001", documentType: "CC" as const,
    documentNumber: PEDRO_DOC, customerName: PEDRO_NAME,
    transactionMode: "Virtual" as const, isD2B: "SI" as const,
    timestamp: ts, authenticationType: "Biometría huella" as const,
    authenticationTransaction: "Biometría huella" as const,
    brandModel: "iPhone", osVersion: "iOS", appVersion: "25.1.0",
  };
  return [
    {
      ...base,
      sessionId: "f6127e10-f3e9-11ed-4d8e-438c4c9f4db1",
      transactionId: "20e34c70-66f2-11ee-43a5-478c42000201",
      initialYearTrx: year, initialMonthTrx: month, initialDayTrx: day,
      initialTrxHour: "08280000", finalTrxHour: "08280152",
      transactionCode: "0120", transactionCodeDesc: "Inicio de sesión canal digital",
      transactionType: "No monetaria", transactionState: "Exitosa",
      excludeITC: true, transactionDesc: "Inicio de sesión canal digital",
    },
    {
      ...base,
      sessionId: "f6127e10-f3e9-11ed-4d8e-438c4c9f4db2",
      transactionId: "20e34c70-66f2-11ee-43a5-478c42000202",
      initialYearTrx: year, initialMonthTrx: month, initialDayTrx: day,
      initialTrxHour: "08350000", finalTrxHour: "08350210",
      transactionCode: "0101", transactionCodeDesc: "Consulta de saldo tarjeta de crédito",
      transactionType: "No monetaria", transactionState: "Exitosa",
      excludeITC: true, transactionDesc: "Consulta de saldo tarjeta de crédito",
    },
    {
      ...base,
      sessionId: "f6127e10-f3e9-11ed-4d8e-438c4c9f4db3",
      transactionId: "20e34c70-66f2-11ee-43a5-478c42000203",
      initialYearTrx: year, initialMonthTrx: month, initialDayTrx: day,
      initialTrxHour: "09150000", finalTrxHour: "09150445",
      transactionCode: "0380", transactionCodeDesc: "Transferencia nacional a terceros cuenta de ahorros",
      transactionType: "Monetaria", transactionState: "Exitosa",
      excludeITC: false,
      currency: "COP", localAmount: ANCHOR_AMOUNTS.PEDRO_YEST_TRANSFER,
      transactionValule: ANCHOR_AMOUNTS.PEDRO_YEST_TRANSFER,
      originProductType: PEDRO_ACC_TYPE, originProductNumber: PEDRO_ACCOUNT,
      destinyProductType: "CUENTA_DE_AHORRO" as const, destinyProductNumber: "12345678901",
      destinyProductRelation: "Inscrita" as const, commission: "NO" as const,
      transactionVoucherNumber: 531224,
      entitlementRol: "Titular" as const, entitlementPrivilege: "Admon Autonomo" as const,
      transactionDesc: "Transferencia a cuenta inscrita de tercero",
    },
  ];
}

/** Fact 3 (date-filter anchor): Pedro had a transfer the day before yesterday so
 *  a "yesterday" filter returns exactly yesterday's 3 events, not this one. */
function anchorDayBefore(now: Date): Omit<RccEvent, "_id"> {
  const { year, month, day } = dateFromOffset(now, 2);
  return {
    sessionId: "f6127e10-f3e9-11ed-4d8e-438c4c9f4dc1",
    transactionId: "20e34c70-66f2-11ee-43a5-478c42000301",
    initialYearTrx: year, initialMonthTrx: month, initialDayTrx: day,
    initialTrxHour: "14200000", finalTrxHour: "14200530",
    finalTrxYear: year, finalTrxMonth: month, finalTrxDay: day,
    transactionCode: "0380", transactionCodeDesc: "Transferencia nacional a terceros cuenta de ahorros",
    responseCode: "000", responseCodeDesc: "Transacción aprobada",
    technicalCode: "BP00000000", channel: "APP",
    deviceNameId: "Dispositivo móvil", ip: PEDRO_IP,
    authenticationType: "Biometría faceid", transactionType: "Monetaria",
    transactionState: "Exitosa", documentTypeCode: "TIPDOC_FS001",
    documentType: "CC", documentNumber: PEDRO_DOC, customerName: PEDRO_NAME,
    currency: "COP", localAmount: ANCHOR_AMOUNTS.PEDRO_2DAYS_TRANSFER,
    transactionValule: ANCHOR_AMOUNTS.PEDRO_2DAYS_TRANSFER,
    originProductType: PEDRO_ACC_TYPE, originProductNumber: PEDRO_ACCOUNT,
    destinyProductType: "CUENTA_DE_AHORRO", destinyProductNumber: "99887766554",
    destinyProductRelation: "Inscrita", transactionMode: "Virtual",
    transactionVoucherNumber: 634512, commission: "NO",
    excludeITC: false, isD2B: "SI",
    timestamp: makeTimestamp(year, month, day),
    authenticationTransaction: "Biometría faceid",
    entitlementRol: "Titular", entitlementPrivilege: "Admon Autonomo",
    transactionDesc: "Transferencia a cuenta inscrita",
    brandModel: "iPhone", osVersion: "iOS", appVersion: "25.1.0",
  };
}

/** Fact 4: Pedro modified Carlos as authorized user for payment approval — 4 days ago. */
function anchorUserModification(now: Date): Omit<RccEvent, "_id"> {
  const { year, month, day } = dateFromOffset(now, 4);
  return {
    sessionId: "f6127e10-f3e9-11ed-4d8e-438c4c9f4dd1",
    transactionId: "20e34c70-66f2-11ee-43a5-478c42000401",
    initialYearTrx: year, initialMonthTrx: month, initialDayTrx: day,
    initialTrxHour: "11450000", finalTrxHour: "11451230",
    finalTrxYear: year, finalTrxMonth: month, finalTrxDay: day,
    transactionCode: "0510",
    transactionCodeDesc: "Modificación usuario autorizado para aprobación de pagos",
    responseCode: "000", responseCodeDesc: "Modificación exitosa",
    technicalCode: "BP00000000", channel: "NEG",
    deviceNameId: "NEG", ip: "10.30.45.210",
    transactionType: "No monetaria", transactionState: "Exitosa",
    documentTypeCode: "TIPDOC_FS001", documentType: "CC",
    documentNumber: PEDRO_DOC, customerName: PEDRO_NAME,
    authorizedUserdocumentTypeCode: "TIPDOC_FS001",
    authorizedUserdocumentType: "CC",
    authorizedUserdocumentNumber: CARLOS_DOC,
    authorizedUserName: CARLOS_NAME,
    operationType: "Modificación", transactionMode: "Virtual",
    excludeITC: true, isD2B: "SI",
    timestamp: makeTimestamp(year, month, day),
    entitlementRol: "Titular", entitlementPrivilege: "Admon Autonomo",
    transactionDesc: "Modificación de permisos del usuario delegado para autorización de pagos",
  };
}

/** Fact 5a: Juan's $45M transfer — largest this month. */
function anchorJuanLargest(now: Date): Omit<RccEvent, "_id"> {
  const { year, month, day } = clampToThisMonth(now, 8);
  return {
    sessionId: "f6127e10-f3e9-11ed-4d8e-438c4c9f4de1",
    transactionId: "20e34c70-66f2-11ee-43a5-478c42000501",
    initialYearTrx: year, initialMonthTrx: month, initialDayTrx: day,
    initialTrxHour: "14220000", finalTrxHour: "14220845",
    finalTrxYear: year, finalTrxMonth: month, finalTrxDay: day,
    transactionCode: "0380",
    transactionCodeDesc: "Transferencia nacional a terceros cuenta de ahorros",
    responseCode: "000", responseCodeDesc: "Transacción aprobada",
    technicalCode: "BP00000000", channel: "NEG",
    deviceNameId: "NEG", ip: JUAN_IP,
    authenticationType: "Token", transactionType: "Monetaria",
    transactionState: "Exitosa", documentTypeCode: "TIPDOC_FS001",
    documentType: "CC", documentNumber: JUAN_DOC, customerName: JUAN_NAME,
    currency: "COP", localAmount: ANCHOR_AMOUNTS.JUAN_LARGEST_MONTH,
    transactionValule: ANCHOR_AMOUNTS.JUAN_LARGEST_MONTH,
    originProductType: JUAN_ACC_TYPE, originProductNumber: JUAN_ACCOUNT,
    destinyProductType: "CUENTA_DE_AHORRO", destinyProductNumber: "68432198765",
    destinyProductRelation: "No inscrita", transactionMode: "Virtual",
    transactionVoucherNumber: 993201, commission: "SI",
    destinyBankCode: "5600078", originBankCode: "5600078",
    excludeITC: false, isD2B: "SI",
    timestamp: makeTimestamp(year, month, day),
    transactionStatusApproval: "Aprobado",
    authenticationTransaction: "Token",
    entitlementRol: "Titular", entitlementPrivilege: "Admon Autonomo",
    transactionDesc: "Transferencia nacional a tercero no inscrito",
  };
}

/** Fact 5b: Ana's $38M transfer — second largest this month. */
function anchorAnaSecond(now: Date): Omit<RccEvent, "_id"> {
  const { year, month, day } = clampToThisMonth(now, 6);
  return {
    sessionId: "f6127e10-f3e9-11ed-4d8e-438c4c9f4df1",
    transactionId: "20e34c70-66f2-11ee-43a5-478c42000601",
    initialYearTrx: year, initialMonthTrx: month, initialDayTrx: day,
    initialTrxHour: "10300000", finalTrxHour: "10300712",
    finalTrxYear: year, finalTrxMonth: month, finalTrxDay: day,
    transactionCode: "0380",
    transactionCodeDesc: "Transferencia nacional a terceros cuenta corriente",
    responseCode: "000", responseCodeDesc: "Transacción aprobada",
    technicalCode: "BP00000000", channel: "SVP",
    deviceNameId: "SVP", ip: ANA_IP,
    authenticationType: "Token", transactionType: "Monetaria",
    transactionState: "Exitosa", documentTypeCode: "TIPDOC_FS001",
    documentType: "CC", documentNumber: ANA_DOC, customerName: ANA_NAME,
    currency: "COP", localAmount: ANCHOR_AMOUNTS.ANA_SECOND_MONTH,
    transactionValule: ANCHOR_AMOUNTS.ANA_SECOND_MONTH,
    originProductType: ANA_ACC_TYPE, originProductNumber: ANA_ACCOUNT,
    destinyProductType: "CUENTA_CORRIENTES", destinyProductNumber: "25678900123",
    destinyProductRelation: "Otros bancos", transactionMode: "Virtual",
    transactionVoucherNumber: 771234, commission: "SI",
    destinyBankCode: "9000123", originBankCode: "5600078",
    excludeITC: false, isD2B: "SI",
    timestamp: makeTimestamp(year, month, day),
    transactionStatusApproval: "Aprobado",
    authenticationTransaction: "Token",
    entitlementRol: "Titular", entitlementPrivilege: "Admon Autonomo",
    transactionDesc: "Transferencia a otro banco",
  };
}

/** Fact 5c: Juan's $50M transfer LAST month — ensures "this month" filter excludes it. */
function anchorJuanLastMonth(now: Date): Omit<RccEvent, "_id"> {
  const som = startOfMonthUTC(now);
  const d = new Date(som - 3 * DAY_MS);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  return {
    sessionId: "f6127e10-f3e9-11ed-4d8e-438c4c9f4dg1",
    transactionId: "20e34c70-66f2-11ee-43a5-478c42000701",
    initialYearTrx: year, initialMonthTrx: month, initialDayTrx: day,
    initialTrxHour: "09000000", finalTrxHour: "09001050",
    finalTrxYear: year, finalTrxMonth: month, finalTrxDay: day,
    transactionCode: "0380",
    transactionCodeDesc: "Transferencia nacional a terceros cuenta de ahorros",
    responseCode: "000", responseCodeDesc: "Transacción aprobada",
    technicalCode: "BP00000000", channel: "NEG",
    deviceNameId: "NEG", ip: JUAN_IP,
    authenticationType: "Token", transactionType: "Monetaria",
    transactionState: "Exitosa", documentTypeCode: "TIPDOC_FS001",
    documentType: "CC", documentNumber: JUAN_DOC, customerName: JUAN_NAME,
    currency: "COP", localAmount: ANCHOR_AMOUNTS.JUAN_LAST_MONTH,
    transactionValule: ANCHOR_AMOUNTS.JUAN_LAST_MONTH,
    originProductType: JUAN_ACC_TYPE, originProductNumber: JUAN_ACCOUNT,
    destinyProductType: "CUENTA_DE_AHORRO", destinyProductNumber: "55123456789",
    destinyProductRelation: "No inscrita", transactionMode: "Virtual",
    transactionVoucherNumber: 882901, commission: "SI",
    destinyBankCode: "5600078", originBankCode: "5600078",
    excludeITC: false, isD2B: "SI",
    timestamp: makeTimestamp(year, month, day),
    transactionStatusApproval: "Aprobado",
    authenticationTransaction: "Token",
    entitlementRol: "Titular", entitlementPrivilege: "Admon Autonomo",
    transactionDesc: "Transferencia nacional — mes anterior",
  };
}

/**
 * Facts 2 & 6: Carlos's dual-control violation — $18.5 M at 02:30 AM, 3 days ago.
 * A single delegate (Carlos) both prepared and approved the same transaction.
 * Returns [initiation_record, approval_record].
 */
function anchorsDualControl(now: Date): [Omit<RccEvent, "_id">, Omit<RccEvent, "_id">] {
  const { year, month, day } = dateFromOffset(now, 3);
  const ts = makeTimestamp(year, month, day);
  const shared = {
    finalTrxYear: year, finalTrxMonth: month, finalTrxDay: day,
    transactionCode: "0380",
    transactionCodeDesc: "Transferencia nacional a terceros cuenta de ahorros",
    responseCode: "000", responseCodeDesc: "Transacción aprobada",
    technicalCode: "BP00000000", channel: "SVP" as const,
    deviceNameId: "SVP", ip: CARLOS_UNUSUAL_IP,
    authenticationType: "Token" as const, transactionType: "Monetaria" as const,
    transactionState: "Exitosa" as const,
    documentTypeCode: "TIPDOC_FS001", documentType: "CC" as const,
    documentNumber: PEDRO_DOC, customerName: PEDRO_NAME,
    authorizedUserdocumentTypeCode: "TIPDOC_FS001",
    authorizedUserdocumentType: "CC" as const,
    authorizedUserdocumentNumber: CARLOS_DOC,
    authorizedUserName: CARLOS_NAME,
    currency: "COP", localAmount: ANCHOR_AMOUNTS.CARLOS_DUAL,
    transactionValule: ANCHOR_AMOUNTS.CARLOS_DUAL,
    originProductType: PEDRO_ACC_TYPE, originProductNumber: PEDRO_ACCOUNT,
    destinyProductType: "CUENTA_DE_AHORRO" as const, destinyProductNumber: "11223344556",
    destinyProductRelation: "No inscrita" as const, transactionMode: "Virtual" as const,
    commission: "NO" as const, excludeITC: false, isD2B: "SI" as const,
    timestamp: ts, authenticationTransaction: "Token" as const,
    entitlementRol: "Titular Rep Legal" as const, entitlementPrivilege: "Preparador/Aprobador" as const,
    managementDescription: "Operación preparada y aprobada por el mismo delegado sin segunda firma",
  };
  const init: Omit<RccEvent, "_id"> = {
    ...shared,
    sessionId: "f6127e10-f3e9-11ed-4d8e-438c4c9f4dh1",
    transactionId: "20e34c70-66f2-11ee-43a5-478c42000801",
    initialYearTrx: year, initialMonthTrx: month, initialDayTrx: day,
    initialTrxHour: "02300000", finalTrxHour: "02300512",
    transactionVoucherNumber: 556781, transactionStatusApproval: "Preparado",
    transactionDesc: "Transferencia nocturna — preparada por delegado",
  };
  const appr: Omit<RccEvent, "_id"> = {
    ...shared,
    sessionId: "f6127e10-f3e9-11ed-4d8e-438c4c9f4dh2",
    transactionId: "20e34c70-66f2-11ee-43a5-478c42000802",
    initialYearTrx: year, initialMonthTrx: month, initialDayTrx: day,
    initialTrxHour: "02310000", finalTrxHour: "02310205",
    transactionVoucherNumber: 556782, transactionStatusApproval: "Aprobado",
    transactionDesc: "Transferencia nocturna — aprobada por el mismo delegado",
  };
  return [init, appr];
}

// ============================================================
// KB anchor builders — Tamales de mi abuela business scenarios
// ============================================================

/**
 * KB Scenario 1 (R001 — rol no autorizado): Luis Herrera Cano (Jefe de Producción)
 * opera la cuenta de ventas como usuario autorizado de Carmen Rivera Mora.
 * Regla violada: Jefe de Producción no está autorizado para la cuenta de ventas.
 * Monto: $350.000 COP (< P90 Envigado $373.000 — monto dentro de rango normal, pero rol incorrecto).
 */
function anchorKbJefeVentas(now: Date): Omit<RccEvent, "_id"> {
  const { year, month, day } = dateFromOffset(now, 6);
  return {
    sessionId: "kb000001-f3e9-11ed-4d8e-438c4c9f0001",
    transactionId: "kb000001-66f2-11ee-43a5-478c42000001",
    initialYearTrx: year, initialMonthTrx: month, initialDayTrx: day,
    initialTrxHour: "10420000", finalTrxHour: "10420318",
    finalTrxYear: year, finalTrxMonth: month, finalTrxDay: day,
    transactionCode: "0380",
    transactionCodeDesc: "Transferencia nacional a terceros cuenta corriente",
    responseCode: "000", responseCodeDesc: "Transacción aprobada",
    technicalCode: "BP00000000", channel: "SVP",
    deviceNameId: "SVP", ip: LUIS_IP,
    authenticationType: "Token", transactionType: "Monetaria",
    transactionState: "Exitosa",
    documentTypeCode: "TIPDOC_FS001", documentType: "CC",
    documentNumber: CARMEN_DOC, customerName: CARMEN_NAME,
    authorizedUserdocumentTypeCode: "TIPDOC_FS001",
    authorizedUserdocumentType: "CC",
    authorizedUserdocumentNumber: LUIS_DOC,
    authorizedUserName: LUIS_NAME,
    currency: "COP", localAmount: ANCHOR_AMOUNTS.KB_JEFE_VENTAS,
    transactionValule: ANCHOR_AMOUNTS.KB_JEFE_VENTAS,
    originProductType: VENTAS_ACC_TYPE, originProductNumber: VENTAS_ACCOUNT,
    destinyProductType: "CUENTA_CORRIENTES", destinyProductNumber: "90234567812",
    destinyProductRelation: "Inscrita", transactionMode: "Virtual",
    transactionVoucherNumber: 412301, commission: "NO",
    excludeITC: false, isD2B: "SI",
    timestamp: makeTimestamp(year, month, day),
    authenticationTransaction: "Token",
    entitlementRol: "Titular Rep Legal", entitlementPrivilege: "Preparador/Aprobador",
    transactionDesc: "Pago proveedor insumos - ejecutado por Jefe de Producción",
    managementDescription: "Jefe de Producción operando cuenta de ventas - revisar autorización según matriz de roles",
    originCity: "Envigado",
  };
}

/**
 * KB Scenario 2 (R005 — dividendos = $0): Transferencia desde cuenta de ventas
 * hacia cuenta personal de Roberto Salazar Pinto (Socio) con concepto
 * "Distribución de utilidades socios". La política vigente fija Dividendos = $0.
 * Monto: $620.000 COP (P90–P99 Envigado → ALERTA MEDIO cuantitativa, además de R005).
 */
function anchorKbDividend(now: Date): Omit<RccEvent, "_id"> {
  const { year, month, day } = dateFromOffset(now, 12);
  return {
    sessionId: "kb000002-f3e9-11ed-4d8e-438c4c9f0002",
    transactionId: "kb000002-66f2-11ee-43a5-478c42000002",
    initialYearTrx: year, initialMonthTrx: month, initialDayTrx: day,
    initialTrxHour: "15080000", finalTrxHour: "15080427",
    finalTrxYear: year, finalTrxMonth: month, finalTrxDay: day,
    transactionCode: "0381",
    transactionCodeDesc: "Transferencia nacional a terceros cuenta corriente",
    responseCode: "000", responseCodeDesc: "Transacción aprobada",
    technicalCode: "BP00000000", channel: "NEG",
    deviceNameId: "NEG", ip: CARMEN_IP,
    authenticationType: "Token", transactionType: "Monetaria",
    transactionState: "Exitosa",
    documentTypeCode: "TIPDOC_FS001", documentType: "CC",
    documentNumber: CARMEN_DOC, customerName: CARMEN_NAME,
    currency: "COP", localAmount: ANCHOR_AMOUNTS.KB_DIVIDEND,
    transactionValule: ANCHOR_AMOUNTS.KB_DIVIDEND,
    originProductType: VENTAS_ACC_TYPE, originProductNumber: VENTAS_ACCOUNT,
    destinyProductType: "CUENTA_CORRIENTES",
    destinyProductNumber: ROBERTO_PERSONAL_ACCOUNT,
    destinyProductRelation: "Inscrita", transactionMode: "Virtual",
    transactionVoucherNumber: 512450, commission: "NO",
    beneficiaryName: ROBERTO_NAME,
    beneficiaryDocumentType: "CC",
    beneficiaryDocumentNumber: ROBERTO_DOC,
    excludeITC: false, isD2B: "SI",
    timestamp: makeTimestamp(year, month, day),
    transactionStatusApproval: "Aprobado",
    authenticationTransaction: "Token",
    entitlementRol: "Titular", entitlementPrivilege: "Admon Autonomo",
    transactionDesc: "Distribución de utilidades socios",
    reasonTransaction: "Distribución de utilidades",
    managementDescription: "Transferencia hacia socio con concepto utilidades - política vigente: Dividendos = $0",
    originCity: "Envigado",
  };
}

/**
 * KB Scenario 3 (anomalía cuantitativa): Pago desde cuenta de operación,
 * Sede Guayabal. Monto: $2.100.000 COP supera el P99 de Guayabal ($1.796.580)
 * → ALERTA ALTA. Por debajo del máximo histórico ($2.227.600).
 */
function anchorKbOperacionAnomaly(now: Date): Omit<RccEvent, "_id"> {
  const { year, month, day } = dateFromOffset(now, 15);
  return {
    sessionId: "kb000003-f3e9-11ed-4d8e-438c4c9f0003",
    transactionId: "kb000003-66f2-11ee-43a5-478c42000003",
    initialYearTrx: year, initialMonthTrx: month, initialDayTrx: day,
    initialTrxHour: "09300000", finalTrxHour: "09300634",
    finalTrxYear: year, finalTrxMonth: month, finalTrxDay: day,
    transactionCode: "0381",
    transactionCodeDesc: "Transferencia nacional a terceros cuenta corriente",
    responseCode: "000", responseCodeDesc: "Transacción aprobada",
    technicalCode: "BP00000000", channel: "NEG",
    deviceNameId: "NEG", ip: LUIS_IP,
    authenticationType: "Token", transactionType: "Monetaria",
    transactionState: "Exitosa",
    documentTypeCode: "TIPDOC_FS001", documentType: "CC",
    documentNumber: LUIS_DOC, customerName: LUIS_NAME,
    currency: "COP", localAmount: ANCHOR_AMOUNTS.KB_OPERACION_ANOMALY,
    transactionValule: ANCHOR_AMOUNTS.KB_OPERACION_ANOMALY,
    originProductType: OPERACION_ACC_TYPE, originProductNumber: OPERACION_ACCOUNT,
    destinyProductType: "CUENTA_CORRIENTES", destinyProductNumber: "67123409812",
    destinyProductRelation: "Inscrita", transactionMode: "Virtual",
    transactionVoucherNumber: 634782, commission: "NO",
    excludeITC: false, isD2B: "SI",
    timestamp: makeTimestamp(year, month, day),
    transactionStatusApproval: "Aprobado",
    authenticationTransaction: "Token",
    entitlementRol: "Titular", entitlementPrivilege: "Admon Autonomo",
    transactionDesc: "Pago proveedor producción - Sede Guayabal",
    reasonTransaction: "Pago a proveedor de producción",
    originCity: "Guayabal",
  };
}

/**
 * KB Scenario 4 (comparación de sedes): Transferencia desde cuenta de ventas,
 * Sede Guayabal. Monto: $1.050.000 COP — normal para Guayabal (<P90 $1.159.970)
 * pero constituiría ALERTA ALTO para Envigado (>P99 $673.450). Permite al agente
 * demostrar que el umbral aplicable depende de la sede del movimiento.
 */
function anchorKbGuayabalNormal(now: Date): Omit<RccEvent, "_id"> {
  const { year, month, day } = dateFromOffset(now, 7);
  return {
    sessionId: "kb000004-f3e9-11ed-4d8e-438c4c9f0004",
    transactionId: "kb000004-66f2-11ee-43a5-478c42000004",
    initialYearTrx: year, initialMonthTrx: month, initialDayTrx: day,
    initialTrxHour: "13150000", finalTrxHour: "13150511",
    finalTrxYear: year, finalTrxMonth: month, finalTrxDay: day,
    transactionCode: "0400",
    transactionCodeDesc: "Pago de facturas y servicios",
    responseCode: "000", responseCodeDesc: "Transacción aprobada",
    technicalCode: "BP00000000", channel: "APP",
    deviceNameId: "Dispositivo móvil", ip: CARMEN_IP,
    authenticationType: "Biometría huella", transactionType: "Monetaria",
    transactionState: "Exitosa",
    documentTypeCode: "TIPDOC_FS001", documentType: "CC",
    documentNumber: CARMEN_DOC, customerName: CARMEN_NAME,
    currency: "COP", localAmount: ANCHOR_AMOUNTS.KB_GUAYABAL_NORMAL,
    transactionValule: ANCHOR_AMOUNTS.KB_GUAYABAL_NORMAL,
    originProductType: VENTAS_ACC_TYPE, originProductNumber: VENTAS_ACCOUNT,
    destinyProductType: "CUENTA_CORRIENTES", destinyProductNumber: "34521078900",
    destinyProductRelation: "Inscrita", transactionMode: "Virtual",
    transactionVoucherNumber: 718923, commission: "NO",
    excludeITC: false, isD2B: "SI",
    timestamp: makeTimestamp(year, month, day),
    authenticationTransaction: "Biometría huella",
    entitlementRol: "Titular", entitlementPrivilege: "Admon Autonomo",
    transactionDesc: "Pago operaciones - Sede Guayabal",
    originCity: "Guayabal",
    brandModel: "Samsung Galaxy", osVersion: "Android", appVersion: "25.3.0",
  };
}

// ============================================================
// Diego López hybrid scenario anchor builders (July 8–9, 2026)
// ============================================================

/**
 * Diego López — TX 1 of 3, July 8 2026.
 * 09:15, SVP, code 0320, $480.000 COP, Envigado.
 * Part of the aggregate: total will be $1.030.000 > P99 Envigado → NEEDS_REVIEW.
 */
function anchorDiegoJul8Tx1(): Omit<RccEvent, "_id"> {
  return {
    sessionId: "diego001-f3e9-11ed-4d8e-438c4c9f0001",
    transactionId: "diego001-66f2-11ee-43a5-478c42000001",
    initialYearTrx: DIEGO_YEAR, initialMonthTrx: DIEGO_MONTH, initialDayTrx: DIEGO_DAY_8,
    initialTrxHour: "09150000", finalTrxHour: "09150412",
    finalTrxYear: DIEGO_YEAR, finalTrxMonth: DIEGO_MONTH, finalTrxDay: DIEGO_DAY_8,
    transactionCode: "0320",
    transactionCodeDesc: "Transferencia entre cuentas propias cuenta corriente",
    responseCode: "000", responseCodeDesc: "Transacción aprobada",
    technicalCode: "BP00000000", channel: "SVP",
    deviceNameId: "SVP", ip: DIEGO_IP,
    authenticationType: "Token", transactionType: "Monetaria",
    transactionState: "Exitosa",
    documentTypeCode: "TIPDOC_FS001", documentType: "CC",
    documentNumber: DIEGO_DOC, customerName: DIEGO_NAME,
    currency: "COP", localAmount: ANCHOR_AMOUNTS.DIEGO_TX1,
    transactionValule: ANCHOR_AMOUNTS.DIEGO_TX1,
    originProductType: DIEGO_ACC_TYPE, originProductNumber: DIEGO_ACCOUNT,
    destinyProductType: "CUENTA_CORRIENTES", destinyProductNumber: OPERACION_ACCOUNT,
    destinyProductRelation: "Propia", transactionMode: "Virtual",
    transactionVoucherNumber: 801001, commission: "NO",
    excludeITC: false, isD2B: "SI",
    timestamp: makeTimestamp(DIEGO_YEAR, DIEGO_MONTH, DIEGO_DAY_8),
    transactionStatusApproval: "Aprobado",
    authenticationTransaction: "Token",
    entitlementRol: "Titular", entitlementPrivilege: "Admon Autonomo",
    transactionDesc: "Transferencia operacional — primer movimiento del día",
    reasonTransaction: "Pago proveedores operación",
    originCity: "Envigado",
  };
}

/**
 * Diego López — TX 2 of 3, July 8 2026.
 * 14:30, APP, code 0381, $350.000 COP, Envigado.
 */
function anchorDiegoJul8Tx2(): Omit<RccEvent, "_id"> {
  return {
    sessionId: "diego002-f3e9-11ed-4d8e-438c4c9f0002",
    transactionId: "diego002-66f2-11ee-43a5-478c42000002",
    initialYearTrx: DIEGO_YEAR, initialMonthTrx: DIEGO_MONTH, initialDayTrx: DIEGO_DAY_8,
    initialTrxHour: "14300000", finalTrxHour: "14300527",
    finalTrxYear: DIEGO_YEAR, finalTrxMonth: DIEGO_MONTH, finalTrxDay: DIEGO_DAY_8,
    transactionCode: "0381",
    transactionCodeDesc: "Transferencia nacional a terceros cuenta corriente",
    responseCode: "000", responseCodeDesc: "Transacción aprobada",
    technicalCode: "BP00000000", channel: "APP",
    deviceNameId: "Dispositivo móvil", ip: DIEGO_IP,
    authenticationType: "Biometría huella", transactionType: "Monetaria",
    transactionState: "Exitosa",
    documentTypeCode: "TIPDOC_FS001", documentType: "CC",
    documentNumber: DIEGO_DOC, customerName: DIEGO_NAME,
    currency: "COP", localAmount: ANCHOR_AMOUNTS.DIEGO_TX2,
    transactionValule: ANCHOR_AMOUNTS.DIEGO_TX2,
    originProductType: DIEGO_ACC_TYPE, originProductNumber: DIEGO_ACCOUNT,
    destinyProductType: "CUENTA_DE_AHORRO", destinyProductNumber: "45821037600",
    destinyProductRelation: "Inscrita", transactionMode: "Virtual",
    transactionVoucherNumber: 801002, commission: "NO",
    excludeITC: false, isD2B: "SI",
    timestamp: makeTimestamp(DIEGO_YEAR, DIEGO_MONTH, DIEGO_DAY_8),
    transactionStatusApproval: "Aprobado",
    authenticationTransaction: "Biometría huella",
    entitlementRol: "Titular", entitlementPrivilege: "Admon Autonomo",
    transactionDesc: "Pago insumos producción — segundo movimiento",
    reasonTransaction: "Compra insumos producción",
    originCity: "Envigado",
    brandModel: "iPhone 14", osVersion: "iOS 17", appVersion: "25.3.0",
  };
}

/**
 * Diego López — TX 3 of 3, July 8 2026.
 * 16:45, NEG, code 0320, $200.000 COP, Envigado.
 */
function anchorDiegoJul8Tx3(): Omit<RccEvent, "_id"> {
  return {
    sessionId: "diego003-f3e9-11ed-4d8e-438c4c9f0003",
    transactionId: "diego003-66f2-11ee-43a5-478c42000003",
    initialYearTrx: DIEGO_YEAR, initialMonthTrx: DIEGO_MONTH, initialDayTrx: DIEGO_DAY_8,
    initialTrxHour: "16450000", finalTrxHour: "16450318",
    finalTrxYear: DIEGO_YEAR, finalTrxMonth: DIEGO_MONTH, finalTrxDay: DIEGO_DAY_8,
    transactionCode: "0320",
    transactionCodeDesc: "Transferencia entre cuentas propias cuenta corriente",
    responseCode: "000", responseCodeDesc: "Transacción aprobada",
    technicalCode: "BP00000000", channel: "NEG",
    deviceNameId: "NEG", ip: DIEGO_IP,
    authenticationType: "OTP", transactionType: "Monetaria",
    transactionState: "Exitosa",
    documentTypeCode: "TIPDOC_FS001", documentType: "CC",
    documentNumber: DIEGO_DOC, customerName: DIEGO_NAME,
    currency: "COP", localAmount: ANCHOR_AMOUNTS.DIEGO_TX3,
    transactionValule: ANCHOR_AMOUNTS.DIEGO_TX3,
    originProductType: DIEGO_ACC_TYPE, originProductNumber: DIEGO_ACCOUNT,
    destinyProductType: "CUENTA_CORRIENTES", destinyProductNumber: OPERACION_ACCOUNT,
    destinyProductRelation: "Propia", transactionMode: "Virtual",
    transactionVoucherNumber: 801003, commission: "NO",
    excludeITC: false, isD2B: "SI",
    timestamp: makeTimestamp(DIEGO_YEAR, DIEGO_MONTH, DIEGO_DAY_8),
    transactionStatusApproval: "Aprobado",
    authenticationTransaction: "OTP",
    entitlementRol: "Titular", entitlementPrivilege: "Admon Autonomo",
    transactionDesc: "Transferencia operacional — cierre de día",
    reasonTransaction: "Cierre operacional diario",
    originCity: "Envigado",
  };
}

/**
 * Near-miss A: "Diego Lopez" (sin tilde) — persona distinta, mismo día July 8 2026.
 * Una consulta exacta por customerName="Diego López" NO debe incluir este registro.
 * Confirma que el filtro discrimina por acento.
 */
function anchorDiegoNoTildeJul8(): Omit<RccEvent, "_id"> {
  return {
    sessionId: "diegon01-f3e9-11ed-4d8e-438c4c9f0001",
    transactionId: "diegon01-66f2-11ee-43a5-478c42000001",
    initialYearTrx: DIEGO_YEAR, initialMonthTrx: DIEGO_MONTH, initialDayTrx: DIEGO_DAY_8,
    initialTrxHour: "10300000", finalTrxHour: "10300245",
    finalTrxYear: DIEGO_YEAR, finalTrxMonth: DIEGO_MONTH, finalTrxDay: DIEGO_DAY_8,
    transactionCode: "0380",
    transactionCodeDesc: "Transferencia nacional a terceros cuenta de ahorros",
    responseCode: "000", responseCodeDesc: "Transacción aprobada",
    technicalCode: "BP00000000", channel: "APP",
    deviceNameId: "Dispositivo móvil", ip: "10.30.46.119",
    authenticationType: "Token", transactionType: "Monetaria",
    transactionState: "Exitosa",
    documentTypeCode: "TIPDOC_FS001", documentType: "CC",
    documentNumber: DIEGO_NOTILDE_DOC, customerName: DIEGO_NOTILDE_NAME,
    currency: "COP", localAmount: ANCHOR_AMOUNTS.DIEGO_NEAR_MISS_NOTILDE,
    transactionValule: ANCHOR_AMOUNTS.DIEGO_NEAR_MISS_NOTILDE,
    originProductType: "CUENTA_CORRIENTES", originProductNumber: DIEGO_NOTILDE_ACCOUNT,
    destinyProductType: "CUENTA_DE_AHORRO", destinyProductNumber: "55123456789",
    destinyProductRelation: "Inscrita", transactionMode: "Virtual",
    transactionVoucherNumber: 801010, commission: "NO",
    excludeITC: false, isD2B: "NO",
    timestamp: makeTimestamp(DIEGO_YEAR, DIEGO_MONTH, DIEGO_DAY_8),
    transactionStatusApproval: "Aprobado",
    authenticationTransaction: "Token",
    entitlementRol: "Titular", entitlementPrivilege: "Admon Autonomo",
    transactionDesc: "Transferencia a cuenta de ahorros",
    originCity: "Envigado",
  };
}

/**
 * Near-miss B: "Diego López" (mismo titular) — día siguiente July 9 2026.
 * Una consulta por initialDayTrx=8 NO debe incluir este registro.
 * Confirma que el filtro de fecha discrimina días contiguos.
 */
function anchorDiegoLopezJul9(): Omit<RccEvent, "_id"> {
  return {
    sessionId: "diego009-f3e9-11ed-4d8e-438c4c9f0009",
    transactionId: "diego009-66f2-11ee-43a5-478c42000009",
    initialYearTrx: DIEGO_YEAR, initialMonthTrx: DIEGO_MONTH, initialDayTrx: DIEGO_DAY_9,
    initialTrxHour: "09000000", finalTrxHour: "09000310",
    finalTrxYear: DIEGO_YEAR, finalTrxMonth: DIEGO_MONTH, finalTrxDay: DIEGO_DAY_9,
    transactionCode: "0320",
    transactionCodeDesc: "Transferencia entre cuentas propias cuenta corriente",
    responseCode: "000", responseCodeDesc: "Transacción aprobada",
    technicalCode: "BP00000000", channel: "SVP",
    deviceNameId: "SVP", ip: DIEGO_IP,
    authenticationType: "Token", transactionType: "Monetaria",
    transactionState: "Exitosa",
    documentTypeCode: "TIPDOC_FS001", documentType: "CC",
    documentNumber: DIEGO_DOC, customerName: DIEGO_NAME,
    currency: "COP", localAmount: ANCHOR_AMOUNTS.DIEGO_NEAR_MISS_NEXTDAY,
    transactionValule: ANCHOR_AMOUNTS.DIEGO_NEAR_MISS_NEXTDAY,
    originProductType: DIEGO_ACC_TYPE, originProductNumber: DIEGO_ACCOUNT,
    destinyProductType: "CUENTA_CORRIENTES", destinyProductNumber: OPERACION_ACCOUNT,
    destinyProductRelation: "Propia", transactionMode: "Virtual",
    transactionVoucherNumber: 801009, commission: "NO",
    excludeITC: false, isD2B: "SI",
    timestamp: makeTimestamp(DIEGO_YEAR, DIEGO_MONTH, DIEGO_DAY_9),
    transactionStatusApproval: "Aprobado",
    authenticationTransaction: "Token",
    entitlementRol: "Titular", entitlementPrivilege: "Admon Autonomo",
    transactionDesc: "Transferencia operacional — día siguiente",
    reasonTransaction: "Pago proveedores operación",
    originCity: "Envigado",
  };
}

// ============================================================
// Build full dataset
// ============================================================

function buildEvents(now: Date): RccEvent[] {
  const rng = mulberry32(SEED);
  const raw: Array<Omit<RccEvent, "_id">> = [];

  // Filler events
  for (let i = 0; i < FILLER_COUNT; i++) {
    raw.push(buildFillerRecord(rng, now));
  }

  // Anchors
  raw.push(...anchorsToday(now));
  raw.push(...anchorsYesterday(now));
  raw.push(anchorDayBefore(now));
  raw.push(anchorUserModification(now));
  raw.push(anchorJuanLargest(now));
  raw.push(anchorAnaSecond(now));
  raw.push(anchorJuanLastMonth(now));
  const [dualInit, dualAppr] = anchorsDualControl(now);
  raw.push(dualInit);
  raw.push(dualAppr);

  // KB business anchors (Tamales de mi abuela)
  raw.push(anchorKbJefeVentas(now));
  raw.push(anchorKbDividend(now));
  raw.push(anchorKbOperacionAnomaly(now));
  raw.push(anchorKbGuayabalNormal(now));

  // Diego López hybrid scenario anchors (fixed dates: July 8–9, 2026)
  raw.push(anchorDiegoJul8Tx1());
  raw.push(anchorDiegoJul8Tx2());
  raw.push(anchorDiegoJul8Tx3());
  raw.push(anchorDiegoNoTildeJul8());
  raw.push(anchorDiegoLopezJul9());

  // Sort chronologically, then assign stable IDs.
  raw.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  return raw.map((e, i) => ({ _id: `rcc_${String(i + 1).padStart(5, "0")}`, ...e }));
}

// ============================================================
// Expectations (compatible shape with scripts/verify.ts)
// ============================================================

export interface Expectations {
  totalEvents: number;
  /** The single record with the highest transactionValule in the current calendar month. */
  largestTransferThisMonth: { _id: string; amount: number; userId: string; userName: string };
  /** The focus customer (Pedro Picapiedra) and their total successful monetary transfers. */
  focusUser: { userId: string; userName: string; totalSuccessfulTransferMinorUnits: number };
  /** The pair of records that represent the dual-control violation. */
  dualControlViolation: { initiatedId: string; approvedId: string; userId: string };
  /** Diego López's July 8, 2026 aggregate for the hybrid scenario. */
  diegoLopezJul8: { total: number; count: number; documentNumber: string; userName: string };
}

/** Sum of all Monetaria+Exitosa transactionValule for a given documentNumber. */
function successfulTransferTotal(events: RccEvent[], documentNumber: string): number {
  return events
    .filter((e) => e.documentNumber === documentNumber && e.transactionType === MONETARY_TRANSACTION_TYPE && e.transactionState === "Exitosa")
    .reduce((sum, e) => sum + (e.transactionValule ?? 0), 0);
}

export function computeExpectations(events: RccEvent[], now: Date = new Date()): Expectations {
  const startOfMonth = startOfMonthUTC(now);

  const thisMonthMonetary = events.filter(
    (e) => e.transactionType === MONETARY_TRANSACTION_TYPE && e.transactionState === "Exitosa" && e.timestamp.getTime() >= startOfMonth,
  );
  let largest = thisMonthMonetary[0];
  for (const e of thisMonthMonetary) {
    if (!largest || (e.transactionValule ?? 0) > (largest.transactionValule ?? 0)) largest = e;
  }
  if (!largest) throw new Error("No successful monetary transfers this month; generator invariant broken.");

  const dualInit = events.find((e) => e.transactionStatusApproval === "Preparado" && e.authorizedUserName === CARLOS_NAME && (e.transactionValule ?? 0) === ANCHOR_AMOUNTS.CARLOS_DUAL);
  const dualAppr = events.find((e) => e.transactionStatusApproval === "Aprobado" && e.authorizedUserName === CARLOS_NAME && (e.transactionValule ?? 0) === ANCHOR_AMOUNTS.CARLOS_DUAL);
  if (!dualInit || !dualAppr) throw new Error("Dual-control violation anchor missing; generator broken.");

  const diegoJul8Txs = events.filter(
    (e) =>
      e.customerName === DIEGO_NAME &&
      e.initialYearTrx === DIEGO_YEAR &&
      e.initialMonthTrx === DIEGO_MONTH &&
      e.initialDayTrx === DIEGO_DAY_8 &&
      e.transactionType === MONETARY_TRANSACTION_TYPE &&
      e.transactionState === "Exitosa",
  );
  const diegoJul8Total = diegoJul8Txs.reduce((s, e) => s + (e.transactionValule ?? 0), 0);

  return {
    totalEvents: events.length,
    largestTransferThisMonth: {
      _id: largest._id,
      amount: largest.transactionValule ?? 0,
      userId: largest.documentNumber,
      userName: largest.customerName ?? "",
    },
    focusUser: {
      userId: PEDRO_DOC,
      userName: PEDRO_NAME,
      totalSuccessfulTransferMinorUnits: successfulTransferTotal(events, PEDRO_DOC),
    },
    dualControlViolation: {
      initiatedId: dualInit._id,
      approvedId: dualAppr._id,
      userId: CARLOS_DOC,
    },
    diegoLopezJul8: {
      total: diegoJul8Total,
      count: diegoJul8Txs.length,
      documentNumber: DIEGO_DOC,
      userName: DIEGO_NAME,
    },
  };
}

/**
 * Generate the synthetic events and assert internal consistency.
 * Throws if any invariant is violated so callers never load bad data.
 */
export function generateActivityEvents(now: Date = new Date()): RccEvent[] {
  const events = buildEvents(now);
  const exp = computeExpectations(events, now);

  // Invariant 1: Juan's anchor is the largest transfer this month.
  if (exp.largestTransferThisMonth.amount !== ANCHOR_AMOUNTS.JUAN_LARGEST_MONTH) {
    throw new Error(
      `Largest transfer this month is ${exp.largestTransferThisMonth.amount}, expected ${ANCHOR_AMOUNTS.JUAN_LARGEST_MONTH}. A filler record may have exceeded the cap.`,
    );
  }

  // Invariant 2: the largest-this-month holder is Juan Garcia Restrepo.
  if (exp.largestTransferThisMonth.userName !== JUAN_NAME) {
    throw new Error(`Largest transfer holder is "${exp.largestTransferThisMonth.userName}", expected "${JUAN_NAME}".`);
  }

  // Invariant 3: Pedro's today anchors are present (both transfers sum to 4,300,000).
  const pedroToday = events.filter(
    (e) => e.documentNumber === PEDRO_DOC && e.transactionType === MONETARY_TRANSACTION_TYPE && e.transactionState === "Exitosa" && e.initialTrxHour.startsWith("09") || e.initialTrxHour.startsWith("11"),
  );
  const todayAnchors = events.filter(
    (e) =>
      e.documentNumber === PEDRO_DOC &&
      e.transactionType === MONETARY_TRANSACTION_TYPE &&
      e.transactionState === "Exitosa" &&
      e.initialYearTrx === now.getUTCFullYear() &&
      e.initialMonthTrx === now.getUTCMonth() + 1 &&
      e.initialDayTrx === now.getUTCDate(),
  );
  void pedroToday; // used implicitly above for anchor existence
  const todayTotal = todayAnchors.reduce((s, e) => s + (e.transactionValule ?? 0), 0);
  const expectedTodayTotal = ANCHOR_AMOUNTS.PEDRO_TODAY_1 + ANCHOR_AMOUNTS.PEDRO_TODAY_2;
  if (todayTotal < expectedTodayTotal) {
    throw new Error(`Pedro's monetary total today is ${todayTotal}, expected at least ${expectedTodayTotal}.`);
  }

  // Invariant 4: user-modification anchor exists.
  const modEvent = events.find((e) => e.operationType === "Modificación" && e.documentNumber === PEDRO_DOC && e.authorizedUserName === CARLOS_NAME);
  if (!modEvent) throw new Error("User-modification anchor for Pedro/Carlos not found; generator broken.");

  // Invariant 5: enum values are valid on all records.
  for (const e of events) {
    if (!CHANNELS.includes(e.channel)) throw new Error(`Bad channel "${e.channel}" on ${e._id}`);
    if (!TRANSACTION_TYPES.includes(e.transactionType)) throw new Error(`Bad transactionType on ${e._id}`);
    if (!TRANSACTION_STATES.includes(e.transactionState)) throw new Error(`Bad transactionState on ${e._id}`);
    if (!DOCUMENT_TYPES.includes(e.documentType)) throw new Error(`Bad documentType on ${e._id}`);
    if (e.isD2B !== "SI" && e.isD2B !== "NO") throw new Error(`Bad isD2B "${e.isD2B}" on ${e._id}`);
    if (e.transactionType !== MONETARY_TRANSACTION_TYPE && (e.transactionValule ?? 0) !== 0) {
      throw new Error(`Non-monetary record ${e._id} has non-zero transactionValule.`);
    }
  }

  // Invariant 7: KB business anchors are present and have correct amounts.
  const kbJefeVentas = events.find((e) => e.authorizedUserName === LUIS_NAME && e.originProductNumber === VENTAS_ACCOUNT && e.transactionType === MONETARY_TRANSACTION_TYPE);
  if (!kbJefeVentas) throw new Error("KB anchor: Jefe de Producción / cuenta ventas not found; generator broken.");
  if ((kbJefeVentas.transactionValule ?? 0) !== ANCHOR_AMOUNTS.KB_JEFE_VENTAS) throw new Error("KB anchor: R001 amount mismatch.");

  const kbDividend = events.find((e) => e.documentNumber === CARMEN_DOC && e.beneficiaryDocumentNumber === ROBERTO_DOC && e.transactionType === MONETARY_TRANSACTION_TYPE);
  if (!kbDividend) throw new Error("KB anchor: dividend payment not found; generator broken.");
  if ((kbDividend.transactionValule ?? 0) !== ANCHOR_AMOUNTS.KB_DIVIDEND) throw new Error("KB anchor: R005 dividend amount mismatch.");

  const kbAnomaly = events.find((e) => e.documentNumber === LUIS_DOC && e.originProductNumber === OPERACION_ACCOUNT && (e.transactionValule ?? 0) === ANCHOR_AMOUNTS.KB_OPERACION_ANOMALY);
  if (!kbAnomaly) throw new Error("KB anchor: Guayabal anomaly not found; generator broken.");

  const kbGuayabal = events.find((e) => e.documentNumber === CARMEN_DOC && e.originCity === "Guayabal" && (e.transactionValule ?? 0) === ANCHOR_AMOUNTS.KB_GUAYABAL_NORMAL);
  if (!kbGuayabal) throw new Error("KB anchor: Guayabal normal transfer not found; generator broken.");

  // Invariant 8: Diego López July 8 aggregate matches expected totals.
  const expectedDiegoTotal = ANCHOR_AMOUNTS.DIEGO_TX1 + ANCHOR_AMOUNTS.DIEGO_TX2 + ANCHOR_AMOUNTS.DIEGO_TX3;
  if (exp.diegoLopezJul8.total !== expectedDiegoTotal) {
    throw new Error(
      `Diego López Jul 8 total is ${exp.diegoLopezJul8.total}, expected ${expectedDiegoTotal}.`,
    );
  }
  if (exp.diegoLopezJul8.count !== 3) {
    throw new Error(`Diego López Jul 8 count is ${exp.diegoLopezJul8.count}, expected 3.`);
  }
  // Near-miss A: "Diego Lopez" (sin tilde) anchor identified by its unique voucher number.
  const noTildeAnchor = events.find((e) => e.transactionVoucherNumber === 801010);
  if (!noTildeAnchor) throw new Error("Diego Lopez (no tilde) near-miss anchor (voucher 801010) missing.");
  if (noTildeAnchor.customerName !== DIEGO_NOTILDE_NAME) throw new Error("Diego Lopez (no tilde) near-miss anchor has wrong customerName.");
  // Near-miss B: Diego López on Jul 9 anchor identified by its unique voucher number.
  const diegoJul9Anchor = events.find((e) => e.transactionVoucherNumber === 801009);
  if (!diegoJul9Anchor) throw new Error("Diego López Jul 9 near-miss anchor (voucher 801009) missing.");
  if (diegoJul9Anchor.initialDayTrx !== DIEGO_DAY_9) throw new Error("Diego López Jul 9 anchor has wrong day.");

  // Invariant 6: per-customer totals sum to the global successful monetary total.
  const global = events.filter((e) => e.transactionType === MONETARY_TRANSACTION_TYPE && e.transactionState === "Exitosa").reduce((s, e) => s + (e.transactionValule ?? 0), 0);
  const perCustomer = CUSTOMERS.reduce((s, c) => s + successfulTransferTotal(events, c.documentNumber), 0);
  if (perCustomer !== global) {
    throw new Error(`Per-customer totals (${perCustomer}) do not sum to global total (${global}). Unknown documentNumber in filler?`);
  }

  return events;
}
