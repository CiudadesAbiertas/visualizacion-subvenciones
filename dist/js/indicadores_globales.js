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

var subvencionCadena=$.i18n( 'convocatoria' );
var noSubvencionCadena=$.i18n( 'no_convocatorias' );
var noSubvencionCadena2=$.i18n( 'no_convocatorias2' );
var anyoCadena=$.i18n( 'anyos' );
var anyoCadena2=$.i18n( 'anyos2' );
var beneficiarioCadena=$.i18n( 'beneficiario' );
var noBeneficiarioCadena=$.i18n( 'no_beneficiarios' );
var noBeneficiarioCadena2=$.i18n( 'no_beneficiarios2' );
var importeCadena=$.i18n( 'importe' );
var importeCadena2=$.i18n( 'importe2' );

/*
	Función de inicialización del script
*/
function inicializaIndicadoresGlobales()
{
	if(logDebugIndicadoresGlobales)
	{
		console.log("inicializaIndicadoresGlobales");
	}
	
	inicializaMultidiomaIndicadoresGlobales();
}

/*
	Función para inicializar el multidioma
*/
function inicializaMultidiomaIndicadoresGlobales()
{
	if(logDebugIndicadoresGlobales)
	{
		console.log("inicializaMultidiomaIndicadoresGlobales");
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
			noSubvencionCadena=$.i18n( 'no_convocatorias' );
			noSubvencionCadena2=$.i18n( 'no_convocatorias2' );
			anyoCadena=$.i18n( 'anyos' );
			anyoCadena2=$.i18n( 'anyos2' );
			noBeneficiarioCadena=$.i18n( 'no_beneficiarios' );
			noBeneficiarioCadena2=$.i18n( 'no_beneficiarios2' );
			importeCadena=$.i18n( 'importe' );
			importeCadena2=$.i18n( 'importe2' );

			inicializaDatosIndicadoresGlobales();
			insertaURLSAPI();
		});
	});
	
	// Enable debug
	$.i18n.debug = logDebugIndicadoresGlobales;
}

/*
	Función que inicializa los datos que dependen de la API
*/
function inicializaDatosIndicadoresGlobales()
{
	if(logDebugIndicadoresGlobales)
	{
		console.log("inicializaDatosIndicadoresGlobales");
	}

	var indicadoresTemp = {};
	var anyos = new Array();
	var jqxhr = $.getJSON(dameURL(queryIndicadorSubvencionesGlobal)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			
			for (var i = 0; i < data.records.length; i++) 
			{
				var indicadorGlobal=new Object();
				var anyo=data.records[i].anyo;
				anyos.push(anyo);
				indicadorGlobal.subvencion=data.records[i].numero;
				indicadorGlobal.anyo=anyo;
				indicadoresTemp[anyo]=indicadorGlobal;
			}
			
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
		var jqxhr = $.getJSON(dameURL(queryIndicadorBeneficiariosGlobal)).done(function( data ) 
		{
			if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
			{
				for (var i = 0; i < data.records.length; i++) 
				{
					var anyo=data.records[i].anyo;
					if(!anyos.includes(anyo))
					{
						anyos.push(anyo);
					}
					var indicadorGlobal=indicadoresTemp[anyo];
					if(indicadorGlobal===undefined){
						indicadorGlobal = new Object();
					}
					indicadorGlobal.beneficiario=data.records[i].numero;
					indicadoresTemp[anyo]=indicadorGlobal;
				}
				
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
			
			var jqxhr = $.getJSON(dameURL(queryIndicadorImporteTotalGlobal)).done(function( data ) 
			{
				if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
				{
					
					var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+anyoCadena+"</th><th>"+noSubvencionCadena+"</th><th>"+noBeneficiarioCadena+"</th><th>"+importeCadena+"</th></tr>";
					for (var i = 0; i < data.records.length; i++) 
					{
						var anyo=data.records[i].anyo;
						if(!anyos.includes(anyo))
						{
							anyos.push(anyo);
						}
						
						var indicadorGlobal=indicadoresTemp[anyo];
						if(indicadorGlobal===undefined){
							indicadorGlobal = new Object();
						}
						indicadorGlobal.importe=data.records[i].suma;
						indicadorGlobal.anyo=anyo;
						indicadoresTemp[anyo]=indicadorGlobal;
						

						var importe=numeral(indicadorGlobal.importe);
						htmlContent = htmlContent + "<tr>" + "<td>" + indicadorGlobal.anyo + "</td>" + "<td>" + indicadorGlobal.subvencion + "</td>" + "<td>" + indicadorGlobal.beneficiario + "</td>" + "<td>" + importe.format(numFormato) + "</td>" + "</tr>";
					}
					var mensaje_mostar_ocultar_datos =  $.i18n( 'mostar_ocultar_datos' );
					htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos()\">"+mensaje_mostar_ocultar_datos+"</button></div></div>";
					$('#datos_indGlo').html(htmlContent);
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
				var indicadoresGlobales=new Array();
				for(var h=0;h<anyos.length;h++){
					var anyo= anyos[h];
					indicadoresGlobales.push(indicadoresTemp[anyo]);
				}
				pintaIndicadoresGlobales(indicadoresGlobales);	
			});
		});
	});
	
}

function pasaArray(element) {
	indicadoresGlobales.push(element);
}

/*
	Función que inserta las URLs de la API
*/
function insertaURLSAPI()
{
	if(logDebugIndicadoresGlobales)
	{
		console.log("insertaURLSAPI");
	}
	if (!inIframe())
	{
		$('#urlMax').hide();
	}
	$('#urlAPIIndSubGlobal').attr("href", queryIndicadorSubvencionesGlobal);
	$('#urlAPIIndBenGlobal').attr("href", queryIndicadorBeneficiariosGlobal);
	$('#urlAPIIndImpTotGlobal').attr("href", queryIndicadorImporteTotalGlobal);
	$('#urlAPIDoc').attr("href", docAPIConcesion);
	$('#urlMax').attr("href", window.location.href);
	$('#urlMax').attr("target", '_blank');
}

/*
	Función que pinta el gráfico
*/
function pintaIndicadoresGlobales(indicadoresGlobales)
{
	if(logDebugIndicadoresGlobales)
	{
		console.log("pintaIndicadoresGlobales");
	}
	
	var chart = am4core.create("chartdiv", am4charts.XYChart);
	
	chart.data = indicadoresGlobales;
	chart.language.locale._decimalSeparator= ",";
	chart.language.locale._thousandSeparator= ".";
	
	var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
	categoryAxis.dataFields.category = "anyo";
	categoryAxis.renderer.opposite = true;
	categoryAxis.title.text = anyoCadena2;
	
	var valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
	valueAxis1.title.text = noSubvencionCadena2;
	var series1 = chart.series.push(new am4charts.LineSeries());
	series1.dataFields.valueY = "subvencion";
	series1.dataFields.categoryX = "anyo";
	series1.name = noSubvencionCadena2;
	series1.yAxis = valueAxis1;
	series1.strokeWidth = 3;
	series1.bullets.push(new am4charts.CircleBullet());
	series1.tooltipText = "{name} en {categoryX}: {valueY}";
	series1.legendSettings.valueText = "{valueY}";
	
	var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
	var series2 = chart.series.push(new am4charts.LineSeries());
	series2.dataFields.valueY = "beneficiario";
	series2.dataFields.categoryX = "anyo";
	series2.name = noBeneficiarioCadena2;
	valueAxis2.title.text = noBeneficiarioCadena2;
	series2.yAxis = valueAxis2;
	series2.strokeWidth = 3;
	series2.bullets.push(new am4charts.CircleBullet());
	series2.tooltipText = "{name} en {categoryX}: {valueY}";
	series2.legendSettings.valueText = "{valueY}";
	
	var valueAxis3 = chart.yAxes.push(new am4charts.ValueAxis());
	var series3 = chart.series.push(new am4charts.LineSeries());
	series3.dataFields.valueY = "importe";
	series3.dataFields.categoryX = "anyo";	
	series3.name = importeCadena2;
	valueAxis3.title.text = importeCadena2;
	series3.yAxis = valueAxis3;
	series3.strokeWidth = 3;
	series3.bullets.push(new am4charts.CircleBullet());
	series3.tooltipText = "{name} en {categoryX}: {valueY}";
	series3.legendSettings.valueText = "{valueY}";
	
	chart.cursor = new am4charts.XYCursor();
	chart.cursor.behavior = "zoomY";
	
	chart.legend = new am4charts.Legend();
	

}

/*
	Función que muestra la tabla de debajo de los gráficos
*/
function mostrarDatos() 
{
	if(logDebugIndicadoresGlobales)
	{
		console.log("mostrarDatos");
	}
	$('#datos_indGlo').toggle();

	var isVisible = $('#datos_indGlo').is(':visible');
	if (isVisible === true) 
	{
		var cachito = (5 / 100) * $( document ).height();
		$('#iframeIndicadoresGlobales', window.parent.document).height($( document ).height()+cachito);
	}else
	{
		$("#iframeIndicadoresGlobales", window.parent.document).height(405+120);
	}
}

