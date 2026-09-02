# Fuente técnica de geolocalización

La implementación consulta `https://ipapi.co/{ip}/json/` únicamente desde el servidor cuando la analítica ha sido consentida. La documentación oficial consultada es https://ipapi.co/api/ y describe los campos `city`, `region`, `country_name`, `country_code`, `latitude` y `longitude`. La aplicación no persiste el identificador de red original; solo guarda los campos geográficos agregados, el idioma, la página y el dominio de referencia.

La ubicación general aproximada puede ser imprecisa con VPN, redes móviles, proxies o proveedores que ocultan la localización. Si el proveedor no responde, se usan cabeceras geográficas disponibles o se deja la ubicación sin coordenadas.
