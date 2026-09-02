# Operación de Vivienda Nova

## Acceso privado

La administración se abre en **`/admin`**. También existe el botón visible **«Acceso administrador»** en la web pública y en la propia ruta `/admin`. Ese botón permite entrar con una clave privada propia, sin depender de la contraseña de Manus. La clave se valida en el servidor y crea una sesión segura; no se guarda en el navegador ni en GitHub.

La cuenta de la sesión por clave es la identidad indicada por `OWNER_OPEN_ID` y debe conservar el rol `admin`. La aplicación la sincroniza automáticamente al utilizar la clave. Si se entra con otra cuenta de Manus, se verá acceso restringido y no se podrán consultar ni modificar los datos privados.

### Variables seguras del entorno

`ADMIN_KEY` es obligatoria para activar el botón de acceso por clave. Debe ser larga, aleatoria y privada; configúrala desde el gestor de **Settings → Secrets** del proyecto y nunca la escribas en un commit, issue, captura o archivo `.env` del repositorio. `OWNER_OPEN_ID` identifica la cuenta propietaria que recibirá la sesión admin; `OWNER_NAME` es el nombre mostrado en esa sesión. `JWT_SECRET` firma las cookies de sesión y debe mantenerse configurada y fuerte. Estas variables se gestionan como secretos del entorno, no como contenido de la aplicación.

Si sospechas que la clave se ha compartido, sustitúyela desde **Settings → Secrets** y reinicia/reconstruye el proyecto. La sesión anterior podrá mantenerse hasta su caducidad, por lo que, ante una exposición real, conviene cerrar sesiones y solicitar la rotación del secreto de sesión según el panel de gestión.

## Enlaces de oficina para colaboradores

Desde el panel admin utiliza **«Enlace de oficina»**. Escribe el nombre de la oficina y elige una caducidad de 7, 30, 60 o 90 días. La aplicación genera un enlace aleatorio de un solo propósito; en la base de datos solo se conserva su huella, no el token en claro. Copia el enlace y entrégalo únicamente a la persona autorizada.

El colaborador abre `/oficina/<token>` y completa una ficha. El enlace solo permite crear viviendas en estado **borrador**; no permite ver clientes, vendedores, métricas, ajustes, imágenes privadas ni el panel admin. Antes de publicarla, revisa la vivienda en **«Cartera»**, corrige los datos si es necesario y añade el enlace y el flujo del vendedor. Puedes revocar un enlace desde el mismo gestor; al revocarlo deja de funcionar inmediatamente.

El enlace funciona como una llave privada: no debe publicarse en un anuncio ni compartirse en grupos abiertos. Si necesitas varias oficinas, crea un enlace distinto para cada una para poder revocarlos por separado.

## Publicar una vivienda

Selecciona **«Añadir vivienda»** en el área privada. Completa los datos del inmueble, el precio visible y numérico, la descripción y la imagen de portada. Puedes subir una fotografía en JPG, PNG o WebP de hasta 5 MB; la aplicación guarda la imagen de forma segura y solo conserva la referencia en la ficha. Mantén la vivienda en **«Borrador privado»** mientras la revisas y elige **«Publicada»** para mostrarla en el escaparate.

La misma ficha permite introducir una URL de imagen alojada externamente. Esta opción es útil cuando cuentas con autorización del propietario de la imagen y deseas reutilizarla desde su ubicación original.

## Actualizar varias viviendas con un archivo

En el área privada, utiliza **«Importar CSV»** para crear varias viviendas desde un archivo. Primero descarga la plantilla CSV, complétala con una fila por vivienda y vuelve a cargarla. La plataforma mostrará una vista previa y los errores antes de guardar nada. El archivo acepta separador por coma o punto y coma y debe contener, como mínimo, título, ciudad, zona, precio, precio numérico, dormitorios, baños, superficie, descripción, URL de imagen, estado y flujo de derivación.

Una vivienda marcada como **publicada** debe incluir una URL del vendedor y un flujo de derivación `redirect` o `both`. Carga imágenes mediante la ficha individual o utiliza una URL de imagen autorizada dentro del archivo. La importación está disponible solo en tu administración privada.

## Enlazar con el vendedor principal

Primero crea la ficha del **vendedor** en la administración y guarda por escrito el canal, parámetro y código que acepta. El código inicial de Vivienda Nova es **`MARTINEZ`**, pero se puede cambiar en cada vendedor o vivienda. Después vincula ese vendedor a cada vivienda y añade la URL exacta de la oferta, si el canal es enlace directo.

El canal puede ser enlace directo, correo, WhatsApp, SMS o llamada. Para un enlace directo, si el vendedor entrega `https://vendedor.example/casa` y acepta el parámetro `ref` con el código `MARTINEZ`, la salida será `https://vendedor.example/casa?ref=MARTINEZ`. En los demás canales, la aplicación prepara el mensaje con el cliente, el inmueble o proyecto y el código de referencia antes de abrir la aplicación elegida.

La acción principal de la tarjeta pública es **«Ver oferta del vendedor»**. El visitante se dirige así directamente a la empresa que realiza la venta, mientras Vivienda Nova conserva de forma privada el registro del clic, la vivienda, el canal y la fecha. El formulario de contacto es una vía opcional para quien pida ayuda adicional.

> El registro de clics y solicitudes es una evidencia operativa de origen, pero no sustituye un acuerdo comercial. Antes de promocionar cada inmueble, confirma por escrito qué enlace, código o sistema acepta el vendedor para reconocer el referido y liquidar la comisión.

## Interesados y avisos

Cuando un visitante envía el formulario vinculado a una vivienda, la consulta se conserva en **«Clientes y proyectos»** con la fecha, los datos de contacto, el inmueble y su estado. Además, se envía un aviso privado a la cuenta propietaria del proyecto. Desde la tabla puedes abrir el correo o llamar al teléfono que haya dejado el interesado, elegir el vendedor y pulsar **«Enviar»** para preparar una derivación por el canal configurado.

Los avisos internos no dependen de un servicio de correo externo. El canal «Correo» se usa para derivar un referido directamente a la dirección que configures para cada vendedor; abre un mensaje preparado en el equipo de quien realice la derivación.

La misma área registra las visitas y clics en **«Visitas y referidos»**. Se muestran los últimos 100 eventos con vivienda, idioma o canal y fecha. No se guarda la dirección IP del visitante.

## Construcción a medida

El bloque **«Construye desde cero»** permite captar a una persona que todavía no busca una vivienda concreta. Pregunta por el lugar, provincia, presupuesto, tipo de vivienda y necesidades. Estas solicitudes aparecen diferenciadas en el CRM como **«Construcción a medida»** y pueden derivarse a un vendedor o empresa constructora igual que una vivienda.

## Idiomas y presentación

En **«Idiomas y diseño»** puedes cambiar el texto, el color, el alto y el ritmo del banner superior; activar o desactivar idiomas; y escoger tarjetas planas o con efecto 3D. La web detecta el idioma del navegador, pero cualquier visitante puede sustituirlo en el selector. Las fichas se guardan primero en español y se traducen automáticamente a los idiomas habilitados; revisa cualquier traducción técnica antes de publicarla.

| Idiomas disponibles | Configuración |
|---|---|
| Español, inglés, neerlandés, alemán, sueco, noruego, francés, rumano, ruso y chino simplificado | Detección del idioma del navegador y selector manual. |
| Alemán de Suiza, francés de Suiza e italiano de Suiza | Opciones separadas, porque Suiza no tiene una única lengua nacional. |

## Operaciones y comisiones

Cuando el vendedor confirme que una venta se ha cerrado, abre **«Añadir operación»**. Indica el cliente, la vivienda o proyecto, dirección, ciudad, provincia, país, precio de cierre y porcentaje de comisión. El panel calcula el importe y permite clasificarlo como **previsto**, **pendiente**, **cobrado** o **cancelado**. El resumen superior y la sección de operaciones muestran estas categorías por separado.

## Publicar y actualizar la web

La web publicada no necesita despublicarse para aplicar una corrección de código. Se trabaja sobre la versión de desarrollo, se comprueban tipos, pruebas, compilación y pantallas, y después se guarda un **checkpoint**. En este proyecto el guardado del checkpoint publica automáticamente la nueva versión; la página permanece accesible durante el proceso y la base de datos conserva viviendas, vendedores, contactos, métricas, ajustes y enlaces de oficina.

Los cambios de contenido que hagas desde **`/admin`** se guardan directamente en la base de datos y no requieren publicar una nueva versión de código. Las actualizaciones de código o de estructura sí requieren guardar el checkpoint. Si una versión necesitara retirarse, utiliza el historial del proyecto para volver a una versión estable, sin ejecutar borrados manuales sobre la base de datos.

La plataforma incluye alojamiento y una dirección pública; puedes utilizarla sin contratar un proveedor externo. Después podrás conectar un dominio propio desde **Settings → Domains** si lo deseas. Antes de dar por terminada una publicación, crea al menos un vendedor y una vivienda publicada real para que el escaparate no aparezca vacío.

### Lista de comprobación antes de publicar

1. Entra en **`/admin`** con el botón **«Acceso administrador»** y prueba la `ADMIN_KEY` propia. Confirma que ves el panel privado y que aparecen **«Añadir vivienda»**, **«Importar CSV»**, **«Vendedores»**, **«Añadir operación»**, **«Idiomas y diseño»** y **«Enlace de oficina»**. Como alternativa, el login OAuth de la cuenta propietaria sigue disponible.
2. Crea cada **vendedor** y confirma por escrito su enlace, código de referido, canal de contacto y condiciones de comisión. Usa `MARTINEZ` solo si el vendedor confirma que reconoce ese código.
3. Publica al menos una **vivienda real** con precio, superficie, dormitorios, baños, fotografía autorizada y enlace de derivación correcto. Mantén en borrador todo lo que no deba aparecer aún.
4. Prueba desde la ficha pública el enlace al vendedor, el teléfono, WhatsApp y los botones de compartir. Revisa especialmente que cada enlace abre el destino esperado.
5. Sustituye los datos pendientes de los textos de privacidad, cookies y aviso legal: razón social o nombre, NIF/CIF, domicilio, correo de derechos, conservación y destinatarios. Estos borradores requieren revisión jurídica antes de una actividad comercial.
6. Comprueba la portada y el formulario en móvil y ordenador. El formulario solo debe pedir datos que vayas a gestionar y los consentimientos de privacidad y derivación deben seguir visibles.
7. Guarda una **versión de respaldo** del proyecto antes de publicar. La administración, métricas, interesados, vendedores y comisiones permanecen tras inicio de sesión; una visita pública no puede consultar esos datos.
8. Cuando los puntos anteriores estén listos, guarda un checkpoint. En este proyecto ese checkpoint se publica automáticamente; no hay que despublicar primero. La publicación no cambia quién puede entrar al área privada: solo actualiza el código público y conserva los datos de la base de datos.

Las actualizaciones de contenido que hagas desde **`/admin`** —viviendas, vendedores, imágenes, operaciones o ajustes visuales— se guardan en la base de datos y no requieren editar el código. Si cambias el diseño, las funciones o los textos estructurales, guarda una nueva versión del proyecto y vuelve a utilizar **Publish** para actualizar la versión pública.

## Copia y control del proyecto

Conserva una copia de la web desde el área de **Code** o conecta el proyecto a un repositorio de GitHub desde **Settings → GitHub**. Si la web utiliza el alojamiento incluido, su funcionamiento depende de ese servicio de alojamiento; el dominio que compres en un registrador externo sigue bajo tu control. Para trasladar la aplicación a otro proveedor se requiere exportar el código, configurar las variables de entorno y adaptar el despliegue al nuevo proveedor.

## Titular comercial, modelo y futura cesión

Desde **Administración → Idiomas y diseño** puedes cambiar el campo **«Titular comercial»** y seleccionar el **modelo de la web**:

| Modelo | Qué cambia con el selector | Qué no incorpora todavía |
|---|---|---|
| Promoción inmobiliaria | Conserva viviendas, vendedor externo, código de referido y registro privado de clics o comisiones. | No gestiona contratos, visitas ni pagos de la compraventa. |
| Catálogo comercial | Cambia las etiquetas públicas a productos, catálogo y consulta de producto. Permite publicar una ficha para consulta directa sin un enlace de vendedor. | No añade carrito, stock, cobro, pedido ni envío. Para una tienda con pagos habrá que conectar una plataforma de comercio. |

El **titular comercial** es el nombre mostrado en el pie y en los textos legales; puedes sustituirlo cuando cambie la empresa, marca o persona responsable. No modifica la cuenta técnica de administrador. Esta separación es importante: el acceso a **`/admin`**, la base de datos y las métricas continúan protegidos por la cuenta propietaria del proyecto, no por el texto que aparece en la web.

Si un día vendes el proyecto, conserva primero una versión de respaldo y sigue este orden: transfiere el repositorio de GitHub al comprador, entrégale o transfiera el dominio en el registrador correspondiente, y solicita el cambio de propiedad del proyecto y de sus servicios de alojamiento o crea una copia nueva bajo la cuenta del comprador. Antes de entregar datos reales, acuerda por escrito qué ocurre con los contactos, métricas, vendedores y archivos existentes; no deben transferirse sin una base legal y la información necesaria para los interesados.

GitHub guarda el **código y el historial de cambios**, pero no sustituye por sí solo al alojamiento, la base de datos, el inicio de sesión ni el almacenamiento de archivos. Puedes alojar la aplicación aquí y usar GitHub como respaldo y control de versiones, o exportar el proyecto y configurarlo en otro proveedor cuando sea necesario.

## Información que debes pedir a cada vendedor

| Dato | Por qué es necesario |
|---|---|
| Enlace exacto de la vivienda | Define el destino de la redirección externa. |
| Código o enlace de afiliado/referido | Se guarda en la ficha del vendedor y permite que atribuya la procedencia del cliente. |
| Parámetro admitido | Evita añadir un código que su web no registre. |
| Acuerdo de comisión | Define importe, condición de cobro y prueba de atribución. |

La cartera empieza deliberadamente vacía para que solo aparezcan los inmuebles y datos comerciales que tú autorices desde la administración.
