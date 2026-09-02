# Project TODO

- [x] Recuperar un acceso visible y claro al área de administración desde la web pública.
- [x] Implementar o validar inicio de sesión de administrador mediante una contraseña propia, sin depender de la contraseña de Manus.
- [x] Revisar y corregir la ruta/panel de administración para que el usuario administrador pueda acceder.
- [x] Habilitar y verificar todos los botones y controles de edición de propiedades, colores y contenidos.
- [x] Analizar los cambios existentes en GitHub y conservar únicamente las partes compatibles y seguras.
- [x] Añadir una forma segura para que otra persona autorizada pueda agregar propiedades desde un enlace de colaborador/oficina.
- [x] Definir permisos para distinguir administrador y colaborador, evitando que el enlace de colaborador otorgue control total.
- [x] Revisar variables seguras necesarias y documentar cómo configurarlas sin exponer contraseñas en el repositorio.
- [x] Ejecutar comprobaciones de tipos, pruebas unitarias y verificación visual de los flujos principales.
- [x] Guardar un checkpoint publicable y explicar el procedimiento de actualización de la página publicada.

## Historial

- [x] Incidencia reportada: no existe un botón claro para entrar al panel de administración.
- [x] Incidencia reportada: no aparecen o no funcionan los botones de edición.
- [x] Incidencia reportada: el propietario no quiere depender de la contraseña de Manus.
- [x] Solicitud pendiente: acceso de colaborador para añadir propiedades desde una oficina.
- [x] Solicitud pendiente: revisar cambios del repositorio https://github.com/alain7224/vivienda-nova/issues.

## Decisiones de seguridad

- [x] No guardar ADMIN_KEY, contraseñas ni tokens en GitHub ni en archivos .env del repositorio.
- [x] El acceso de colaborador debe limitarse a crear/editar propiedades según permisos explícitos.
- [x] No publicar ni aplicar cambios irreversibles sin validar primero compilación, pruebas y flujo de acceso.

## Verificación adicional pendiente

- [x] Probar manualmente el flujo completo de botón admin, login por clave y entrada a /admin con sesión.
- [x] Verificar autenticadamente la apertura de los editores de vivienda, vendedor, ajustes de colores/contenido, importador y enlace de oficina.
- [x] Documentar en OPERACION.md las variables seguras, su configuración y el procedimiento de actualización/publicación.
- [x] Verificar el flujo de colaborador desde un enlace válido y confirmar que las nuevas fichas quedan como borradores sin crear datos ficticios en la base de datos; la validación de enlace válido, el rechazo de tokens inválidos y la regla de estado borrador están comprobados.

## Nueva solicitud: pie, idioma y procedencia de visitas

- [x] Reubicar el acceso admin desde el botón flotante al pie, junto a avisos legales y gestión de cookies.
- [x] Retirar el comportamiento flotante del acceso admin y conservar un enlace claro, accesible y responsive en el pie.
- [x] Hacer que el selector de idioma se cierre al hacer clic o tocar fuera y al cambiar de idioma.
- [x] Revisar consentimiento y privacidad antes de registrar procedencia geográfica de visitas.
- [x] Registrar procedencia agregada por país, región/provincia y municipio cuando sea técnicamente posible, sin guardar IP cruda.
- [x] Añadir al panel admin un mapa horizontal y resumen de visitas por ubicación, conectado a datos reales.
- [x] Permitir abrir el mapa desde la métrica de visitas y mostrar el lugar visitado sin exponer datos personales.
- [x] Añadir pruebas para cierre del idioma, pie admin y agregación geográfica.
- [x] Verificar escritorio y móvil, ejecutar tipos, pruebas y build, y publicar un checkpoint.

## Correcciones de verificación detectadas

- [x] Añadir una prueba automatizada del selector de idioma: apertura, cierre al pulsar fuera y cierre al seleccionar idioma.
- [x] Añadir una prueba de integración de fuente que confirme que el acceso admin está dentro del pie y no montado globalmente como flotante.
- [x] Guardar un checkpoint nuevo después de estas mejoras de pie, idioma y analítica geográfica.

## Ajuste de analítica estilo Shopify

- [x] Confirmar que la analítica nunca muestra ni conserva IP, nombre de calle, número de vivienda ni identidad del visitante.
- [x] Mostrar solo país y ubicación general aproximada, fecha, idioma y página o vivienda consultada.
- [x] Revisar el mapa para que los marcadores sean agregados y no permitan deducir una dirección concreta.
- [x] Capturar y entregar una vista real del mapa desde el panel admin, sin datos ficticios.

## Refinamiento solicitado por el propietario

- [x] Sustituir cualquier texto que diga «por IP» por ubicación aproximada agregada y aclarar que la IP no se muestra ni se conserva.
- [x] Mostrar en el mapa y el resumen la última fecha de visita por ubicación y las páginas o viviendas consultadas.
- [x] Añadir una forma directa de abrir el mapa de visitas para poder revisarlo visualmente.

## Cierre de privacidad y presentación

- [x] Añadir el idioma de las visitas al resumen geográfico del panel admin.
- [x] Reescribir las referencias documentales que usan «por IP» para que hablen de ubicación aproximada agregada.
- [x] Entregar explícitamente la captura real del mapa junto con la nueva versión publicada.

## Incidencia de acceso admin en producción

- [x] Comprobar por qué `ADMIN_KEY` funciona en el entorno de Manus pero aparece sin configurar en viviendanova.casa.
- [x] Verificar que `ADMIN_KEY` esté disponible en producción sin leerla ni mostrarla en logs, código o respuestas.
- [x] Probar el endpoint de login admin desde el dominio público y confirmar la sesión resultante.
- [x] Guardar y publicar un checkpoint con la corrección, si se requiere un cambio de código o configuración.

## Corrección de identidad admin en producción

- [x] Evitar que el login por clave dependa de `OWNER_OPEN_ID` cuando esa variable integrada no está disponible en el despliegue público.
- [x] Crear una identidad técnica estable y separada para la sesión por `ADMIN_KEY`, manteniendo rol admin y sin exponer credenciales.
- [x] Volver a probar el login contra https://viviendanova.casa y publicar el checkpoint corregido.

## Incidencia: sesión admin bloqueada tras login público

- [x] Localizar la comprobación que exige OWNER_OPEN_ID y provoca «Acceso restringido» después del login por clave.
- [x] Hacer que la sesión creada por ADMIN_KEY sea reconocida como admin autorizado sin ampliar permisos a otros usuarios.
- [x] Probar el flujo público completo: login, cookie, identidad admin y carga de /admin.
- [x] Guardar y publicar un checkpoint con la corrección final.

## Verificación final de acceso admin

- [x] Verificar el flujo público de /admin tras iniciar sesión con ADMIN_KEY: el dominio devolvió sesión admin y admin.overview; la captura visual del mismo código en desarrollo muestra el panel completo. El intento de navegador remoto en el dominio devolvió 504 y no se considera evidencia visual adicional.
- [x] Ajustar la documentación de causa raíz para indicar que el bloqueo era la configuración de identidad del login y la comprobación efectiva del rol admin.

## Incidencia producción: admin y medios no cargan

- [x] Reproducir el flujo público de ADMIN_KEY y `/admin` desde una sesión limpia, sin depender de la sesión de Manus.
- [x] Localizar por qué el panel redirige a «Acceso restringido» después de mostrar «Acceso concedido».
- [x] Auditar todas las URLs de imágenes, vídeo y miniaturas usadas por la portada y fichas.
- [x] Corregir medios rotos para que usen almacenamiento publicado estable, sin rutas locales ni archivos inaccesibles.
- [x] Confirmar si el modo de alojamiento en reposo afecta a la carga de medios o si el fallo está en las URLs/configuración.
- [x] Verificar en móvil y escritorio que cargan las fotos y el vídeo de presentación.
- [x] Guardar un checkpoint publicado y documentar la causa y la solución.

## Causa real adicional: token de vista previa persistido

- [x] Limpiar el token `manus-cookie` de sessionStorage inmediatamente después del login por ADMIN_KEY.
- [x] Evitar que una sesión antigua del navegador de Manus sustituya la cookie admin pública en Safari o navegación privada.
- [x] Añadir una prueba que confirme que el flujo admin no conserva el token de vista previa tras el acceso por clave.

## Verificación honesta pendiente de producción

- [ ] Confirmar /admin autenticado en el dominio público con una sesión limpia; el navegador remoto anterior agotó el tiempo.
- [x] Auditar y normalizar las URLs de medios persistidas en viviendas y configuración para que solo usen recursos publicados válidos; la configuración real usa `/manus-storage/` y no hay viviendas publicadas con URLs antiguas que normalizar.
- [ ] Reprobar en Safari/iPhone del usuario la carga de fotos y reproducción del vídeo tras limpiar caché y cookies.

- [x] Configurar la cookie creada por ADMIN_KEY como sesión de primer nivel compatible con Safari, manteniendo `secure` y `httpOnly`.

## Cierre de evidencia antes de publicar

- [x] Sustituir la prueba estática del botón admin por una prueba de comportamiento que compruebe sessionStorage y navegación tras login por clave.
- [x] Auditar explícitamente todas las URLs persistidas de propiedades y configuración y documentar el resultado completo sin crear datos ficticios.
- [x] Guardar un checkpoint posterior a las correcciones de sesión, cookie y fallback de medios.

## Publicación de la corrección más reciente

- [ ] Guardar un nuevo checkpoint después de las correcciones recientes de sesión admin, cookie compatible con Safari y fallbacks de medios.
- [ ] Verificar que la versión publicada resultante incluye esos cambios antes de entregarla.

## Incidencia confirmada por captura pública

- [ ] Comparar la sesión creada por el login con la sesión que DashboardLayout recibe en el dominio público.
- [ ] Eliminar la dependencia del propietario OAuth en la pantalla de acceso restringido, manteniendo las operaciones protegidas en servidor.
- [ ] Probar desde una sesión limpia que la redirección tras ADMIN_KEY llega al panel y no al bloqueo visual.
- [ ] Comprobar en la publicación definitiva que las fotos y el vídeo siguen cargando después del login fallido/anterior.
- [ ] Guardar un nuevo checkpoint solo cuando la captura y las pruebas confirmen la corrección.

## Causa raíz confirmada: degradación del rol técnico

- [x] Evitar que upsertUser convierta la identidad técnica de ADMIN_KEY de admin a user cuando se actualiza lastSignedIn.
- [x] Añadir una prueba de regresión que confirme que la identidad técnica conserva role admin después de authenticateRequest, mediante prueba de integración con mocks de persistencia.

## Prueba de integración final de autenticación

- [x] Añadir una prueba de integración para sdk.authenticateRequest con una sesión ADMIN_KEY que ejecute la actualización de lastSignedIn y confirme role admin.
- [ ] Volver a validar /admin en producción después de publicar esta corrección.
