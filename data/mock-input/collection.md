# galatea-central-repository — RCC v3.0.0

Colección única del Repositorio Central de Comportamiento (RCC). Cada documento es un evento de transacción registrado por los canales digitales y físicos del banco.

---

## Collection

- **Name:** `galatea-central-repository`  (debe coincidir con `EVENTS_COLLECTION` en `.env`)
- **One document is:** un evento transaccional del cliente en cualquier canal bancario (APP, NEG, SVP): puede ser monetario (transferencia, pago) o no monetario (consulta, modificación de usuario, inscripción).
- **Approximate volume for the demo:** ~500 records

## Fields

| Field | Type | Notes / units |
|---|---|---|
| `_id` | `string` | id estable, e.g. `rcc_00001` |
| `sessionId` | `string` | UUID de sesión del cliente en el canal digital; obligatorio |
| `transactionId` | `string` | UUID único por canal y transacción; obligatorio |
| `initialYearTrx` | `number` | Año de inicio de la transacción, 4 dígitos; obligatorio |
| `initialMonthTrx` | `number` | Mes de inicio, 1–12; obligatorio |
| `initialDayTrx` | `number` | Día de inicio, 1–31; obligatorio |
| `initialTrxHour` | `string` | Hora inicio formato HHmmssSS (8 chars, sin separadores); obligatorio |
| `finalTrxYear` | `number` | Año de fin de la transacción, 4 dígitos; obligatorio |
| `finalTrxMonth` | `number` | Mes de fin, 1–12; obligatorio |
| `finalTrxDay` | `number` | Día de fin, 1–31; obligatorio |
| `finalTrxHour` | `string` | Hora fin formato HHmmssSS (8 chars); obligatorio |
| `transactionCode` | `string` | Código que identifica el tipo de transacción, e.g. `0320`; obligatorio |
| `transactionCodeDesc` | `string` | Descripción legible del código; para monetarias incluye producto e info adicional; obligatorio |
| `responseCode` | `string` | Código de respuesta homologado (cara al cliente); obligatorio |
| `responseCodeDesc` | `string` | Descripción del resultado funcional; obligatorio |
| `technicalCode` | `string` | Código técnico de error de la transacción, e.g. `BP12900037`; obligatorio |
| `channel` | `string` | Siglas del canal en mayúscula; obligatorio. Demo usa APP, NEG, SVP |
| `deviceNameId` | `string` | Dispositivo móvil/web, nombre del punto físico o del aliado; obligatorio |
| `ip` | `string` | Dirección IP separada por puntos; obligatorio |
| `authenticationType` | `string` | Tipo de autenticación: Credenciales / Biometría huella / Biometría faceid; opcional |
| `currency` | `string` | ISO 4217 en mayúsculas: COP / USD / EUR / YEN; opcional |
| `localAmount` | `number` | Monto en COP, decimal 13.2; solo para Monetaria; opcional |
| `internationalAmount` | `number` | Monto en moneda extranjera, decimal 13.2; solo para transferencias internacionales; opcional |
| `establishmentUniqueCode` | `number` | Código del punto físico (ATM, Corresponsal), e.g. `1701`; opcional |
| `cardNumber` | `string` | Últimos 4 dígitos enmascarados de tarjeta, e.g. `***********3819`; opcional |
| `originProductType` | `string` | Tipo de producto origen: CUENTA_DE_AHORRO / CUENTA_CORRIENTES / TARJETA_DE_CREDITO; opcional |
| `originProductNumber` | `string` | Número de producto origen, sin separadores; opcional |
| `destinyProductType` | `string` | Tipo de producto destino: CUENTA_DE_AHORRO / CUENTA_CORRIENTES / TARJETA_DE_CREDITO; opcional |
| `destinyProductNumber` | `string` | Número de producto destino, sin separadores; opcional |
| `destinyProductRelation` | `string` | Relación con cuenta destino: Propia / Inscrita / No inscrita / Otros bancos / Inscrita programada / Programada; opcional |
| `transactionMode` | `string` | Modo: Virtual / Presencial nacional / Presencial internacional / Debito automático; opcional |
| `transactionVoucherNumber` | `number` | Número de comprobante visible al cliente, max 10 dígitos; opcional |
| `destinyBankCode` | `string` | Código SWIFT o nacional del banco destino; opcional |
| `originBankCode` | `string` | Código SWIFT o nacional del banco origen; opcional |
| `agreementCode` | `number` | Código de convenio para pago de facturas; opcional |
| `reference` | `string` | Referencia del pago de factura; opcional |
| `transactionType` | `string` | Monetaria / No monetaria / Administrativa; obligatorio |
| `inputTransactionMode` | `string` | NFC / CONTACTLESS / QR COMPRA / QR TRANS; solo aplica cuando corresponda; opcional |
| `transactionState` | `string` | Estado: Exitosa / Técnicamente exitosa / No exitosa; obligatorio |
| `commission` | `string` | SI / NO; indica si hay comisión; opcional |
| `transactionValule` | `number` | Valor de la transacción en COP, decimal 13.2; solo para Monetaria; opcional |
| `throwbackId` | `number` | 0 = sin reversión, 1 = reversión; aplica para cajeros físicos; opcional |
| `latitude` | `string` | Latitud de la transacción, e.g. `6.2442`; opcional |
| `length` | `string` | Longitud de la transacción, e.g. `-75.5812`; opcional |
| `documentTypeCode` | `string` | Código MDM del tipo de documento, e.g. `TIPDOC_FS001`; obligatorio |
| `documentType` | `string` | Tipo de documento: CC / CD / TI / CE / NIT / PAS / IEPN / IEPJ / FD / RC; obligatorio |
| `documentNumber` | `string` | Número de documento del titular de la cuenta; obligatorio |
| `customerName` | `string` | Nombre completo del cliente, inicial mayúscula; opcional |
| `authorizedUserdocumentTypeCode` | `string` | Código MDM del tipo de documento del usuario autorizado; opcional, aplica para SVE/SVP/Pyme |
| `authorizedUserdocumentType` | `string` | Tipo de documento del usuario autorizado; opcional |
| `authorizedUserdocumentNumber` | `string` | Número de documento del usuario autorizado; opcional |
| `authorizedUserName` | `string` | Nombre del usuario autorizado/delegado; opcional |
| `brandModel` | `string` | Marca-modelo del dispositivo, e.g. `iPhone`, `Samsung`; opcional |
| `osVersion` | `string` | SO del dispositivo: Android / iOS / Windows / Linux; opcional |
| `browser` | `string` | Navegador: Chrome / Safari / Firefox / Mozilla; opcional |
| `mobileOperator` | `string` | Operador móvil: Claro / Tigo / Virgin; opcional |
| `appVersion` | `string` | Versión de la app, e.g. `25.1.0`; opcional |
| `sharedKey` | `string` | ID de clave dinámica / identificador Detect TI; opcional |
| `agreementTermsConditions` | `string` | SI / NO; aceptación de términos y condiciones; opcional |
| `versionTermsConditions` | `string` | Versión de T&C aceptada, e.g. `1.0`; opcional |
| `agreementTermsConditionsDate` | `number` | Fecha de aceptación formato AAAAMMDD, e.g. `20231204`; opcional |
| `excludeITC` | `boolean` | true = no replicar a ITC; false = replicar a ITC; obligatorio |
| `token` | `number` | Campo auxiliar decimal 13.2; desde v1.4.0 usar authenticationTransaction para tipo de autenticación; opcional |
| `changeRate` | `number` | Tasa de cambio para transacciones internacionales, decimal 13.2; opcional |
| `totalBatchRecords` | `number` | Número de registros del lote; decimal 13.2; opcional |
| `value4` | `number` | Campo auxiliar decimal 13.2; opcional |
| `value5` | `number` | Campo auxiliar decimal 13.2; opcional |
| `value6` | `number` | Campo auxiliar decimal 13.2; opcional |
| `isD2B` | `string` | SI / NO mayúsculas; identifica si la transacción está en arquitectura Galatea; obligatorio |
| `serialToken` | `string` | Serial del Hardtoken o ID del Softoken; opcional |
| `entitlement` | `string` | Rol y regla de seguridad del usuario (Admin. Autónoma, Adm compartida); opcional |
| `batchName` | `string` | Nombre del lote de operación; opcional |
| `loadMechanism` | `string` | Tipo de carga de archivo para operaciones batch; opcional |
| `paymentType` | `string` | Tipo de pago: Pago de nomina / Pago a proveedores; opcional |
| `transactionGroup` | `string` | Grupo de transacción según clasificación Entitlement; opcional |
| `targetCurrency` | `string` | Moneda destino ISO 4217: COP / USD / EUR / YEN; opcional |
| `field9` | `string` | Campo auxiliar alfanumérico; opcional |
| `transactionStatusApproval` | `string` | Estado en flujo de aprobación: Aprobado / Rechazado / Preparado / Cancelado; opcional |
| `managementDescription` | `string` | Descripción del resultado de la transacción, e.g. `Rechazado por usuario aprobador`; opcional |
| `transactionTracker` | `string` | ID End-to-End de la transacción; opcional |
| `descriptionFunctions` | `string` | Funciones de inscripción, e.g. `Pago de nómina, Transferencias`; opcional |
| `customizingProductName` | `string` | Nombre personalizado del producto por el cliente; opcional |
| `beneficiaryDocumentType` | `string` | Tipo de documento del beneficiario: CC / CD / TI / CE / NIT / PAS…; opcional |
| `beneficiaryDocumentNumber` | `string` | Número de documento del beneficiario; opcional |
| `beneficiaryName` | `string` | Nombre del beneficiario, inicial mayúscula; opcional |
| `operationType` | `string` | Tipo de operación: Inscripción / Modificación / Eliminación; opcional |
| `originProductDesc` | `string` | Detalle del producto origen (franquicia), e.g. `Visa Platinum`; opcional |
| `destinationProductDesc` | `string` | Detalle del producto destino (franquicia); opcional |
| `destinationBankName` | `string` | Nombre del banco destino, e.g. `Nequi`; opcional |
| `originBankName` | `string` | Nombre del banco origen; opcional |
| `transactionDesc` | `string` | Descripción ampliada de la transacción; opcional |
| `authenticationTransaction` | `string` | Método de autenticación usado: Token / OTP / Biometría huella / Biometría faceid; opcional |
| `entitlementRol` | `string` | Rol profesional del usuario: Titular / Titular Rep Legal; opcional |
| `entitlementPrivilege` | `string` | Privilegio en el canal: Admon Autonomo / Aprobador / Preparador / Preparador/Aprobador / Consultor; opcional |
| `factor` | `number` | Factor aplicado a la operación en cálculos financieros, decimal 5.5, e.g. `1.00001`; opcional |
| `bankCharges` | `string` | Quién asume cargos bancarios: BEN / SHA / OUR; opcional |
| `bankChargesValue` | `number` | Valor de los cargos bancarios, decimal 13.2; opcional |
| `VATBankCharges` | `number` | IVA sobre los cargos bancarios, decimal 13.2; opcional |
| `totalAmountDebited` | `number` | Monto total debitado de la cuenta origen, decimal 13.2; opcional |
| `originatingBankCode2` | `string` | Código bancario origen en formato internacional (IBAN), e.g. `GB63CHAS60161331926819`; opcional |
| `destinationBankCode2` | `string` | Código bancario destino en formato internacional (IBAN); opcional |
| `customTransactionMessage` | `string` | Mensaje personalizado de la transacción, max 150 chars; opcional |
| `reasonTransaction` | `string` | Motivo de la transacción, e.g. `Servicios, transferencias y otros conceptos`; opcional |
| `typeEntity` | `string` | Tipo de entidad involucrada, e.g. `FIC - Fondo de Inversion Colectiva`; opcional |
| `depositNumber` | `string` | Número de depósito relacionado, e.g. `BC123456789`; opcional |
| `administratorId` | `string` | Identificación del administrador de la cuenta; opcional |
| `exchangeNumerals` | `string` | Detalle de numerales cambiarios, e.g. `9999,1234567890123.`; opcional |
| `taxCompliance` | `string` | Declaración de cumplimiento tributario; opcional |
| `customsInformation` | `string` | SI / NO; indica si aplica información de aduana; opcional |
| `customsDocumentNumber` | `string` | Número del documento aduanero; opcional |
| `originBankCountry` | `string` | País del banco origen en mayúsculas, e.g. `COLOMBIA`; opcional |
| `beneficiaryBankCountry` | `string` | País del banco beneficiario en mayúsculas, e.g. `ESTADOS UNIDOS`; opcional |
| `originBankCodeType` | `string` | Tipo de código bancario origen: SWIFT / ABA / etc.; opcional |
| `originBankCode2Type` | `string` | Segundo tipo de código bancario origen: IBAN / etc.; opcional |
| `beneficiaryBankCodeType` | `string` | Tipo de código del banco beneficiario: SWIFT / ABA; opcional |
| `beneficiaryBankCode2Type` | `string` | Segundo tipo de código del banco beneficiario: TRANSIT / IBAN; opcional |
| `originOwnershipType` | `string` | Titularidad en cuenta de origen, e.g. `Propia y único titular`; opcional |
| `beneficiaryOwnershipType` | `string` | Titularidad en cuenta del beneficiario, e.g. `Propia y varios titulares`; opcional |
| `countryResidenceBeneficiary` | `string` | País de residencia del beneficiario en mayúsculas; opcional |
| `countryResidenceOrigin` | `string` | País de residencia del originador en mayúsculas; opcional |
| `originCity` | `string` | Ciudad de origen en mayúsculas, e.g. `MEDELLIN`; opcional |
| `beneficiaryCity` | `string` | Ciudad del beneficiario en mayúsculas, e.g. `MIAMI`; opcional |
| `originAddres` | `string` | Dirección de origen de la transacción; opcional |
| `beneficiaryAddres` | `string` | Dirección del beneficiario; opcional |

## Enums

- `channel`: `APP`, `NEG`, `SVP` *(demo)* — catálogo completo: `APP`, `SVE`, `SVP`, `NEG`, `BALM`, `CB`, `SUC`, `ATM`, `MULTIFUN`, `KIOS`, `H2H`, `SWIFT`, `CONTACC`
- `transactionType`: `Monetaria`, `No monetaria`, `Administrativa`
- `transactionState`: `Exitosa`, `Técnicamente exitosa`, `No exitosa`
- `originProductType` / `destinyProductType`: `CUENTA_DE_AHORRO`, `CUENTA_CORRIENTES`, `TARJETA_DE_CREDITO`
- `documentType` / `beneficiaryDocumentType` / `authorizedUserdocumentType`: `CC`, `CD`, `TI`, `CE`, `NIT`, `PAS`, `IEPN`, `IEPJ`, `FD`, `RC`
- `isD2B`: `SI`, `NO` *(exactamente en mayúsculas — ver validación especial)*
- `commission` / `agreementTermsConditions` / `customsInformation`: `SI`, `NO`
- `throwbackId`: `0` (sin reversión), `1` (reversión)
- `transactionStatusApproval`: `Aprobado`, `Rechazado`, `Preparado`, `Cancelado`
- `operationType`: `Inscripción`, `Modificación`, `Eliminación`
- `destinyProductRelation`: `Propia`, `Inscrita`, `No inscrita`, `Otros bancos`, `Inscrita programada`, `Programada`
- `transactionMode`: `Virtual`, `Presencial nacional`, `Presencial internacional`, `Debito automático`
- `inputTransactionMode`: `NFC`, `CONTACTLESS`, `QR COMPRA`, `QR TRANS`
- `authenticationType` / `authenticationTransaction`: `Credenciales`, `Biometría huella`, `Biometría faceid`, `Token`, `OTP`
- `currency` / `targetCurrency`: `COP`, `USD`, `EUR`, `YEN`
- `bankCharges`: `BEN`, `SHA`, `OUR`
- `entitlementRol`: `Titular`, `Titular Rep Legal`
- `entitlementPrivilege`: `Admon Autonomo`, `Aprobador`, `Preparador`, `Preparador/Aprobador`, `Consultor`

## Units and conventions

- `localAmount` y `transactionValule` están en pesos colombianos (COP), decimal 13.2. No se usan unidades menores (centavos): `2500000.00` = $2,500,000 COP.
- `internationalAmount` y `changeRate` aplican solo cuando `currency` ≠ `COP`.
- Las fechas se almacenan como tres campos numéricos separados (`initialYearTrx`, `initialMonthTrx`, `initialDayTrx`) más la hora como string de 8 caracteres `HHmmssSS` (horas, minutos, segundos, centésimas sin separadores).
- `agreementTermsConditionsDate` es un número entero en formato `AAAAMMDD` (e.g. `20231204`).
- `isD2B` acepta únicamente `"SI"` o `"NO"` en mayúsculas; no acepta booleanos ni minúsculas.
- `excludeITC` es booleano puro (`true` / `false`), no string.
- Coordenadas `latitude` y `length` son strings decimales (e.g. `"6.2442"`, `"-75.5812"`).
- `initialTrxHour` / `finalTrxHour`: el campo `SS` corresponde a centésimas de segundo (no milisegundos).

## Consistency rules

- `transactionValule` y `localAmount` son distinto de cero **solo** cuando `transactionType` = `Monetaria`.
- `internationalAmount` y `changeRate` aparecen juntos y solo cuando `currency` ≠ `COP`.
- `authorizedUserName`, `authorizedUserdocumentNumber`, `authorizedUserdocumentType` y `authorizedUserdocumentTypeCode` se poblán todos o ninguno; aplican en canales SVP/SVE/Pyme.
- `throwbackId` = `1` implica reversión: debe existir una transacción previa con el mismo `originProductNumber` y monto equivalente.
- `transactionStatusApproval` está presente en transacciones de canales NEG/SVP que requieren flujo de aprobación.
- `operationType` solo aparece en transacciones administrativas de inscripción/modificación/eliminación de productos o usuarios.
- `bankChargesValue`, `VATBankCharges` y `totalAmountDebited` acompañan a `bankCharges` en operaciones con cargos explícitos.
- La suma `localAmount` + `bankChargesValue` ≈ `totalAmountDebited` cuando aplica carga de cargos bancarios.

## Verifiable facts (the anchors)

- **¿Cuánto dinero movió hoy Pedro Picapiedra?** → Pedro Picapiedra (CC `79456123`) tiene exactamente **2 transacciones monetarias exitosas el 2026-08-11**: $2,500,000 COP (canal APP, `rcc_00001`) y $1,800,000 COP (canal APP, `rcc_00002`). Total monetario del día: **$4,300,000 COP**. Hay además 1 consulta de saldo (No monetaria) ese mismo día para que el filtro por `transactionType` sea relevante.

- **¿Quién realizó movimientos en mis cuentas durante la última semana?** → En `originProductNumber` `"51134450001"` (cuenta de Pedro), entre el 2026-08-04 y el 2026-08-11 hubo movimientos de **dos actores distintos**: Pedro Picapiedra (directamente, 3 transacciones) y **Carlos Bedoya Martinez** (delegado autorizado, CC `1098765432`, 1 transacción el 2026-08-08). La respuesta debe nombrar ambos actores y sus fechas.

- **¿Qué actividades realizó Pedro durante el día de ayer?** → El 2026-08-10, `customerName` = `"Pedro Picapiedra"` tiene exactamente **3 actividades**: inicio de sesión a las 08:28 (No monetaria), consulta de saldo de tarjeta de crédito a las 08:35 (No monetaria), y transferencia de $850,000 COP a las 09:15 (Monetaria, Exitosa). Una transacción adicional de Pedro existe el 2026-08-09 para que el filtro de fecha sea relevante.

- **¿Quién modificó los usuarios autorizados para aprobar pagos?** → El 2026-08-07, `customerName` = `"Pedro Picapiedra"` (CC `79456123`) ejecutó la transacción con `transactionCode` = `"0510"`, `transactionCodeDesc` = `"Modificación usuario autorizado para aprobación de pagos"`, `operationType` = `"Modificación"`, `authorizedUserName` = `"Carlos Bedoya Martinez"` (CC `1098765432`), canal NEG, estado Exitosa. Es el **único** registro de modificación de usuario autorizado en los últimos 30 días.

- **¿Qué usuario realizó la transferencia de mayor valor este mes?** → **Juan Garcia Restrepo** (CC `1045678902`) realizó la transferencia de mayor valor en agosto 2026: **$45,000,000 COP** el 2026-08-03 (`rcc_00003`, canal NEG). La segunda más alta es de $38,000,000 COP por **Ana Gutierrez Lopez** (CC `1023456789`) el 2026-08-05 (`rcc_00006`, canal SVP), para que el ranking sea inequívoco.

- **¿Existen actividades inusuales en los accesos de mis delegados?** → **Carlos Bedoya Martinez** (delegado de Pedro Picapiedra) realizó una transferencia de **$18,500,000 COP a las 02:30 AM del 2026-08-08** (`rcc_00004`, canal SVP) desde la IP `200.118.47.220` (diferente a la IP habitual `181.60.14.137` de las transacciones de Pedro). Adicionalmente, ese mismo delegado tanto inició (`authorizedUserName`) como figura como único aprobador de esa misma transacción, configurando una **violación de control dual** (un solo operador inicia y aprueba sin segunda firma).

## Sample records (hand-author 3 to 5)

```json
[
  {
    "_id": "rcc_00001",
    "sessionId": "f6127e10-f3e9-11ed-4d8e-438c4c9f4da6",
    "transactionId": "20e34c70-66f2-11ee-43a5-478c420001b0",
    "initialYearTrx": 2026,
    "initialMonthTrx": 8,
    "initialDayTrx": 11,
    "initialTrxHour": "09150000",
    "finalTrxYear": 2026,
    "finalTrxMonth": 8,
    "finalTrxDay": 11,
    "finalTrxHour": "09150312",
    "transactionCode": "0320",
    "transactionCodeDesc": "Transferencia entre cuentas propias cuenta de ahorros",
    "responseCode": "000",
    "responseCodeDesc": "Transacción aprobada",
    "technicalCode": "BP00000000",
    "channel": "APP",
    "deviceNameId": "Dispositivo móvil",
    "ip": "181.60.14.137",
    "authenticationType": "Biometría huella",
    "currency": "COP",
    "localAmount": 2500000.00,
    "originProductType": "CUENTA_DE_AHORRO",
    "originProductNumber": "51134450001",
    "destinyProductType": "CUENTA_DE_AHORRO",
    "destinyProductNumber": "31189907865",
    "destinyProductRelation": "Propia",
    "transactionMode": "Virtual",
    "transactionVoucherNumber": 724428,
    "transactionType": "Monetaria",
    "transactionState": "Exitosa",
    "commission": "NO",
    "transactionValule": 2500000.00,
    "latitude": "6.2442",
    "length": "-75.5812",
    "documentTypeCode": "TIPDOC_FS001",
    "documentType": "CC",
    "documentNumber": "79456123",
    "customerName": "Pedro Picapiedra",
    "brandModel": "iPhone",
    "osVersion": "iOS",
    "appVersion": "25.1.0",
    "excludeITC": false,
    "isD2B": "SI",
    "transactionDesc": "Transferencia a cuenta propia de ahorros",
    "authenticationTransaction": "Biometría huella",
    "entitlementRol": "Titular",
    "entitlementPrivilege": "Admon Autonomo"
  },
  {
    "_id": "rcc_00002",
    "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "transactionId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "initialYearTrx": 2026,
    "initialMonthTrx": 8,
    "initialDayTrx": 11,
    "initialTrxHour": "11420000",
    "finalTrxYear": 2026,
    "finalTrxMonth": 8,
    "finalTrxDay": 11,
    "finalTrxHour": "11420521",
    "transactionCode": "0380",
    "transactionCodeDesc": "Transferencia nacional a terceros cuenta de ahorros",
    "responseCode": "000",
    "responseCodeDesc": "Transacción aprobada",
    "technicalCode": "BP00000000",
    "channel": "APP",
    "deviceNameId": "Dispositivo móvil",
    "ip": "181.60.14.137",
    "authenticationType": "Biometría faceid",
    "currency": "COP",
    "localAmount": 1800000.00,
    "originProductType": "CUENTA_DE_AHORRO",
    "originProductNumber": "51134450001",
    "destinyProductType": "CUENTA_DE_AHORRO",
    "destinyProductNumber": "98765000123",
    "destinyProductRelation": "Inscrita",
    "beneficiaryName": "Maria Londoño Uribe",
    "beneficiaryDocumentType": "CC",
    "beneficiaryDocumentNumber": "1002346789",
    "transactionMode": "Virtual",
    "transactionVoucherNumber": 819345,
    "transactionType": "Monetaria",
    "transactionState": "Exitosa",
    "commission": "NO",
    "transactionValule": 1800000.00,
    "destinyBankCode": "5600078",
    "originBankCode": "5600078",
    "documentTypeCode": "TIPDOC_FS001",
    "documentType": "CC",
    "documentNumber": "79456123",
    "customerName": "Pedro Picapiedra",
    "brandModel": "iPhone",
    "osVersion": "iOS",
    "appVersion": "25.1.0",
    "excludeITC": false,
    "isD2B": "SI",
    "transactionDesc": "Transferencia a cuenta inscrita de tercero",
    "authenticationTransaction": "Biometría faceid",
    "entitlementRol": "Titular",
    "entitlementPrivilege": "Admon Autonomo"
  },
  {
    "_id": "rcc_00003",
    "sessionId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "transactionId": "d4e5f6a7-b8c9-0123-defa-234567890123",
    "initialYearTrx": 2026,
    "initialMonthTrx": 8,
    "initialDayTrx": 3,
    "initialTrxHour": "14220000",
    "finalTrxYear": 2026,
    "finalTrxMonth": 8,
    "finalTrxDay": 3,
    "finalTrxHour": "14220845",
    "transactionCode": "0380",
    "transactionCodeDesc": "Transferencia nacional a terceros cuenta de ahorros",
    "responseCode": "000",
    "responseCodeDesc": "Transacción aprobada",
    "technicalCode": "BP00000000",
    "channel": "NEG",
    "deviceNameId": "NEG",
    "ip": "10.30.45.210",
    "authenticationType": "Token",
    "currency": "COP",
    "localAmount": 45000000.00,
    "originProductType": "CUENTA_CORRIENTES",
    "originProductNumber": "25678912345",
    "destinyProductType": "CUENTA_DE_AHORRO",
    "destinyProductNumber": "68432198765",
    "destinyProductRelation": "No inscrita",
    "transactionMode": "Virtual",
    "transactionVoucherNumber": 993201,
    "transactionType": "Monetaria",
    "transactionState": "Exitosa",
    "commission": "SI",
    "transactionValule": 45000000.00,
    "destinyBankCode": "5600078",
    "originBankCode": "5600078",
    "documentTypeCode": "TIPDOC_FS001",
    "documentType": "CC",
    "documentNumber": "1045678902",
    "customerName": "Juan Garcia Restrepo",
    "excludeITC": false,
    "isD2B": "SI",
    "transactionStatusApproval": "Aprobado",
    "authenticationTransaction": "Token",
    "entitlementRol": "Titular",
    "entitlementPrivilege": "Admon Autonomo",
    "transactionDesc": "Transferencia nacional a tercero no inscrito"
  },
  {
    "_id": "rcc_00004",
    "sessionId": "e5f6a7b8-c9d0-1234-efab-345678901234",
    "transactionId": "f6a7b8c9-d0e1-2345-fabc-456789012345",
    "initialYearTrx": 2026,
    "initialMonthTrx": 8,
    "initialDayTrx": 8,
    "initialTrxHour": "02300000",
    "finalTrxYear": 2026,
    "finalTrxMonth": 8,
    "finalTrxDay": 8,
    "finalTrxHour": "02301205",
    "transactionCode": "0380",
    "transactionCodeDesc": "Transferencia nacional a terceros cuenta de ahorros",
    "responseCode": "000",
    "responseCodeDesc": "Transacción aprobada",
    "technicalCode": "BP00000000",
    "channel": "SVP",
    "deviceNameId": "SVP",
    "ip": "200.118.47.220",
    "authenticationType": "Token",
    "currency": "COP",
    "localAmount": 18500000.00,
    "originProductType": "CUENTA_CORRIENTES",
    "originProductNumber": "51134450001",
    "destinyProductType": "CUENTA_DE_AHORRO",
    "destinyProductNumber": "11223344556",
    "destinyProductRelation": "No inscrita",
    "transactionMode": "Virtual",
    "transactionVoucherNumber": 556781,
    "transactionType": "Monetaria",
    "transactionState": "Exitosa",
    "commission": "NO",
    "transactionValule": 18500000.00,
    "documentTypeCode": "TIPDOC_FS001",
    "documentType": "CC",
    "documentNumber": "79456123",
    "customerName": "Pedro Picapiedra",
    "authorizedUserdocumentTypeCode": "TIPDOC_FS001",
    "authorizedUserdocumentType": "CC",
    "authorizedUserdocumentNumber": "1098765432",
    "authorizedUserName": "Carlos Bedoya Martinez",
    "excludeITC": false,
    "isD2B": "SI",
    "transactionStatusApproval": "Aprobado",
    "entitlementRol": "Titular Rep Legal",
    "entitlementPrivilege": "Aprobador",
    "transactionDesc": "Transferencia nocturna a tercero ejecutada por delegado",
    "authenticationTransaction": "Token",
    "managementDescription": "Aprobado por usuario delegado sin segunda firma"
  },
  {
    "_id": "rcc_00005",
    "sessionId": "a7b8c9d0-e1f2-3456-abcd-567890123456",
    "transactionId": "b8c9d0e1-f2a3-4567-bcde-678901234567",
    "initialYearTrx": 2026,
    "initialMonthTrx": 8,
    "initialDayTrx": 7,
    "initialTrxHour": "11450000",
    "finalTrxYear": 2026,
    "finalTrxMonth": 8,
    "finalTrxDay": 7,
    "finalTrxHour": "11451230",
    "transactionCode": "0510",
    "transactionCodeDesc": "Modificación usuario autorizado para aprobación de pagos",
    "responseCode": "000",
    "responseCodeDesc": "Modificación exitosa",
    "technicalCode": "BP00000000",
    "channel": "NEG",
    "deviceNameId": "NEG",
    "ip": "10.30.45.210",
    "transactionMode": "Virtual",
    "transactionType": "No monetaria",
    "transactionState": "Exitosa",
    "documentTypeCode": "TIPDOC_FS001",
    "documentType": "CC",
    "documentNumber": "79456123",
    "customerName": "Pedro Picapiedra",
    "authorizedUserdocumentTypeCode": "TIPDOC_FS001",
    "authorizedUserdocumentType": "CC",
    "authorizedUserdocumentNumber": "1098765432",
    "authorizedUserName": "Carlos Bedoya Martinez",
    "operationType": "Modificación",
    "excludeITC": true,
    "isD2B": "SI",
    "transactionDesc": "Modificación de permisos del usuario delegado para autorización de pagos",
    "entitlementRol": "Titular",
    "entitlementPrivilege": "Admon Autonomo"
  }
]
```
