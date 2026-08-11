# Roles y cuentas

## 1. Cuentas bancarias

### Cuenta de ventas

Propósito:

- Recibir ingresos provenientes de ventas.
- Realizar pagos asociados al punto de venta.

Responsable autorizado:

- **Socios**.

El Jefe de producción no debe operar esta cuenta salvo que exista una autorización adicional que no está definida en la política actual.

### Cuenta de operación y producción

Propósito:

- Recibir/gestionar recursos destinados a operación.
- Pagar gastos asociados a producción y operación.

Responsable autorizado:

- **Jefe de producción**.

Los Socios no deben operar esta cuenta salvo autorización adicional no definida en la política actual.

## 2. Matriz de autorización

| Rol | Cuenta ventas | Cuenta operación |
|---|---|---|
| Socios | AUTORIZADO | NO AUTORIZADO* |
| Jefe de producción | NO AUTORIZADO* | AUTORIZADO |

`*` La fuente no define excepciones. Si existe una excepción formal, debe incorporarse a la base de conocimiento antes de usarla como regla.

## 3. Regla de trazabilidad

Para cada actividad bancaria, el agente debe comparar:

`rol del ejecutor → cuenta utilizada → tipo de actividad → finalidad → ciclo asociado`

Una actividad debe generar alerta cuando el rol no corresponda a la cuenta utilizada.

## 4. Actividades bancarias relevantes

La herramienta bancaria puede registrar actividades como:

- Consulta de saldos.
- Transferencias.
- Pagos.
- Otras actividades bancarias.

No todas las actividades tienen el mismo nivel de riesgo.

Una consulta de saldo fuera de la cuenta asignada debe tratarse como **ALERTA DE AUTORIZACIÓN**, mientras que una transferencia o pago no autorizado debe tratarse como **NO CUMPLE** si la traza permite identificar inequívocamente la cuenta y el rol.
