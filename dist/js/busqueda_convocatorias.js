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

var peticionesInicialesSub = [false,false,false,false];
var peticionesParamSub = [false,false,false,false,false,false,false,false,false];
var urlBusqueda = "";
var organizaciones=new Array();
var heightInicial;
var heightConTabla;

/*
	Función de inicialización del script
*/
function inicializaBusquedaSubvenciones()
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("inicializaBusquedaSubvenciones");
	}
	
	inicializaMultidiomaBusquedaSubvenciones();
}

/*
	Función que invoca a todas las funciones que se realizan al inicializar el script
*/
function inicializaTablaBusquedaSubvenciones()
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("inicializaTablaBusquedaSubvenciones");
	}
	
	obtieneOrganizaciones(queryIniOrganization);
	camposFecha();
	preparaTablaSubvenciones(false);			
	$("#lineaGraficosBusquedaSub").hide();
	$(".table-responsive").hide();
	$("#botoneraDescarga").hide();
	$("#tablaSubvencionesCompleta").hide();
	// $("#iframeBusquedaSubvenciones", window.parent.document).height(884);

	if(screen.width>=992){
		$("#iframeBusquedaSubvenciones", window.parent.document).height(584);
	}else if(screen.width<992 && screen.width>=769)
	{
		$("#iframeBusquedaSubvenciones", window.parent.document).height(1715);
	}else if(screen.width<769 && screen.width>=450)
	{
		$("#iframeBusquedaSubvenciones", window.parent.document).height(1444);
	}else if(screen.width<450)
	{
		$("#iframeBusquedaSubvenciones", window.parent.document).height(1188);
	}

	$( "#buscarListado" ).click(function() 
	{
		buscar();
		this.blur();
	});
	
	$( "#descargaCSV" ).click(function() 
	{
		$('.modal').modal('show');
		if(!urlBusqueda.includes("pageSize=500"))
		{
			if(urlBusqueda.includes("?")){
				urlBusqueda = urlBusqueda+"&pageSize=500";
			}else{
				urlBusqueda = urlBusqueda+"?pageSize=500";
			}
		}
		descargaTabla(urlBusqueda,'.buttons-csv');
	});
	$( "#descargaJSON" ).click(function() 
	{
		$('.modal').modal('show');
		if(!urlBusqueda.includes("pageSize=500"))
		{
			if(urlBusqueda.includes("?")){
				urlBusqueda = urlBusqueda+"&pageSize=500";
			}else{
				urlBusqueda = urlBusqueda+"?pageSize=500";
			}
		}
		descargaTabla(urlBusqueda,'.buttons-json');
	});
	$( "#descargaExcel" ).click(function() 
	{
		$('.modal').modal('show');
		if(!urlBusqueda.includes("pageSize=500"))
		{
			if(urlBusqueda.includes("?")){
				urlBusqueda = urlBusqueda+"&pageSize=500";
			}else{
				urlBusqueda = urlBusqueda+"?pageSize=500";
			}
		}
		descargaTabla(urlBusqueda,'.buttons-excel');
	});
	$( "#descargaPDF" ).click(function() 
	{
		$('.modal').modal('show');
		if(!urlBusqueda.includes("pageSize=500"))
		{
			if(urlBusqueda.includes("?")){
				urlBusqueda = urlBusqueda+"&pageSize=500";
			}else{
				urlBusqueda = urlBusqueda+"?pageSize=500";
			}
		}
		descargaTabla(urlBusqueda,'.buttons-pdf');
	});
	$( "#descargaCopiar" ).click(function() 
	{
		$('.modal').modal('show');
		if(!urlBusqueda.includes("pageSize=500"))
		{
			if(urlBusqueda.includes("?")){
				urlBusqueda = urlBusqueda+"&pageSize=500";
			}else{
				urlBusqueda = urlBusqueda+"?pageSize=500";
			}
		}
		descargaTabla(urlBusqueda,'.buttons-copy');
	});
	
}

/* 
	Función para inicializar el multidioma
*/
function inicializaMultidiomaBusquedaSubvenciones()
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("inicializaMultidiomaBusquedaSubvenciones");
	}
	var langUrl = getUrlVars()["lang"];
	if(langUrl==undefined)
	{
		langUrl='es';
	}
	$.i18n().locale = langUrl;
	document.documentElement.lang=$.i18n().locale;
	$('html').i18n();
	
	jQuery(function($) 
	{
		$.i18n().load( 
		{
			en: './dist/i18n/en.json',
			es: './dist/i18n/es.json',
			gl: './dist/i18n/gl.json'
		}
		).done(function() 
		{
			$('html').i18n();
			inicializaTablaBusquedaSubvenciones();
		}
		);
	}
	);
	
	$.i18n.debug = logDebugBusquedasubvenciones;
}


function obtieneOrganizaciones(url)
{
	$.ajax({
		type: 'GET',
		url: url,
		dataType: "json",
		crossDomain: true,
		contentType: "application/json; charset=utf-8",
		timeout: valTimeout ,
	  		
		success: function (data) 
		{
			if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
			{
				for (var i = 0; i < data.records.length; i++) 
				{
					organizaciones[data.records[i].id] = data.records[i].title;
				}
				if(data.next!=undefined)
				{
					obtieneOrganizaciones(data.next);
				}
				else {
					inicializaDatos();
					console.log("iframeBusquedaSubvenciones "+$("#iframeBusquedaSubvenciones", window.parent.document).height());
					console.log("body "+$("body").height());
					console.log("document "+$(document).height());
					console.log("window "+$(window).height());
				}
			}else
			{
				console.log( msgErrorAPIResVacio );
			}
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
	Función que iniciliza los datos que dependen de la API
*/
function inicializaDatos()
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("inicializaDatos");
	}
	
	var areas=new Array();	
	var anyos=new Array();
	var servicioId=new Array();
	
	$('#selectNombreArea').empty().append("<option value=''></option>").attr("selected","selected");				
	$.getJSON(dameURL(queryIniAreas)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			for (var i = 0; i < data.records.length; i++) 
			{
				areas.push(data.records[i]);
			}
		}else
		{
			console.log( msgErrorAPIResVacio );
		}
	}
	).fail(function( textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() 
	{
		for (var i=0;i<areas.length;i++)
		{
			if (areas[i].trim()!="")
			{
				$('#selectNombreArea').append("<option value='"+areas[i]+"'>"+organizaciones[areas[i]]+"</option>");				
			}
		}
	
		peticionesInicialesSub[0]=true;
		peticionesParamSub[0]=true;
		if(logDebugBusquedasubvenciones)
		{
			console.log("fin peticion 0");
		}
		if (checkBooleanArray(peticionesInicialesSub))
		{			
			modificaTaskMaster("iframeBusquedaSubvenciones");
		}
		if (checkBooleanArray(peticionesParamSub)){
			capturaParam();
		}
	}
	);
	
	$('#selectAnyo').empty().append("<option value=''></option>").attr("selected","selected");	
	anyos=new Array();
	$.getJSON(dameURL(queryIniAnyosConvocatoria)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			for (var i = 0; i < data.records.length; i++) 
			{
				anyos.push(Number(data.records[i].anyo));
			}
		}else
		{
			console.log( msgErrorAPIResVacio );
		}
	}
	).fail(function( textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() 
	{				
		anyos.sort(function(a, b){return a-b;});

		for (var i=0;i<anyos.length;i++)
		{
			$('#selectAnyo').append("<option value='"+anyos[i]+"'>"+anyos[i]+"</option>");				
		}

		var valorDefecto=anyos[anyos.length-1];
		if(getUrlVars()["anyo"]!=undefined){
			valorDefecto=decodeURI(getUrlVars()["anyo"]);
		}
		// Instantiate a slider
		var mySlider = $("#filtroAnyoConv").bootstrapSlider({
			ticks: anyos,
			ticks_labels: anyos,
			value: valorDefecto
		});
		
		mySlider.on('change',function( sliderValue ) 
		{
			filtraGraficos(sliderValue.value.newValue);
		});
		
		filtraGraficos(anyos[anyos.length-1]);
		
		peticionesInicialesSub[1]=true;
		peticionesParamSub[1]=true;
		if(logDebugBusquedasubvenciones)
		{
			console.log("fin peticion 1");
		}
		if (checkBooleanArray(peticionesInicialesSub))
		{			
			modificaTaskMaster("iframeBusquedaSubvenciones");
		}
		if (checkBooleanArray(peticionesParamSub)){
			capturaParam();
		}
	}
	);
	
	$('#selectServicio').empty().append("<option value=''></option>").attr("selected","selected");				
	servicioId=new Array();
	$.getJSON(dameURL(queryIniServicio)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			for (var i = 0; i < data.records.length; i++) 
			{
				servicioId.push(data.records[i]);
			}
		}else
		{
			console.log( msgErrorAPIResVacio );
		}
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() 
	{		
		for (var i=0;i<servicioId.length;i++)
		{
			if (servicioId[i].trim()!="")
			{
				$('#selectServicio').append("<option value='"+servicioId[i]+"'>"+organizaciones[servicioId[i]]+"</option>");				
			}
		}
		peticionesParamSub[2]=true;
		if (checkBooleanArray(peticionesParamSub)){
			capturaParam();
		}
	}
	);
	
	$('#selectEntidadFinanciadora').empty().append("<option value=''></option>").attr("selected","selected");				
	var entidadFinanciadora=new Array();
	$.getJSON(dameURL(queryIniEntidadFinanciadoraTitle)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			for (var i = 0; i < data.records.length; i++) 
			{
				entidadFinanciadora.push(data.records[i]);
			}
		}else
		{
			console.log( msgErrorAPIResVacio );
		}
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() 
	{
		for (var i=0;i<entidadFinanciadora.length;i++)
		{
			if (entidadFinanciadora[i].trim()!="")
			{
				$('#selectEntidadFinanciadora').append("<option value='"+entidadFinanciadora[i]+"'>"+organizaciones[entidadFinanciadora[i]]+"</option>");				
			}
		}
		peticionesParamSub[3]=true;
		if (checkBooleanArray(peticionesParamSub)){
			capturaParam();
		}
	}
	);
	
	$('#selectTipoInstrumento').empty().append("<option value=''></option>").attr("selected","selected");				
	var tipoInstrumento=new Array();
	$.getJSON(dameURL(queryIniTipoInstrumento)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			for (var i = 0; i < data.records.length; i++) 
			{
				tipoInstrumento.push(data.records[i]);
			}
		}else
		{
			console.log( msgErrorAPIResVacio );
		}
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() 
	{
		for (var i=0;i<tipoInstrumento.length;i++)
		{
			if (tipoInstrumento[i].trim()!="")
			{
				$('#selectTipoInstrumento').append("<option value='"+tipoInstrumento[i]+"'>"+etiquetasTipoInstrumento.get(tipoInstrumento[i])+"</option>");				
			}
		}
		peticionesParamSub[4]=true;
		if (checkBooleanArray(peticionesParamSub)){
			capturaParam();
		}
	}
	);

	$('#selectTipoProcedimiento').empty().append("<option value=''></option>").attr("selected","selected");				
	var tipoProcedimiento=new Array();
	$.getJSON(dameURL(queryIniTipoProcedimiento)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			for (var i = 0; i < data.records.length; i++) 
			{
				tipoProcedimiento.push(data.records[i]);
			}
		}else
		{
			console.log( msgErrorAPIResVacio );
		}
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() 
	{
		for (var i=0;i<tipoProcedimiento.length;i++)
		{
			if (tipoProcedimiento[i].trim()!="")
			{
				// $('#selectTipoProcedimiento').append("<option value='"+tipoProcedimiento[i]+"'>"+dametipoProcedimiento(tipoProcedimiento[i])+"</option>");				
				$('#selectTipoProcedimiento').append("<option value='"+tipoProcedimiento[i]+"'>"+etiquetasTipoProcedimiento.get(tipoProcedimiento[i])+"</option>");				
			}
		}
		peticionesParamSub[5]=true;
		if (checkBooleanArray(peticionesParamSub)){
			capturaParam();
		}
	}
	);

	$('#selectNominativa').empty().append("<option value=''></option>").attr("selected","selected");				
	var nominativa=new Array();
	$.getJSON(dameURL(queryIniNominativa)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			for (var i = 0; i < data.records.length; i++) 
			{
				nominativa.push(data.records[i]);
			}
		}
		else
		{
			console.log( msgErrorAPIResVacio );
		}
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() 
	{
		for (var i=0;i<nominativa.length;i++)
		{
			// $('#selectNominativa').append("<option value='"+nominativa[i]+"'>"+dameSiNo(nominativa[i].toString())+"</option>");				
			$('#selectNominativa').append("<option value='"+nominativa[i]+"'>"+etiquetasSiNo.get(nominativa[i].toString())+"</option>");				
		}
		peticionesParamSub[6]=true;
		if (checkBooleanArray(peticionesParamSub)){
			capturaParam();
		}
	}
	);

	$('#selectInstrumenta').empty().append("<option value=''></option>").attr("selected","selected");				
	var convenios=new Array();
	$.getJSON(dameURL(queryIniInstrumentaTitle)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			for (var i = 0; i < data.records.length; i++) 
			{
				convenios.push(data.records[i]);
			}
		}else
		{
			console.log( msgErrorAPIResVacio );
		}
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() 
	{
		for (var i=0;i<convenios.length;i++)
		{
			if (convenios[i].trim()!="")
			{
				$('#selectInstrumenta').append("<option value='"+convenios[i]+"'>"+convenios[i]+"</option>");				
			}
		}
		peticionesParamSub[7]=true;
		if (checkBooleanArray(peticionesParamSub)){
			capturaParam();
		}
	}
	);

	$('#selectTematica').empty().append("<option value=''></option>").attr("selected","selected");				
	var tematica=new Array();
	$.getJSON(dameURL(queryIniTematica)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			for (var i = 0; i < data.records.length; i++) 
			{
				tematica.push(data.records[i]);
			}
		}else
		{
			console.log( msgErrorAPIResVacio );
		}
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() 
	{
		for (var i=0;i<tematica.length;i++)
		{
			if (tematica[i].trim()!="")
			{
				// $('#selectTematica').append("<option value='"+tematica[i]+"'>"+dameTitleTematica(tematica[i])+"</option>");				
				$('#selectTematica').append("<option value='"+tematica[i]+"'>"+etiquetasTematica.get(tematica[i])+"</option>");				
			}
		}
		peticionesParamSub[8]=true;
		if (checkBooleanArray(peticionesParamSub)){
			capturaParam();
		}
	}
	);
}

/*
	Función que iniciliza los datos que dependen de la API
*/
function dameTitleOrganization(id)
{
	$.getJSON(dameURL(queryOrganizationId+id)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			return data.records[0].title;
		}else
		{
			console.log( msgErrorAPIResVacio );
		}
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	);
}

/*
	Función que comprueba y captura si se han pasado parámetros a la web, en caso de haberlos ejecutará una búsqueda con ellos.
*/
function capturaParam()
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("capturaParam");
	}

	var ejecutarBusqueda=false;
	var paramNombre = getUrlVars()["nombre"];
	if(paramNombre!=undefined)
	{
		$("#buscadorNombre").val(decodeURI(paramNombre));
		ejecutarBusqueda=true;
	}
	var paramAreaNombre = getUrlVars()["areaNombre"];
	if(paramAreaNombre!=undefined)
	{
		$("#selectNombreArea").val(decodeURI(paramAreaNombre));
		ejecutarBusqueda=true;
	}
	var paramareaNombreTexto = getUrlVars()["areaNombreTexto"];
	if(paramareaNombreTexto!=undefined)
	{
		$.getJSON(queryOrganizationTitle+paramareaNombreTexto).done(function( data ) 
		{
			if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
			{
				paramAreaNombre=data.records[0].id;
			}else
			{
				console.log( msgErrorAPIResVacio );
			}
		}
		).fail(function( textStatus, error ) 
		{
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );
		}
		).always(function() 
		{
			$("#selectNombreArea").val(decodeURI(paramAreaNombre));
			buscar();
		}
		);
	}
	var paramEntidadFinanciadora = getUrlVars()["entidadFinanciadora"];
	if(paramEntidadFinanciadora!=undefined)
	{
		$("#selectEntidadFinanciadora").val(decodeURI(paramEntidadFinanciadora));
		ejecutarBusqueda=true;
	}
	var paramServicio = getUrlVars()["servicio"];
	if(paramServicio!=undefined)
	{
		$("#selectServicio").val(decodeURI(paramServicio));
		ejecutarBusqueda=true;
	}
	var paramTipoInstrumento = getUrlVars()["tipoInstrumento"];
	if(paramTipoInstrumento!=undefined)
	{
		$("#selectTipoInstrumento").val(decodeURI(paramTipoInstrumento));
		ejecutarBusqueda=true;
	}
	var paramClasificacionPrograma = getUrlVars()["clasificacionPrograma"];
	if(paramClasificacionPrograma!=undefined)
	{
		$("#buscadorclasificacionPrograma").val(decodeURI(paramClasificacionPrograma));
		ejecutarBusqueda=true;
	}
	var paramclasificacionEconomicaGasto = getUrlVars()["clasificacionEconomicaGasto"];
	if(paramclasificacionEconomicaGasto!=undefined)
	{
		$("#buscadorclasificacionEconomicaGasto").val(decodeURI(paramclasificacionEconomicaGasto));
		ejecutarBusqueda=true;
	}
	var paramTipoProcedimiento = getUrlVars()["tipoProcedimiento"];
	if(paramTipoProcedimiento!=undefined)
	{
		$("#selectTipoProcedimiento").val(decodeURI(paramTipoProcedimiento));
		ejecutarBusqueda=true;
	}
	var paramNominativa = getUrlVars()["nominativa"];
	if(paramNominativa!=undefined)
	{
		$("#selectNominativa").val(decodeURI(paramNominativa));
		ejecutarBusqueda=true;
	}
	var paramName = getUrlVars()["name"];
	if(paramName!=undefined)
	{
		$("#buscadorName").val(decodeURI(paramName));
		ejecutarBusqueda=true;
	}
	var paramObjeto = getUrlVars()["objeto"];
	if(paramObjeto!=undefined)
	{
		$("#buscadorObjeto").val(decodeURI(paramObjeto));
		ejecutarBusqueda=true;
	}
	var paramInstrumentaTitle = getUrlVars()["convenio"];
	if(paramInstrumentaTitle!=undefined)
	{
		$("#selectInstrumenta").val(decodeURI(paramInstrumentaTitle));
		ejecutarBusqueda=true;
	}
	var paramAnyo = getUrlVars()["anyo"];
	if(paramAnyo!=undefined)
	{
		$("#selectAnyo").val(decodeURI(paramAnyo));
		ejecutarBusqueda=true;
	}
	var paramFechaAdjudicacionDesde = getUrlVars()["fechaDesde"];
	if(paramFechaAdjudicacionDesde!=undefined)
	{
		$("#desde").val(decodeURI(paramFechaAdjudicacionDesde));
		ejecutarBusqueda=true;
	}
	var paramFechaAdjudicacionHasta = getUrlVars()["fechaHasta"];
	if(paramFechaAdjudicacionHasta!=undefined)
	{
		$("#hasta").val(decodeURI(paramFechaAdjudicacionHasta));
		ejecutarBusqueda=true;
	}
	var paramImporteDesde = getUrlVars()["importeDesde"];
	if(paramImporteDesde!=undefined)
	{
		$("#importeDesde").val(decodeURI(paramImporteDesde));
		ejecutarBusqueda=true;
	}
	var paramImporteHasta = getUrlVars()["importeHasta"];
	if(paramImporteHasta!=undefined)
	{
		$("#importeHasta").val(decodeURI(paramImporteHasta));
		ejecutarBusqueda=true;
	}	
		
	if(ejecutarBusqueda){
		buscar();
	}
}

/*
	Funcion que filtra los gráficos superiores por el año seleccionado
*/
function filtraGraficos(filtroAnyo)
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("filtraGraficos");
	}
	
	var textoIzq = $.i18n( 'top_50_importe_area' );
	var textoDer = $.i18n( 'numero_tematica' );
	$('#cabeceraArribaIzquierda').html(textoIzq+' '+filtroAnyo);
	$('#cabeceraArribaDerecha').html(textoDer+' '+filtroAnyo);
	
	var areasNum=new Array();
	var urlFiltroAnyo="";
	if(filtroAnyo!=undefined && filtroAnyo!='Todos')
	{
		urlFiltroAnyo="&"+paramWhereAPI+"=fechaAcuerdo>='"+filtroAnyo+"-01-01T00:00:00' and fechaAcuerdo<='"+filtroAnyo+"-12-31T23:59:59'";
	}	
	$.getJSON(dameURL(queryGraficoAreasTop10+urlFiltroAnyo)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			var areaCadena=$.i18n( 'area' );
			var numeroSubvecionesCadena=$.i18n( 'numero_convocatorias' );
			var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+areaCadena+"</th><th>"+numeroSubvecionesCadena+"</th></tr>";
			for (var i = 0; i < data.records.length; i++) 
			{
				if(i<resgistroGráficos)
				{
					var areaNum=new Object();
					areaNum.name=organizaciones[data.records[i].area].substring(0, limiteCadenasTexto);
					areaNum.nameCompleto=organizaciones[data.records[i].area];
					areaNum.value=data.records[i].numero;
					areasNum.push(areaNum);
				}
				var valor=numeral(data.records[i].numero);
				htmlContent = htmlContent + "<tr>" + "<td>" + organizaciones[data.records[i].area].toString() + "</td>" + "<td>" + valor.format(numFormato) + "</td>" + "</tr>";
			}
			var mensaje_mostar_ocultar_datos =  $.i18n( 'mostar_ocultar_datos' );
			htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos('datos_subSupIzq')\">"+mensaje_mostar_ocultar_datos+"</button></div></div>";
			
			$('#datos_subSupIzq').html(htmlContent);
		}
		else
		{
			console.log( msgErrorAPIResVacio );
		}
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}).always(function() 
	{
		pintaGraficoSuperiorIzquierda(areasNum);

		peticionesInicialesSub[2]=true;
		if(logDebugBusquedasubvenciones)
		{
			console.log("fin peticion 2");
		}
		if (checkBooleanArray(peticionesInicialesSub))
		{			
			modificaTaskMaster("iframeBusquedaSubvenciones");
		}

	});
	
	var tematicasnum=new Array();
	$.getJSON(dameURL(queryIniGraficoTematicaNum+urlFiltroAnyo)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			var tematicaCadena=$.i18n( 'tematica' );
			var numeroSubvecionesCadena=$.i18n( 'numero_convocatorias' );
			var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+tematicaCadena+"</th><th>"+numeroSubvecionesCadena+"</th></tr>";
			for (var i = 0; i < data.records.length; i++) 
			{
				if(i<resgistroGráficos)
				{
					var tematicanum=new Object();
					tematicanum.tematicaCompl=data.records[i].tieneTematica;
					if(data.records[i].tieneTematica.length>40)
					{
						tematicanum.tematica=data.records[i].tieneTematica.substring(0, 40);
					}else{
						tematicanum.tematica=data.records[i].tieneTematica;
					}
					// tematicanum.etiquetaCompl=dameTitleTematica(data.records[i].tieneTematica);
					tematicanum.etiquetaCompl=etiquetasTematica.get(data.records[i].tieneTematica);
					if(tematicanum.etiquetaCompl.length>40){
						tematicanum.etiqueta=tematicanum.etiquetaCompl.substring(0, 40);
					}else
					{
						tematicanum.etiqueta=tematicanum.etiquetaCompl;
					}
					tematicanum.subNum=data.records[i].numero;
					tematicasnum.push(tematicanum);
				}

				var valor=numeral(data.records[i].numero);
				// htmlContent = htmlContent + "<tr>" + "<td>" +dameTitleTematica(data.records[i].tieneTematica) + "</td>" + "<td>" + valor.format(numFormato) + "</td>" + "</tr>";
				htmlContent = htmlContent + "<tr>" + "<td>" +etiquetasTematica.get(data.records[i].tieneTematica) + "</td>" + "<td>" + valor.format(numFormato) + "</td>" + "</tr>";
			}
			var mensaje_mostar_ocultar_datos =  $.i18n( 'mostar_ocultar_datos' );
			htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos('datos_subSupDer')\">"+mensaje_mostar_ocultar_datos+"</button></div></div>";
			
			$('#datos_subSupDer').html(htmlContent);
		}
		else
		{
			console.log( msgErrorAPIResVacio );
		}

	}).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() 
	{
		pintaGraficoSuperiorDerecha(tematicasnum);
		
		peticionesInicialesSub[3]=true;
		if(logDebugBusquedasubvenciones)
		{
			console.log("fin peticion 3");
		}
		if (checkBooleanArray(peticionesInicialesSub))
		{			
			modificaTaskMaster("iframeBusquedaSubvenciones");
		}
	});
	
}

/*
	Función que inicializa los botones de fecha
*/
function camposFecha()
{	
	if(logDebugBusquedasubvenciones)
	{ 
		console.log("camposFecha");
	}
	
	$( function() 
	{
		$( "#desde, #hasta" ).datepicker(
		{
			showButtonPanel:  false,
			dateFormat: "dd/mm/yy"
		}
		);
	
		$('#botonDesde').click(function() 
		{
		
			if ($("#desde").datepicker( "widget" ).is(":visible"))	
			{
				$('#desde').datepicker('hide');
			}
			else
			{
				$('#desde').datepicker('show');
			}
		}
		);
	
		$('#botonHasta').click(function() 
		{
			if ($("#hasta").datepicker( "widget" ).is(":visible"))	
			{
				$('#hasta').datepicker('hide');
			}
			else
			{
				$('#hasta').datepicker('show');
			}
		});
	
	} 
	);
}

/*
	Función que inicializa la tabla de búsqueda
*/
function preparaTablaSubvenciones(segundaPasada)
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("preparaTablaSubvenciones");
	}

	// var cabecerasTablaSubvenciones="";
	var fichaCadena="";
	var nombreCadena="";
	var nombreAreaCadena="";
	var copyCadena="";
	var tipoInstrumentoCadena="";
	// var basesReguladorasCadena="";
	var importeTotalCadena="";
	var fechaAcuerdoCadena="";

	fichaCadena=$.i18n( 'ficha' );
	nombreCadena=$.i18n( 'nombre' );
	nombreAreaCadena=$.i18n( 'nombre_area' );
	tipoInstrumentoCadena=$.i18n( 'tipo_instrumento' );
	importeTotalCadena=$.i18n( 'importe_total_concedido' );
	fechaAcuerdoCadena=$.i18n( 'fecha_acuerdo' );
	// basesReguladorasCadena=$.i18n( 'basesPresupuestarias' );
	
	copyCadena=$.i18n( 'copiar' );
	// cabecerasTablaSubvenciones=	"<th>"+fichaCadena+"</th><th>Identificador</th><th>"+nombreCadena+"</th><th>"+nombreAreaCadena+"</th><th>"+tipoInstrumentoCadena+"</th><th>"+importeTotalCadena+"</th><th>"+fechaAcuerdoCadena+"</th><th>"+basesReguladorasCadena+"</th>";	
	
	var urlLanguaje = "vendor/datatables/i18n/"+$.i18n().locale+".json";
	
	// $('#tablaSubvencionesTHead').empty();
	// $('#tablaSubvencionesTHead').append(cabecerasTablaSubvenciones);
	
	var tablaSubvenciones=$('#tablaSubvenciones').DataTable(
	{
		"processing": true,
		"serverSide": true,
		"paging": true,
		"searching": false,
		"pageLength": registrosTablabusqueda,
		"formatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
			  /\B(?=(\d{3})+(?!\d))/g, "."
			);
		},
		"language": 
		{
			"decimal": ",",
			"thousands": ".",
			"url": urlLanguaje,		
		},
		"ajax": 
		{
			"dataSrc": function ( data ) 
			{						
				var total=data.totalRecords;
				data.recordsTotal=total;
				data.recordsFiltered=total;
				
				var return_data = new Array();			
				if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
				{
					for(var i=0;i< data.records.length; i++)
					{
						return_data.push({					  
						  	'plus' : '',
						  	'id' : data.records[i].id, 
						 	'title' : data.records[i].title,
						  	'areaId' : organizaciones[data.records[i].areaId],
						  	'tipoInstrumento' : etiquetasTipoInstrumento.get(data.records[i].tipoInstrumento),
							'importeTotalConcedido' : data.records[i].importeTotalConcedido,
							'fechaAcuerdo' : data.records[i].fechaAcuerdo,
						});
					}
				}
				else
				{
					console.log( msgErrorAPIResVacio );
				}

				return return_data;
			},
			"data": function ( d ) 
			{
				var newD = new Object();
				var actualPage;
				newD.pageSize = d.length;
				if(d.length!=0)
				{
					actualPage=(d.start/d.length);
				}
				else
				{
					actualPage=1;
				}
				newD.page=(actualPage+1);
				
				if (d.order.length>0)
				{
					var numColumnaSeleccionada=d.order[0].column;
					var dirColumnaSeleccionada=d.order[0].dir;
					var dataColumnaSeleccionada=d.columns[numColumnaSeleccionada].name;
					if(dirColumnaSeleccionada=='asc')
					{
						newD.sort = dataColumnaSeleccionada;
					}else{
						newD.sort = '-'+dataColumnaSeleccionada;
					}
				}
				
				return newD;
			}
		},
		"order": [5, 'desc'],
		"columns":  
		[
			{'data' : null, 'render': function(data,type,row) {return ('<a aria-label="Abrir ficha">'+data.id+'</a>');}, className:"details-control", orderable: false , "title": "Identificador", 'name':'id'},
			// {'data': 'id' , "title": "Identificador", 'name':'id'},
			{'data': 'title' , "title": nombreCadena, 'name':'title'},
			{'data': 'areaId' , "title": nombreAreaCadena, 'name':'areaId'},
			{'data': 'tipoInstrumento' , "title": tipoInstrumentoCadena, 'name':'tipoInstrumento'},
			// {'data': null, 'render': function(data,type,row) {return (numeral(data.importeTotalConcedido)).format(importeFormato,Math.ceil);} , "title": importeTotalCadena, 'name':'importeTotalConcedido'},
			{'data': null, 'render': function(data,type,row) {var num = $.fn.dataTable.render.number(".", ",", 2, '', '€').display(data.importeTotalConcedido); return num;}, "title": importeTotalCadena, 'name':'importeTotalConcedido'},
			{'data': null, 'render': function(data,type,row) {return (Date.parse(data.fechaAcuerdo)).toString('dd-MM-yyyy');} , "title": fechaAcuerdoCadena, 'name':'fechaAcuerdo'},
			// {'data': 'basesReguladoras' , "title": basesReguladorasCadena, 'name':'basesReguladoras'},
		],
		dom: '<"row"<"col-sm-6"lfi><"col-sm-6"p>>rt<"row"<"col-sm-6"fi><"col-sm-6"p>>',
		buttons: 
		[				
			{
				extend: 'csv',
				text: 'CSV <span class="fa fa-table"></span>',
				className: 'btn btn-primary',				
				exportOptions: {
					columns: [1,2,3,4,5,6],
					search: 'applied',
					order: 'applied'
				},
				bom: true
			},
			{
				text: 'JSON <span class="fa fa-list-alt "></span>',
				className: 'btn btn-primary',
				exportOptions: {
					columns: [1,2,3,4,5,6],
					search: 'applied',
					order: 'applied'
				},
				action: function ( e, dt, button, config ) 
				{
					var data = dt.buttons.exportData();
 
					$.fn.dataTable.fileSave(
						new Blob( [ JSON.stringify( data ) ] ),
						'Subvenciones.json'
					);
				}
			},
			{
				extend: 'excel',
				text: 'EXCEL <span class="fa fa-file-excel-o"></span>',
				className: 'btn btn-primary',				
				exportOptions: {
					columns: [1,2,3,4,5,6],
					search: 'applied',
					order: 'applied'
				},
			},
			{
				text: 'PDF <span class="fa fa-file-pdf-o"></span>',
				className: 'btn btn-primary',
				extend: 'pdfHtml5',
					filename: 'listado_convocatorias',
					orientation: 'landscape',
					pageSize: 'A4',
					exportOptions: {
						columns: [1,2,3,4,5,6],
						search: 'applied',
						order: 'applied'
					},
					customize: function (doc) {
						doc.content.splice(0,1);
						var now = new Date();
						var jsDate = now.getDate()+'-'+(now.getMonth()+1)+'-'+now.getFullYear();
						var logo = logoBase64;
						doc.pageMargins = [20,60,20,30];
						doc.defaultStyle.fontSize = 7;
						doc.styles.tableHeader.fontSize = 7;
						doc['header']=(function() {
							return {
								columns: [
									{
										image: logo,
										width: 96
									},
									{
										alignment: 'center',
										fontSize: '14',
										text: ['Listado de convocatorias de subvenciones']
									}
								],
								margin: 20
							};
						});
						doc['footer']=(function(page, pages) {
							return {
								columns: [
									{
										alignment: 'left',
										text: ['Creado el: ', { text: jsDate.toString() }]
									},
									{
										alignment: 'right',
										text: ['Pag.', { text: page.toString() },	' de ',	{ text: pages.toString() }]
									}
								],
								margin: 20
							};
						});
						var objLayout = {};
						objLayout['hLineWidth'] = function(i) { return .5; };
						objLayout['vLineWidth'] = function(i) { return .5; };
						objLayout['hLineColor'] = function(i) { return '#aaa'; };
						objLayout['vLineColor'] = function(i) { return '#aaa'; };
						objLayout['paddingLeft'] = function(i) { return 4; };
						objLayout['paddingRight'] = function(i) { return 4; };
						doc.content[0].layout = objLayout;			
					}
			},       
			{
				extend: 'copy',
				text: copyCadena+' <span class="fa fa-copy  "></span>',
				className: 'btn btn-primary',
				exportOptions: {
					columns: [1,2,3,4,5,6],
					search: 'applied',
					order: 'applied'
				},
			},								
		],
		initComplete: function(settings, json) {
			heightConTabla=$( 'body' ).height();
			$('#iframeBusquedaSubvenciones', window.parent.document).height($( 'body' ).height());
		},
		drawCallback: function(settings, json) {
			heightConTabla=$( 'body' ).height();
			$('#iframeBusquedaSubvenciones', window.parent.document).height($( 'body' ).height());
		},
	});

	//Esta linea es para que no haya warnings en dataTables
	$.fn.dataTable.ext.errMode = 'none';
	
	if(!segundaPasada)
	{
		$('#tablaSubvenciones tbody').on('click', 'td.details-control', function () 
		{
			var tr = $(this).closest('tr');
			var row = tablaSubvenciones.row( tr );
			var id = row.data()['id'];
			var areaId = row.data()['areaId'];
						
			var url = "ficha_convocatoria.html?lang="+$.i18n().locale;
			url=url+"&id="+id+"&areaId="+areaId;
			// window.open(url,'_blank');

			$('#iframeFicha', window.parent.document).attr('src',url);
			$("#iframeFicha", window.parent.document).height($( document ).height());
			
			
			$("#capaInicio", window.parent.document).hide();
			$("#capaSubvenciones", window.parent.document).hide();
			$("#capaBeneficiarios", window.parent.document).hide();
			$("#capaAyuda", window.parent.document).hide();
			$("#capaFicha", window.parent.document).show();

			$('html,body', window.parent.document).scrollTop(0);
		} );
	}

}

/*
	Funcion que realiza las busquedas en la tabla
*/
function buscar()
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("buscar");
	}
	
	$("#lineaGraficosBusquedaSub").show();
	$(".table-responsive").show();
	$("#botoneraDescarga").show();
	
	if(heightInicial==undefined)
	{
		heightInicial=$("#iframeBusquedaSubvenciones", window.parent.document).height();
	}
	
	var subvencionesTematica=new Array();
	var subvencionesTipoInstrumento=new Array();
	var textoBusqueda="";
	var textoBusquedaTabla = "";
	var textoBusquedaGrafico = "";
	var busquedaTodo = true;
	
	var title=$("#buscadorNombre").val().trim();	
	var paramTitle;
	var paramTitleq;
	if($("#buscadorNombre").val().length >= caracteresMinimosBusqueda)
	{
		paramTitle="title like '*"+title+"*'";
		paramTitleq="title=='*"+title+"*'";
	}else
	{
		paramTitle="title like '"+title+"'";
		paramTitleq="title=='"+title+"'";
	}

	var areaId=$("#selectNombreArea").val();	
	var paramAreaId="areaId like '"+areaId+"'";
	var paramAreaIdq="areaId=='"+areaId+"'";
	
	var entidadFinanciadoraId=$("#selectEntidadFinanciadora").val();	
	var paramEntidadFinanciadoraId="entidadFinanciadoraId like '"+entidadFinanciadoraId+"'";
	var paramEntidadFinanciadoraIdq="entidadFinanciadoraId=='"+entidadFinanciadoraId+"'";
	
	var servicioId=$("#selectServicio").val();	
	var paramServicioId="servicioId like '"+servicioId+"'";
	var paramServicioIdq="servicioId=='"+servicioId+"'";
	
	var tipoInstrumento=$("#selectTipoInstrumento").val();	
	var paramTipoInstrumento="tipoInstrumento like '"+tipoInstrumento+"'";
	var paramTipoInstrumentoq="tipoInstrumento=='"+tipoInstrumento+"'";

	var clasificacionPrograma=$("#buscadorclasificacionPrograma").val().trim();
	var paramClasificacionPrograma="clasificacionPrograma like '"+clasificacionPrograma+"*'";
	var paramClasificacionProgramq="clasificacionPrograma=='"+clasificacionPrograma+"*'";

	var clasificacionEconomicaGasto=$("#buscadorclasificacionEconomicaGasto").val().trim();
	var paramClasificacionEconomicaGasto="clasificacionEconomicaGasto like '"+clasificacionEconomicaGasto+"*'";
	var paramClasificacionEconomicaGastoq="clasificacionEconomicaGasto=='"+clasificacionEconomicaGasto+"*'";
	
	var tipoProcedimiento=$("#selectTipoProcedimiento").val();	
	var paramTipoProcedimiento="tipoProcedimiento like '"+tipoProcedimiento+"'";
	var paramTipoProcedimientoq="tipoProcedimiento=='"+tipoProcedimiento+"'";

	var nominativa=-1;	
	if($("#selectNominativa").val()=="true")
	{
		nominativa=1;
	}else if($("#selectNominativa").val()=="false"){
		nominativa=0;
	}
	var paramNominativa="nominativa like '"+nominativa+"'";
	var paramNominativaq="nominativa=='"+nominativa+"'";

	var objeto=$("#buscadorObjeto").val().trim();
	var paramObjeto;
	var paramObjetoq;
	if($("#buscadorObjeto").val().length >= caracteresMinimosBusqueda)
	{
		paramObjeto="objeto like '*"+objeto+"*'";
		paramObjetoq="objeto=='*"+objeto+"*'";
	}else
	{
		paramObjeto="objeto like '"+objeto+"'";
		paramObjetoq="objeto=='"+objeto+"'";
	}

	var instrumenta=$("#selectInstrumenta").val();	
	var paramInstrumenta="instrumentaTitle like '"+instrumenta+"'";
	var paramInstrumentaq="instrumentaTitle=='"+instrumenta+"'";

	var anyo=$("#selectAnyo").val();	
	
	var fechaAcuerdoDesde=$("#desde").val().trim();
	var fechaAcuerdoDesdeISO;
	var paramFechaAcuerdoDesde;

	var fechaAcuerdoHasta=$("#hasta").val().trim();	
	var fechaAcuerdoHastaISO;
	var paramFechaAcuerdoHasta;
	
	var importeDesde=$("#importeDesde").val().trim();	
	var paramImporteDesde="importePresupuestado>="+importeDesde;		

	var importeHasta=$("#importeHasta").val().trim();	
	var paramImporteHasta="importePresupuestado<"+importeHasta;
	
	var tematica = $("#selectTematica").val();	
	var paramTematica="tieneTematica like '"+tematica+"'";
	var paramTematicaq="tieneTematica=='"+tematica+"'";

	var importeConcedidoDesde=$("#importeConcedidoDesde").val().trim();	
	var paramImporteConcedidoDesde="importeTotalConcedido>="+importeConcedidoDesde;		

	var importeConcedidoHasta=$("#importeConcedidoHasta").val().trim();	
	var paramImporteConcedidoHasta="importeTotalConcedido<"+importeConcedidoHasta;
	
	var URLParam="";
	var URLParamQ="";

	if (title!='')	
	{
		URLParam=URLParam+paramTitle;
		URLParamQ=URLParamQ+paramTitleq;
		textoBusqueda='<span class="textoNegrita">'+$.i18n( 'nombre:' )+'</span>'+" "+title;
		busquedaTodo=false;
	}
	if (areaId!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramAreaId;
		URLParamQ=URLParamQ+paramAreaIdq;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'nombre_area:' )+'</span>'+" "+organizaciones[areaId];
		busquedaTodo=false;
	}

	if (entidadFinanciadoraId!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramEntidadFinanciadoraId;
		URLParamQ=URLParamQ+paramEntidadFinanciadoraIdq;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'entidad_financiadora:' )+'</span>'+" "+entidadFinanciadoraId;
		busquedaTodo=false;
	}

	if (servicioId!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramServicioId;
		URLParamQ=URLParamQ+paramServicioIdq;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'servicio:' )+'</span>'+" "+organizaciones[servicioId];
		busquedaTodo=false;
	}

	if (tipoInstrumento!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramTipoInstrumento;
		URLParamQ=URLParamQ+paramTipoInstrumentoq;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'tipo_instrumento:' )+'</span>'+" "+etiquetasTipoInstrumento.get(tipoInstrumento);
		busquedaTodo=false;
	}

	if (clasificacionPrograma!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramClasificacionPrograma;
		URLParamQ=URLParamQ+paramClasificacionProgramq;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+"Clasisicación Programa"+'</span>'+" "+clasificacionPrograma;
		busquedaTodo=false;
	}

	if (clasificacionEconomicaGasto!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramClasificacionEconomicaGasto;
		URLParamQ=URLParamQ+paramClasificacionEconomicaGastoq;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+"Clasificación económica gasto"+'</span>'+" "+clasificacionEconomicaGasto;
		busquedaTodo=false;
	}

	if (tipoProcedimiento!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramTipoProcedimiento;
		URLParamQ=URLParamQ+paramTipoProcedimientoq;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'tipo_procedimiento:' )+'</span>'+" "+etiquetasTipoProcedimiento.get(tipoProcedimiento);
		busquedaTodo=false;
	}

	if (nominativa==0 || nominativa==1)	
	{
		var nomAux='';
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramNominativa;
		URLParamQ=URLParamQ+paramNominativaq;
		if(nominativa=="1")
		{
			nomAux="Sí";
		}else if(nominativa=="0")
		{
			nomAux="No";
		}
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'nominativa:' )+'</span>'+" "+nomAux;
		busquedaTodo=false;
	}

	if (name!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramName;
		URLParamQ=URLParamQ+paramNameq;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'proyecto:' )+'</span>'+" "+name;
		busquedaTodo=false;
	}

	if (objeto!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramObjeto;
		URLParamQ=URLParamQ+paramObjetoq;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'objeto:' )+'</span>'+" "+objeto;
		busquedaTodo=false;
	}

	if (instrumenta!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramInstrumenta;
		URLParamQ=URLParamQ+paramInstrumentaq;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'objeto:' )+'</span>'+" "+instrumenta;
		busquedaTodo=false;
	}
	
	if (tematica!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramTematica;
		URLParamQ=URLParamQ+paramTematicaq;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'tematica:' )+'</span>'+" "+etiquetasTematica.get(tematica);
		busquedaTodo=false;
	}

	if (fechaAcuerdoDesde!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		fechaAcuerdoDesdeISO=Date.parse(fechaAcuerdoDesde).toString('yyyy-MM-ddThh:mm:ss');
		paramFechaAcuerdoDesde="fechaAcuerdo>='"+fechaAcuerdoDesdeISO+"'";
		URLParam=URLParam+paramFechaAcuerdoDesde;
		URLParamQ=URLParamQ+paramFechaAcuerdoDesde;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'fecha' )+" "+$.i18n( 'desde:' )+'</span>'+" "+fechaAcuerdoDesde;
		busquedaTodo=false;
	}
	if (fechaAcuerdoHasta!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		fechaAcuerdoHastaISO=Date.parse(fechaAcuerdoHasta).toString('yyyy-MM-ddThh:mm:ss');
		paramFechaAcuerdoHasta="fechaAcuerdo<'"+fechaAcuerdoHastaISO+"'";
		URLParam=URLParam+paramFechaAcuerdoHasta;
		URLParamQ=URLParamQ+paramFechaAcuerdoHasta;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'fecha' )+" "+$.i18n( 'hasta:' )+'</span>'+" "+fechaAcuerdoHasta;
		busquedaTodo=false;
	}
	if(anyo!='')
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		fechaAcuerdoDesdeISO=Date.parse(anyo+"-01-01T00:00:00").toString('yyyy-MM-ddThh:mm:ss');
		paramFechaAcuerdoDesde="fechaAcuerdo>='"+fechaAcuerdoDesdeISO+"'";
		URLParam=URLParam+paramFechaAcuerdoDesde;
		URLParamQ=URLParamQ+paramFechaAcuerdoDesde;
		fechaAcuerdoHastaISO=Date.parse(anyo+"-12-31T23:59:59").toString('yyyy-MM-ddThh:mm:ss');
		paramFechaAcuerdoHasta=" and fechaAcuerdo<'"+fechaAcuerdoHastaISO+"'";
		URLParam=URLParam+paramFechaAcuerdoHasta;
		URLParamQ=URLParamQ+paramFechaAcuerdoHasta;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'anyo' )+'</span>'+" "+anyo;
		busquedaTodo=false;
	}
	if (importeDesde!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramImporteDesde;
		URLParamQ=URLParamQ+paramImporteDesde;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'importe_total_presupuestado' )+" "+$.i18n( 'desde:' )+'</span>'+" "+importeDesde;
		busquedaTodo=false;
	}
	if (importeHasta!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramImporteHasta;
		URLParamQ=URLParamQ+paramImporteHasta;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'importe_total_presupuestado' )+" "+$.i18n( 'hasta:' )+'</span>'+" "+importeHasta;
		busquedaTodo=false;
	}
	if (importeConcedidoDesde!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramImporteConcedidoDesde;
		URLParamQ=URLParamQ+paramImporteConcedidoDesde;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'importe_total_concedido' )+" "+$.i18n( 'desde:' )+'</span>'+" "+importeConcedidoDesde;
		busquedaTodo=false;
	}
	if (importeConcedidoHasta!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramImporteConcedidoHasta;
		URLParamQ=URLParamQ+paramImporteConcedidoHasta;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'importe_total_concedido' )+" "+$.i18n( 'hasta:' )+'</span>'+" "+importeConcedidoHasta;
		busquedaTodo=false;
	}
	
	if(busquedaTodo)
	{
		textoBusquedaTabla=$.i18n( 'datos_tabla_filtrar' );
		textoBusquedaGrafico=$.i18n( 'datos_grafico_filtrar' );
	}
	$('#textoBusquedaTabla').html(textoBusquedaTabla+textoBusqueda);
	$('#textoBusquedaGraficos').html(textoBusquedaGrafico+textoBusqueda);
	
	
	if(URLParam!="")
	{
		URLParam="&"+paramWhereAPI+"="+URLParam;
	}
	while (URLParam.indexOf("==")>=0)
	{
		URLParam=URLParam.replace("=="," like ");
	}
	while (URLParam.indexOf("%")>=0)
	{
		URLParam=URLParam.replace("%","*");
	}

	var urlBuscar;
	if(URLParamQ!="") 
	{
		urlBuscar = convocatoriaURL+'?q='+URLParamQ;
	}else{
		urlBuscar = convocatoriaURL;
	}
	
	urlBusqueda = urlBuscar;
	var table = $('#tablaSubvenciones').DataTable();
	table.ajax.url( dameURL(urlBuscar) ).load(null, false);
	if(logDebugBusquedasubvenciones)
	{
		console.log("fin de busqueda");
		console.log(urlBuscar);
	}
	$('#panelFichaSubvenciones').hide();
	
	subvencionesTematica=new Array();
	$.getJSON(dameURL(queryIniGraficoSubvencionesTematica+URLParam)).done(function( data ) 
	{			
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			var tematicaCadena=$.i18n( 'tematica' );
			var numeroSubvecionesCadena=$.i18n( 'numero_convocatorias' );
			var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+tematicaCadena+"</th><th>"+numeroSubvecionesCadena+"</th></tr>";
			for (var i = 0; i < data.records.length; i++) 
			{
				if(i<resgistroGráficos)
				{
					var subvencion=new Object();
					subvencion.tematicaCompl=data.records[i].tieneTematica;
					if(data.records[i].tieneTematica.length>30)
					{
						subvencion.tematica=data.records[i].tieneTematica.substring(0, 40);
					}else
					{
						subvencion.tematica=data.records[i].tieneTematica;
					}
					// subvencion.etiquetaCompl=dameTitleTematica(data.records[i].tieneTematica);
					subvencion.etiquetaCompl=etiquetasTematica.get(data.records[i].tieneTematica);
					if(subvencion.etiquetaCompl.length>40){
						subvencion.etiqueta=subvencion.etiquetaCompl.substring(0, 40);
					}else
					{
						subvencion.etiqueta=subvencion.etiquetaCompl;
					}
					subvencion.tematica=data.records[i].tieneTematica.substring(0, 40);
					subvencion.numSub=data.records[i].numero;
					subvencionesTematica.push(subvencion);
				}

				var valor=numeral(data.records[i].numero);
				// htmlContent = htmlContent + "<tr>" + "<td>" +dameTitleTematica(data.records[i].tieneTematica) + "</td>" + "<td>" + valor.format(numFormato) + "</td>" + "</tr>";
				htmlContent = htmlContent + "<tr>" + "<td>" +etiquetasTematica.get(data.records[i].tieneTematica) + "</td>" + "<td>" + valor.format(numFormato) + "</td>" + "</tr>";
			}

			var mensaje_mostar_ocultar_datos =  $.i18n( 'mostar_ocultar_datos' );
			htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos('datos_subInfIzq')\">"+mensaje_mostar_ocultar_datos+"</button></div></div>";
			
			$('#datos_subInfIzq').html(htmlContent);
		}
		else
		{
			console.log( msgErrorAPIResVacio );
		}

	}).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}).always(function() 
	{

		pintaGraficoInferiorIzquierda(subvencionesTematica,$( window.parent.document ).width());	

	});
	
	subvencionesTipoInstrumento=new Array();
	$.getJSON(dameURL(queryIniGraficoSubvencionesTipoInstrumento+URLParam)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{				
			var tipoInstrumentoCadena=$.i18n( 'tipo_instrumento' );
			var numeroSubvecionesCadena=$.i18n( 'numero_convocatorias' );
			var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+tipoInstrumentoCadena+"</th><th>"+numeroSubvecionesCadena+"</th></tr>";
			for (var i = 0; i < data.records.length; i++) 
			{
				if(i<resgistroGráficos)
				{
					var subvencion=new Object();
					// if(data.records[i].tipoInstrumento.length>30){
					// 	subvencion.tipoInstrumento=etiquetasTipoProcedimiento.get(data.records[i].tipoInstrumento).substring(0, limiteCadenasTexto);
					// 	subvencion.tipoInstrumentoCompl=data.records[i].tipoInstrumento;	
					// }else{
					// 	subvencion.tipoInstrumento=etiquetasTipoProcedimiento.get(data.records[i].tipoInstrumento);
					// 	subvencion.tipoInstrumentoCompl=data.records[i].tipoInstrumento;
					// }
					subvencion.tipoInstrumentoCompl=etiquetasTipoInstrumento.get(data.records[i].tipoInstrumento);
					subvencion.tipoInstrumento=etiquetasTipoInstrumento.get(data.records[i].tipoInstrumento).substring(0, limiteCadenasTexto);
					subvencion.numSub=data.records[i].numero;
					subvencionesTipoInstrumento.push(subvencion);
				}

				var valor=numeral(data.records[i].numero);
				htmlContent = htmlContent + "<tr>" + "<td>" + etiquetasTipoInstrumento.get(data.records[i].tipoInstrumento).toString() + "</td>" + "<td>" + valor.format(numFormato) + "</td>" + "</tr>";
			}
			var mensaje_mostar_ocultar_datos =  $.i18n( 'mostar_ocultar_datos' );
			htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos('datos_subInfDer')\">"+mensaje_mostar_ocultar_datos+"</button></div></div>";
			
			$('#datos_subInfDer').html(htmlContent);
		}
		else
		{
			console.log( msgErrorAPIResVacio );
		}
		
	}).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}).always(function() 
	{
		pintaGraficoInferiorDerecha(subvencionesTipoInstrumento,$( window.parent.document ).width());
			
		
	});
}

function descargaTabla(url, boton)
{
	var copyCadena=$.i18n( 'copiar' );
	var urlLanguaje = "vendor/datatables/i18n/"+$.i18n().locale+".json";

	var nombreCadena=$.i18n( 'nombre' );
	var nombreAreaCadena=$.i18n( 'nombre_area' );
	var tipoInstrumentoCadena=$.i18n( 'tipo_instrumento' );
	var importeTotalCadena=$.i18n( 'importe_total_concedido' );
	var fechaAcuerdoCadena=$.i18n( 'fecha_acuerdo' );
	// var basesReguladorasCadena=$.i18n( 'basesPresupuestarias' );
	
	var cabecerasTablaSubvenciones=	"<th>"+nombreCadena+"</th><th>"+nombreAreaCadena+"</th><th>"+tipoInstrumentoCadena+"</th><th>"+importeTotalCadena+"</th><th>"+fechaAcuerdoCadena+"</th>";	
	// var cabecerasTablaSubvenciones=	"<th>"+nombreCadena+"</th><th>"+nombreAreaCadena+"</th><th>"+tipoInstrumentoCadena+"</th><th>"+importeTotalCadena+"</th><th>"+fechaAcuerdoCadena+"</th><th>"+basesReguladorasCadena+"</th>";	
	
	$('#tablaSubvencionesCompletaTHead').empty();
	$('#tablaSubvencionesCompletaTHead').append(cabecerasTablaSubvenciones);

	$.getJSON(dameURL(url)).done(function( data ) 
	{			
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{

			for (var i = 0; i < data.records.length; i++) 
			{
				var title = data.records[i].title;
				if(title==undefined)
				{
					title='';
				}
				var areaId = data.records[i].areaId;
				if(areaId==undefined)
				{
					areaId='';
				}else{
					areaId = organizaciones[data.records[i].areaId];
				}
				var tipoInstrumento = data.records[i].tipoInstrumento;
				if(tipoInstrumento==undefined)
				{
					tipoInstrumento='';
				}else{
					tipoInstrumento = etiquetasTipoInstrumento.get(data.records[i].tipoInstrumento);
				}
				var importeTotalConcedido = data.records[i].importeTotalConcedido;
				if(importeTotalConcedido==undefined)
				{
					importeTotalConcedido='';
				}
				var fechaAcuerdo = data.records[i].fechaAcuerdo;
				if(fechaAcuerdo==undefined)
				{
					fechaAcuerdo='';
				}
				$('#tablaSubvencionesCompleta').append("<tr>"+"<td>"+title+"</td>"+"<td>"+areaId+"</td>"+"<td>"+tipoInstrumento+"</td>"+"<td>"+importeTotalConcedido+"</td>"+"<td>"+fechaAcuerdo+"</td></tr>");
			}
			if(data.next!=null && data.records!=null){

				descargaTabla(data.next, boton);
			}
			else{			
				$('#tablaSubvencionesCompleta').DataTable(
				{
					"paging": true,
					"searching": false,
					"pageLength": registrosTablabusqueda,
					"formatNumber": function ( toFormat ) {
						return toFormat.toString().replace(
						  /\B(?=(\d{3})+(?!\d))/g, "."
						);
					},
					"language": 
					{
						"decimal": ",",
						"thousands": ".",
						"url": urlLanguaje,		
					},
					"order": [4, 'asc'],
					dom: '<"row">t<"row"<"col-sm-6"B>>',
					buttons: 
					[				
						{
							extend: 'csv',
							text: 'CSV <span class="fa fa-table"></span>',
							title: 'convocatorias',
							className: 'btn btn-primary',				
							exportOptions: {
								search: 'applied',
								order: 'applied'
							},
							bom: true,
							fieldSeparator: ';',
							fieldBoundary: ''
						},
						{
							text: 'JSON <span class="fa fa-list-alt "></span>',
							title: 'convocatorias',
							className: 'buttons-json btn btn-primary',
							exportOptions: {
								search: 'applied',
								order: 'applied'
							},
							action: function ( e, dt, button, config ) 
							{
								var exportData = dt.buttons.exportData();
			
								$.fn.dataTable.fileSave(
									new Blob( [ JSON.stringify( exportData ) ] ),
									'convocatorias.json'
								);
							}
						},
						{
							extend: 'excel',
							text: 'EXCEL <span class="fa fa-file-excel-o"></span>',
							title: 'convocatorias',
							className: 'btn btn-primary',				
							exportOptions: {
								search: 'applied',
								order: 'applied'
							},
						},
						{
							text: 'PDF <span class="fa fa-file-pdf-o"></span>',
							title: 'convocatorias',
							className: 'btn btn-primary',
							extend: 'pdfHtml5',
								filename: 'listado_convocatorias',
								orientation: 'landscape',
								pageSize: 'A4',
								exportOptions: {
									search: 'applied',
									order: 'applied'
								},
								customize: function (doc) {
									doc.content.splice(0,1);
									var now = new Date();
									var jsDate = now.getDate()+'-'+(now.getMonth()+1)+'-'+now.getFullYear();
									var logo = logoBase64;
									doc.pageMargins = [20,60,20,30];
									doc.defaultStyle.fontSize = 7;
									doc.styles.tableHeader.fontSize = 7;
									doc['header']=(function() {
										return {
											columns: [
												{
													image: logo,
													width: 96
												},
												{
													alignment: 'center',
													fontSize: '14',
													text: ['Listado de convocatorias de subvenciones']
												}
											],
											margin: 20
										};
									});
									doc['footer']=(function(page, pages) {
										return {
											columns: [
												{
													alignment: 'left',
													text: ['Creado el: ', { text: jsDate.toString() }]
												},
												{
													alignment: 'right',
													text: ['Pag.', { text: page.toString() },	' de ',	{ text: pages.toString() }]
												}
											],
											margin: 20
										};
									});
									var objLayout = {};
									objLayout['hLineWidth'] = function() { return .5; };
									objLayout['vLineWidth'] = function() { return .5; };
									objLayout['hLineColor'] = function() { return '#aaa'; };
									objLayout['vLineColor'] = function() { return '#aaa'; };
									objLayout['paddingLeft'] = function() { return 4; };
									objLayout['paddingRight'] = function() { return 4; };
									doc.content[0].layout = objLayout;			
								}
						},       
						{
							extend: 'copy',
							text: copyCadena+' <span class="fa fa-copy  "></span>',
							title: 'convocatorias',
							className: 'btn btn-primary',
							exportOptions: {
								search: 'applied',
								order: 'applied'
							},
						},								
					],
					initComplete: function(settings, json) {
						$("#tablaSubvencionesCompleta_wrapper > div:nth-child(3) > div > div").hide();
						var table = $('#tablaSubvencionesCompleta').DataTable();
						$('.modal').modal('hide');
						table.button(boton).trigger();
						table.destroy();
						$('#tablaSubvencionesCompletaBody').empty();
					}
				});
				
			}
		}
		else
		{
			console.log( msgErrorAPIResVacio );
		}

	}).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});
}

	
/*
	Función para crear el gráfico superior izquierda
*/
function pintaGraficoSuperiorIzquierda(importeArea)
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("pintaGraficoSuperiorIzquierda");
	}
	
	am4core.useTheme(am4themes_frozen);
	am4core.useTheme(am4themes_animated);

	var chart = am4core.create("chartdivGraficoSuperiorIzquierda", am4charts.TreeMap);
	chart.data = importeArea;
	chart.language.locale._decimalSeparator= ",";
	chart.language.locale._thousandSeparator= ".";

	/*chart.language.locale = am4lang_es_ES;*/
	
	chart.dataFields.value = "value";
	chart.dataFields.name = "name";

	var level1 = chart.seriesTemplates.create("0");
	var level1_column = level1.columns.template;
	level1_column.column.cornerRadius(10, 10, 10, 10);
	level1_column.fillOpacity = 0.8;
	level1_column.stroke = am4core.color("#fff");
	level1_column.strokeWidth = 5;
	level1_column.strokeOpacity = 1;
	level1_column.properties.tooltipText= "{parentName} {nameCompleto}\n{value}";
	
	var level1_bullet = level1.bullets.push(new am4charts.LabelBullet());
	level1_bullet.locationY = 0.5;
	level1_bullet.locationX = 0.5;
	level1_bullet.label.text = "{name}\n{value}";
	level1_bullet.label.fill = am4core.color("#fff");
	level1_bullet.label.truncate = false;
	level1_bullet.label.wrap  = true;
}

/*
	Función para crear el gráfico superior derecha
*/
function pintaGraficoSuperiorDerecha(importeLinea)
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("pintaGraficoSuperiorDerecha");
	}

	var labels = true;
	
	am4core.useTheme(am4themes_frozen);
	am4core.useTheme(am4themes_animated);
	
	var chart = am4core.create("chartdivGraficoSuperiorDerecha", am4charts.XYChart);

	chart.data = importeLinea;
	chart.language.locale._decimalSeparator= ",";
	chart.language.locale._thousandSeparator= ".";
	// chart.language.locale = am4lang_es_ES;

	var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
	categoryAxis.dataFields.category = "etiqueta";
	categoryAxis.renderer.inversed = true;
	categoryAxis.renderer.grid.template.location = 0;
	categoryAxis.renderer.minGridDistance = 1;

	var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
	valueAxis.min = 0;
	valueAxis.strictMinMax = true;

	var series = chart.series.push(new am4charts.ColumnSeries());
	series.dataFields.categoryY = "etiqueta";
	series.dataFields.valueX = "subNum";
	series.name = "subNum";
	series.columns.template.tooltipText = "{etiqueta}: [bold]{valueX}[/]";
	series.columns.template.fillOpacity = .8;
	series.columns.template.strokeOpacity = 0;
	// series.tooltipText = "{lineaCompl}: [bold]{valueX}[/]";
	// series.tooltipText = "Income in {categoryY}: {valueX}";

	var columnTemplate = series.columns.template;
	columnTemplate.strokeWidth = 2;
	columnTemplate.strokeOpacity = 1;

}





/*
	Función para crear el gráfico inferior izquierda
*/
function pintaGraficoInferiorIzquierda(subvenciones,width)
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("pintaGraficoInferiorIzquierda");
	}
	
	var labels = true;
	if (width<700)
	{
		labels=false;
	}
	
	am4core.useTheme(am4themes_frozen);
	am4core.useTheme(am4themes_animated);
	
	var chart = am4core.create("chartdivGraficoInferiorIzquierda", am4charts.XYChart);

	chart.data = subvenciones;
	chart.language.locale._decimalSeparator= ",";
	chart.language.locale._thousandSeparator= ".";
	// chart.language.locale = am4lang_es_ES;

	var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
	categoryAxis.dataFields.category = "etiqueta";
	categoryAxis.renderer.inversed = true;
	categoryAxis.renderer.grid.template.location = 0;
	categoryAxis.renderer.minGridDistance = 1;
	
	var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
	valueAxis.min = 0;
	valueAxis.strictMinMax = true;

	var series = chart.series.push(new am4charts.ColumnSeries());
	series.dataFields.categoryY = "etiqueta";
	series.dataFields.valueX = "numSub";
	series.name = "numSub";
	series.columns.template.tooltipText = "{etiqueta}: [bold]{valueX}[/]";
	series.columns.template.fillOpacity = .8;
	series.columns.template.strokeOpacity = 0;
	// series.tooltipText = "{categoryY}: [bold]{valueX}[/]";

	var columnTemplate = series.columns.template;
	columnTemplate.strokeWidth = 2;
	columnTemplate.strokeOpacity = 1;
}

/*
	Función para crear el gráfico inferior derecha
*/
function pintaGraficoInferiorDerecha(subvenciones,width)
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("pintaGraficoInferiorDerecha");
	}
	
	var labels = true;
	if (width<700)
	{
		labels=false;
	}
	
	am4core.useTheme(am4themes_frozen);
	am4core.useTheme(am4themes_animated);
	
	var chart = am4core.create("chartdivGraficoInferiorDerecha", am4charts.XYChart);

	chart.data = subvenciones;
	chart.language.locale._decimalSeparator= ",";
	chart.language.locale._thousandSeparator= ".";
	// chart.language.locale = am4lang_es_ES;

	var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
	categoryAxis.dataFields.category = "tipoInstrumento";
	categoryAxis.renderer.inversed = true;
	categoryAxis.renderer.grid.template.location = 0;
	categoryAxis.renderer.minGridDistance = 1;

	var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
	valueAxis.min = 0;
	valueAxis.strictMinMax = true;

	var series = chart.series.push(new am4charts.ColumnSeries());
	series.dataFields.categoryY = "tipoInstrumento";
	series.dataFields.valueX = "numSub";
	series.name = "numSub";
	series.columns.template.tooltipText = "{tipoInstrumentoCompl}: [bold]{valueX}[/]";
	series.columns.template.fillOpacity = .8;
	series.columns.template.strokeOpacity = 0;

	var columnTemplate = series.columns.template;
	columnTemplate.strokeWidth = 2;
	columnTemplate.strokeOpacity = 1;

}

/*
	Función para mostrar la tabla de debajo de los gráficos
*/
function mostrarDatos( capa ) 
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("mostrarDatos");
	}

	$('#'+capa).toggle();
	if(heightInicial==undefined)
	{
		heightInicial=$("#iframeBusquedaSubvenciones", window.parent.document).height();
	}

	var isVisible = $('#'+capa).is(':visible');
	//datos_subInfDer  datos_subInfIzq
	if (isVisible === true) 
	{
		$("#iframeBusquedaSubvenciones", window.parent.document).height($( 'body' ).height());
	}else
	{
		if($(".table-responsive").is(':visible'))
		{
			$('#iframeBusquedaSubvenciones', window.parent.document).height(heightConTabla);
		}else
		{
			$('#iframeBusquedaSubvenciones', window.parent.document).height(heightInicial);
		}
	}
}

/*
	Función para limpiar el formulario de beneficiarios
*/
function limpiarFormularioSub()
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("limpiarFormularioSub");
	}
	
	$("#buscadorNombre").val("");
	$("#selectNombreArea").val("");
	$("#selectEntidadFinanciadora").val("");
	$("#selectServicio").val("");
	$("#selectTipoInstrumento").val("");
	$("#buscadorclasificacionPrograma").val("");
	$("#buscadorclasificacionEconomicaGasto").val("");
	$("#selectTipoProcedimiento").val("");
	$("#buscadorName").val("");
	$("#buscadorObjeto").val("");
	$("#selectInstrumenta").val("");
	$("#selectNominativa").val("");
	$("#selectAnyo").val("");
	$("#desde").val("");
	$("#hasta").val("");
	$("#importeDesde").val("");
	$("#importeHasta").val("");
	$("#selectTematica").val("");
	$("#importeConcedidoDesde").val("");
	$("#importeConcedidoHasta").val("");


	$("#lineaGraficosBusquedaSub").hide();
	$(".table-responsive").hide();
	$("#botoneraDescarga").hide();

	$("#iframeBusquedaSubvenciones", window.parent.document).height(heightInicial);
}