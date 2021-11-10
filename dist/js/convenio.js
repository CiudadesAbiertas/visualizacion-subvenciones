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

var convenios=new Array();	
var anyo;
var urlFiltroAnyo="";

/*
	Función de inicialización del script
*/
function inicializaConvenio()
{
	if(logDebugConvenio)
	{
		console.log("inicializaConvenio");
	}
	
	inicializaMultidiomaConvenio();
}

/*
	Función para inicializar el multidioma
*/
function inicializaMultidiomaConvenio()
{
	if(logDebugConvenio)
	{
		console.log("inicializaMultidiomaConvenio");
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
	var iframe2 = '" frameborder="0" height="600" width="100%"></iframe>';
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
			inicializaDatosConvenio();
			
		});
	});
	
	// Enable debug
	$.i18n.debug = logDebugConvenio;
}

/*
	Función que iniciliza los datos que dependen de la API
*/
function inicializaDatosConvenio()
{
	if(logDebugConvenio)
	{
		console.log("inicializaDatosConvenio");
	}
	
	anyo = getUrlVars()["anyo"];
	if(anyo==undefined)
	{
		anyo='2020';
	}
	
	
	if(anyo!=undefined && anyo!='Todos')
	{
		urlFiltroAnyo="&"+paramWhereAPI+"=fechaAcuerdo>='"+anyo+"-01-01T00:00:00' and fechaAcuerdo<='"+anyo+"-12-31T23:59:59'";
	}
	insertaURLSAPI();

	var texto = $.i18n( 'convenios' );
	$('#textoCabeceraConv').html(texto+' '+anyo);
		
	$.getJSON(dameURL(queryGraficoConvenio+urlFiltroAnyo)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			var convenioCadena=$.i18n( 'convenio' );
			var importeCadena=$.i18n( 'importe' );
			var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+convenioCadena+"</th><th>"+importeCadena+"</th></tr>";
			for (var i = 0; i < data.records.length; i++) 
			{
				if(data.records[i].convenio!=null)
				{
					var convenio=new Object();
					convenio.name=data.records[i].convenio;
					convenio.value=data.records[i].suma;
					convenios.push(convenio);

					var importe=numeral(data.records[i].suma);
					htmlContent = htmlContent + "<tr>" + "<td>" + data.records[i].convenio.toString() + "</td>" + "<td>" + importe.format(numFormato) + "</td>" + "</tr>";
				}
			}
			var mensaje_mostar_ocultar_datos =  $.i18n( 'mostar_ocultar_datos' );
			htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos()\">"+mensaje_mostar_ocultar_datos+"</button></div></div>";
			$('#datos_conv').html(htmlContent);
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
		if(convenios.length==0)
		{
			$('#chartdiv').html('No hay datos de '+texto+' '+anyo);
		}else
		{
			pintaGrafico(convenios);	
		}		
		modificaTaskMaster("iframeConvenio");
	});
}

/*
	Función que inserta las URLs de la API
*/
function insertaURLSAPI()
{
	if(logDebugConvenio)
	{
		console.log("insertaURLSAPI");
	}
	if (!inIframe())
	{
		$('#urlMax').hide();
	}
	$('#urlAPIDepGasGlo').attr("href", queryGraficoConvenio+urlFiltroAnyo);
	$('#descargaDepGasGloCSV').attr("href", queryGraficoConvenioCSV+urlFiltroAnyo);
	$('#descargaDepGasGloJSON').attr("href", queryGraficoConvenio+urlFiltroAnyo);
	$('#urlAPIDoc').attr("href", docAPIConvocatoria);
	$('#urlMax').attr("href", window.location.href);
	$('#urlMax').attr("target", '_blank');
}

/*
	Función que pinta el gráfico
*/

function pintaGrafico(convenios)
{
	if(logDebugBusquedaBeneficiarios)
	{
		console.log("pintaConvenios");
	}

	am4core.useTheme(am4themes_frozen);
	am4core.useTheme(am4themes_animated);
	
	var chart = am4core.create("chartdiv", am4charts.XYChart);

	chart.data = convenios;
	chart.language.locale._decimalSeparator= ",";
	chart.language.locale._thousandSeparator= ".";
	// chart.language.locale = am4lang_es_ES;

	var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
	categoryAxis.dataFields.category = "name";
	categoryAxis.renderer.inversed = true;
	categoryAxis.renderer.grid.template.location = 0;
	categoryAxis.renderer.minGridDistance = 1;

	var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
	valueAxis.min = 0;
	valueAxis.strictMinMax = true;

	var series = chart.series.push(new am4charts.ColumnSeries());
	series.dataFields.categoryY = "name";
	series.dataFields.valueX = "value";
	series.name = "value";
	series.columns.template.tooltipText = "{adjudicatarioTitleCompleto}: [bold]{valueX}[/]";
	series.columns.template.fillOpacity = .8;
	series.columns.template.strokeOpacity = 0;

	var columnTemplate = series.columns.template;
	columnTemplate.strokeWidth = 2;
	columnTemplate.strokeOpacity = 1;
}


/*
	Función que muestra la tabla de debajo del gráfico
*/
function mostrarDatos() 
{
	if(logDebugConvenio)
	{
		console.log("mostrarDatos");
	}
	$('#datos_conv').toggle();

	var isVisible = $('#datos_conv').is(':visible');
	if (isVisible === true) 
	{
		var cachito = (5 / 100) * $( document ).height();
		$('#iframeConvenio', window.parent.document).height($( document ).height()+cachito);
	}else
	{
		$("#iframeConvenio", window.parent.document).height(394+120);
	}
}