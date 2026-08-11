# Mi colección estructurada

Completa todas las secciones a continuación, luego ejecuta la **Opción A** desde `prompts/phase-1-foundation.md`. Reemplaza los marcadores entre corchetes. Sé breve y concreto; esta es la especificación a partir de la cual se genera el datos. Al final encontrarás un ejemplo completo (el escenario bancario incluido) como referencia.

---

## Colección

- **Nombre:** `[nombre_colección]`  (debe coincidir con `EVENTS_COLLECTION` en `.env`)
- **Un documento es:** [una oración: ¿un pedido? ¿un ticket de soporte? ¿un envío?]
- **Volumen aproximado para la demo:** [p.ej. ~60 registros]

## Campos

| Campo | Tipo | Notas / unidades |
|---|---|---|
| `_id` | string | id estable, p.ej. `ord_0001` |
| `[campo]` | `[string \| number \| Date \| boolean]` | [significado; para números, la unidad] |
| `[campo]` | | |
| `[campo]` | | |

## Enumeraciones

Lista cada campo cuyo valor proviene de un conjunto fijo, con los valores permitidos.

- `[campo]`: `[VALOR_A]`, `[VALOR_B]`, `[VALOR_C]`
- `[campo]`: `[VALOR_A]`, `[VALOR_B]`

## Unidades y convenciones

[p.ej. los montos se almacenan en unidades menores (centavos); las marcas de tiempo son fechas BSON en UTC; las cantidades son enteros.]

## Reglas de consistencia

Reglas que los datos siempre deben cumplir para que las respuestas sean coherentes.

- [p.ej. un registro con estado `SHIPPED` siempre tiene un `shippedAt` no nulo.]
- [p.ej. `total` es igual a la suma de los montos de sus líneas de detalle.]

## Hechos verificables (los anclas)

Las preguntas específicas que tu demo hará, cada una con la respuesta que los datos deben hacer verdadera. El generador crea un registro para cada una y lo verifica antes de cargar, por lo que estas son las preguntas que puedes demostrar con seguridad.

- [p.ej. "pedido más grande del mes" -> exactamente un pedido de $25,000, con fecha de este mes, y uno mayor de $30,000 del mes pasado para que el filtro por mes sea relevante.]
- [p.ej. "valor total enviado para customer_03" -> una cifra específica a la que suman los montos por registro.]
- [caso borde o ancla opcional, p.ej. un registro que viola una regla para que el agente lo detecte.]

## Registros de muestra (escribe 3 a 5 a mano)

Pega documentos representativos que escribas desde cero. Son datos ficticios, no exportados; anclan las formas de los campos, rangos de valores realistas y la nomenclatura. JSON es el formato más cómodo.

```json
[
  {
    "_id": "ord_0001",
    "...": "..."
  }
]
```

---

## Referencia: el escenario bancario incluido, completo

Así luce un `collection.md` completado, correspondiente a `data/sample/activity_events.ts`.

- **Nombre:** `activity_events`
- **Un documento es:** un evento operacional en un banco (un inicio de sesión, una consulta de saldo, una transferencia, un cambio de usuario).
- **Volumen aproximado:** ~60 registros.

Campos: `_id` (string, `evt_0001`), `userId` / `userName` (string, el actor), `action` (string enum), `amount` (number, unidades menores, distinto de cero solo en transferencias), `channel` (string enum), `status` (string enum), `timestamp` (Date, UTC).

Enumeraciones: `action` = `LOGIN`, `BALANCE_QUERY`, `TRANSFER_INITIATED`, `TRANSFER_APPROVED`, `USER_CREATED`, `USER_MODIFIED`; `channel` = `WEB`, `MOBILE`, `API`, `BRANCH`; `status` = `SUCCESS`, `FAILED`, `PENDING`.

Unidades: `amount` en unidades menores (centavos); `1500000` significa 15,000.00.

Reglas de consistencia: solo `TRANSFER_INITIATED` y `TRANSFER_APPROVED` llevan un `amount` distinto de cero; los totales de transferencias exitosas por usuario suman al total global.

Hechos verificables: "transferencia más grande del mes" es una única transferencia de $25,000.00 con fecha de este mes, con una transferencia mayor de $30,000.00 del mes pasado para que el filtro por mes sea relevante; una violación de control dual donde un mismo operador inicia y aprueba la misma transferencia de alto valor, para la demo híbrida.
