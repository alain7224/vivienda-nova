# Auditoría de actualización desde Google Drive — 2026-09-05

La carpeta encontrada es **Manus actualización** (con tilde), identificador `1zgXMbuzRqO7PmDGYk3swFHDQ4iN-CiIu`, dentro del Drive del propietario. No se encontró una carpeta con el nombre ASCII exacto «Manus actualizacion».

Archivos encontrados:

| Archivo | ID de Drive | Uso | Resultado |
|---|---|---|---|
| `vivienda-nova2-admin-botones-final (1).zip` | `1zxbUtfpryibWCSWyypRCUl51hhbX0LXJ` | Código y migraciones de otra revisión | Auditado en carpeta aislada; no se ha sobrescrito el proyecto actual |
| `LRCOSTAHOMES_CATALOGO_COMPLETO_109 (1).csv` | `1zrlGqRo4aOzi58G53lCLfRkneCDbD9cZ` | Catálogo y precios fuente | 109 URLs únicas; 108 precios numéricos; una ficha sin precio |
| `Instrucciones_de_aplicación_—_Vivienda_Nova.pdf` | `1f8Ocryrxu7FBWOJX7cCX_wl1hYe4HXvM` | Procedimiento de revisión | Indica no inventar el precio de `https://lrcostahomes.com/es/property/villa-8/` y mantenerla como borrador |

El CSV tiene como fuente `https://lrcostahomes.com/es/property/`, incluye `price`, `priceValue`, `sourceUrl`, imágenes y galería. El auditor local confirmó 109 filas, 108 con precio, 1 sin precio, 109 URLs únicas, precio máximo de 1.700.000 € y mínimo de 86.900 €. La ficha sin precio es «Villa», slug `villa`, URL `https://lrcostahomes.com/es/property/villa-8/`, con texto de origen «En venta» sin importe.

La base actual contiene 109 propiedades con `externalUrl` de L & R y **104 con `priceValue = 1000`**, confirmando el problema reportado. Se preparó un SQL idempotente por URL de origen; la primera aplicación falló por mezcla de collations y se corrigió usando `COLLATE utf8mb4_unicode_ci`. Ya se aplicaron tres lotes de precios; queda un último lote de 20 fichas por aplicar y después debe verificarse el recuento total.

Fuente primaria de Drive: carpeta del propietario `https://drive.google.com/drive/folders/1zgXMbuzRqO7PmDGYk3swFHDQ4iN-CiIu`.
