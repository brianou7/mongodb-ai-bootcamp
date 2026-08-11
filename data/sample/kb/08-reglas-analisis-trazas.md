# Reglas de análisis de trazas de actividades

## Objetivo

Convertir las políticas del negocio en reglas que un agente de IA pueda aplicar sobre una traza bancaria.

## Estructura conceptual de una actividad

Una actividad puede analizarse mediante:

- `timestamp`
- `actor`
- `rol`
- `cuenta`
- `tipo_actividad`
- `monto`
- `contraparte`
- `concepto`
- `referencia`
- `ciclo`
- `soporte`
- `resultado`

Cuando un campo no exista, el agente debe indicar que la validación correspondiente no puede realizarse.

## Reglas

### R001 — Rol autorizado para cuenta

**Condición:** el actor opera una cuenta.

**Validación:**
- Socio → cuenta ventas.
- Jefe de producción → cuenta operación.

**Resultado:**
- coincide → CUMPLE
- no coincide → NO CUMPLE
- rol desconocido → ALERTA

### R002 — Separación de gastos

**Condición:** operación es un pago.

Si el concepto es claramente de producción y sale de cuenta ventas:

→ NO CUMPLE.

Si sale de cuenta operación:

→ CUMPLE respecto de separación de cuentas.

### R003 — Transferencia interna

Una transferencia entre las dos cuentas del negocio no debe clasificarse automáticamente como gasto.

→ Requiere análisis del destino y del contexto.

### R004 — Pago de ciclo

Si el pago está asociado a un ciclo:

Comparar contra la liquidación del ciclo.

Validar:

`Operación Tamales + Operación otros productos + ajustes = pago`

### R005 — Dividendos

Si la actividad es dividendo durante un período donde la política indica `Dividendos = 0`:

→ NO CUMPLE.

### R006 — Soporte

Si una actividad corresponde a compra/gasto y la información disponible indica ausencia de soporte:

→ ALERTA.

### R007 — Gasto fuera de ciclo

Si el concepto parece de producción pero está fuera de la ventana temporal del ciclo:

→ ALERTA.

No marcar como incumplimiento sin evidencia de que el gasto no corresponde a inventario o a otro ciclo.

### R008 — Duplicidad

Si existen dos actividades con:

- misma contraparte,
- mismo monto,
- concepto similar,
- fecha próxima,

→ ALERTA DE POSIBLE DUPLICIDAD.

### R009 — Monto no conciliado

Si un pago no coincide con la liquidación y no existe ajuste explicativo:

→ NO CUMPLE.

### R010 — Actividad de consulta

Una consulta de saldo no es un movimiento financiero.

Debe evaluarse principalmente desde el punto de vista de autorización del rol y cuenta.

## Principio de no inferencia

El agente no debe inventar:

- límites monetarios,
- topes diarios,
- horarios permitidos,
- número máximo de transferencias,
- proveedores autorizados,
- necesidad de doble aprobación,

si estas reglas no están definidas en la base de conocimiento.
