# Importación autorizada desde L & R Costa Homes

## Objetivo

Incorporar en Vivienda Nova las fichas que L & R Costa Homes autorice desde su web pública, evitando que la inmobiliaria tenga que duplicar la carga manual. Cada importación debe crear una **vivienda en borrador** para que el administrador de Vivienda Nova revise la información antes de hacerla visible.

## Fuente autorizada y alcance

La web pública `https://lrcostahomes.com/es/` permite el acceso de rastreadores a las páginas de propiedades y publica un sitemap; no se accederá a `/wp-admin/`. La autorización comercial de la inmobiliaria es necesaria para reutilizar imágenes, descripciones y datos comerciales en Vivienda Nova. La importación debe limitarse a URLs de ficha bajo `https://lrcostahomes.com/es/property/` y no debe descargar ni copiar información de contacto de clientes, comentarios ni áreas privadas.

## Mapeo de ficha

| Dato de la ficha origen | Campo en Vivienda Nova | Tratamiento |
|---|---|---|
| Título | Título | Se conserva y puede editarse antes de publicar. |
| URL de la ficha | Enlace externo | Se guarda como enlace de referencia y derivación. |
| Ciudad, zona y país | Localización | Se completan si aparecen en la ficha. |
| Precio, superficie, dormitorios y baños | Datos comerciales | Se convierten a los campos estándar de Vivienda Nova. |
| Descripción y características | Descripción | Se importa como texto de borrador para revisión editorial. |
| Imagen principal | Imagen de la vivienda | Se utiliza como vista previa; se conserva la URL origen y se valida antes de publicar. |
| Referencia de la inmobiliaria | Nota/referencia | Se incorpora para evitar duplicados. |

## Reglas de seguridad y revisión

Cada URL se valida contra el dominio autorizado y se limita a una sola ficha por acción. La operación muestra una vista previa y requiere una confirmación del administrador antes de guardar. El resultado se crea con estado `draft`; no activa anuncios, enlaces de vendedor ni publicaciones sin revisión manual. Las imágenes y el texto se atribuyen a L & R Costa Homes mientras el acuerdo comercial esté vigente.

## Dos formas de uso

| Opción | Qué hace | Ventaja | Límite |
|---|---|---|---|
| Importar una ficha por URL | El administrador pega la URL de una propiedad y revisa la vista previa antes de crear el borrador. | Simple, control total y no necesita procesos continuos. | Requiere repetir la acción por cada vivienda elegida. |
| Sincronizar periódicamente | Un proceso revisa el listado de fichas y propone nuevas o modificadas como borradores. | Menos trabajo cuando hay muchas altas. | Requiere acuerdo estable, control de duplicados y un proceso de actualización configurado. |

Para comenzar se recomienda la **importación de una ficha por URL**. Solo se considerará una sincronización periódica tras validar varios imports y confirmar con L & R Costa Homes el alcance, las fotos y las fichas que desean compartir.

## Referencias

[1]: https://lrcostahomes.com/robots.txt "Reglas públicas de rastreo de L & R Costa Homes"
[2]: https://lrcostahomes.com/es/property/apartments-in-calpe/ "Ejemplo de ficha de propiedad L & R Costa Homes"
