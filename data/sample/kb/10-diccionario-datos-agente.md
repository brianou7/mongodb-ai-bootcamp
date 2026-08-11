# Diccionario de datos para el agente

## Entidades

### Cuenta

Valores actuales:

- `VENTAS`
- `OPERACION_PRODUCCION`

### Rol

Valores actuales:

- `SOCIO`
- `JEFE_PRODUCCION`

### Tipo de actividad

Ejemplos:

- `CONSULTA_SALDO`
- `TRANSFERENCIA`
- `PAGO`

El catálogo exacto de actividades depende de la herramienta bancaria.

### Categoría de gasto

Valores sugeridos a partir de los registros históricos:

- `INSUMOS`
- `MATERIALES`
- `EMPAQUE`
- `TRANSPORTE`
- `SERVICIOS`
- `OPERACION`
- `OTRO`

### Estado de validación

- `CUMPLE`
- `NO_CUMPLE`
- `ALERTA`
- `NO_EVALUABLE`

## Datos de ciclo

- `ciclo_id`
- `fecha_inicio`
- `fecha_fin`
- `tamales_producidos`
- `ventas_proyectadas`
- `ventas_reales`
- `costo_insumos`
- `utilidad_bruta`
- `operacion_calculada`
- `operacion_pagada`
- `otros_productos`
- `excedente_materia_prima`
- `deficit_materia_prima`
- `dividendos`
- `deducciones`
- `consignacion`

## Cálculo de conciliación

Cuando todos los componentes estén disponibles:

`total_pago_esperado = operación_tamales + operación_otros_productos + ajustes`

Los ajustes deben respetar el signo registrado en la liquidación.

## Fuente histórica

Los ciclos de producción muestran ejemplos donde:

- el costo de insumos puede reutilizar inventario sobrante;
- el pago final puede diferir de la operación calculada;
- existen ciclos con déficit o excedente de materia prima;
- algunos ciclos contienen más de un producto.

Por ello el agente no debe utilizar un valor promedio histórico como sustituto de la liquidación específica del ciclo.

## Principio de trazabilidad

Toda conclusión debe poder responder:

> ¿Qué actividad observada, qué política y qué dato del ciclo justifican esta conclusión?
