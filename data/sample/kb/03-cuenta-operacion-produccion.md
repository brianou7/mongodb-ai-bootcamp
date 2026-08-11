# Política de cuenta de operación y producción

## Objetivo

Centralizar los recursos destinados a la fabricación de tamales y a los gastos operativos asociados a producción.

## Responsable

El **Jefe de producción** es el rol autorizado para gestionar esta cuenta.

## Gastos observados en los ciclos

El modelo de costos registra conceptos como:

- Carne.
- Pollo.
- Legumbres/verduras.
- Maíz.
- Arroz.
- Hojas.
- Cabuya.
- Bolsas/empaques.
- Guantes.
- Detergente.
- Baldes.
- Transporte.
- Otros insumos de producción.

## Evidencia documental

En los ciclos se registra una columna `Soporte`, con valores como `si`, `no`, `factura electronica` u observaciones.

Por tanto, el agente debe considerar la existencia de soporte como un atributo relevante para auditoría.

### Regla

Si una actividad corresponde a un gasto de producción y la traza/documentación asociada indica que no existe soporte:

→ **ALERTA** si la política de soporte obligatorio no ha sido formalizada.

→ **NO CUMPLE** únicamente si el negocio establece formalmente que todo gasto debe contar con soporte.

## Regla de cuenta

Un gasto de producción pagado desde la cuenta de ventas:

→ **NO CUMPLE** por separación de cuentas.

Un gasto de producción pagado desde la cuenta de operación:

→ **CUMPLE** respecto de la cuenta, sujeto a las demás validaciones.

## Transferencias

Las transferencias hacia la cuenta de operación deben interpretarse como movimientos de financiación de la operación y no como gasto por sí mismas.

El agente no debe contabilizar una transferencia interna como costo de producción sin evidencia del gasto final.
