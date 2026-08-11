# Parámetros técnicos para el agente

## 1. Parámetros estadísticos derivados del archivo de ventas

```yaml
sedes:
  envigado:
    periodo_inicio: "2025-07-01"
    periodo_fin: "2026-06-19"
    p50_ventas_diarias: 138500
    p75_ventas_diarias: 263500
    p90_ventas_diarias: 373000
    p95_ventas_diarias: 460425
    p99_ventas_diarias: 673450
    max_ventas_diarias: 1235500

  guayabal:
    periodo_inicio: "2026-02-15"
    periodo_fin: "2026-08-09"
    p50_ventas_diarias: 534850
    p75_ventas_diarias: 771225
    p90_ventas_diarias: 1159970
    p95_ventas_diarias: 1384880
    p99_ventas_diarias: 1796580
    max_ventas_diarias: 2227600

  global:
    p50_ventas_diarias: 290500
    p75_ventas_diarias: 563700
    p90_ventas_diarias: 996300
    p95_ventas_diarias: 1216100
    p99_ventas_diarias: 1703700
    max_ventas_diarias: 2227600
```

## 2. Clasificador de monto

```text
if monto <= P90:
    NORMAL
elif monto <= P95:
    ALERTA_BAJA
elif monto <= P99:
    ALERTA_MEDIA
elif monto <= MAX:
    ALERTA_ALTA
else:
    ALERTA_CRITICA
```

## 3. Regla de acumulación

Para cada:

- fecha,
- cuenta,
- actor,
- contraparte,

calcular:

`sum(movimientos)`

y aplicar los mismos niveles de control.

## 4. Regla de ratio contra ventas

```text
if ventas_dia == 0 and movimiento > 0:
    ALERTA_ALTA

else:
    ratio = movimiento / ventas_dia

    if ratio <= 0.50:
        NORMAL_CUANTITATIVO
    elif ratio <= 1.00:
        REQUIERE_CONTEXTO
    else:
        ALERTA
```

## 5. Limitación

Estos parámetros fueron calculados con registros de ventas y sirven para control estadístico.

No deben utilizarse para concluir que:

- un pago es legal o ilegal;
- una transferencia está autorizada;
- existe fraude;
- un gasto es correcto;
- un socio actuó indebidamente.

Para esas conclusiones se necesitan las políticas de autorización y el contexto de la actividad.

## 6. Actualización

Los parámetros deben recalcularse cuando:

- se cierre una sede;
- se abra una sede;
- cambie significativamente el volumen de ventas;
- cambie el modelo de negocio;
- se acumulen nuevos datos suficientes.

Dado que Envigado está en proceso de cierre según la información operacional del negocio, sus parámetros deben conservarse como referencia histórica y no utilizarse automáticamente como límites actuales de una sede que ya no opere.
