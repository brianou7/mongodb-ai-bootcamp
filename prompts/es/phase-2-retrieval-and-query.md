# Prompts de la Fase 2: Recuperación y consulta inteligentes (Checkpoint 2)

Objetivo: resultados correctos y respaldados por evidencia para tus preguntas de muestra. Ver [`../../HOW-TO-USE.es.md`](../../HOW-TO-USE.es.md#fase-2-recuperación-y-consulta-inteligentes-checkpoint-2).

Usa los prompts de tu patrón. Verifica con `npm run verify` y con revisiones puntuales vía `npm run dev`.

---

## Prompt (RAG): mejorar la calidad de la recuperación

```
Nuestras respuestas RAG están [DESCRIBE EL PROBLEMA: no encuentran el pasaje correcto /
citan la sección equivocada / son demasiado genéricas]. Ayúdame a mejorar la calidad de la
recuperación:
1. Revisa el chunking en data/load.ts para nuestros documentos y sugiere una división
   mejor si las secciones son demasiado grandes o demasiado pequeñas.
2. Sugiere valores para RETRIEVAL_TOP_K y RERANK_TOP_K según el tamaño de nuestro corpus y
   explica el compromiso entre ambos.
3. Confirma que cada pasaje devuelto conserva su cita de source y section, y que el orden
   tras el reranking pone primero el pasaje más relevante para estas preguntas:
   [LISTA 2-3 PREGUNTAS DE MUESTRA].
4. Antes de seguir afinando números, dime si otra capacidad de Voyage resolvería esto de
   raíz: embeddings contextualizados (voyage-context-4) si los pasajes que fallan dependen
   de contexto que está fuera de su propio chunk, un modelo de dominio (voyage-code-3,
   voyage-law-2, voyage-finance-2) si nuestro vocabulario es especializado, rerank-2.5 con
   una instrucción si el orden queda cerca pero mal, o rerank-2.5-lite si el reranking es
   nuestro costo de latencia. Dime cuál elegirías para nuestro corpus y por qué.
Haz un cambio a la vez, y vuelve a ejecutar npm run load solo si cambió el chunking.
```

## Prompt (structured): lograr consultas verificablemente correctas

```
Ayúdame a que structured_query sea correcto para estas preguntas de muestra:
[LISTA 3-5 PREGUNTAS DE MUESTRA CON LA RESPUESTA QUE ESPERAS].

1. Mejora la descripción en src/query/schema.ts para que el modelo produzca de forma
   confiable la agregación correcta (aclara el significado de los campos, las unidades, los
   valores de los enums y cómo manejar fechas). Mantén esa descripción en inglés.
2. Para cada pregunta, ejecútala con npm run dev y revisa los registros devueltos, la
   explicación en lenguaje natural y el pipeline. Si una consulta sale mal, dime si el
   arreglo va en la descripción del esquema o en los datos.
3. Confirma que nuestros datos sintéticos son internamente consistentes con esas respuestas.
No agregues validación ni allowlists a la herramienta de consulta; mantenla simple según
CLAUDE.md.
```

## Prompt (híbrido): que ambas vías aporten

```
Para nuestro caso de uso híbrido quiero una sola respuesta que use tanto la política
recuperada como una consulta estructurada. Escenario de muestra: "¿Cuánto dinero movió
Diego López en transferencias el 8 de julio de 2026 y está alineado con la política de
límites diarios para cuentas operacionales?"

Usando src/hybrid/hybridTool.ts como plantilla, ayúdame a verificar:

(a) Consulta estructurada trae las transacciones correctas y discrimina casos cercanos:
    - Principal: authorizedUserName="Diego López", timestamp=8 de julio de 2026,
      transactionType="Monetaria", códigos de transferencia (ej. "0320")
    - Devuelve: monto total COP movido, cantidad de transacciones, canales y horas usadas
    - Caso cercano: agregar registros para "Diego Lopez" (sin tilde) o transferencias de Diego
      el 9 de julio para confirmar que la consulta filtra correctamente, no solo devuelve la única coincidencia
    
(b) Recuperación de base de conocimiento cita los pasajes correctos y discrimina:
    - Documento 15 (politica-movimientos-cuenta-operacion) para reglas de cuentas operacionales
    - Documento 11 (politica-limites-monetarios-diarios) para umbrales diarios
    - Extrae: límites diarios, horas permitidas, restricciones por tipo de usuario/cuenta
    - Caso cercano: Documento 14 (politica-movimientos-cuenta-ventas) para cuentas ventas debe
      ranquear menor; confirma que la recuperación discrimina por tipo de cuenta
    
(c) Assess reconcilia con lógica de agregación:
    - ¿El total está dentro del límite diario para ese usuario y tipo de cuenta?
    - ¿Hay patrones sospechosos (concentración, fuera de horario, transferencia muy grande)?
    - Salida: CONSISTENT (alineado con política), INCONSISTENT (excede límites), o
      NEEDS_REVIEW (borderline o patrón detectado)
    - Caso límite: si Diego movió exactamente el límite → NEEDS_REVIEW
    
Muéstrame en qué punto entra el resultado de cada vía al prompt final y confirma que el
veredicto esté fundamentado tanto en el resultado de la consulta como en la cita de política.
```

## Prompt: adaptar las verificaciones

```
Actualiza scripts/verify.ts para que el Checkpoint 2 revise nuestros datos en lugar de los
de ejemplo:

Para RAG: que recuperación discrimine documentos cercanos en
"¿Cuál es el límite diario de transferencias para cuentas operacionales?"
→ debe citar Documento 15, NO Documento 14 (que habla de cuentas ventas)
→ confirma que ranquea Documento 15 primero aunque Documento 14 mencione "límite" y "cuenta"

Para structured_query: agregaciones devuelven resultados correctos para
"¿Cuántas transferencias realizó Diego López el 8 de julio de 2026 y cuál fue el monto total?"
→ debe retornar COUNT (agregación), SUM de monto COP, explicación del pipeline
→ prueba también: "Ranquea usuarios por monto total COP transferido el 8 de julio" (agregación con orden)

Para híbrido: ambas vías aporten y manejen límites en
"¿Cuánto dinero movió Diego López en transferencias el 8 de julio de 2026 y está alineado 
con la política de límites diarios para cuentas operacionales?"
→ structured_query devuelve cifras, retrieval cita límites, assess emite CONSISTENT/INCONSISTENT/NEEDS_REVIEW
→ caso límite: si Diego movió exactamente el límite → NEEDS_REVIEW (no CONSISTENT)
→ discriminación: si Diego movió menos que límite, límite existe, sin patrones → CONSISTENT

Basa los valores esperados en las expectations que exporta nuestro generador, no en 
suposiciones escritas a mano. Anota cualquier pregunta que falle en una lista para herramientas
de Fase 3. Ejecuta npm run verify y reporta qué pasa.
```

## Ideas para probar en esta fase

- Agrega un par de documentos o registros "casi correctos" para que la recuperación y las consultas tengan que discriminar, no solo devolver la única coincidencia.
- Para agentes estructurados, prueba una agregación (un conteo, una suma, un ranking), no solo una búsqueda puntual.
- Anota cualquier pregunta que todavía falle: es buena candidata para una herramienta dedicada en la Fase 3.
