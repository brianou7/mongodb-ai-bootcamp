# Política de cuenta de ventas

## Objetivo

Mantener separadas las entradas y salidas asociadas a la actividad comercial del negocio respecto de los gastos de producción y operación.

## Ingresos esperados

La cuenta de ventas debe ser la cuenta principal para recibir recursos provenientes de las ventas.

Las fuentes de ventas observadas en el modelo incluyen:

- WhatsApp.
- Local.
- Rappi.
- DiDi.
- Aliados/B2B.

## Egresos permitidos

La cuenta de ventas puede utilizarse para pagos asociados al punto de venta.

Ejemplos conceptuales:

- Gastos directamente asociados a la operación comercial del local.
- Gastos comerciales previamente definidos por el negocio.

## Regla de separación

Un gasto cuyo concepto corresponda claramente a:

- carne,
- pollo,
- legumbres,
- hojas,
- maíz,
- empaques de producción,
- transporte de producción,
- otros insumos o gastos directamente vinculados al ciclo productivo,

debe gestionarse desde la **cuenta de operación**, no desde la cuenta de ventas.

## Regla de rol

Las actividades sobre esta cuenta deben ser realizadas por un **Socio**, según la configuración actual.

## Regla para el agente

Si la traza muestra:

- `cuenta = ventas`
- `rol = jefe de producción`
- `actividad = transferencia/pago`

→ **NO CUMPLE**, salvo que exista una autorización formal registrada.

Si la traza muestra:

- `cuenta = ventas`
- `rol = socio`

→ **CUMPLE** respecto de autorización de rol; todavía debe validarse la finalidad de la operación.

## No confundir

La autorización para operar la cuenta no significa que cualquier concepto sea válido.

El agente debe evaluar por separado:

1. **Quién** ejecutó.
2. **Desde qué cuenta**.
3. **Qué operación** realizó.
4. **Para qué**.
5. **Cuándo**.
6. **Por qué monto**.
