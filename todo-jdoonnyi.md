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
