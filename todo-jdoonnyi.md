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
