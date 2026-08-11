# Política de compras, gastos y soportes

## Objetivo

Controlar los egresos de producción y permitir su posterior conciliación con los ciclos.

## Categorías

### Insumos

Incluyen, entre otros:

- Carne.
- Pollo.
- Legumbres.
- Maíz.
- Arroz.
- Hojas.
- Cabuya.

### Materiales y consumibles

Incluyen, entre otros:

- Bolsas.
- Guantes.
- Detergente.
- Baldes.
- Desechables.

### Logística

- Transporte.

## Registro mínimo esperado

Cada gasto debería poder asociarse con:

- Fecha.
- Concepto.
- Valor.
- Ciclo de producción.
- Soporte, cuando exista.

## Soporte

El archivo histórico muestra que algunos gastos tienen soporte y otros aparecen marcados como `no`.

Esto demuestra que el negocio actualmente registra explícitamente el estado del soporte, pero la fuente no establece un umbral monetario ni una excepción formal.

Por ello:

- ausencia de soporte → **ALERTA**
- soporte presente → continúa la evaluación
- no inventar un límite mínimo para exigir factura/soporte.

## Detección de anomalías

El agente debe alertar cuando:

- exista un gasto con concepto incompatible con producción;
- haya múltiples pagos similares que parezcan duplicados;
- un gasto aparezca fuera de la ventana temporal del ciclo sin explicación;
- el total de gastos de un ciclo sea muy superior al patrón histórico;
- una compra sea atribuida a un ciclo que ya fue cerrado.

Estas son reglas de auditoría y no necesariamente incumplimientos.
