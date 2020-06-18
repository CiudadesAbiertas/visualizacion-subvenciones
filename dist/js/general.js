/*
Copyright 2020 Ayuntamiento de A Coruña, Ayuntamiento de Madrid, Ayuntamiento de Santiago de Compostela, Ayuntamiento de Zaragoza, Entidad Pública Empresarial Red.es

This visualization is part of the actions carried out within the "Ciudades Abiertas" project.

Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and limitations under the Licence.
*/

/* Llamadas a la API */

// URL que obtiene una lista de subvenciones agrupada por tipoInstrumento y contanto las subvenciones
var queryIndicadorSubvenciones = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=count(id)&"+paramGroupAPI+"=tipoInstrumento";
// URL que obtiene una lista de beneficiarios agrupada por tipoInstrumento y contanto las beneficiarios
var queryIndicadorBeneficiarios = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=count(distinct adjudicatarioId)&"+paramGroupAPI+"=tipoInstrumento";
// URL que obtiene una lista de importes agrupada por tipoInstrumento y sumando los importes
var queryIndicadorImporteTotal = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=sum(importe)&"+paramGroupAPI+"=tipoInstrumento";
// URL que obtiene una lista de subvenciones agrupada por año y contanto las subvenciones
var queryIndicadorSubvencionesGlobal = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=count(distinct id),YEAR(fechaAdjudicacion)&"+paramGroupAPI+"=YEAR(fechaAdjudicacion)";
// URL que obtiene una lista de beneficiarios agrupada por año y contanto las beneficiarios
var queryIndicadorBeneficiariosGlobal = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=count(distinct adjudicatarioId),YEAR(fechaAdjudicacion)&"+paramGroupAPI+"=YEAR(fechaAdjudicacion)";
// URL que obtiene una lista de importes agrupada por año y sumando los importes
var queryIndicadorImporteTotalGlobal = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=sum(importe),YEAR(fechaAdjudicacion)&"+paramGroupAPI+"=YEAR(fechaAdjudicacion)";

// URL que obtiene una lista del nombre de las áreas y la suma del importe de las áreas en formato JSON
var queryGraficoDepGasto = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=areaTitle, sum(importe)&"+paramGroupAPI+"=areaTitle&"+paramSortAPI+"=-sum(importe)";
// URL que obtiene una lista del nombre de las áreas y la suma del importe de las áreas en formato CSV
var queryGraficoDepGastoCSV = subvencionAgrupadaURLCSV + "?"+paramFieldsAPI+"=areaTitle, sum(importe)&"+paramGroupAPI+"=areaTitle&"+paramSortAPI+"=-sum(importe)";
// URL que obtiene una lista del nombre de las áreas y la suma del importe de las áreas en formato JSON
var queryGraficoAreas = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=areaTitle, count(title)&"+paramGroupAPI+"=areaTitle&"+paramSortAPI+"=-count(title)";
// URL que obtiene una lista del top 10 del nombre de las áreas y la suma del importe de las áreas en formato JSON
var queryGraficoAreasTop10 = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=areaTitle, count(title)&"+paramGroupAPI+"=areaTitle&"+paramSortAPI+"=-count(title)&"+paramPageSizeAPI+"="+registrosTablaGráficos;

// URL que obtiene una lista de la primera letra del adjudicatarioId e importe agrupada por primera letra del adjudicatarioId y sumando los importes en formato JSON
var queryGraficoImporteTipoBeneficiarios = subvencionAgrupadaURL+"?"+paramFieldsAPI+"=substring(adjudicatarioId,1,1),sum(importe)&"+paramGroupAPI+"=substring(adjudicatarioId,1,1)";
// URL que obtiene una lista de la primera letra del adjudicatarioId e importe agrupada por primera letra del adjudicatarioId y sumando los importes en formato CSV
var queryGraficoImporteTipoBeneficiariosCSV = subvencionAgrupadaURLCSV + "?"+paramFieldsAPI+"=substring(adjudicatarioId,1,1),sum(importe)&"+paramGroupAPI+"=substring(adjudicatarioId,1,1)";

// URL que obtiene las areas
var queryIniAreas = subvencionURLdistinct + "?"+paramFieldAPI+"=areaTitle";
// URL que obtiene las Lineas de Financiacion
var queryIniLineaFinanciacion = subvencionURLdistinct + "?"+paramFieldAPI+"=lineaFinanciacion&"+paramPageAPI+"=1&"+paramPageSizeAPI+"=100";
// URL que obtiene las entidades Financiadoras
var queryIniEntidadFinanciadoraTitle = subvencionURLdistinct + "?"+paramFieldAPI+"=entidadFinanciadoraTitle&"+paramPageAPI+"=1&"+paramPageSizeAPI+"=100";
// URL que obtiene los tipos de instrumento
var queryIniTipoInstrumento = subvencionURLdistinct + "?"+paramFieldAPI+"=tipoInstrumento&"+paramPageAPI+"=1&"+paramPageSizeAPI+"=100";

// URL que obtiene una lista agrupada por lineas de financiación contando las subvenciones
var queryIniGraficoSubvencionesLineaFinanciacion = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=lineaFinanciacion,count(title)&"+paramGroupAPI+"=lineaFinanciacion&"+paramSortAPI+"=-count(title)&"+paramPageSizeAPI+"=50";

// URL que obtiene una lista de años agruando por años 
var queryIniAnyos = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=YEAR(fechaAdjudicacion)&"+paramGroupAPI+"=YEAR(fechaAdjudicacion)";
// URL que obtiene una lista de lineaFinanciacion e importe agrupada por lineaFinanciacion y sumando los importes
var queryIniGraficoLineaNum = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=lineaFinanciacion,count(title)&"+paramGroupAPI+"=lineaFinanciacion&"+paramSortAPI+"=-count(title)";
// URL que obtiene una lista de nombre y area agrupando por nombre y area
var queryBusquedaSubvenciones = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=title,areaTitle,entidadFinanciadoraTitle,lineaFinanciacion,tipoInstrumento,aplicacionPresupuestaria&"+paramGroupAPI+"=title,areaTitle,entidadFinanciadoraTitle,lineaFinanciacion,tipoInstrumento,aplicacionPresupuestaria";
// URL que obtiene una subvencion filtrando por nombre, area 
var queryTablaFichaSubvenciones_1 = subvencionURL + "?title=";
var queryTablaFichaSubvenciones_2 = "&areaTitle=";
var queryTablaFichaSubvenciones_3 = "&"+paramSortAPI+"=-importe";
// URL que obtiene una lista de importe agrupando por nombre y area, filtrando por nombre y area y contando el numero de subvenciones
var queryFichaIndicadorNumSubvenciones_1 = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=count(importe)&"+paramGroupAPI+"=title,areaTitle&"+paramWhereAPI+"=title like '";
var queryFichaIndicadorNumSubvenciones_2 = "' and areaTitle like '";
var queryFichaIndicadorNumSubvenciones_3 = "'";
// URL que obtiene una lista de importe agrupando por nombre y area filtrando por nombre y area y sumando el importe
var queryFichaIndicadorSumSubvenciones_1 = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=sum(importe)&"+paramGroupAPI+"=title,areaTitle&"+paramWhereAPI+"=title like '";
var queryFichaIndicadorSumSubvenciones_2 = "' and areaTitle like '";
var queryFichaIndicadorSumSubvenciones_3 = "'";

// URL que obtiene una lista de importe, dni/cif y beneficiario agrupando por dni/cif y beneficiario y sumando los importes y ordenando por la suma de los importes 
var queryIniGraficoSumImporteBeneficiarios = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=sum(importe),adjudicatarioId,adjudicatarioTitle&"+paramGroupAPI+"=adjudicatarioId,adjudicatarioTitle&"+paramSortAPI+"=-sum(importe)";
// URL que obtiene una lista de número de beneficiarios, dni/cif y beneficiario agrupando por dni/cif y beneficiario contando el número de beneficiario y ordenando por el número de beneficiario
var queryIniGraficoNumSubvencionesBeneficiarios = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=count(title),adjudicatarioId,adjudicatarioTitle&"+paramGroupAPI+"=adjudicatarioId	,adjudicatarioTitle&"+paramSortAPI+"=-count(title)";
// URL que obtiene una subvencion filtrando por dni/cif
var queryTablaFichaBeneficiarios = subvencionURL + ".json?adjudicatarioId=";
// URL que obtiene una lista de importe agrupando por dni/cif y beneficiario filtrando por dni/cif
var queryFichaIndicadorSumImporteBeneficiarios_1 = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=sum(importe)&"+paramGroupAPI+"=adjudicatarioId,adjudicatarioTitle&"+paramWhereAPI+"=adjudicatarioId like '";
var queryFichaIndicadorSumImporteBeneficiarios_2 = "'"
// URL que obtiene una lista de número de beneficiarios agrupando por dni/cif y beneficiario filtrando por dni/cif
var queryFichaIndicadorNumSubvencionesBeneficiarios_1 = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=count(title)&"+paramGroupAPI+"=adjudicatarioId,adjudicatarioTitle&"+paramWhereAPI+"=adjudicatarioId like '";
var queryFichaIndicadorNumSubvencionesBeneficiarios_2 = "'";
// URL que obtiene una lista de número de importe, año agrupando por año ordenando por año, filtrando por dni/cif
var queryFichaGraficoSumImporteBeneficiarioAnyo_1 = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=sum(importe),YEAR(fechaAdjudicacion)&"+paramGroupAPI+"=YEAR(fechaAdjudicacion)&"+paramSortAPI+"=-YEAR(fechaAdjudicacion)&"+paramWhereAPI+"=adjudicatarioId like '";
var queryFichaGraficoSumImporteBeneficiarioAnyo_2 = "'";
// URL que obtiene una lista de importe, dni/cif y beneficiario agrupando por dni/cif y beneficiario sumando los importes y ordenando por la suma de los importes y filtrando os 50 primeros
var queryGraficoBusquedaSumImporteBeneficiarios = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=sum(importe),adjudicatarioId,adjudicatarioTitle&"+paramGroupAPI+"=adjudicatarioId,adjudicatarioTitle&"+paramSortAPI+"=-sum(importe)&"+paramPageSizeAPI+"="+registrosTablaGráficos;
var queryGraficoBusquedaSumImporteBeneficiariosCSV = subvencionAgrupadaURLCSV + "?"+paramFieldsAPI+"=sum(importe),adjudicatarioId,adjudicatarioTitle&"+paramGroupAPI+"=adjudicatarioId,adjudicatarioTitle&"+paramSortAPI+"=-sum(importe)&"+paramPageSizeAPI+"="+registrosTablaGráficos;
// URL que obtiene una lista de número de beneficiarios, dni/cif y beneficiario agrupando por dni/cif y beneficiario contando el número de beneficiarios y ordenando por el número de beneficiarios y filtrando os 50 primeros
var queryGraficoBusquedaNumSubvencionesBeneficiarios = subvencionAgrupadaURL + "?"+paramFieldsAPI+"=count(title),adjudicatarioId,adjudicatarioTitle&"+paramGroupAPI+"=adjudicatarioId,adjudicatarioTitle&"+paramSortAPI+"=-count(title)&"+paramPageSizeAPI+"="+registrosTablaGráficos;

// variables para normalizar datos
var numFormatoSinDecimales='0,0';
var numFormato='0,0.[00]';
var importeFormato='0,0.[00] $';
var importeFormatoSinDecimales='0,0 $';

// Lista para almnacenar los años de las subvenciones
var anyos=new Array();

/* 
	Métodos para el arranque de la web
*/
function initComun()
{
	if(logDebugComun){
		console.log("initComun");
	}
	
	multidiomaComun();
	numeralInit();
}

/* 
	Función para el multiidioma 
*/
function multidiomaComun()
{
	if(logDebugComun)
	{
		console.log("multidiomaComun");
	}
	
	jQuery(function($){
		//carga de los idiomas
		$.i18n().load({
			en: 'dist/i18n/en.json',
			es: 'dist/i18n/es.json',
			gl: 'dist/i18n/gl.json'
		}).done(function(){
			$('html').i18n()
		});
		
		//configuración del botón que cambia de idioma
		$(".switch-locale").click(function(){
			
			var r = confirm("Si se cambia de idioma se perderán las posibles busquedas realizadas");
			if (r == true) 
			{
				$('.modal').modal('show');
				$('#capaInicio').show();
				$('#capaSubvenciones').show();
				$('#capaBeneficiarios').show();
				$('#capaAyuda').show();
				$.i18n().locale = $(this).data('locale');
				$('html').i18n();
				document.documentElement.lang=$.i18n().locale; 
				// $('#iframeIndicadores').contents().i18n().locale = $(this).data('locale');
				// $('#iframeIndicadoresGlobales').contents().i18n().locale = $(this).data('locale');
				// $('#iframeImporteTipoBeneficiarios').contents().i18n().locale = $(this).data('locale');
				// $('#iframeDepartamentosGastoGlobal').contents().i18n().locale = $(this).data('locale');
				// $('#iframeImporteMeses').contents().i18n().locale = $(this).data('locale');
				// $('#iframeBusquedaBeneficiarios').contents().i18n().locale = $(this).data('locale');
				// $('#iframeBusquedaSubvenciones').contents().i18n().locale = $(this).data('locale');
				// $('#iframeBusquedaSubvenciones').contents().i18n();
				
				var url = "";
				url = $('#iframeBusquedaBeneficiarios').attr('src');
				var pos = url.search('lang=');
				url = url.substring(0,pos)+'lang='+$(this).data('locale');
				$('#iframeBusquedaBeneficiarios').attr('src',url);

				url = $('#iframeBusquedaSubvenciones').attr('src');
				pos = url.search('lang=');
				url = url.substring(0,pos)+'lang='+$(this).data('locale');
				$('#iframeBusquedaSubvenciones').attr('src',url);

				url = $('#iframeIndicadores').attr('src');
				pos = url.search('lang=');
				url = url.substring(0,pos)+'anyo='+anyos[anyos.length-1]+'&lang='+$(this).data('locale');
				$('#iframeIndicadores').attr('src',url);

				url = $('#iframeIndicadoresGlobales').attr('src');
				pos = url.search('lang=');
				url = url.substring(0,pos)+'anyo='+anyos[anyos.length-1]+'&lang='+$(this).data('locale');
				$('#iframeIndicadoresGlobales').attr('src',url);

				url = $('#iframeImporteTipoBeneficiarios').attr('src');
				pos = url.search('lang=');
				url = url.substring(0,pos)+'anyo='+anyos[anyos.length-1]+'&lang='+$(this).data('locale');
				$('#iframeImporteTipoBeneficiarios').attr('src',url);

				url = $('#iframeDepartamentosGastoGlobal').attr('src');
				pos = url.search('lang=');
				url = url.substring(0,pos)+'anyo='+anyos[anyos.length-1]+'&lang='+$(this).data('locale');
				$('#iframeDepartamentosGastoGlobal').attr('src',url);

				// url = $('#iframeImporteMeses').attr('src');
				// pos = url.search('lang=');
				// url = url.substring(0,pos)+'anyo='+anyos[anyos.length-1]+'&lang='+$(this).data('locale');
				// $('#iframeImporteMeses').attr('src',url);

				taskMaster = {
					iframeIndicadores:true, 
					iframeDepartamentosGastoGlobal:true, 
					// iframeImporteMeses:true, 
					iframeBusquedaSubvenciones:false, 
					iframeBusquedaBeneficiarios:false,
					iframeImporteTipoBeneficiarios:true
				};
				
				checkTaskMaster();
				cambioCapaInicio();
			}  
		}); 
	});
	
	// Enable debug
	$.i18n.debug = logDebugComun;
}

/*
	Función que iniciliza los datos que dependen de la API
*/
function inicializaDatosInicio()
{
	if(logDebugComun){
		console.log("inicializaDatosInicio");
	}
	if(seguridad)
	{
		generarToken();
	}

	$.ajaxSetup({
		beforeSend: function (xhr)
		{
			authorization = sessionStorage.getItem("authorization");
			xhr.setRequestHeader("Accept","application/json");
			xhr.setRequestHeader("Authorization",authorization);        
		}
	});

	anyos=new Array();
	var theURL = dameURL(queryIniAnyos);
	$.ajax({
		type: 'GET',
		url: theURL,
		dataType: "json",
		crossDomain: true,
		contentType: "application/json; charset=utf-8",
		timeout: valTimeout ,
	  
		// headers: {
		// 	'Accept': 'application/json',
		// 	'Authorization': authorization
		// }, 
		
		success: function (data) 
		{
			for (var i = 0; i < data.records.length; i++) 
			{
				anyos.push(Number(data.records[i]));
			}
		},

		error: function (xhr, textStatus, errorThrown)
	    {
	    	
	    	console.error( xhr.status);
	    	console.error( xhr.responseText);	    	
	    	console.error(errorThrown);
	    	console.error(textStatus);	 	
		 
	    },
		
		complete: function (data) 
		{
			// Instantiate a slider
			var mySlider = $("#filtroAnyoInicio").bootstrapSlider({
				ticks: anyos,
				ticks_labels: anyos,
				value: anyos[anyos.length-1],
				min: anyos[0],
				max: anyos[anyos.length-1],
				labelledby: anyos
			});
			
			mySlider.on('change',function( sliderValue ) 
			{
				filtraGraficosInicio(sliderValue.value.newValue);
			});
			
			filtraGraficosInicio(anyos[anyos.length-1]);

		}
	});
	// var jqxhr = $.getJSON().done(function( data ) 
	// {
		// for (var i = 0; i < data.records.length; i++) 
		// {
			// anyos.push(data.records[i]);
		// }
	// }).fail(function( jqxhr, textStatus, error ) 
	// {
		// var err = textStatus + ", " + error;
		// console.log( "Request Failed: " + err );
	// }).always(function() 
	// {

		// // Instantiate a slider
		// var mySlider = $("#filtroAnyoInicio").bootstrapSlider({
			// ticks: anyos,
			// ticks_labels: anyos,
			// value: anyos[anyos.length-1],
			// min: anyos[0],
			// max: anyos[anyos.length-1],
			// labelledby: anyos
		// });
		
		// mySlider.on('change',function( sliderValue ) 
		// {
			// filtraGraficosInicio(sliderValue.value.newValue);
		// });
		
		// filtraGraficosInicio(anyos[anyos.length-1]);

	// });
}

/*
	Se inicializa la librería para tratar los formatos de los números
*/ 
function numeralInit()
{
	if(logDebugComun)
	{
		console.log("numeralInit");
	}
	
	numeral.register('locale', 'es',{
		delimiters: 
		{
			thousands: '.',
			decimal: ','
		},
		abbreviations: 
		{
			thousand: 'k',
			million: 'm',
			billion: 'b',
			trillion: 't'
		},
		ordinal : function (number) 
		{
			return number === 1 ? 'er' : 'o';
		},
		currency: 
		{
			symbol: '€'
		}
	});
	numeral.locale('es');
}

/* 
	Función que permite cambiar a la capa de inicio 
*/
function cambioCapaInicio()
{
	if(logDebugComun)
	{
		console.log("cambioCapaInicio");
	}
	
	$('#liInicio').css("background-color", "#666");
	$('#buttonInicio').css("color", "#fff");
	$('#liSubvenciones').css("background-color", "#fff");
	$('#buttonSubvenciones').css("color", "#666");
	$('#liBeneficiarios').css("background-color", "#fff");
	$('#buttonBeneficiarios').css("color", "#666");
	$('#liGlosario').css("background-color", "#fff");
	$('#buttonGlosario').css("color", "#777");
	
	$('#capaInicio').show();
	$('#capaSubvenciones').hide();
	$('#capaBeneficiarios').hide();
	$('#capaAyuda').hide();
	$('#capaFicha').hide();
}

/* 
	Función que permite cambiar a la capa de subvenciones 
*/
function cambioCapaSubvenciones()
{
	if(logDebugComun)
	{
		console.log("cambioCapaSubvenciones");
	}
	
	$('#liInicio').css("background-color", "#fff");
	$('#buttonInicio').css("color", "#666");
	$('#liSubvenciones').css("background-color", "#666");
	$('#buttonSubvenciones').css("color", "#fff");
	$('#liBeneficiarios').css("background-color", "#fff");
	$('#buttonBeneficiarios').css("color", "#666");
	$('#liGlosario').css("background-color", "#fff");
	$('#buttonGlosario').css("color", "#777");
	
	$('#capaInicio').hide();
	$('#capaSubvenciones').show();
	$('#capaBeneficiarios').hide();
	$('#capaAyuda').hide();
	$('#capaFicha').hide();
	$('#iframeBusquedaSubvenciones').height($( document ).height());
}

/* 
	Función que permite cambiar a la capa de subvenciones filtrando por area y año
*/
function cambioCapaSubvencionesAreaNombre(areaNombre,anyo)
{
	if(logDebugComun)
	{
		console.log("cambioCapaSubvencionesAreaNombre");
	}
	cambioCapaSubvenciones();
	var url = $('#iframeBusquedaSubvenciones').attr('src');
	pos = url.search('areaNombre=');
	if(pos!=-1)
	{
		url = url.substring(0,pos);
	}
	url = url+'&areaNombre='+areaNombre;
	url = url+'&anyo='+anyo;
	$('#iframeBusquedaSubvenciones').attr('src',url);
}

/* 
	Función que permite cambiar a la capa de beneficiarios 
*/
function cambioCapaBeneficiarios()
{
	if(logDebugComun)
	{
		console.log("cambioCapaBeneficiarios");
	}
	
	$('#liInicio').css("background-color", "#fff");
	$('#buttonInicio').css("color", "#666");
	$('#liSubvenciones').css("background-color", "#fff");
	$('#buttonSubvenciones').css("color", "#666");
	$('#liBeneficiarios').css("background-color", "#666");
	$('#buttonBeneficiarios').css("color", "#fff");
	$('#liGlosario').css("background-color", "#fff");
	$('#buttonGlosario').css("color", "#666");
	
	$('#capaInicio').hide();
	$('#capaSubvenciones').hide();
	$('#capaBeneficiarios').show();
	$('#capaAyuda').hide();
	$('#capaFicha').hide();
	$('#iframeBusquedaBeneficiarios').height($( document ).height());
}

/* 
	Función que permite cambiar a la capa de beneficiarios filtrando por tipo
*/
function cambioCapaBeneficiariosTipo(tipo,anyo)
{
	if(logDebugComun)
	{
		console.log("cambioCapaBeneficiariosTipo");
	}

	cambioCapaBeneficiarios();
	var url = $('#iframeBusquedaBeneficiarios').attr('src');
	pos = url.search('tipo=');
	if(pos!=-1)
	{
		url = url.substring(0,pos);
	}
	url = url+'&tipo='+tipo;
	url = url+'&anyo='+anyo;
	$('#iframeBusquedaBeneficiarios').attr('src',url);
}

/* 
	Función que permite cambiar a la capa de ayuda 
*/
function cambioCapaAyuda()
{
	if(logDebugComun)
	{
		console.log("cambioCapaAyuda");
	}
	
	$('#liInicio').css("background-color", "#fff");
	$('#buttonInicio').css("color", "#666");
	$('#liSubvenciones').css("background-color", "#fff");
	$('#buttonSubvenciones').css("color", "#666");
	$('#liBeneficiarios').css("background-color", "#fff");
	$('#buttonBeneficiarios').css("color", "#666");
	$('#liGlosario').css("background-color", "#666");
	$('#buttonGlosario').css("color", "#fff");
	
	$('#capaInicio').hide();
	$('#capaSubvenciones').hide();
	$('#capaBeneficiarios').hide();
	$('#capaAyuda').show();
	$('#capaFicha').hide();
}

/* 
	Función que permite cambiar a la capa de ayuda 
*/
function cambioCapaAyudaQueEsSubvencion()
{
	if(logDebugComun)
	{
		console.log("cambioCapaAyudaQueEsSubvencion");
	}
	
	$('#liInicio').css("background-color", "#fff");
	$('#buttonInicio').css("color", "#666");
	$('#liSubvenciones').css("background-color", "#fff");
	$('#buttonSubvenciones').css("color", "#666");
	$('#liBeneficiarios').css("background-color", "#fff");
	$('#buttonBeneficiarios').css("color", "#666");
	$('#liGlosario').css("background-color", "#666");
	$('#buttonGlosario').css("color", "#fff");
	
	$('#capaInicio').hide();
	$('#capaSubvenciones').hide();
	$('#capaBeneficiarios').hide();
	$('#capaAyuda').show();
	$('#capaFicha').hide();
	
	var new_position = $('#bloque_ayuda_que_es_subvencion').offset();
	window.scrollTo(new_position.left,new_position.top);
}

/* 
	Función que permite cambiar a la capa de ayuda 
*/
function cambioCapaAyudaEncontrarPortal()
{
	if(logDebugComun)
	{
		console.log("cambioCapaAyudaEncontrarPortal");
	}
	
	$('#liInicio').css("background-color", "#fff");
	$('#buttonInicio').css("color", "#666");
	$('#liSubvenciones').css("background-color", "#fff");
	$('#buttonSubvenciones').css("color", "#666");
	$('#liBeneficiarios').css("background-color", "#fff");
	$('#buttonBeneficiarios').css("color", "#666");
	$('#liGlosario').css("background-color", "#666");
	$('#buttonGlosario').css("color", "#fff");
	
	$('#capaInicio').hide();
	$('#capaSubvenciones').hide();
	$('#capaBeneficiarios').hide();
	$('#capaAyuda').show();
	$('#capaFicha').hide();
	
	var new_position = $('#bloque_ayuda_encontrar_portal').offset();
	window.scrollTo(new_position.left,new_position.top);
	
}

/*
	Función que filtra los iframes por el año seleccionado
*/
function filtraGraficosInicio(filtroAnyo) 
{
	if(logDebugComun)
	{
		console.log("filtraGraficosInicio "+filtroAnyo);
	}
	
	var url = "indicadores.html";
	// url = $('#iframeIndicadores').attr('src');
	// var pos = url.search('?');
	url = url +'?anyo='+filtroAnyo+'&lang='+$.i18n().locale;
	$('#iframeIndicadores').attr('src',url); 
	
	var url = "importe_tipo_beneficiarios.html";
	// url = $('#iframeImporteTipoBeneficiarios').attr('src');
	// var pos = url.search('?');
	url = url +'?anyo='+filtroAnyo+'&lang='+$.i18n().locale;
	$('#iframeImporteTipoBeneficiarios').attr('src',url); 
	
	var url = "gasto_area.html";
	// url = $('#iframeDepartamentosGastoGlobal').attr('src');
	// var pos = url.search('?');
	url = url +'?anyo='+filtroAnyo+'&lang='+$.i18n().locale;
	$('#iframeDepartamentosGastoGlobal').attr('src',url); 
	
	// var url = "importe_meses.html";
	// url = $('#iframeImporteMeses').attr('src');
	// var pos = url.search('?');
	// url = url +'?anyo='+filtroAnyo+'&lang='+$.i18n().locale;
	// $('#iframeImporteMeses').attr('src',url); 
}

/*
	Función encodea la URL y usa la seguridad de la API en caso de ser necesario
*/
function dameURL(URL)
{
	if(logDebugComun)
	{
		console.log("dameURL: "+URL);
	}
	
	var resultado;
	resultado = encodeURI(URL);
	if(seguridad)
	{
		var fechaActual = new Date();
		var fechaExpiracion = sessionStorage.getItem("fechaExpiracion");
		if(fechaExpiracion == undefined || fechaExpiracion =='Invalid Date'){
			fechaExpiracion = new Date();
		}

		if(fechaActual>=fechaExpiracion)
		{
			generarToken();			
		}
		
		$.ajaxSetup({
			beforeSend: function (xhr)
			{
				authorization = sessionStorage.getItem("authorization");
				xhr.setRequestHeader("Accept","application/json");
			   	xhr.setRequestHeader("Authorization",authorization);        
			}
		});

	}

	return resultado;
}

/*
	Función que genera el token para realizar la autenticación con la API
*/
function generarToken()
{	
	if(logDebugComun)
	{
		console.log("generarToken");
	}
	var urlT=tokenUrl+"?username="+user+"&password="+pass+"&grant_type=password";
	var basicA="Basic "+btoa(appname+":"+appsecret);	
		
	$.ajax({
		type: 'POST',
	    url: urlT,
        contentType: "application/json; charset=utf-8",
		async:false,
		timeout: valTimeout ,

        headers: {
	        'Accept': 'application/json',
            'Authorization': basicA
	    },  
        
	    success: function (data) {	        
	 
			var fechaExpiracion = new Date().getTime();
			var timeSeconds = (Number(data.expires_in)-1); 
			fechaExpiracion = new Date(fechaExpiracion + (timeSeconds * 1000));
			sessionStorage.setItem("fechaExpiracion", fechaExpiracion);
			
			authorization='Bearer '+data.access_token;
			sessionStorage.setItem("authorization", authorization);
	        
		},
		
	    error: function (xhr, textStatus, errorThrown)
	    {
	    	
	    	console.error( xhr.status);
	    	console.error( xhr.responseText);	    	
	    	console.error(errorThrown);
	    	console.error(textStatus);

		}
	
	});
}

/*
Función que devuelve el tipo de beneficiario pasando como parámetro el DNI / CIF
*/
function dameTipoEntidad(dniNif)
{
	if(logDebugComun)
	{
		console.log("dameTipoEntidad");
	}
	
	var firstchar = dniNif[0];
	
	switch(firstchar) 
	{
		case 'A':
			return "Sociedades anónimas"
			break;
		case 'B':
			return "Sociedades de responsabilidad limitada"
			break;
		case 'C':
			return "Sociedades colectivas"
			break;
		case 'D':
			return "Sociedades comanditarias"
			break;
		case 'E':
			return "Comunidades de bienes, herencias yacentes y demás entidades carentes de personalidad jurídica no incluidas expresamente en otras claves"
			break;
		case 'F':
			return "Sociedades cooperativas"
			break;
		case 'G':
			return "Asociaciones"
			break;
		case 'H':
			return "Comunidades de propietarios en régimen de propiedad horizontal"
			break;
		case 'J':
			return "Sociedades civiles"
			break;
		case 'P':
			return "Corporaciones Locales"
			break;
		case 'Q':
			return "Organismos públicos"
			break;
		case 'R':
			return "Congregaciones e instituciones religiosas"
			break;
		case 'S':
			return "Órganos de la Administración del Estado y de las Comunidades Autónomas"
			break;
		case 'U':
			return "Uniones Temporales de Empresas"
			break;
		case 'V':
			return "Otros tipos no definidos en el resto de claves"
			break;
		case 'N':
			return "Entidades extranjeras"
			break;
		case 'W':
			return "Establecimientos permanentes de entidades no residentes en territorio español"
			break;
		default:
			return "Persona física"
	}
}

/*
Función que devuelve el tipo de beneficiario pasando como parámetro el DNI / CIF
*/
function dameLetraTipoEntidad(tipo)
{
	if(logDebugComun)
	{
		console.log("dameLetraTipoEntidad");
	}
	
	switch(tipo) 
	{
		case 'Sociedades anónimas':
			return "A"
			break;
		case 'Sociedades de responsabilidad limitada':
			return "B"
			break;
		case 'Sociedades colectivas':
			return "C"
			break;
		case 'Sociedades comanditarias':
			return "D"
			break;
		case 'Comunidades de bienes, herencias yacentes y demás entidades carentes de personalidad jurídica no incluidas expresamente en otras claves':
			return "E"
			break;
		case 'Sociedades cooperativas':
			return "F"
			break;
		case 'Asociaciones':
			return "G"
			break;
		case 'Comunidades de propietarios en régimen de propiedad horizontal':
			return "H"
			break;
		case 'Sociedades civiles':
			return "J"
			break;
		case 'Corporaciones Locales':
			return "P"
			break;
		case 'Organismos públicos':
			return "Q"
			break;
		case 'Congregaciones e instituciones religiosas':
			return "R"
			break;
		case 'Órganos de la Administración del Estado y de las Comunidades Autónomas':
			return "S"
			break;
		case 'Uniones Temporales de Empresas':
			return "U"
			break;
		case 'Otros tipos no definidos en el resto de claves':
			return "V"
			break;
		case 'Entidades extranjeras':
			return "N"
			break;
		case 'Establecimientos permanentes de entidades no residentes en territorio español':
			return "W"
			break;
		default:
			return ""
	}
}

/*
Función que crea un campo de selección para los formularios que tienen tipo de beneficiario
*/
function creaSelectTipoEntidad()
{
	if(logDebugComun)
	{
		console.log("creaSelectTipoEntidad");
	}
	
	$('#selectTipoBeneficiario').empty().append("<option value=''></option>").attr("selected","selected");
	$('#selectTipoBeneficiario').append("<option value='A'>Sociedades anónimas</option>");
	$('#selectTipoBeneficiario').append("<option value='B'>Sociedades de responsabilidad limitada</option>");
	$('#selectTipoBeneficiario').append("<option value='C'>Sociedades colectivas</option>");
	$('#selectTipoBeneficiario').append("<option value='D'>Sociedades comanditarias</option>");
	$('#selectTipoBeneficiario').append("<option value='E'>Comunidades de bienes, herencias yacentes y demás entidades carentes de personalidad jurídica no incluidas expresamente en otras claves</option>");
	$('#selectTipoBeneficiario').append("<option value='F'>Sociedades cooperativas</option>");
	$('#selectTipoBeneficiario').append("<option value='G'>Asociaciones</option>");
	$('#selectTipoBeneficiario').append("<option value='H'>Comunidades de propietarios en régimen de propiedad horizontal</option>");
	$('#selectTipoBeneficiario').append("<option value='J'>Sociedades civiles</option>");
	$('#selectTipoBeneficiario').append("<option value='P'>Corporaciones Locales</option>");
	$('#selectTipoBeneficiario').append("<option value='Q'>Organismos públicos</option>");
	$('#selectTipoBeneficiario').append("<option value='R'>Congregaciones e instituciones religiosas</option>");
	$('#selectTipoBeneficiario').append("<option value='S'>Órganos de la Administración del Estado y de las Comunidades Autónomas</option>");
	$('#selectTipoBeneficiario').append("<option value='U'>Uniones Temporales de Empresas</option>");
	$('#selectTipoBeneficiario').append("<option value='V'>Otros tipos no definidos en el resto de claves</option>");
	$('#selectTipoBeneficiario').append("<option value='N'>Entidades extranjeras</option>");
	$('#selectTipoBeneficiario').append("<option value='W'>Establecimientos permanentes de entidades no residentes en territorio español</option>");
}

/*
Funcion para obtener parametros de la URL
*/
function getUrlVars() 
{
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

/*
Funcion que chequea si un array de booleans esta entero a true
*/
function checkBooleanArray(vector)
{
	for (var i=0;i<vector.length;i++)
	{
		var temp=vector[i];
		if (temp==false)
		{
			return temp;
		}
	}
	return true;
}

/*
Funcion que chequea el objecto taskMaster
*/	
function checkTaskMaster()
{	
	if (taskMaster==null)
	{
		return false;
	}
	
	if (taskMaster.iframeIndicadores==false)
	{
		return false;
	}

	if (taskMaster.iframeDepartamentosGastoGlobal==false)
	{
		return false;
	}
	
	if (taskMaster.iframeBusquedaSubvenciones==false)
	{
		return false;
	}
	
	if (taskMaster.iframeBusquedaBeneficiarios==false)
	{
		return false;
	}
	
	if (taskMaster.iframeImporteTipoBeneficiarios==false)
	{
		return false;
	}

	setTimeout(function(){ cargaTerminada(); }, 500);				
}
	
/*
Funcion que se invoca cuando se han terminado todas las llamadas ajax desde la funcion checkTaskMaster
*/	
function cargaTerminada()
{		
	$("#iframeDepartamentosGastoGlobal").height(heightImporteMeses+120);
	$("#iframeImporteTipoBeneficiarios").height(heightTipoBeneficiario+170);
	$("#iframeIndicadoresGlobales").height(heightIndicadoresGlobal+170);
	$('.modal').modal('hide');
}	
	
/*
Funcion que modifica un attributo del objeto taskmaster del padre (si existe)
*/	
function modificaTaskMaster(attr)
{
	try
	{
		if ((parent!=null)&&(parent.taskMaster!=null))
		{
			eval("parent.taskMaster."+attr+"=true");
			parent.checkTaskMaster();
		}
	}
	catch(errorTM)
	{
	}
}

/*
	Función que devuelve true si se ejecuta dentro de un iframe
*/
function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

/*
	Función que calcula el porcentaje de un numero
*/
function porcentaje(numero, porcentaje)
{
	var p=Math.floor(numero*porcentaje)/100;
	p=Math.round(p)
	return p;
}

/*
	Función que situa el scroll de la pantalla arriba del todo
*/
function scrollTop()
{
	window.scrollTo(0, 0); 
}