# RCC - Versión 3.0.0

A partir de esta versión se implementaron los siguientes cambios:
  
👉 **Campos antiguos continúan funcionando sin cambios.**

✏️ **Adición de campos:** Se han incorporado 5 nuevos campos hacia contact center:   segmentType, contactCellPhone, managerName, subject, screenRecordingState

✏️ Se implementa la especificación de patrones asíncronos para la recepción de eventos. 
   link: https://grupobancolombia.visualstudio.com/Vicepresidencia%20Servicios%20de%20Tecnolog%C3%ADa/_wiki/wikis/Vicepresidencia%20Servicios%20de%20Tecnolog%C3%ADa.wiki/403040/Especificaci%C3%B3n-de-patrones-as%C3%ADncronos-v2
   (Receptor  de Eventos)

> Estos son los campos disponibles en versiones 3.0.0 y anteriores, aún vigentes.

## Validación de campos obligatorios

Antes de procesar un registro, la ETL valida que todos los campos obligatorios contengan información válida según el tipo de dato esperado. Si alguno de estos campos no cumple las reglas definidas, el registro es rechazado.

### Campos de texto

Los campos de texto deben contener información. Se acepta cualquier valor de texto diferente de vacío o solo espacios.

| Valor recibido | Resultado |
|---------------|-----------|
| `"192.168.1.1"` | ✅ Procesado |
| `"null"` | ✅ Procesado |
| `"NULL"` | ✅ Procesado |
| `"none"` | ✅ Procesado |
| `"NONE"` | ✅ Procesado |
| `""` | ❌ Rechazado |
| `"   "` | ❌ Rechazado |
| `null` | ❌ Rechazado |
| Campo no enviado | ❌ Rechazado |

> **Nota:** Los valores `"null"`, `"NULL"` y `"none"` son tratados como texto, por lo que son considerados válidos.

---

### Campos booleanos

Los campos booleanos aceptan diferentes representaciones de **Verdadero** y **Falso**, las cuales son normalizadas durante el procesamiento.

| Valor recibido | Resultado |
|---------------|-----------|
| `true` | ✅ Procesado (TRUE) |
| `false` | ✅ Procesado (FALSE) |
| `"TRUE"` | ✅ Procesado (TRUE) |
| `"FALSE"` | ✅ Procesado (FALSE) |
| `1` | ✅ Procesado (TRUE) |
| `0` | ✅ Procesado (FALSE) |
| `"SI"` | ❌ Rechazado |
| `"NO"` | ❌ Rechazado |
| `"false!"` | ❌ Rechazado |
| `-7` | ❌ Rechazado |
| `null` | ❌ Rechazado |

---

### Campo `isD2B`

Este campo tiene una validación específica y únicamente acepta los valores **"SI"** y **"NO"** en mayúsculas.

| Valor recibido | Resultado |
|---------------|-----------|
| `"SI"` | ✅ Procesado |
| `"NO"` | ✅ Procesado |
| `"si"` | ❌ Rechazado |
| `"no"` | ❌ Rechazado |
| `"TRUE"` | ❌ Rechazado |
| `"FALSE"` | ❌ Rechazado |
| `0` | ❌ Rechazado |
| `1` | ❌ Rechazado |
| `null` | ❌ Rechazado |

---

### Campos de fecha

La fecha es válida cuando el año, mes y día conforman una fecha existente y el año se encuentra entre **1900** y **9999**.

| Fecha recibida | Resultado |
|---------------|-----------|
| `2026-08-04` | ✅ Procesado |
| `2024-02-29` | ✅ Procesado |
| `2025-02-29` | ❌ Rechazado |
| `2025-13-01` | ❌ Rechazado |
| `2025-04-31` | ❌ Rechazado |
| Año `1899` | ❌ Rechazado |
| Año, mes o día `null` | ❌ Rechazado |
| Campo no enviado | ❌ Rechazado |

<!-- tabla de campos comunes -->

## Total de campos campos en la versión 3.0.0

|Campo||Tipo|Longitud|Obligatoriedad|Lineamiento|Ejemplo|
|-|-|-|-|-|-|-|
|sessionId|ID de sesión|Alfanumérico|50|X|ID que identifica cada sesión del cliente en los canales digitales. Este campo se debe diligenciar según su estructura.|f6127e10-f3e9-11ed-4d8e-438c4c9f4da6|
|transactionId|Id de transacción|Alfanumérico|50|X|Este ID es único por canal y se diligencia según su estructura.|20e34c70-66f2-11ee-43a5-478c428047b0|
|initialYearTrx|Año [Inicial] Transaccion|Numérico|4|X|El canal debe de enviar los 4 dígitos correspondientes al año. Este campo debe de ir sin caracteres especiales.|2023|
|initialMonthTrx|Mes[Inicial] Transaccion|Numérico|2|X|El canal debe de enviar los 2 dígitos correspondientes al mes. Cuando el mes sea de un digito se diligencia el digito correspondiente.|11|
|initialDayTrx|Día [Inicial] Transaccion|Numérico|2|X|El canal debe de enviar los 2 dígitos correspondientes al día. Cuando el día sea de un digito se diligencia el digito correspondiente.|20|
|initialTrxHour|Hora: HHmmssSS [inicial] Transaccion|Alfanumérico|8|X|El canal debe de diligenciar este campo con 8 dígitos: hora, minutos, segundos, y decimas de segundos, de forma consecutiva sin ningún carácter especial.|10480010|
|finalTrxYear|Año [Final] Transaccion|Numérico|4|X|El canal debe de enviar los 4 dígitos correspondientes al año. Este campo debe de ir sin caracteres especiales.|2023|
|finalTrxMonth|Mes[Final] Transaccion|Numérico|2|X|El canal debe de enviar los 2 dígitos correspondientes al mes. Cuando el mes sea de un digito se diligencia el digito correspondiente.|11|
|finalTrxDay|Día [Final] Transaccion|Numérico|2|X|El canal debe de enviar los 2 dígitos correspondientes al día. Cuando el día sea de un digito se diligencia el digito correspondiente.|20| 
|finalTrxHour|Hora: HHmmssSS [final] Transaccion|Alfanumérico|8|X|El canal debe de diligenciar este campo con 8 dígitos: hora, minutos, segundos, y decimas de segundos, de forma consecutiva sin ningún carácter especial.|10480012|
|transactionCode|Cod transacción|Alfanumérico|10|X|Código con el que se identifica la transacción realizada. Este campo se debe diligenciar según su estructura.|0260|
|transactionCodeDesc|Descripción código de transacción|Alfanumérico|50|X|Para transacciones monetarias indicar el nombre de la transacción, el producto, tipo de producto e información adicional (si es el caso).  Para transacciones no monetarias indicar el nombre de la transacción e información adicional (si es el caso). Este campo debe de iniciar con letra capital.|Consulta de saldo tarjeta de crédito|
|responseCode|Cod respuesta del mensaje (Código funcional de la homologación)|Alfanumérico|20|X|Codigo de respuesta homologado, es decir, este codigo es de cara al cliente y se debe diligenciar según su estructura. Para este campo debemos tomar como base el campo de la matriz de error llamado: itc_homologated_code.|701|
|responseCodeDesc|Descripción código de respuesta técnico (Mensaje funciona de la homologación)|Alfanumérico|500|X|En este campo el canal debe de ser suficientemente especifico en el motivo por el cual se rechazó la transacción. Para este campo debemos tomar como base el campo de la matriz de error llamado: message_description.|Número máximo de registros inválido|
|technicalCode|Codigo Tecnico|Alfanumérico|10|x|En este campo se indica el codigo técnico de error de la transacción. Se debe diligenciar según su estructura. Para este campo debemos tomar como base el campo de la matriz de error llamado: technical_code.|BP12900037| 
|channel|Canal por donde transa|Alfanumérico|10|X|Indica las siglas de cada canal en mayúscula sostenida, de esta manera: APP (aplica para la app personas), SVE, SVP, NEG, BALM, CB, SUC, ATM, MULTIFUN, KIOS, H2H, SWIFT. CONTACC.|NEG|
|deviceNameId|Nombre de dispositivo/ ID DISPOSITIVO|Alfanumérico|50|X|Si la transacción se integra con ITC, asegúrate de usar el mismo dispositivo registrado en ITC; de lo contrario, en caso de canales digitales, se debe indicar si se realizó la transacción a través de dispositivo móvil o web. Para canales físicos y autoservicio, se debe indicar el nombre del punto físico desde donde se realizó la transacción. Para canales a distancia, se debe indicar el nombre del aliado por el cual se realizó la transacción (Teleperformance, Konecta, Emtelco).|APP|
|ip|Dirección IP|Alfanumérico|30|X|La dirección IP debe de ir separada por puntos, según su estructura.|45.178.14.137|
|authenticationType|Tipo de autenticación|Alfanumérico|14||Indica si el tipo de autenticación es Credenciales, Biometría huella o Biometría faceid. Este campo debe de iniciar con letra capital.|Biometría huella|
|currency|Moneda|Alfanumérico|10||Indica el tipo de moneda en mayúscula sostenida de la siguiente forma: COP/USD/EUR/YEN. Tomar como base el estándar internacional ISO 4217|USD|
|localAmount|Monto en COP|Decimal|13.2||Indica el monto de la transacción en pesos colombianos, según su estructura.|39,283.13|
|internationalAmount|Monto en otras monedas|Decimal|13.2||Se indica este valor cuando se realicen transferencias internacionales en otro tipo de monedas.|402.00|
|establishmentUniqueCode|Codigo único del establecimiento (RED)|Numérico|10||Este campo aplica cuando se realiza una transacción en un canal físico, se debe indicar el código de dicho punto físico, de acuerdo o según la codificación que tenga definida cada canal. Ejemplo ATM: 1701, Corresponsal: 21645.|1701|
|cardNumber|Numero de tarjeta|Alfanumérico|20||Indica (si es el caso) los últimos 4 dígitos del numero de tarjeta Debido/Crédito de forma consecutiva y sin ningún carácter especial.|***********3819|
|originProductType|Tipo de producto origen|Alfanumérico|40||Indica si es: CUENTA_DE_AHORRO/CUENTA_CORRIENTES/TARJETA_DE_CREDITO. Este campo debe de ir en mayúscula sostenida. |CUENTA_DE_AHORRO|
|originProductNumber|Número de producto origen|Alfanumérico|16||Indica el numero del producto desde donde se ejecuta la transacción de forma consecutiva y sin ningún carácter especial.|51134450001|
|destinyProductType|Tipo de producto destino|Alfanumérico|40||Indica si es: CUENTA_DE_AHORRO/CUENTA_CORRIENTES/TARJETA_DE_CREDITO. Este campo debe de ir en mayúscula sostenida.|CUENTA_DE_AHORRO|
|destinyProductNumber|Número de producto destino|Alfanumérico|16||Indica el numero del producto que recibe la transacción ejecutada de forma consecutiva y sin ningún carácter especial.|31189907865|
|destinyProductRelation|Relación producto destino|Alfanumérico|30||Indica cual es la relación con la cuenta destino de la siguiente manera: Propia/ Inscrita / No inscrita / Otros bancos / Inscrita programada / Programada. Este campo debe de iniciar con letra capital.|Inscrita|
|transactionMode|Modo de transacción|Alfanumérico|30||Indica si la transacción se hizo de forma: Virtual ( Compra, Transferencia, Pago) / Presencial nacional / Presencial internacional / Debito automático. Este campo debe de iniciar con letra capital.|Virtual|
|transactionVoucherNumber|N° de comprobante de la transacción|Numérico|10||Indica el N° de comprobante que tiene el cliente en el front, siendo este un campo numérico se debe diligenciar según su estructura.|724428|
|destinyBankCode|Codigo banco destino|Alfanumérico|20||Código nacional o SWIFF con el que se reconoce el banco. Dicho campo se debe diligenciar según su estructura.|5600078|
|originBankCode|Codigo banco origen|Alfanumérico|20||Código nacional o SWIFF con el que se reconoce el banco. Dicho campo se debe diligenciar según su estructura.|5600078|
|agreementCode|Código de convenio|Numérico|10||Se indica cuando es un pago de facturas. Siendo este un campo numérico se debe diligenciar según su estructura.|53992|
|reference|Referencia|Alfanumérico|20||Se indica la referencia con la cual se realiza el pago de una factura. Siendo este un campo alfanumérico se debe diligenciar según su estructura.|Pago de factura|
|transactionType|Tipo de transacción |Alfanumérico|15|X|Indica si la transacción es Monetaria o No monetaria. Para el programa de negocios indica si la transacción es Monetaria o Administrativa. Este campo debe de iniciar con letra capital.|Monetaria|
|inputTransactionMode|Modo de entrada transaccion|Alfanumérico|15||Indica el modo de la transacción según sea el caso, de la siguiente manera: NFC / CONTACTLESS/ QR COMPRA / QR TRANS.  Este campo debe de ir en mayúscula sostenida.|QR COMPRA|
|transactionState|Estado de la transacción|Alfanumérico|25|X|Indica si la transacción fue Exitosa, Técnicamente exitosa, No exitosa, este campo debe de iniciar con letra capital. Para este campo debemos tomar como base el campo de la matriz de error llamado: message_type.|Exitosa|
|commission|Comisión|Alfanumérico|2| |La transacción tiene comisión (SI/NO), este campo debe de ir en mayúscula sostenida.|NO|
|transactionValule|Valor de la transacción|Decimal|13.2||Indica el valor de la transacción según su estructura.|39,283.13|
|throwbackId|Indicador de reversión|Numérico|2||Este campo es para canales físicos, específicamente de cajeros. Indica cuando hubo debito no entregó en cajeros, se compone de un máximo de 2 dígitos donde 1 es igual = REVERSIÓN y 0 es igual = NO HAY REVERSIÓN.|0|
|latitude|latitud|Alfanumérico|30||Indica la coordenada desde donde se ejecuto la transacción, según su estructura.|-3.9931|
|length|longitud|Alfanumérico|30||Indica la coordenada desde donde se ejecuto la transacción, según su estructura.|-79.2042|
|documentTypeCode|Código de tipo de documento|Alfanumérico|12|X|Indica el código de tipo de documento para ello tener como base la tabla proveniente de MDM.|TIPDOC_FS001 |
|documentType|Tipo de documento|Alfanumérico|50|X|Indica el tipo de documento en mayúscula sostenida de la siguiente manera: CD,CC,TI,CE, NIT, PAS, IEPN, IEPJ, FD, RC.|CC|
|documentNumber|Numero de documento|Alfanumérico|20|X|Indica el numero de documento del cliente, dueño de la cuenta desde donde se ejecuta la transacción de forma consecutiva y sin ningún carácter especial.|1002346754|
|customerName|Nombre del cliente|Alfanumérico|60||Indica el nombre del cliente dueño de la cuenta. Este campo debe de iniciar con letra capital.|Andrea Velasquez Gomez |
|authorizedUserdocumentTypeCode|Código de tipo de documento usuario autorizado|Alfanumérico|12||Indica el código de tipo de documento de la persona que este siendo  autorizada para realizar una transacción. Este campo es utilizado por los canales Pyme y SVE, de forma que se pueda identificar al usuario que está transando. Para este campo tener como base la tabla proveniente de MDM.|TIPDOC_FS001|
|authorizedUserdocumentType|Tipo de documento usuario autorizado|Alfanumérico|50||Indica el tipo de documento de la persona que este siendo  autorizada para realizar una transacción. Este campo es utilizado por los canales Pyme y SVE, de forma que se pueda identificar al usuario que está transando. Este campo se debe diligenciar en mayúscula sostenida de la siguiente manera: CD,CC,TI,CE, NIT, PAS, IEPN, IEPJ, FD, RC.|CC|
|authorizedUserdocumentNumber|Número de documento usuario autorizado|Alfanumérico|20||Indica el numero de documento de la persona que este siendo  autorizada para realizar una transacción. Este campo es utilizado por los canales Pyme y SVE, de forma que se pueda identificar al usuario que está transando. Este campo se debe diligenciar de forma consecutiva y sin ningún carácter especial.|1000896750|
|authorizedUserName|Nombre del usuario autorizado|Alfanumérico|60||Indica el nombre de la persona que este siendo autorizada para realizar una transacción. Este campo es utilizado para clientes Pyme y SVE, de forma que se pueda identificar al usuario que está transando. Este campo debe de iniciar con letra capital.|Julio Cardona Carmona|
|brandModel|Marca - Modelo|Alfanumérico|20||En este campo se indica la marca - modelo del dispositivo desde el cual se hace la transacción (si es el caso). De la siguiente manera: Samsung / Huawei / iPhone,  aplica para WEB y para APP, este campo debe de iniciar con letra capital.|iPhone|
|osVersion|Sistema operativo - versión sistema operativo|Alfanumérico|20||Indica el sistema operativo del dispositivo desde el cual se hace la transacción (si es el caso). De la siguiente manera:  Android / iOS / Windows / Linux,  este campo debe de iniciar con letra capital.|iOS|
|browser|Navegador|Alfanumérico|20||Indica el navegador desde el cual se hace la transacción (si es el caso). De la siguiente manera: Chrome / Safari / Firefox / Mozilla,  este campo debe de iniciar con letra capital.|Safari|
|mobileOperator|Operador movil|Alfanumérico|20||Indica el operador móvil desde el cual se hace la transacción (si es el caso). De la siguiente manera: Claro / Tigo / Virgin, este campo debe de iniciar con letra capital.|Claro|
|appVersion|Versión de la aplicación |Alfanumérico|10||Indica según sea el caso la versión de la aplicación por la cual se realiza la transacción, Este campo se debe de diligenciar según su estructura.|25.1.0|
|sharedKey|sharedkey (Detect TI - ID) identificador de la clave dinámica y monitoreo transaccional|Alfanumérico|30||Este campo es diligenciado por pyme para un ID identificador del cliente y es usado por APP y SVP para diligenciar el código de clave dinámica.|459786|
|agreementTermsConditions|Aceptación de términos y condiciones|Alfanumérico|2||Indica si el cliente acepta o no la transacción de aceptación de  términos y condiciones. SI / NO, aplica para las transacciones que en su flujo requieren la aceptación de términos y condiciones por el usuario , este campo debe de ir en mayúscula sostenida.|SI|
|versionTermsConditions|Versión términos y condiciones|Alfanumérico|10||Indica la versión de términos y condiciones que es aceptada por el cliente en el transacción de registro. Este campo se diligencia según su estructura.|1.0|
|agreementTermsConditionsDate|Fecha de aceptación de términos y condiciones|Numérico|8||Indica la fecha de aceptación de términos y condiciones en el siguiente formato: AAAAMMDD.|20231204|
|excludeITC|Indica si la transacción no pasa por ITC|Booleano||X|Este campo es para identificar si la transacción se debe enviar a ITC desde el RCC o no. Indica true (si no se requiere la replica de la transacción al ITC), indica false (si se requiere la replica de la transacción al ITC), este campo debe de ir en minúscula.|true|
|token|token de la transaccion|Decimal|13.2||A partir de la versión 1.4.0, la información que corresponde al tipo de autenticación ("OPT","Softoken",...) debe ser migrado al campo authenticationTransaction. Este campo será utilizado como auxiliar de tipo Decimal (13,2).||
|changeRate|Tasa de cambio|Decimal|13.2||Este campo es para transacciones internacionales. Indica la tasa con la que se realizó la operación, según su estructura.|3897.46|
|totalBatchRecords|Numero de registros del lote|Decimal|13.2||Cuando la operación sea un lote me deberá mostrar el recuento del número de registros de dicho lote.|10|
|value4|Valor4|Decimal|13.2||
|value5|Valor5|Decimal|13.2||
|value6|Valor6|Decimal|13.2||
|isD2B|Identificador D2B|Alfanumérico|2|X|Este campo nos ayudara a identificar si la transacción esta en arquitectura Galatea o no. Indica SI o NO, este campo debe de ir en mayúscula sostenida.|SI|
|serialToken|serial token de la transaccion|Alfanumérico|20||En caso de que la transacción haya requerido Hardtoken o token físico  como las trx monetarias y de autenticación se debe de indicar dicho serial del token, en caso de ser softoken se debe registrar el ID. Diligenciar este campo según su estructura.|436098771|
|entitlement|Indica los controles de seguridad asignados al cliente. Debe contener si es Admin. Autónoma, Adm compartida|Alfanumérico|20||Indica el rol y regla de seguridad que le aplica al usuario que realiza la transacción. Este campo es solicitado por el equipo de negocios y debe de iniciar con letra capital.|N/A|
|batchName|nombre de lote de la operacion|Alfanumérico|20||Cuando la operación tenga nombre de lote se deberá registrar el mismo. Dicho campo debe de iniciar con letra capital.|N/A|
|loadMechanism|Tipo de carga de archivo|Alfanumérico|20||Tipo de carga de archivo, cuando la operación se realice por una de las diferentes opciones de carga de lotes. El formato queda de acuerdo como lo registre el cliente.|N/A|
|paymentType|Tipo de pago|Alfanumérico|20||Este campo es solicitado por el equipo de negocios, con el fin de indicar si la transacción es un pago, que tipo de pago es, pago de nomina o pago a proveedores, iniciando con letra capital.|N/A|
|transactionGroup|Grupo de transacción |Alfanumérico|20||Indica el grupo de la transacción de acuerdo con la clasificación de Entitlement. Este campo es solicitado por el equipo de negocios y debe de iniciar con letra capital.|N/A|
|targetCurrency|Moneda de destino|Alfanumérico|20||Indica (si es el caso) el tipo de moneda en mayúscula sostenida de la siguiente forma: COP/USD/EUR/YEN. Tomar como base el estándar internacional ISO 4217.|USD|
|field9|Campos9|Alfanumérico|20||
|transactionStatusApproval| Estado de transacción en aprobación|Alfanumérico|50||Este campo debe de iniciar con letra capital. (       (Aprobado, Rechazado, Preparado, Cancelado)|Rechazado|
|managementDescription| Descripción del resultado de la transacción|Alfanumérico|500||Este campo debe de iniciar con letra capital|Rechazado por usuario aprobador|
| transactionTracker | ID Identificador del End to End de la transacción |50|| |Diligenciar según su estructura. | |
| descriptionFunctions | Funciones de inscripción| Alfanumérico|200|| Este campo debe de iniciar con letra capital. (Pago de nómina, Pago a proveedores, Transferencias, etc)|Pago de nómina|
| customizingProductName | Nombre personalizado del producto | Alfanumérico |50|||Madre1|
| beneficiaryDocumentType | Tipo de documento del beneficiario | Alfanumérico|10|| Indica el tipo de documento en mayúscula sostenida de la siguiente manera: CD,CC,TI,CE, NIT, PAS, IEPN, IEPJ, FD, RC.|CC|
| beneficiaryDocumentNumber | Número de documento del beneficiario | Alfanumérico|50|| Indica el número de documento del beneficiario de forma consecutiva y sin ningún carácter especial |1002346789|
| beneficiaryName | Nombre del beneficiario | Alfanumérico|20|| Indica el nombre del beneficiario de la transacción. Este campo debe de iniciar con letra capital. | Maria Londoño Uribe |
| operationType | Tipo de operación | Alfanumérico|15|| Este campo debe de iniciar con letra capital. (Inscripción, Modificación, Eliminación.)| Inscripción |
| originProductDesc | Detalle tipo producto origen, como la franquicia | Alfanumérico|50|| Este campo debe de iniciar con letra capital.| Visa Platinum |
| destinationProductDesc | Detalle tipo producto destino, como la franquicia | Alfanumérico|50|| Este campo debe de iniciar con letra capital.| Visa Platinum |
| destinationBankName | Nombre del banco destino | Alfanumérico|70|| Este campo debe de iniciar con letra capital.| Nequi |
| originBankName | Nombre del banco origen | Alfanumérico|70|| Este campo debe de iniciar con letra capital.| Nequi |
| transactionDesc | Detalle de la transacción | Alfanumérico|300|| Este campo amplía la información de la transacción que se está ejecutando. Debe de iniciar con letra capital.| Transferencia a producto inscrito |
| authenticationTransaction  | Autenticación de la transacción | Alfanumérico|20|| En este campo se identifica que método de autenticación utiliza la transacción. Debe de iniciar con letra capital.| Token, OTP, …|
| entitlementRol| Tipo de rol en la profesión |Alfanumérico|40|| En este campo debe determinar el rol de la profesión que está realizando la transacción |       Titular  Titular Rep Legal|
| entitlementPrivilege| Tipo de rol que tiene para el canal |Alfanumérico|40|| En este define los privilegios que tiene el canal |Admon Autonomo  Aprobador Preparador  Preparador/Aprobador  Consultor|

**NOTA**:
## Estos nuevos campos permiten guardar más detalles sobre la información de las transacciones, mejorando así la precisión y exhaustividad de los datos registrados. Es importante destacar que los campos existentes no se han visto afectados y continúan operando como antes. **_Sin embargo, por el momento, estos nuevos campos no están siendo transmitidos a LZ._**

# **Nuevos Campos Financieros Avanzados**

Esta tabla describe campos utilizados en operaciones financieras avanzadas, para detallar el origen, destino, valores e implicaciones tributarias.

| Nombre del campo            | Tipo de dato   | Longitud | Obligatoriedad | Lineamiento                                                                 | Ejemplo                                              |
|----------------------------|----------------|----------|----------------|------------------------------------------------------------------------------|------------------------------------------------------|
| factor                     | Numérico       | 5.5      |                | Factor aplicado a la operación, usado en cálculos financieros.              | 1.00001                                              |
| bankCharges                | Alfanumérico   | 10       |                | Define quién asume los cargos bancarios (BEN/SHA/OUR).                      | BEN/SHA                                              |
| bankChargesValue           | Numérico       | 13.2     |                | Valor numérico de los cargos bancarios.                                     | 1.23457E+12                                          |
| VATBankCharges             | Numérico       | 13.2     |                | Valor del IVA aplicado a los cargos bancarios.                              | 1.23457E+12                                          |
| totalAmountDebited         | Numérico       | 13.2     |                | Monto total debitado de la cuenta origen.                                   | 1.23457E+12                                          |
| originatingBankCode2       | Alfanumérico   | 50       |                | Código bancario origen (formato internacional como IBAN).                   | GB63CHAS60161331926819                               |
| destinationBankCode2       | Alfanumérico   | 50       |                | Código bancario destino (formato internacional como IBAN).                  | GB63CHAS60161331926819                               |
| customTransactionMessage   | Alfanumérico   | 150      |                | Mensaje personalizado de la transacción.                                    | Pago de aranceles                                   |
| reasonTransaction          | Alfanumérico   | 75       |                | Descripción del motivo de la transacción.                                   | Servicios, transferencias y otros conceptos          |
| typeEntity                 | Alfanumérico   | 50       |                | Tipo de entidad involucrada (por ejemplo: FIC, Fondo, Banco).              | FIC - Fondo de Inversion Colectiva                   |
| depositNumber              | Alfanumérico   | 20       |                | Número de depósito relacionado.                                             | BC123456789                                          |
| administratorId            | Alfanumérico   | 20       |                | Identificación del administrador de la cuenta.                              | 10342564098                                          |
| exchangeNumerals           | Alfanumérico   | 200      |                | Detalle de numerales cambiarios aplicados.                                  | 9999,1234567890123.                                  |
| taxCompliance              | Alfanumérico   | 150      |                | Declaración sobre cumplimiento tributario.                                  | Declaro haber cumplido con todas mis obligaciones... |
| customsInformation         | Alfanumérico   | 2        |                | Indica si aplica información de aduana (SI/NO).                             | SI                                                   |
| customsDocumentNumber      | Alfanumérico   | 850      |                | Número del documento aduanero.                                              | 9999,1234567890123456,...                            |
| originBankCountry          | Alfanumérico   | 60       |                | País del banco que envía los fondos.                                        | COLOMBIA                                             |
| beneficiaryBankCountry     | Alfanumérico   | 60       |                | País del banco que recibe los fondos.                                       | ESTADOS UNIDOS                                       |
| originBankCodeType         | Alfanumérico   | 10       |                | Tipo de código bancario origen (SWIFT, ABA, etc.).                          | SWIFT                                                |
| originBankCode2Type        | Alfanumérico   | 10       |                | Segundo tipo de código bancario origen (IBAN, etc.).                        | IBAN                                                 |
| beneficiaryBankCodeType    | Alfanumérico   | 10       |                | Tipo de código del banco beneficiario.                                      | SWIFT                                                |
| beneficiaryBankCode2Type   | Alfanumérico   | 10       |                | Segundo tipo de código del banco beneficiario.                              | TRANSIT                                              |
| originOwnershipType        | Alfanumérico   | 50       |                | Define el tipo de titularidad en la cuenta de origen.                       | Propia y único titular                               |
| beneficiaryOwnershipType   | Alfanumérico   | 50       |                | Define el tipo de titularidad en la cuenta del beneficiario.               | Propia y varios titulares                            |
| countryResidenceBeneficiary| Alfanumérico   | 60       |                | País de residencia del beneficiario.                                        | COLOMBIA                                             |
| countryResidenceOrigin     | Alfanumérico   | 60       |                | País de residencia del originador.                                          | ESTADOS UNIDOS                                       |
| originCity                 | Alfanumérico   | 60       |                | Ciudad de origen de la transacción.                                         | MEDELLIN                                             |
| beneficiaryCity            | Alfanumérico   | 60       |                | Ciudad del beneficiario.                                                   | MIAMI                                                |
| originAddres               | Alfanumérico   | 70       |                | Dirección de origen de la transacción.                                      | Cra. 48 #26-85                                       |
| beneficiaryAddres          | Alfanumérico   | 70       |                | Dirección del beneficiario.                                                | 3915 Isidro Plazas                                   |


# **Nuevos Campos de Interacción (Métricas de canales)**

Esta sección contiene los campos asociados al monitoreo e interacción con canales de servicio, agentes y clientes.

| Nombre del campo         | Tipo de dato   | Longitud | Obligatoriedad | Lineamiento                                                             | Ejemplo               |
|--------------------------|----------------|----------|----------------|-------------------------------------------------------------------------|------------------------|
| metric                   | Alfanumérico   | 50       |                | Nombre o identificador de la métrica capturada en el evento.           | tiempoEspera           |
| ani                      | Alfanumérico   | 100      |                | Número de origen de la interacción (ej: teléfono del cliente).         | 3161234567             |
| dnis                     | Alfanumérico   | 100      |                | Número destino de la interacción (ej: línea de atención).              | 018000123456           |
| interactionDirection     | Alfanumérico   | 15       |                | Dirección del contacto (entrante/saliente).                            | Entrante              |
| mediaType                | Alfanumérico   | 15       |                | Tipo de canal utilizado (ej: voz, chat, correo).                       | Voz                   |
| isRecording              | Alfanumérico   | 6        |                | Indica si la interacción fue grabada.                                  | SI                    |
| purpose                  | Alfanumérico   | 20       |                | Propósito del participante en la interacción.                          | Soporte               |
| queueName                | Alfanumérico   | 100      |                | Nombre de la cola o grupo de atención.                                 | Soporte_Nivel1        |
| service                  | Alfanumérico   | 60       |                | Nombre del servicio o producto asociado a la interacción.              | Internet Empresarial  |
| businessRule             | Alfanumérico   | 5        |                | Código de la regla de negocio aplicada.                                | R1                    |
| wrapUpCodeName           | Alfanumérico   | 200      |                | Código de cierre o clasificación de la interacción.                    | Cierre por solución   |
| agentDocument            | Alfanumérico   | 20       |                | Documento del asesor que atendió la interacción.                       | 1022334455            |
| agentUser                | Alfanumérico   | 30       |                | Usuario de red del agente.                                              | jlopez1               |
| agentName                | Alfanumérico   | 60       |                | Nombre completo del asesor.                                            | Juan Lopez            |
| agentEmail               | Alfanumérico   | 50       |                | Correo corporativo del agente.                                         | jlopez@empresa.com    |
| customerCellPhone        | Alfanumérico   | 20       |                | Celular del cliente.                                                   | 3104567890            |
| customerEmail            | Alfanumérico   | 70       |                | Correo electrónico del cliente.                                        | cliente@mail.com      |
| customerCountry          | Alfanumérico   | 60       |                | País desde el cual se realizó la interacción.                          | COLOMBIA              |
| customerOTPStatus        | Alfanumérico   | 5        |                | Resultado del proceso de autenticación OTP.                            | OK                    |
| systemPresenceEs         | Alfanumérico   | 20       |                | Estado del agente en español (Disponible, Ocupado, etc.).              | Disponible            |
| reasonCancel1            | Alfanumérico   | 50       |                | Motivo principal de cancelación o rechazo de oferta.                   | No interesado         |
| reasonCancel2            | Alfanumérico   | 60       |                | Motivo detallado del rechazo de la oferta.                             | Ya tiene el servicio  |
| queueStatus              | Alfanumérico   | 5        |                | Estado de la cola (Activa/Bloqueada).|

# **Campos call center**

Esta sección contiene los campos asociados al monitoreo e interacción con canales de servicio, agentes y clientes.
| Nombre del campo                   | Tipo de dato   | Longitud | Obligatoriedad | Lineamiento                                                                 | Ejemplo           |
|------------------------------------|----------------|----------|----------------|------------------------------------------------------------------------------|-------------------|
| firstKey                           | Alfanumérico   | 70       |                | Clave principal que identifica el evento o métrica registrada.              | eventoPrincipal   |
| dynamicKey                         | Alfanumérico   | 70       |                | Clave dinámica generada o asociada al evento para correlación.              | 3161234567        |
| authenticationStatus              | Alfanumérico   | 20       |                | Estado del proceso de autenticación (ej: éxito, fallo, pendiente).          | EXITO             |
| dynamicKeyAuthenticationStatus    | Alfanumérico   | 50       |                | Clave dinámica asociada al estado de autenticación.                         | OTP-123456        |
| authorizationType                 | Alfanumérico   | 50       |                | Tipo de autorización utilizada (token, contraseña, biometría, etc.).        | Biometría facial  |
| flowName                           | Alfanumérico   | 100      |                | Nombre del flujo o proceso en el que se enmarca la interacción.             | flujoTransferencia|
| flowOutcomeValue                   | Alfanumérico   | 20       |                | Resultado final del flujo o interacción (ej: aprobado, cancelado, error).   | Aprobado          |


# **Nuevos Campos contact center**

Esta sección contiene los campos asociados para el detalle de solicitudes gestionada por el contact center.
| Nombre del campo                   | Tipo de dato   | Longitud | Obligatoriedad | Lineamiento                                                                 | Ejemplo           |
|------------------------------------|----------------|----------|----------------|------------------------------------------------------------------------------|-------------------|
| segmentType                           | Alfanumérico   | 20       |                | Segmento cual pertenece la llama.              | contacting   |
| contactCellPhone                         | Alfanumérico   | 20       |                | Numero de contacto del cliente.              | 573042969245        |
| managerName              | Alfanumérico   | 60       |                | Nombre del asesor que esta tomando la llamada.          | Angie Estefania Blandon Jaramillo             |
| subject    | Alfanumérico   | 100       |                | Asunto del contacto.                         | El cliente dijo: Me acaban de robar mis documentos, deseo bloquear mis tarjetas        |
| screenRecordingState                 | Alfanumérico   | 20       |                | se refiere al estado actual de una función de grabación de pantalla en un dispositivo o aplicación.        | stopped  |



