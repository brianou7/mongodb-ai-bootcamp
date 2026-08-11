# Excepciones, alertas y severidad

## Niveles

### CRÍTICO

Usar cuando exista evidencia fuerte de una operación incompatible con una política financiera fundamental.

Ejemplos:

- Pago/dividendo no autorizado durante período con dividendos prohibidos.
- Operación financiera ejecutada por un rol explícitamente no autorizado.

### ALTO

Usar cuando exista una desviación financiera que pueda representar un pago incorrecto.

Ejemplos:

- Pago de ciclo que no concilia con la liquidación y no tiene ajuste.
- Gasto de producción pagado desde la cuenta de ventas.

### MEDIO

Usar para inconsistencias que requieren revisión.

Ejemplos:

- Gasto sin soporte.
- Actividad fuera de ventana temporal del ciclo.
- Diferencia de monto posiblemente explicada por un ajuste no encontrado.

### BAJO

Usar para información incompleta sin evidencia de incumplimiento.

Ejemplos:

- No se identifica el ciclo.
- No se identifica el concepto.
- No se puede clasificar la contraparte.

## Formato recomendado de salida del agente

```text
Estado: CUMPLE | NO CUMPLE | ALERTA | NO EVALUABLE
Severidad: CRÍTICO | ALTO | MEDIO | BAJO

Actividad:
- Fecha/hora:
- Actor:
- Rol:
- Cuenta:
- Tipo:
- Monto:
- Concepto:

Política evaluada:
- ID:
- Nombre:

Evidencia:
- ...

Razón:
- ...

Acción recomendada:
- ...
```

## Regla fundamental

El agente debe diferenciar:

1. **Incumplimiento demostrado.**
2. **Posible incumplimiento.**
3. **Información insuficiente.**

Nunca convertir una anomalía estadística en una acusación de incumplimiento sin evidencia.
