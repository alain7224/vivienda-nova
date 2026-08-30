# Auditoría legal y de privacidad · Vivienda Nova

**Estado:** textos y controles implementados como borrador operativo. **Revisión jurídica recomendada antes de la publicación definitiva**, especialmente por la actividad internacional y los acuerdos con vendedores externos.

> Este documento organiza los cambios implementados y no constituye asesoramiento jurídico formal.

## Resultado de la revisión

| Área | Situación actual | Acción completada |
|---|---|---|
| Política de privacidad | Disponible en `/privacidad` | Explica datos tratados, finalidades, consentimiento, destinatarios, conservación y derechos. |
| Política de cookies | Disponible en `/cookies` | Separa almacenamiento necesario, analítica privada y contenido externo. |
| Consentimiento de cookies | Implementado | La analítica y el mapa de Google se bloquean hasta que el visitante acepta las opciones correspondientes. |
| Formulario de vivienda | Implementado | Requiere aceptación de la política de privacidad y autorización de derivación antes de guardar la consulta. |
| Formulario de construcción | Implementado | Registra fecha de aceptación de privacidad y derivación, además de coordenadas, imágenes y referencia MARTINEZ. |
| Transparencia de referidos | Disponible en `/referidos` | Explica la salida a la web externa del vendedor y el uso del código MARTINEZ. |
| Aviso legal | Disponible en `/aviso-legal` | Describe el alcance de Vivienda Nova como escaparate y derivación; deja visibles los datos del titular que aún faltan. |

## Datos que debes completar antes de publicar definitivamente

El aviso legal y la política de privacidad siguen en condición de borrador porque no se han facilitado los datos identificativos del titular. Antes de publicar, incorpora los datos reales siguientes:

| Dato | Dónde debe aparecer |
|---|---|
| Nombre completo o razón social del titular | Aviso legal y política de privacidad. |
| NIF/CIF o identificador fiscal aplicable | Aviso legal. |
| Domicilio o dirección de establecimiento | Aviso legal y política de privacidad. |
| Correo para ejercer derechos de privacidad | Política de privacidad, aviso legal y formularios. |
| Datos registrales, si corresponde | Aviso legal. |
| Plazo interno de conservación de consultas y clientes | Política de privacidad. |
| Identidad de los vendedores o equipos que recibirán referencias | Política de privacidad y flujo de derivación. |

## Decisiones operativas aplicadas

Los visitantes pueden rechazar las opciones no necesarias y continuar navegando. Si no aceptan contenido externo, el sitio no carga el mapa interactivo; el visitante puede abrir el panel de preferencias para autorizarlo. La información de contacto se conserva solo tras el envío voluntario del formulario y el servidor impide que se derive a un vendedor cualquier cliente que no haya autorizado esa derivación.

Vivienda Nova registra el código **MARTINEZ** como origen comercial de los referidos. Este dato permite organizar y verificar la procedencia de una consulta o clic, pero debe complementarse con un acuerdo con cada vendedor que determine la atribución y la comisión.

## Referencias

1. [Comisión Europea — Información para las personas físicas conforme al RGPD](https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en). Explica que la información debe incluir, entre otros elementos, identidad y contacto del responsable, finalidades, base jurídica, conservación, destinatarios, transferencias y derechos.
2. [AEPD — Guía sobre el uso de las cookies (mayo de 2024)](https://www.aepd.es/guias/guia-cookies.pdf). Referencia española para distinguir tecnologías necesarias y opciones sujetas a información y consentimiento.
3. [BOE — Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758). Texto de referencia para información identificativa del prestador y transparencia en servicios de la sociedad de la información.
