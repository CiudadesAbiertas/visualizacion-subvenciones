------------
Instalación
------------

Para que la instalación esté al 100% habrá que incluir a la visualización una cabecera, un pie de página, repasar el CSS, repasar y traducir los textos para que tenga la forma corporativa de donde se va a alojar la visualización.

Para desplegar la visualización habrá que copiar los ficheros en un servidor web, como **Apache**.

------------
Configuración
------------
La configuración de la visualización se encuentra en::

    dist/js/constantes.js
	dist/js/general.js

Variables para la la visualización en constantes.js:

* URLAPI, esta variable debe de tener la URL de la API. Ej. https://api.ciudadesabiertas.com/OpenCitiesAPI
* subvencionURL, esta variable debe de tener la URL de la API de subvenciones. Ej. URLAPI + "/subvencion/subvencion"
* subvencionAgrupadaURL, esta variable debe de tener la URL para la API de subvenciones agrupadas en formato json. Ej. subvencionURL + "/groupBy.json"
* subvencionURLdistinct, esta variable debe de tener la URL para la API de distinct en formato json. Ej. subvencionURL + "/distinct.json"
* tokenUrl,  esta variable debe de tener la URL para la autenticación de la API. Ej. URLAPI + "/oauth/token"
* idiomaAPI, Si se usa una API con multiidioma con esta variable de podrá controlar
* subvencionAgrupadaURLCSV, esta variable debe de tener la URL para la API de subvenciones agrupadas en formato CSV. Ej. subvencionURL + "/groupBy.csv"
* docAPI, esta variable debe de tener la URL de la documentación de la API de subvenciones. Ej. URLAPI + "/swagger/index.html#/Subvención"

Variables de los parámetros de la API
* paramFieldsAPI, Parámetro para especificar que atributos se quieren solicitar. Ejemplo: id,title
* paramFieldAPI, Parámetro para especificar que atributo se quiere solicitar. Ejemplo: title
* paramGroupAPI, Parámetro para espeficicar el campo o los campos por lo que se agrupará la búsqueda
* paramSortAPI, Parámetro para espeficicar el orden de la consulta
* paramPageSizeAPI, Parámetro para especificar el tamaño de página
* paramWhereAPI, Parámetro para especificar un filtro sobre los campos
* paramQAPI, Parámetro para especificar una consulta de tipo RSQL.
* paramPageAPI, Parámetro para especificar la página que se quiere solicitar
* paramHavingAPI, Parámetro para especificar el filtro sobre las operaciones de agrupación. Ejemplo COUNT(id) > 5

Variables para las querys de la API en general.js:

* queryIndicadorSubvenciones, URL que obtiene una lista de subvenciones agrupada por tipoInstrumento y contanto las subvenciones. Ej. subvencionAgrupadaURL + "?fields=count(id)&group=tipoInstrumento"
* queryIndicadorBeneficiarios, URL que obtiene una lista de beneficiarios agrupada por tipoInstrumento y contanto las beneficiarios. Ej. subvencionAgrupadaURL + "?fields=count(distinct adjudicatarioId)&group=tipoInstrumento"
* queryIndicadorImporteTotal, URL que obtiene una lista de importes agrupada por tipoInstrumento y sumando los importes. Ej. subvencionAgrupadaURL + "?fields=sum(importe)&group=tipoInstrumento"
* queryIndicadorSubvencionesGlobal, URL que obtiene una lista de subvenciones agrupada por año y contanto las subvenciones. Ej. subvencionAgrupadaURL + "?fields=count(distinct id),EXTRACT(YEAR FROM fechaAdjudicacion)&group=EXTRACT(YEAR FROM fechaAdjudicacion)"
* queryIndicadorBeneficiariosGlobal, URL que obtiene una lista de beneficiarios agrupada por año y contanto las beneficiarios. Ej. subvencionAgrupadaURL + "?fields=count(distinct adjudicatarioId),EXTRACT(YEAR FROM fechaAdjudicacion)&group=EXTRACT(YEAR FROM fechaAdjudicacion)"
* queryIndicadorImporteTotalGlobal, URL que obtiene una lista de importes agrupada por año y sumando los importes. Ej. subvencionAgrupadaURL + "?fields=sum(importe),EXTRACT(YEAR FROM fechaAdjudicacion)&group=EXTRACT(YEAR FROM fechaAdjudicacion)"

* queryGraficoDepGasto, URL que obtiene una lista del nombre de las áreas y la suma del importe de las áreas en formato JSON. Ej. subvencionAgrupadaURL + "?fields=areaTitle, sum(importe)&group=areaTitle&sort=-sum(importe)"
* queryGraficoDepGastoCSV, URL que obtiene una lista del nombre de las áreas y la suma del importe de las áreas en formato CSV. Ej. subvencionAgrupadaURLCSV + "?fields=areaTitle, sum(importe)&group=areaTitle&sort=-sum(importe)"
* queryGraficoAreas, URL que obtiene una lista del nombre de las áreas y la suma del importe de las áreas en formato JSON. Ej. subvencionAgrupadaURL + "?fields=areaTitle, count(title)&group=areaTitle&sort=-count(title)"
* queryGraficoAreasTop10, URL que obtiene una lista del top 10 del nombre de las áreas y la suma del importe de las áreas en formato JSON. Ej. subvencionAgrupadaURL + "?"+paramFieldsAPI+"=areaTitle, count(title)&"+paramGroupAPI+"=areaTitle&"+paramSortAPI+"=-count(title)&"+paramPageSizeAPI+"="+registrosTablaGráficos


* queryGraficoImporteTipoBeneficiarios, URL que obtiene una lista de la primera letra del adjudicatarioId e importe agrupada por primera letra del adjudicatarioId y sumando los importes en formato JSON. Ej. subvencionAgrupadaURL+"?fields=substring(adjudicatarioId,1,1),sum(importe)&group=substring(adjudicatarioId,1,1)"
* queryGraficoImporteTipoBeneficiariosCSV, URL que obtiene una lista de la primera letra del adjudicatarioId e importe agrupada por primera letra del adjudicatarioId y sumando los importes en formato CSV. Ej. subvencionAgrupadaURLCSV + "?fields=substring(adjudicatarioId,1,1),sum(importe)&group=substring(adjudicatarioId,1,1)"

* queryIniAreas, URL que obtiene las areas. Ej. subvencionURLdistinct + "?"+paramFieldAPI+"=areaTitle";
* queryIniLineaFinanciacion, URL que obtiene las Lineas de Financiacion. Ej, subvencionURLdistinct + "?"+paramFieldAPI+"=lineaFinanciacion&"+paramPageAPI+"=1&"+paramPageSizeAPI+"=100"
* queryIniEntidadFinanciadoraTitle, URL que obtiene las entidades Financiadoras. Ej. subvencionURLdistinct + "?"+paramFieldAPI+"=entidadFinanciadoraTitle&"+paramPageAPI+"=1&"+paramPageSizeAPI+"=100"
* queryIniTipoInstrumento, URL que obtiene los tipos de instrumento. Ej. subvencionURLdistinct + "?"+paramFieldAPI+"=tipoInstrumento&"+paramPageAPI+"=1&"+paramPageSizeAPI+"=100"

* queryIniGraficoSubvencionesLineaFinanciacion, URL que obtiene una lista agrupada por lineas de financiación contando las subvenciones. Ej. subvencionAgrupadaURL + "?"+paramFieldsAPI+"=lineaFinanciacion,count(title)&"+paramGroupAPI+"=lineaFinanciacion&"+paramSortAPI+"=-count(title)&"+paramPageSizeAPI+"=50"

* queryIniAnyos, URL que obtiene una lista de años agruando por años. Ej. subvencionAgrupadaURL + "?fields=EXTRACT(YEAR FROM fechaAdjudicacion)&group=EXTRACT(YEAR FROM fechaAdjudicacion)"
* queryIniGraficoLineaNum, URL que obtiene una lista de lineaFinanciacion e importe agrupada por lineaFinanciacion y sumando los importes. Ej. subvencionAgrupadaURL + "?fields=lineaFinanciacion,count(title)&group=lineaFinanciacion"
* queryBusquedaSubvenciones, URL que obtiene una lista de nombre y area agrupando por nombre y area. Ej. queryBusquedaSubvenciones = subvencionAgrupadaURL + "?fields=title,areaTitle&group=title,areaTitle"
* queryTablaFichaSubvenciones_1, primera parte de la URL que obtiene una subvencion filtrando por nombre, area. Ej. subvencionURL + "?title="
* queryTablaFichaSubvenciones_2, segunda parte de la URL que obtiene una subvencion filtrando por nombre, area. Ej. "&areaTitle="
* queryTablaFichaSubvenciones_3, tercera parte de la URL que obtiene una subvencion filtrando por nombre, area. "&sort=-importe"
* queryFichaIndicadorNumSubvenciones_1, primera parte de la URL que obtiene una lista de importe agrupando por nombre y area, filtrando por nombre y area y contando el numero de subvenciones. Ej. subvencionAgrupadaURL + "?fields=count(importe)&group=title,areaTitle&where=title like '"
* queryFichaIndicadorNumSubvenciones_2, segunda parte de la URL que obtiene una lista de importe agrupando por nombre y area, filtrando por nombre y area y contando el numero de subvenciones. Ej. "' and areaTitle like '"
* queryFichaIndicadorNumSubvenciones_3, tercera parte de la URL que obtiene una lista de importe agrupando por nombre y area, filtrando por nombre y area y contando el numero de subvenciones. Ej. "'"
* queryFichaIndicadorSumSubvenciones_1, primera parte de la URL que obtiene una lista de importe agrupando por nombre y area filtrando por nombre y area y sumando el importe-. Ej. subvencionAgrupadaURL + "?fields=sum(importe)&group=title,areaTitle&where=title like '"
* queryFichaIndicadorSumSubvenciones_2, segunda parte de la URL que obtiene una lista de importe agrupando por nombre y area filtrando por nombre y area y sumando el importe. Ej. "' and areaTitle like '"
* queryFichaIndicadorSumSubvenciones_3, tercera parte de la URL que obtiene una lista de importe agrupando por nombre y area filtrando por nombre y area y sumando el importe. Ej. "'"

* queryIniGraficoSumImporteBeneficiarios, URL que obtiene una lista de importe, dni/cif y beneficiario agrupando por dni/cif y beneficiario y sumando los importes y ordenando por la suma de los importes. Ej. subvencionAgrupadaURL + "?fields=sum(importe),adjudicatarioId,adjudicatarioTitle&group=adjudicatarioId,adjudicatarioTitle&sort=-sum(importe)"
* queryIniGraficoNumSubvencionesBeneficiarios, URL que obtiene una lista de número de beneficiarios, dni/cif y beneficiario agrupando por dni/cif y beneficiario contando el número de beneficiario y ordenando por el número de beneficiario. Ej. subvencionAgrupadaURL + "?fields=count(title),adjudicatarioId,adjudicatarioTitle&group=adjudicatarioId	,adjudicatarioTitle&sort=-count(title)"
* queryBusquedaBeneficiarios, URL que obtiene una lista de dni/cif y beneficiario agrupando por dni/cif y beneficiario. Ej. subvencionAgrupadaURL + "?fields=adjudicatarioId,adjudicatarioTitle&group=adjudicatarioId,adjudicatarioTitle"
* queryTablaFichaBeneficiarios, URL que obtiene una subvencion filtrando por dni/cif. Ej. subvencionURL + ".json?adjudicatarioId="
* queryFichaIndicadorSumImporteBeneficiarios_1, primera parte de la URL que obtiene una lista de importe agrupando por dni/cif y beneficiario filtrando por dni/cif. Ej. subvencionAgrupadaURL + "?fields=sum(importe)&group=adjudicatarioId,adjudicatarioTitle&where=adjudicatarioId like '"
* queryFichaIndicadorSumImporteBeneficiarios_2, segunda parte de la URL que obtiene una lista de importe agrupando por dni/cif y beneficiario filtrando por dni/cif. "'"
* queryFichaIndicadorNumSubvencionesBeneficiarios_1, primera parte de la URL que obtiene una lista de número de beneficiarios agrupando por dni/cif y beneficiario filtrando por dni/cif. Ej. subvencionAgrupadaURL + "?fields=count(title)&group=adjudicatarioId,adjudicatarioTitle&where=adjudicatarioId like '"
* queryFichaIndicadorNumSubvencionesBeneficiarios_2, primera parte de la URL que obtiene una lista de número de beneficiarios agrupando por dni/cif y beneficiario filtrando por dni/cif. "'"
* queryFichaGraficoSumImporteBeneficiarioAnyo_1, primera parte de la URL que obtiene una lista de número de importe, año agrupando por año ordenando por año, filtrando por dni/cif. Ej. subvencionAgrupadaURL + "?fields=sum(importe),EXTRACT(YEAR FROM fechaAdjudicacion)&group=EXTRACT(YEAR FROM fechaAdjudicacion)&sort=-EXTRACT(YEAR FROM fechaAdjudicacion)&where=adjudicatarioId like '"
* queryFichaGraficoSumImporteBeneficiarioAnyo_2, segunda parte de la URL que obtiene una lista de número de importe, año agrupando por año ordenando por año, filtrando por dni/cif. Ej. "'"
* queryGraficoBusquedaSumImporteBeneficiarios, URL que obtiene una lista de importe, dni/cif y beneficiario agrupando por dni/cif y beneficiario sumando los importes y ordenando por la suma de los importes y filtrando os 50 primeros en formato json. Ej. subvencionAgrupadaURL + "?fields=sum(importe),adjudicatarioId,adjudicatarioTitle&group=adjudicatarioId,adjudicatarioTitle&sort=-sum(importe)&pageSize=25"
* queryGraficoBusquedaSumImporteBeneficiariosCSV, URL que obtiene una lista de importe, dni/cif y beneficiario agrupando por dni/cif y beneficiario sumando los importes y ordenando por la suma de los importes y filtrando os 50 primeros en formato CSV. Ej. subvencionAgrupadaURLCSV + "?fields=sum(importe),adjudicatarioId,adjudicatarioTitle&group=adjudicatarioId,adjudicatarioTitle&sort=-sum(importe)&pageSize=25"
* queryGraficoBusquedaNumSubvencionesBeneficiarios, URL que obtiene una lista de número de beneficiarios, dni/cif y beneficiario agrupando por dni/cif y beneficiario contando el número de beneficiarios y ordenando por el número de beneficiarios y filtrando os 50 primeros. Ej. subvencionAgrupadaURL + "?fields=count(title),adjudicatarioId,adjudicatarioTitle&group=adjudicatarioId,adjudicatarioTitle&sort=-count(title)&pageSize=10";

Variable para la seguridad:

Por motivos de requisitos del proyecto, las credenciales de seguridad son totalmente VISIBLES y por tanto se recomienda combinar código en servidor con la autenticación proporcionada, así se conseguirá que las credenciales no sean accesibles.

* seguridad, poner true para que la visualización use seguridad en las llamadas a la API.

Variables de depuración:

* logDebugComun, variable para habilitar la depuración del módulo común
* logDebugBusquedaBeneficiarios, variable para habilitar la depuración del módulo busqueda_beneficiarios
* logDebugBusquedasubvenciones, variable para habilitar la depuración del módulo busqueda_subvenciones
* logDebugDepartamentosGastoGlobal, variable para habilitar la depuración del módulo gasto_area
* logDebugImporteMeses, variable para habilitar la depuración del módulo importe_meses
* logDebugImporteTipoBeneficiarios, variable para habilitar la depuración del módulo importe_tipo_beneficiarios
* logDebugIndicadores, variable para habilitar la depuración del módulo indicadores
* logDebugFichaSubvenciones, variable para habilitar la depuración del módulo de la ficha de subvenciones
* logDebugFichaBeneficiarios, variable para habilitar la depuración del módulo de la ficha de beneficiarios
* logDebugIndicadoresGlobales, variable para habilitar la depuración del módulo indicadores globales
* logDebugTop25GastoBeneficiario, variable para habilitar la depuración del módulo top 25 del gasto de beneficiarios

Otras variables:

* caracteresMinimosBusqueda, número de caracteres mínimos que debe de tener una busqueda para agregarle comodines a ambos lados
* registrosTablabusqueda, número de registros para las tablas de búsqueda
* resgistroGráficos, Número de registros para los gráficos
* registrosTablaGráficos, Número de registros para las tablas de los gráficos
* valTimeout, Tiempo de espera en la petición ajax de autenticación
* logoBase64, logotipo de la exportación de los PDF de las tablas en case 64

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
Cumpliendo con el requisito del pliego:
2.5.5.4.8 Se garantizará su usabilidad y rendimiento en las últimas versiones de los navegadores más utilizados tanto en escritorio como en dispositivos móviles.
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
