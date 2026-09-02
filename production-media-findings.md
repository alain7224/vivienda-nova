# Diagnóstico de producción — medios y acceso admin

Fecha de comprobación: 2026-09-02.

Las capturas headless tomadas contra `https://viviendanova.casa/` en 375x812 y 1280x720 muestran que la portada actual carga correctamente la imagen hero en móvil y escritorio. El vídeo configurado responde con HTTP 200, `video/mp4`, códec H.264, 1280x720 y 8 segundos. Las dos imágenes estáticas de método/construcción también responden HTTP 200 y los archivos descargados son decodificables; no hay evidencia de que el modo Autoscale/reposo esté provocando el icono roto.

La API pública devuelve actualmente cero viviendas publicadas, por lo que una ficha antigua, una URL compartida previamente o una caché del navegador puede mostrar una tarjeta sin un recurso válido aunque la portada actual funcione. Debe comprobarse cualquier `imageUrl` guardada en cada propiedad antes de publicarla.

El login público responde HTTP 200, crea `app_session_id`, `auth.me` devuelve `role: admin` y `admin.overview` responde HTTP 200. El endpoint de navegador remoto no se pudo usar por timeout 504, pero la sesión y la operación protegida sí se verificaron desde el dominio real. La captura visual del panel en desarrollo corresponde al mismo código publicado.

Los avisos de Chromium sobre DBus/GCM son del entorno headless y no corresponden a fallos de imágenes, vídeo o la aplicación.


La consulta de base de datos confirmó una configuración de `siteSettings` y cero registros en `properties`; la configuración usa rutas `/manus-storage/` válidas y no hay fichas persistidas que corregir o normalizar. La salida de la consulta múltiple fue parcialmente mezclada por el ejecutor SQL, pero el recuento de configuración fue 1 y el de propiedades fue 0; la lista de URLs de propiedades quedó vacía.

La corrección adicional elimina `manus-cookie` tras el login por clave, marca la sesión admin en `sessionStorage` y hace que el cliente no envíe el bearer de vista previa durante esa sesión. La cookie de ADMIN_KEY se emite con `secure`, `httpOnly` y `sameSite: lax`.
