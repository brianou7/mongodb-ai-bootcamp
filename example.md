# Ejemplos de uso — Agente Galatea

Comandos listos para ejecutar contra los datos cargados en `galatea-central-repository`.

## Sintaxis general

```bash
npm run dev -- --pattern <rag|structured|hybrid> --thread <id> --user <id> "tu pregunta"
```

| Parámetro | Descripción |
|---|---|
| `--pattern hybrid` | Usa KB + datos (recomendado para análisis de cumplimiento) |
| `--pattern structured` | Solo consulta MongoDB (ideal para cifras, rankings, totales) |
| `--pattern rag` | Solo busca en la base de conocimiento (ideal para políticas y reglas) |
| `--thread` | Mismo valor = conversación continua (memoria corta por sesión) |
| `--user` | Mismo valor en distintos threads = memoria larga persiste entre sesiones |

---

## Actividad bancaria — Pedro Picapiedra

```bash
# ¿Cuánto movió hoy?
# Respuesta esperada: $2.500.000 + $1.800.000 = $4.300.000 COP (2 transferencias, canal APP)
npm run dev -- --pattern structured --thread pedro1 --user analyst_1 "¿Cuánto dinero movió hoy Pedro Picapiedra?"

# ¿Qué hizo ayer?
# Respuesta esperada: inicio de sesión 08:28, consulta de saldo 08:35, transferencia $850.000 a las 09:15
npm run dev -- --pattern hybrid --thread pedro2 --user analyst_1 "¿Qué actividades realizó Pedro Picapiedra ayer?"

# ¿Quién tocó su cuenta esta semana?
# Respuesta esperada: Pedro Picapiedra (directo) y Carlos Bedoya Martinez (delegado, hace 3 días)
npm run dev -- --pattern structured --thread pedro3 --user analyst_1 "¿Quién realizó movimientos en la cuenta 51134450001 durante la última semana?"
```

---

## Rankings y totales

```bash
# Mayor transferencia del mes
# Respuesta esperada: Juan Garcia Restrepo, $45.000.000 COP, canal NEG
npm run dev -- --pattern structured --thread rank1 --user analyst_1 "¿Qué usuario realizó la transferencia de mayor valor este mes?"

# Modificación de usuarios autorizados
# Respuesta esperada: Pedro Picapiedra modificó a Carlos Bedoya Martinez hace 4 días, código 0510
npm run dev -- --pattern structured --thread rank2 --user analyst_1 "¿Quién modificó los usuarios autorizados para aprobar pagos?"
```

---

## Anomalías en delegados

```bash
# Actividad nocturna sospechosa
# Respuesta esperada: Carlos Bedoya Martinez, $18.500.000 a las 02:30 AM, IP 200.118.47.220,
#                     mismo delegado preparó y aprobó sin segunda firma (violación de control dual)
npm run dev -- --pattern hybrid --thread anomalia1 --user analyst_1 "¿Existen actividades inusuales en los accesos de los delegados?"
```

---

## Tamales de mi abuela — Violaciones de política

```bash
# R001: Jefe de Producción operando cuenta de ventas
# Respuesta esperada: Luis Herrera Cano operó la cuenta de ventas (28734590123)
#                     el 2026-08-05 por $350.000, sede Envigado — NO CUMPLE R001
npm run dev -- --pattern hybrid --thread kb1 --user analyst_1 "¿Realizó el Jefe de Producción algún movimiento en la cuenta de ventas esta semana?"

# R005: Posible pago de dividendos (política vigente: Dividendos = $0)
# Respuesta esperada: transferencia de $620.000 el 2026-07-30 hacia Roberto Salazar Pinto,
#                     concepto "Distribución de utilidades socios" — NO CUMPLE R005
npm run dev -- --pattern hybrid --thread kb2 --user analyst_1 "¿Hay transferencias desde la cuenta de ventas que parezcan pago de dividendos?"

# Anomalía cuantitativa — Guayabal supera P99
# Respuesta esperada: Luis Herrera Cano, $2.100.000 desde cuenta de operación,
#                     sede Guayabal, 2026-07-27 — supera P99 ($1.796.580) → ALERTA ALTA
npm run dev -- --pattern hybrid --thread kb3 --user analyst_1 "¿Qué pagos de producción superaron el límite P99 de la sede Guayabal en los últimos 30 días?"

# Comparación de sedes
# Respuesta esperada: $1.050.000 en Guayabal = nivel normal (< P90 $1.159.970);
#                     ese mismo monto en Envigado sería ALERTA ALTO (> P99 $673.450)
npm run dev -- --pattern hybrid --thread kb4 --user analyst_1 "¿Cuál es la diferencia entre los montos de movimientos de la sede Envigado y la sede Guayabal?"
```

---

## Políticas y reglas (solo KB)

```bash
# ¿Quién puede operar qué cuenta?
npm run dev -- --pattern rag --thread pol1 --user analyst_1 "¿Qué roles están autorizados para operar la cuenta de ventas?"

# Umbral de control dual
npm run dev -- --pattern rag --thread pol2 --user analyst_1 "¿Cuál es el umbral de control dual para transferencias?"

# Límites por sede
npm run dev -- --pattern rag --thread pol3 --user analyst_1 "¿Cuáles son los límites P90 y P99 para la sede Guayabal?"

# Política de dividendos
npm run dev -- --pattern rag --thread pol4 --user analyst_1 "¿Está permitido el pago de dividendos actualmente?"
```

---

## Memoria entre mensajes (mismo thread)

```bash
# Turno 1: presentarse
npm run dev -- --pattern hybrid --thread sesion_demo --user gerente_1 "Mi nombre es Carmen y soy Socia del negocio Tamales de mi abuela"

# Turno 2: el agente debe recordar quién es (misma sesión)
npm run dev -- --pattern hybrid --thread sesion_demo --user gerente_1 "¿Recuerdas quién soy y en qué negocio trabajo?"

# Turno 3 (thread diferente, mismo user): la memoria larga persiste
npm run dev -- --pattern hybrid --thread nueva_sesion --user gerente_1 "¿En qué negocio trabajo?"
```

---

## Escenario de demo completo (sugerido)

Secuencia recomendada para una presentación de 5 minutos:

```bash
# 1. Mostrar que el agente consulta datos estructurados
npm run dev -- --pattern structured --thread demo --user presenter "¿Cuánto dinero movió hoy Pedro Picapiedra?"

# 2. Mostrar que recupera conocimiento de la KB
npm run dev -- --pattern rag --thread demo --user presenter "¿Qué roles pueden operar la cuenta de ventas?"

# 3. Mostrar análisis híbrido con veredicto de cumplimiento
npm run dev -- --pattern hybrid --thread demo --user presenter "¿Realizó el Jefe de Producción algún movimiento en la cuenta de ventas esta semana?"

# 4. Mostrar detección de anomalía cuantitativa
npm run dev -- --pattern hybrid --thread demo --user presenter "¿Qué pagos superaron el P99 de Guayabal en los últimos 30 días?"

# 5. Mostrar memoria: el agente recuerda el contexto de la sesión
npm run dev -- --pattern hybrid --thread demo --user presenter "¿Hay otras cuentas con actividad sospechosa similar?"
```
