# Operación de Vivienda Nova

## Acceso privado

La administración se abre en **`/admin`**. Entra con la misma cuenta del propietario del proyecto. El sistema valida esa identidad en el servidor: cualquier otra persona que acceda a esta ruta verá un mensaje de acceso restringido y no podrá consultar ni modificar la cartera, los interesados ni los enlaces.

## Publicar una vivienda

Selecciona **«Añadir vivienda»** en el área privada. Completa los datos del inmueble, el precio visible y numérico, la descripción y la imagen de portada. Puedes subir una fotografía en JPG, PNG o WebP de hasta 5 MB; la aplicación guarda la imagen de forma segura y solo conserva la referencia en la ficha. Mantén la vivienda en **«Borrador privado»** mientras la revisas y elige **«Publicada»** para mostrarla en el escaparate.

La misma ficha permite introducir una URL de imagen alojada externamente. Esta opción es útil cuando cuentas con autorización del propietario de la imagen y deseas reutilizarla desde su ubicación original.

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

## Publicar la web

Cuando quieras hacerla visible en internet, abre el panel del proyecto, guarda una versión y utiliza el botón **Publish**. La plataforma incluye alojamiento y una dirección pública; puedes comenzar con esa dirección sin contratar un proveedor externo. Después podrás conectar un dominio propio desde **Settings → Domains** si lo deseas. Antes de publicar, crea al menos un vendedor y una vivienda publicada para que el escaparate no aparezca vacío.

## Información que debes pedir a cada vendedor

| Dato | Por qué es necesario |
|---|---|
| Enlace exacto de la vivienda | Define el destino de la redirección externa. |
| Código o enlace de afiliado/referido | Se guarda en la ficha del vendedor y permite que atribuya la procedencia del cliente. |
| Parámetro admitido | Evita añadir un código que su web no registre. |
| Acuerdo de comisión | Define importe, condición de cobro y prueba de atribución. |

La cartera empieza deliberadamente vacía para que solo aparezcan los inmuebles y datos comerciales que tú autorices desde la administración.
