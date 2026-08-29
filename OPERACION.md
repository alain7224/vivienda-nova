# Operación de Vivienda Nova

## Acceso privado

La administración se abre en **`/admin`**. Entra con la misma cuenta del propietario del proyecto. El sistema valida esa identidad en el servidor: cualquier otra persona que acceda a esta ruta verá un mensaje de acceso restringido y no podrá consultar ni modificar la cartera, los interesados ni los enlaces.

## Publicar una vivienda

Selecciona **«Añadir vivienda»** en el área privada. Completa los datos del inmueble, el precio visible y numérico, la descripción y la imagen de portada. Puedes subir una fotografía en JPG, PNG o WebP de hasta 5 MB; la aplicación guarda la imagen de forma segura y solo conserva la referencia en la ficha. Mantén la vivienda en **«Borrador privado»** mientras la revisas y elige **«Publicada»** para mostrarla en el escaparate.

La misma ficha permite introducir una URL de imagen alojada externamente. Esta opción es útil cuando cuentas con autorización del propietario de la imagen y deseas reutilizarla desde su ubicación original.

## Enlazar con el vendedor principal

En el bloque **«Contactos y enlace del vendedor»** elige uno de estos recorridos: solo consulta, solo enlace externo, o ambos. Para los inmuebles que se redirijan, introduce la URL facilitada por el vendedor, el nombre del parámetro que acepta —por ejemplo, `ref` o `utm_source`— y tu código único de referencia. Al visitar al vendedor, Vivienda Nova registra el clic y añade el código configurado al enlace.

Ejemplo: si el vendedor entrega `https://vendedor.example/casa` y acepta el parámetro `ref` con el código `nova-018`, la salida será `https://vendedor.example/casa?ref=nova-018`.

> El registro de clics y solicitudes es una evidencia operativa de origen, pero no sustituye un acuerdo comercial. Antes de promocionar cada inmueble, confirma por escrito qué enlace, código o sistema acepta el vendedor para reconocer el referido y liquidar la comisión.

## Interesados y avisos

Cuando un visitante envía el formulario vinculado a una vivienda, la consulta se conserva en **«Interesados identificados»** con la fecha, los datos de contacto y el inmueble. Además, se envía un aviso privado a la cuenta propietaria del proyecto. Desde la tabla puedes abrir el correo o llamar al teléfono que haya dejado el interesado.

## Información que debes pedir a cada vendedor

| Dato | Por qué es necesario |
|---|---|
| Enlace exacto de la vivienda | Define el destino de la redirección externa. |
| Código o enlace de afiliado/referido | Permite que el vendedor te atribuya la procedencia del cliente. |
| Parámetro admitido | Evita añadir un código que su web no registre. |
| Acuerdo de comisión | Define importe, condición de cobro y prueba de atribución. |

La cartera empieza deliberadamente vacía para que solo aparezcan los inmuebles y datos comerciales que tú autorices desde la administración.
