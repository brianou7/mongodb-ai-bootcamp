# Política de ciclos de producción

## Concepto

La producción se administra mediante **ciclos de producción**.

Cada ciclo contiene, según el modelo:

- Productos fabricados.
- Cantidades.
- Ventas.
- Costos de insumos.
- Precio de venta promedio.
- Ventas proyectadas.
- Utilidad bruta.
- Distribución.
- Operación.
- Pagos.
- Consignación.
- Excedente o déficit de materia prima.
- Observaciones.

## Identificación

Los ciclos están numerados, por ejemplo:

- Ciclo 17.
- Ciclo 18.
- ...
- Ciclo 28.
- Ciclos 29 y 30 aparecen agrupados en el modelo.

## Regla de asociación

Un gasto de producción debe poder asociarse, cuando sea posible, con:

- un ciclo,
- una compra/insumo,
- una fecha,
- un concepto,
- y un valor.

Si la traza bancaria no contiene suficiente información para asociar una operación a un ciclo:

→ **ALERTA: ciclo no identificable**.

## Consignaciones

En los ciclos aparecen valores de `Consignación`, por ejemplo:

- $1.500.000 en varios ciclos.
- $2.400.000 en ciclos posteriores.
- $3.000.000 en el ciclo 28.

El agente no debe asumir que existe un monto fijo universal de consignación. El monto debe validarse contra el ciclo correspondiente.

## Excedentes y déficits

El modelo registra:

- `Sobrante` / `Excedente`.
- `Faltante` / `Déficit`.

Estos valores pueden modificar el pago final del ciclo.

### Regla

Una diferencia entre el valor calculado de operación y el valor efectivamente pagado no debe marcarse automáticamente como fraude o error.

Debe revisarse si existe:

- excedente de materia prima,
- déficit de materia prima,
- deducciones,
- otros conceptos explícitos del cierre del ciclo.

## Regla de cierre

Antes de validar un pago relacionado con un ciclo, el agente debe intentar identificar:

1. ciclo,
2. valor calculado,
3. ajustes,
4. valor final a pagar,
5. beneficiario,
6. cuenta de origen.
