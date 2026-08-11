# Phase 2 Prompts: Intelligent Retrieval and Querying (Checkpoint 2)

Goal: correct, evidence-backed results for your sample queries. See [`../../HOW-TO-USE.md`](../../HOW-TO-USE.md#phase-2-intelligent-retrieval-and-querying-checkpoint-2).

Use the prompts for your pattern. Verify with `npm run verify` and spot-checks via `npm run dev`.

---

## Prompt (RAG): improve retrieval quality

```
My RAG answers are [DESCRIBE THE PROBLEM: missing the right passage / citing the wrong
section / too generic]. Help me improve retrieval quality:
1. Review chunking in data/load.ts for our documents and suggest a better split if
   sections are too big or too small.
2. Suggest values for RETRIEVAL_TOP_K and RERANK_TOP_K for our corpus size and explain
   the trade-off.
3. Confirm every returned passage keeps a source and section citation, and that the
   reranked order puts the most relevant passage first for these questions:
   [LIST 2-3 SAMPLE QUESTIONS].
4. Before tuning numbers further, tell me whether a different Voyage capability would fix
   this outright: contextualized chunk embeddings (voyage-context-4) if the losing
   passages depend on context outside their own chunk, a domain model (voyage-code-3,
   voyage-law-2, voyage-finance-2) if our vocabulary is specialized, rerank-2.5 with an
   instruction if the ordering is close but wrong, or rerank-2.5-lite if reranking is our
   latency cost. Say which one you would pick for our corpus and why.
Make one change at a time and re-run npm run load only if chunking changed.
```

## Prompt (structured): make queries verifiable correct

```
Help me make structured_query correct for these sample questions:
[LIST 3-5 SAMPLE QUESTIONS WITH THE ANSWER YOU EXPECT].

1. Improve the description in src/query/schema.ts so the model reliably produces the
   right aggregation (clarify field meanings, units, enum values, and how to handle
   dates).
2. For each question, run it via npm run dev and check the returned records, the
   plain-language explanation, and the pipeline. If a query is wrong, tell me whether
   the fix belongs in the schema description or the data.
3. Confirm our synthetic data is internally consistent for these answers.
Do not add validation or allowlists to the query tool; keep it simple per CLAUDE.md.
```

## Prompt (hybrid): make both legs contribute

```
For our hybrid use case, I want one answer that uses both retrieved policy and a
structured lookup. Sample scenario: "¿Cuánto dinero movió Diego López en transferencias
el 8 de julio de 2026 y está alineado con la política de límites diarios para cuentas
operacionales?"

Using src/hybrid/hybridTool.ts as the template, help me verify:

(a) Structured query pulls the correct transactions and discriminates near-misses:
    - Primary: authorizedUserName="Diego López", timestamp=July 8 2026, 
      transactionType="Monetaria", transfer codes (e.g. "0320")
    - Returns: total COP amount moved, transaction count, channels and times used
    - Add near-miss test: also have records for "Diego Lopez" (misspelled) or Diego's transfers
      on July 9 to confirm the query filters correctly, not just returns the only match
    
(b) Knowledge base retrieval cites the right policy passages and discriminates near-misses:
    - Document 15 (politica-movimientos-cuenta-operacion) for operational account rules
    - Document 11 (politica-limites-monetarios-diarios) for daily thresholds
    - Extracts: daily limits, allowed hours, user/account type restrictions
    - Add near-miss test: Document 14 (politica-movimientos-cuenta-ventas) for sales accounts
      should rank lower; confirm retrieval discriminates by account type
    
(c) Assess reconciles and grounds the answer with aggregation logic:
    - Is the total within the daily limit for that user and account type?
    - Any suspicious patterns (concentration, off-hours, single large transfer)?
    - Output: CONSISTENT (aligned with policy), INCONSISTENT (exceeds limits), 
      or NEEDS_REVIEW (borderline or pattern detected)
    - Test edge case: what if Diego moved exactly at the limit? → NEEDS_REVIEW
    
Show me where each leg's result enters the final prompt and confirm the verdict is
grounded in both the query result AND the policy citation.
```

## Prompt: adapt the verify checks

```
Update scripts/verify.ts so Checkpoint 2 checks our data instead of the sample data:

For RAG: retrieval discriminates near-miss documents in
"What is the daily transfer limit for operational accounts?"
→ must cite Document 15 (politica-movimientos-cuenta-operacion), not Document 14
→ confirm it ranks Document 15 first despite Document 14 mentioning "limit" and "account"

For structured_query: aggregation returns correct results for
"How many transfers did Diego López execute on July 8, 2026 and total amount?"
→ must return transaction COUNT (aggregation), total COP (SUM), explanation of pipeline
→ test also: "Rank users by total COP transferred on July 8" (ordering aggregation)

For hybrid: both legs contribute and handle edge cases in
"How much money did Diego López move in transfers on July 8, 2026 and is it aligned 
with the daily limit policy for operational accounts?"
→ structured_query returns figures, retrieval cites limits, assess emits CONSISTENT/INCONSISTENT/NEEDS_REVIEW
→ test edge case: if Diego moved exactly at limit → NEEDS_REVIEW (not CONSISTENT)
→ test discrimination: if Diego moved less than limit, limit exists, no suspicious patterns → CONSISTENT

Base the expected values on our generator's exported expectations, not hard-coded
guesses. Note any question that still fails in a list for Phase 3 candidate tools.
Run npm run verify and report what passes.
```

## Ideas to try in this phase

- Add a couple of near-miss documents or records so retrieval and queries have to discriminate, not just return the only match.
- For structured agents, test an aggregation (a count, a sum, a ranking), not just a lookup.
- Note any question that still fails; it is a good candidate for a dedicated tool in Phase 3.
