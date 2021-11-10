------------
Instalación
------------
Para que la instalación esté al 100% hay que incluir a la visualización una cabecera, un pie, personalizar el CSS y los textos, para que tenga la forma corporativa de donde se va a alojar la visualización.
Para desplegar la visualización hay que copiar los ficheros en un servidor web, como apache.

------------
Configuración
------------
La configuración de la visualización se encuentra en::
    dist/js/constantes.js
	dist/js/general.js

Variables para la la visualización en constantes.js:
* URLAPI, esta variable debe de tener la URL de la API. Ej. https://api.ciudadesabiertas.com/OpenCitiesAPI
* tokenUrl,  esta variable debe de tener la URL para la autenticación de la API. Ej. URLAPI + "/oauth/token"
* docAPI, esta variable debe de tener la URL de la documentación de la API de subvenciones. Ej. URLAPI+"/swagger/index.html";

Variable para la seguridad:
Por motivos de requisitos del proyecto, las credenciales de seguridad son totalmente VISIBLES y por tanto se recomienda combinar código en servidor con la autenticación proporcionada, así se conseguirá que las credenciales no sean accesibles.
* seguridad, poner true para que la visualización use seguridad en las llamadas a la API.

Variables de depuración:
* logDebugXXX, variable para habilitar la depuración del módulo


Otras variables:
* caracteresMinimosBusqueda, número de caracteres mínimos que debe de tener una busqueda para agregarle comodines a ambos lados
* registrosTablabusqueda, número de registros para las tablas de búsqueda
* resgistroGráficos, Número de registros para los gráficos
* registrosTablaGráficos, Número de registros para las tablas de los gráficos
* valTimeout, Tiempo de espera en la petición ajax de autenticación
* limiteCadenasTexto, Limite de las cadenas de texto
* logoBase64, logotipo de la exportación de los PDF de las tablas en formato base64. Ej. data:image/png;base64,xxxxxxxxxxxxxxxxxxxxxx

------------
Multiidioma
------------
Para cambiar el idioma por defecto habrá que editar los archivos '.html' y cambiar el parámetro lang por el idioma deseado. Por ejemplo::
    <html lang="gl" dir="ltr">
    
La localización de los ficheros con los literales de cada idioma están en::
    dist\i18n\es.json
    dist\i18n\gl.json
    dist\i18n\en.json
    
Y los literales de las tablas están en::
    vendor\datatables\i18n\es.json
    vendor\datatables\i18n\gl.json
    vendor\datatables\i18n\en.json
    
------------
Navegadores compatibles
------------
Esta visualización ha sido probada en los navedores:
* Firefox 76
* Google Chrome 81
* Internet explorer 11

------------
Licencia
------------
Esta visualización forma parte de las actuaciones que se llevan a cabo dentro del proyecto "Plataforma de Gobierno Abierto, Colaborativa e Interoperable",
presentado por los ayuntamientos de A Coruña, Madrid, Santiago de Compostela y Zaragoza, que fue seleccionado como beneficiario de la
"II Convocatoria de Ciudades Inteligentes" del Ministerio de Economía y Empresa lanzado a través de la Entidad Pública Empresarial Red.es
adscrita a la Secretaría de Estado de Avance Digital de dicho Ministerio.

Los derechos de autor de esta aplicación pertenecen a © 2020 Ayuntamiento de A Coruña, Ayuntamiento de Madrid, Ayuntamiento de Santiago de Compostela, Ayuntamiento de Zaragoza, Entidad Pública Empresarial Red.es
Licencia cedida con arreglo a la EUPL.
Por favor, tenga en cuenta asimismo las demás menciones de derechos de autor presentes en todos los componentes usados.
