# Base de conocimiento de políticas — Tamales de mi abuela

## Propósito

Esta base define las políticas operacionales que deben utilizarse para analizar la trazabilidad de actividades realizadas sobre las cuentas bancarias del negocio.

El objetivo del agente es determinar si una actividad observada en la banca empresarial es:

- **CUMPLE**: consistente con las políticas conocidas.
- **NO CUMPLE**: contradice una política explícita.
- **ALERTA**: requiere información adicional para determinar cumplimiento.
- **NO EVALUABLE**: la traza no contiene información suficiente.

## Alcance

Aplica principalmente a:

1. Cuenta de ventas.
2. Cuenta de operación y producción.
3. Roles de Socios.
4. Rol de Jefe de producción.
5. Compras y gastos de producción.
6. Pagos derivados de ciclos de producción.
7. Distribución de resultados y dividendos.

## Fuentes de autoridad

### Configuración actual declarada por el negocio

- Existen dos cuentas de depósito:
  - **Cuenta de ventas**: ingresos por ventas y pagos asociados al punto de venta.
  - **Cuenta de operación**: gastos de operación y producción.
- Los **Socios** pueden gestionar la cuenta de ventas.
- El **Jefe de producción** puede gestionar la cuenta de operación.

### Modelo histórico de costos

El archivo de referencia contiene los modelos de costos de los ciclos de producción, incluyendo costos de insumos, distribución de utilidad, operación, pagos, consignaciones, excedentes y déficits de materia prima.

> Importante: cuando una regla no está explícitamente definida en las fuentes, el agente debe marcarla como `ALERTA` y no inventar límites, montos o autorizaciones.

## Documentos

- `01-roles-y-cuentas.md`
- `02-cuenta-ventas.md`
- `03-cuenta-operacion-produccion.md`
- `04-ciclos-produccion.md`
- `05-compras-gastos-y-soportes.md`
- `06-liquidacion-y-pagos-ciclo.md`
- `07-dividendos-y-distribucion-resultados.md`
- `08-reglas-analisis-trazas.md`
- `09-excepciones-y-severidad.md`
- `10-diccionario-datos-agente.md`
