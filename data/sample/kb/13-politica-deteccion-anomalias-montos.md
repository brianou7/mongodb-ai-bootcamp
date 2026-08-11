# Política de detección de anomalías monetarias

## 1. Objetivo

Detectar movimientos bancarios que sean atípicos frente al comportamiento diario de ventas.

Esta política es de **detección**, no de autorización contable.

## 2. Señales de alerta

El agente debe analizar:

- monto absoluto;
- monto respecto de las ventas del día;
- monto respecto del promedio/mediana;
- acumulado diario;
- frecuencia de movimientos;
- cuenta utilizada;
- rol del actor;
- contraparte;
- concepto;
- fecha;
- relación con ciclo de producción.

## 3. Umbrales por sede

### Envigado

- P90: $373.000.
- P95: $460.425.
- P99: $673.450.
- Máximo histórico: $1.235.500.

### Guayabal

- P90: $1.159.970.
- P95: $1.384.880.
- P99: $1.796.580.
- Máximo histórico: $2.227.600.

## 4. Clasificación

### Normal

Movimiento ≤ P90.

No requiere alerta cuantitativa.

### Observación

P90 < movimiento ≤ P95.

→ **ALERTA BAJA**.

### Revisión

P95 < movimiento ≤ P99.

→ **ALERTA MEDIA**.

### Alto

P99 < movimiento ≤ máximo histórico.

→ **ALERTA ALTA**.

### Crítico

Movimiento > máximo histórico.

→ **ALERTA CRÍTICA**.

## 5. Regla adicional: acumulación de movimientos

El agente no debe analizar únicamente cada transacción de forma aislada.

Debe calcular, cuando los datos estén disponibles:

`monto acumulado del día por cuenta`

y

`monto acumulado del día por actor`

Si varias operaciones pequeñas producen un acumulado atípicamente alto, debe generarse una alerta.

## 6. Fragmentación

Debe generarse una alerta si se detectan múltiples movimientos hacia la misma contraparte durante un período corto que, sumados, superen un umbral de control.

Ejemplo:

- 4 transferencias de $400.000.
- Individualmente pueden parecer normales.
- Acumuladas = $1.600.000.

El agente debe evaluar el acumulado y no únicamente cada operación.

## 7. Relación con ventas del día

Cuando un movimiento se pretenda justificar como salida de dinero proveniente de ventas, calcular:

`ratio = movimiento / ventas verificadas del día`

Interpretación recomendada:

- ≤ 50%: no genera alerta cuantitativa por sí solo.
- > 50% y ≤ 100%: requiere contexto.
- > 100%: alerta; requiere explicar saldo acumulado, financiación o fuente adicional.

Estos porcentajes son reglas de control recomendadas, no límites legales.

## 8. Días sin ventas

Si ventas verificadas = $0 y existe un movimiento significativo desde la cuenta de ventas:

→ **ALERTA ALTA**.

La actividad puede ser legítima si corresponde a:

- saldo acumulado;
- devolución;
- transferencia interna;
- pago previamente autorizado.

## 9. Regla de contexto

Una anomalía monetaria no significa automáticamente incumplimiento.

El agente debe buscar primero una explicación operacional antes de clasificar como `NO CUMPLE`.
