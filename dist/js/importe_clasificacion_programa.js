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

var anyo;
var urlFiltroAnyo="";

/*
	Función de inicialización del script
*/
function inicializaImporteClasificacionPrograma()
{
	if(logDebugImporteClasificacionPrograma)
	{
		console.log("inicializaImporteClasificacionPrograma");
	}
	
	inicializaMultidiomaImporteClasificacionPrograma();
}

/*
	Función para inicializar el multidioma
*/
function inicializaMultidiomaImporteClasificacionPrograma()
{
	if(logDebugImporteClasificacionPrograma)
	{
		console.log("inicializaMultidiomaImporteClasificacionPrograma");
	}
	
	var langUrl = getUrlVars()["lang"];
	if(langUrl==undefined)
	{
		langUrl='es';
	}
	$.i18n().locale = langUrl;
	document.documentElement.lang=$.i18n().locale;
	$('html').i18n();
	
	var iframe1 = '<iframe class="embed-responsive-item" src="';
	var iframe2 = '" frameborder="0" scrolling="no" height="500" width="100%"></iframe>';
	$('#code').text(iframe1+window.location.href+iframe2);
	
	jQuery(function($) 
	{
		$.i18n().load( 
		{
			en: './dist/i18n/en.json',
			es: './dist/i18n/es.json',
			gl: './dist/i18n/gl.json'
		}).done(function() 
		{
			$('html').i18n();
			inicializaDatosImporteClasificacionPrograma();
			
		});
	});
	
	// Enable debug
	$.i18n.debug = logDebugImporteClasificacionPrograma;
}

/*
	Función que iniciliza los datos que dependen de la API
*/
function inicializaDatosImporteClasificacionPrograma()
{
	if(logDebugImporteClasificacionPrograma)
	{
		console.log("inicializaDatosImporteClasificacionPrograma");
	}
	
	anyo = getUrlVars()["anyo"];
	if(anyo==undefined)
	{
		anyo='2018';
	}
	
	if(anyo!=undefined && anyo!='Todos')
	{
		urlFiltroAnyo="&"+paramWhereAPI+"=fechaAcuerdo>='"+anyo+"-01-01T00:00:00' and fechaAcuerdo<='"+anyo+"-12-31T23:59:59'";
	}
	insertaURLSAPI();
	var texto = $.i18n( 'importe_clasificacion_programa' );
	$('#textoCabeceraImpTipBen').html(texto+' '+anyo);
	
	var importeClasificacionProgramas=new Array();

	$.getJSON(dameURL(queryGraficoImporteClasificacionPrograma+urlFiltroAnyo)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			var importeClasficacion=new Object();
			
			for (var i = 0; i < data.records.length; i++) 
			{
				var clasficacion=etiquetasClasificacionPro.get(data.records[i].clasificacion.toString()[0]);
				var importe=data.records[i].suma;

				importeClasficacion=new Object();
				importeClasficacion.clasficacion=clasficacion.substring(0, limiteCadenasTexto);
				importeClasficacion.clasficacionCompl=clasficacion;
				importeClasficacion.importe=importe;
				importeClasificacionProgramas.push(importeClasficacion);
				
			}

			importeClasificacionProgramas.sort(function(a, b){return b.importe-a.importe;});

			var ClasificacionProgramaCadena = "Clasificación programa";
			var importeCadena=$.i18n( 'importe' );
			var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+ClasificacionProgramaCadena+"</th><th>"+importeCadena+"</th></tr>";
			for(var h = 0; h < importeClasificacionProgramas.length; h++){
				var tipo = importeClasificacionProgramas[h].clasficacion;
				var importehtml=importeClasificacionProgramas[h].importe;
				importehtml=numeral(importehtml);
				htmlContent = htmlContent + "<tr>" + "<td>" + tipo + "</td>" + "<td>" + importehtml.format(numFormato) + "</td>" + "</tr>";
			}
			var mensaje_mostar_ocultar_datos =  $.i18n( 'mostar_ocultar_datos' );
			htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos()\">"+mensaje_mostar_ocultar_datos+"</button></div></div>";
			$('#datos_ImpTipBen').html(htmlContent);
		}else
		{
			console.log( msgErrorAPIResVacio );
		}
	}).fail(function( jqxhr, textStatus, error ) 
	{
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );
	}).always(function() 
	{
		pintaImporteClasificacionPrograma(importeClasificacionProgramas);
		modificaTaskMaster("iframeClasificacionPrograma");		
	});
}

/*
	Función que inserta las URLs de la API
*/
function insertaURLSAPI()
{
	if(logDebugImporteClasificacionPrograma)
	{
		console.log("insertaURLSAPI");
	}
	if (!inIframe())
	{
		$('#urlMax').hide();
	}
	$('#urlAPIImpTipBen').attr("href", queryGraficoImporteClasificacionPrograma+urlFiltroAnyo);
	$('#descargaImpTipBenCSV').attr("href", queryGraficoImporteClasificacionProgramaCSV+urlFiltroAnyo);
	$('#descargaImpTipBenJSON').attr("href", queryGraficoImporteClasificacionPrograma+urlFiltroAnyo);
	$('#urlAPIDoc').attr("href", docAPIConvocatoria);
	$('#urlMax').attr("href", window.location.href);
	$('#urlMax').attr("target", '_blank');
	
}

/*
	Función que pinta el gráfico inicializaDatosImporte
*/
function pintaImporteClasificacionPrograma(importeClasificacionPrograma)
{
	if(logDebugImporteClasificacionPrograma)
	{
		console.log("pintaImporteClasificacionPrograma");
	}
	
	am4core.useTheme(am4themes_frozen);
	am4core.useTheme(am4themes_animated);

	var chart = am4core.create("chartdiv", am4charts.TreeMap);
	chart.data = importeClasificacionPrograma;
	chart.language.locale._decimalSeparator= ",";
	chart.language.locale._thousandSeparator= ".";
	
	chart.dataFields.value = "importe";
	chart.dataFields.name = "clasficacion";
	
	chart.focusFilter.stroke = am4core.color("#0f0");
	chart.focusFilter.strokeWidth = 4;
	
	var level1 = chart.seriesTemplates.create("0");
	var level1_column = level1.columns.template;
	level1_column.column.cornerRadius(10, 10, 10, 10);
	level1_column.fillOpacity = 0.8;
	level1_column.stroke = am4core.color("#fff");
	level1_column.strokeWidth = 5;
	level1_column.strokeOpacity = 1;
	level1_column.properties.tooltipText= "{parentName} {clasficacionCompl}: {value} €";
	level1_column.events.on("hit", function(ev) 
	{
		var paramClasficacion = ev.target.dataItem.dataContext.dataContext.clasficacionCompl;
		
		if(window.self!=window.top)
		{
			console.log('Llamada a general.js');
			window.parent.cambioCapaSubvencionesClasiProg(paramClasficacion,anyo);
		}else
		{
			console.log('Ejecutar enlace');
			var url = "busqueda_convocatorias.html?lang="+$.i18n().locale;
			url=url+"&clasificacionPrograma="+paramClasficacion+"*&anyo="+anyo;
			window.open(url,'_blank');
		}
	}, this);

	var level1_bullet = level1.bullets.push(new am4charts.LabelBullet());
	level1_bullet.locationY = 0.5;
	level1_bullet.locationX = 0.5;
	level1_bullet.label.text = "{name}\n{value}€";
	level1_bullet.label.fill = am4core.color("#222");
	level1_bullet.label.truncate = false;
	// level1_bullet.label.wrap  = true;	

	level1_bullet.label.padding(4,10,4,10);
	level1_bullet.label.fontSize = 20;
	level1_bullet.layout = "absolute";
	level1_bullet.label.isMeasured = true;

	level1_bullet.events.on("ready", function(event){
		let target = event.target;
		if (target.parent) {
		  var pw = target.maxWidth;
		  var ph = target.maxHeight;
	  
		  let label = target.children.getIndex(0)
		  var tw = label.measuredWidth;
		  var th = label.measuredHeight;
	  
		  let scale = Math.min(pw / tw, ph / th);
	  
		  if (!isNaN(scale) && scale != Infinity) {
			if(scale>limiteAgrandarTextosTreemap)
			{
			scale=limiteAgrandarTextosTreemap;
			}
			target.scale = scale;
			}
			if(scale<limiteOcultarTextosTreemap)
			{
				target.disabled = true;
			}
		}
	})

}

/*
	Función que muestra la tabla de debajo de los gráficos
*/
function mostrarDatos() 
{
	if(logDebugImporteClasificacionPrograma)
	{
		console.log("mostrarDatos");
	}

	$('#datos_ImpTipBen').toggle();

	var isVisible = $('#datos_ImpTipBen').is(':visible');
	if (isVisible === true) 
	{
		var cachito = (5 / 100) * $( document ).height();
		$('#iframeClasificacionPrograma', window.parent.document).height($( document ).height()+cachito);
	}else
	{
		$("#iframeClasificacionPrograma", window.parent.document).height(394+120);
	}
}
