# Política de límites monetarios diarios

## 1. Propósito

Establecer referencias cuantitativas para analizar las actividades de movimiento de dinero de Tamales de mi abuela a partir del comportamiento histórico de ventas registrado por día.

Estos límites tienen dos usos:

1. Control preventivo de movimientos.
2. Detección de actividades atípicas en las trazas bancarias.

**Importante:** estos valores son límites de control recomendados derivados de la información histórica de ventas. No representan límites impuestos por el banco ni sustituyen una autorización formal de los socios.

## 2. Fuente analizada

Se analizaron los registros de ventas de:

- Sede Envigado: 01/07/2025 a 19/06/2026.
- Sede Guayabal: 15/02/2026 a 09/08/2026.

Se consideraron únicamente registros con fecha y valor de venta identificables.

### Resultados diarios

| Sede | Mediana diaria | P75 | P90 | P95 | P99 | Máximo observado |
|---|---:|---:|---:|---:|---:|---:|
| Envigado | $138.500 | $263.500 | $373.000 | $460.425 | $673.450 | $1.235.500 |
| Guayabal | $534.850 | $771.225 | $1.159.970 | $1.384.880 | $1.796.580 | $2.227.600 |

## 3. Niveles de control

### Nivel normal

Un movimiento de dinero relacionado con ventas cuyo valor sea igual o inferior al **P90 de ventas diarias de la sede** se considera dentro del rango habitual desde el punto de vista cuantitativo.

- Envigado: hasta $373.000.
- Guayabal: hasta $1.159.970.

Esto no significa que el movimiento esté automáticamente autorizado. Deben validarse rol, cuenta, concepto y finalidad.

### Nivel de revisión

Movimiento superior al P90 y hasta el P99:

- Envigado: > $373.000 y ≤ $673.450.
- Guayabal: > $1.159.970 y ≤ $1.796.580.

→ **ALERTA MEDIO**.

Debe verificarse el concepto, beneficiario y relación con las ventas o con una obligación del negocio.

### Nivel alto

Movimiento superior al P99 y hasta el máximo histórico observado:

- Envigado: > $673.450 y ≤ $1.235.500.
- Guayabal: > $1.796.580 y ≤ $2.227.600.

→ **ALERTA ALTO**.

Debe existir una justificación identificable en la traza.

### Nivel crítico cuantitativo

Movimiento superior al máximo diario histórico de ventas de la sede:

- Envigado: > $1.235.500.
- Guayabal: > $2.227.600.

→ **ALERTA CRÍTICA**.

La actividad requiere revisión manual y no debe considerarse normal únicamente por existir saldo disponible.

## 4. Regla global

Cuando no sea posible determinar la sede, utilizar inicialmente como referencia el comportamiento consolidado:

- P90: $996.300.
- P95: $1.216.100.
- P99: $1.703.700.
- Máximo observado: $2.227.600.

Si posteriormente se identifica la sede, debe aplicarse el límite específico de esa sede.

## 5. Regla fundamental

El tamaño de una venta diaria **no constituye por sí mismo el límite permitido para una transferencia o pago**.

Los percentiles sirven para detectar anomalías.

La autorización financiera debe determinarse por:

`rol + cuenta + concepto + beneficiario + finalidad + soporte + ciclo/obligación`

## 6. Actualización

Los límites deben recalcularse periódicamente porque el negocio está creciendo y el comportamiento de ventas cambia.

Se recomienda recalcularlos al menos cada trimestre o cuando el volumen de ventas cambie de forma significativa.
