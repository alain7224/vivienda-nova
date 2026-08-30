# Verificación de vídeo y filtro de costa

La portada carga correctamente en ordenador y móvil con la ventana de vídeo dentro del bloque editorial indicado. El selector transparente **«Ver costa»** se abre y muestra el estado de configuración cuando todavía no hay clips cargados. La reproducción está preparada para pausarse al salir de pantalla mediante observación de visibilidad y reanudarse al volver a entrar; esta parte se activará con el primer MP4 o WebM que cargue el administrador.

El filtro rápido utiliza coincidencias territoriales para Costa Blanca Norte, Costa Blanca Sur, Costa Cálida y Costa del Sol. La lógica está cubierta con pruebas automatizadas, incluyendo la separación de Torrevieja respecto de Costa del Sol.

Con el clip real de Costa Blanca Norte configurado, el navegador detectó el reproductor activo y, tras desplazar la página fuera de la portada, confirmó `pausedAfterScroll: true`. Esto acredita que la pausa automática se activa cuando el vídeo deja de estar visible.

Al volver a la portada, el reproductor confirmó `playingAfterReturn: true`. El botón **«Ver propiedades de esta costa»** activa el filtro territorial de Costa Blanca Norte y desplaza al catálogo; mientras no haya viviendas publicadas, el catálogo muestra su estado vacío. Las pruebas del filtro confirman que una vivienda de Torrevieja se clasifica en Costa Blanca Sur y no en Costa del Sol.

El mapa de parcela se muestra correctamente después de aceptar el contenido externo o pulsar el botón de activación del propio recorrido. La comprobación devolvió el mapa interactivo de Google y el mensaje «Pulsa en el mapa para marcar la parcela exacta», con el control de ubicación actual disponible.
