import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { bootstrapCredentials } from "../src/credentials";
import { getConfig } from "../src/config";
import { getDb, closeMongoClient } from "../src/db/client";
import { getKbCollection } from "../src/retrieval/vectorStore";
import { getEmbeddings } from "../src/retrieval/embeddings";
import { generateActivityEvents } from "./sample/activity_events";

/**
 * Seed the demo: chunk + embed + index the KB, and insert the synthetic events.
 *
 *   npm run load
 *
 * Safe to re-run: it clears the demo collections first. It creates the Atlas
 * Vector Search index if missing and waits for it to become queryable.
 */

const HERE = dirname(fileURLToPath(import.meta.url));
const KB_DIR = join(HERE, "sample", "kb");

interface Chunk {
  text: string;
  source: string;
  section: string;
}

/** Split a markdown doc into one chunk per `##` section (plus an overview). */
function chunkMarkdown(source: string, text: string): Chunk[] {
  const parts = text.split(/^##\s+/m);
  const chunks: Chunk[] = [];

  const head = parts[0] ?? "";
  const title = head.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? source;
  const introBody = head.replace(/^#\s+.+$/m, "").trim();
  // Prefix every chunk with the document title so the embedding carries
  // that anchor even before contextualized embeddings apply.
  if (introBody)
    chunks.push({ text: `[${title}]\n${introBody}`, source, section: `${title} (overview)` });

  for (let i = 1; i < parts.length; i++) {
    const block = parts[i] ?? "";
    const nl = block.indexOf("\n");
    const heading = (nl === -1 ? block : block.slice(0, nl)).trim();
    const body = (nl === -1 ? "" : block.slice(nl + 1)).trim();
    if (body) chunks.push({ text: `[${title}] ${heading}\n${body}`, source, section: heading });
  }
  return chunks;
}

interface KbRecord {
  text: string;
  source: string;
  section: string;
  embedding: number[];
}

async function loadKnowledgeBase(): Promise<number> {
  const cfg = getConfig();
  const files = (await readdir(KB_DIR)).filter((f) => f.endsWith(".md"));

  // Group chunks by source file so we can send each document's full text as
  // context to /contextualizedembeddings — the endpoint embeds each chunk
  // while the model sees the whole document, resolving cross-section references
  // ("el umbral", "P90") that would otherwise be opaque in isolation.
  const byFile = new Map<string, { chunks: Chunk[]; fullText: string }>();
  for (const file of files) {
    const fullText = await readFile(join(KB_DIR, file), "utf8");
    const chunks = chunkMarkdown(file, fullText);
    if (chunks.length > 0) byFile.set(file, { chunks, fullText });
  }

  const collection = await getKbCollection();
  await collection.deleteMany({});

  const embedder = getEmbeddings();
  const records: KbRecord[] = [];

  for (const [, { chunks, fullText }] of byFile) {
    const texts = chunks.map((c) => c.text);
    const vectors = await embedder.embedChunksWithContext(texts, fullText);
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]!;
      const embedding = vectors[i]!;
      records.push({ text: chunk.text, source: chunk.source, section: chunk.section, embedding });
    }
  }

  if (records.length > 0) {
    await collection.insertMany(records as unknown as Array<Record<string, unknown>>);
  }

  await ensureVectorIndex();
  console.log(`  KB: ${records.length} chunks from ${byFile.size} files into "${cfg.KB_COLLECTION}".`);
  return records.length;
}

async function ensureVectorIndex(): Promise<void> {
  const cfg = getConfig();
  const collection = await getKbCollection();

  const existing = await collection.listSearchIndexes(cfg.VECTOR_INDEX_NAME).toArray();
  if (existing.length === 0) {
    await collection.createSearchIndex({
      name: cfg.VECTOR_INDEX_NAME,
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            path: "embedding",
            numDimensions: cfg.VOYAGE_EMBEDDING_DIMENSIONS,
            similarity: "cosine",
          },
        ],
      },
    });
    console.log(`  Created vector index "${cfg.VECTOR_INDEX_NAME}" (${cfg.VOYAGE_EMBEDDING_DIMENSIONS} dims).`);
  }
  await waitForIndexQueryable(cfg.VECTOR_INDEX_NAME);
}

interface SearchIndexInfo {
  name: string;
  queryable?: boolean;
  status?: string;
}

/** Poll until the search index reports queryable, or time out. */
async function waitForIndexQueryable(name: string, timeoutMs = 180_000): Promise<void> {
  const collection = await getKbCollection();
  const deadline = Date.now() + timeoutMs;
  process.stdout.write("  Waiting for vector index to become queryable");
  while (Date.now() < deadline) {
    const indexes = (await collection.listSearchIndexes(name).toArray()) as unknown as SearchIndexInfo[];
    const idx = indexes[0];
    if (idx?.queryable) {
      process.stdout.write(" ready.\n");
      return;
    }
    process.stdout.write(".");
    await new Promise((r) => setTimeout(r, 3000));
  }
  process.stdout.write("\n");
  throw new Error(`Vector index "${name}" did not become queryable within ${timeoutMs / 1000}s.`);
}

async function loadEvents(): Promise<number> {
  const cfg = getConfig();
  const db = await getDb();
  const collection = db.collection(cfg.EVENTS_COLLECTION);

  await collection.deleteMany({});
  const events = generateActivityEvents(); // asserts internal consistency
  await collection.insertMany(events as unknown as Array<Record<string, unknown>>);

  await collection.createIndex({ userId: 1 });
  await collection.createIndex({ action: 1 });
  await collection.createIndex({ timestamp: 1 });

  console.log(`  Events: ${events.length} documents into "${cfg.EVENTS_COLLECTION}" (+ indexes).`);
  return events.length;
}

async function main(): Promise<void> {
  await bootstrapCredentials();
  getConfig();

  console.log("Loading BuildRel demo data...");
  await loadEvents();
  await loadKnowledgeBase();
  console.log("Done. Next: npm run verify");
}

main()
  .catch((err) => {
    console.error(`\nLoad failed: ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  })
  .finally(() => closeMongoClient());
