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

/*
Algunas variables que se usan en este javascript se inicializan en ciudadesAbiertas.js
*/
var anyo=undefined;

var subvencionCadena=$.i18n( 'subvencion' );
var noSubvencionCadena=$.i18n( 'no_subvenciones' );
var anyoCadena=$.i18n( 'anyo' );
var beneficiarioCadena=$.i18n( 'beneficiario' );
var noBeneficiarioCadena=$.i18n( 'no_beneficiarios' );
var importeCadena=$.i18n( 'importe' );

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
	$('html').i18n()
	
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
			noSubvencionCadena=$.i18n( 'no_subvenciones' );
			anyoCadena=$.i18n( 'anyo' );
			noBeneficiarioCadena=$.i18n( 'no_beneficiarios' );
			importeCadena=$.i18n( 'importe' );
			inicializaDatosIndicadoresGlobales();
			insertaURLSAPI();
		});
	});
	
	// Enable debug
	$.i18n.debug = logDebugImporteTipoBeneficiarios;
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
	var jqxhr = $.getJSON(dameURL(queryIndicadorSubvencionesGlobal)).done(function( data ) 
	{
		if(data.records!=undefined)
		{
			
			for (var i = 0; i < data.records.length; i++) 
			{
				var indicadorGlobal=new Object();
				var anyo=data.records[i][1];
				indicadorGlobal.subvencion=data.records[i][0];
				indicadoresTemp[anyo]=indicadorGlobal;
			}
			
		}else
		{
			console.log( "Request empty");
		}
	}).fail(function( jqxhr, textStatus, error ) 
	{
			var err = textStatus + ", " + error;
			console.log( "Request Failed: " + err );
	}).always(function() 
	{
		var jqxhr = $.getJSON(dameURL(queryIndicadorBeneficiariosGlobal)).done(function( data ) 
		{
			if(data.records!=undefined)
			{
				for (var i = 0; i < data.records.length; i++) 
				{
					var anyo=data.records[i][1];
					var indicadorGlobal=indicadoresTemp[anyo];
					indicadorGlobal.beneficiario=data.records[i][0];
					indicadoresTemp[anyo]=indicadorGlobal;
				}
				
			}else
			{
				console.log( "Request empty");
			}
		}).fail(function( jqxhr, textStatus, error ) 
		{
				var err = textStatus + ", " + error;
				console.log( "Request Failed: " + err );
		}).always(function() 
		{
			var indicadoresGlobales=new Array();
			var jqxhr = $.getJSON(dameURL(queryIndicadorImporteTotalGlobal)).done(function( data ) 
			{
				if(data.records!=undefined)
				{
					
					var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+anyoCadena+"</th><th>"+noSubvencionCadena+"</th><th>"+noBeneficiarioCadena+"</th><th>"+importeCadena+"</th></tr>";
					for (var i = 0; i < data.records.length; i++) 
					{
						var anyo=data.records[i][1];
						var indicadorGlobal=indicadoresTemp[anyo];
						indicadorGlobal.importe=data.records[i][0];
						indicadorGlobal.anyo=anyo;
						indicadoresGlobales.push(indicadorGlobal);

						var importe=numeral(indicadorGlobal.importe);
						htmlContent = htmlContent + "<tr>" + "<td>" + indicadorGlobal.anyo + "</td>" + "<td>" + indicadorGlobal.subvencion + "</td>" + "<td>" + indicadorGlobal.beneficiario + "</td>" + "<td>" + importe.format(numFormato) + "</td>" + "</tr>";
					}
					htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos()\">Mostar/Ocultar datos</button></div></div>";
					$('#datos_indGlo').html(htmlContent);
				}else
				{
					console.log( "Request empty");
				}
			}).fail(function( jqxhr, textStatus, error ) 
			{
					var err = textStatus + ", " + error;
					console.log( "Request Failed: " + err );
			}).always(function() 
			{
				pintaIndicadoresGlobales(indicadoresGlobales);
				// modificaTaskMaster("iframeImporteTipoBeneficiarios");		
			});
		});
	});
	
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
	$('#urlAPIImpTipBen').attr("href", queryGraficoImporteTipoBeneficiarios);
	$('#descargaImpTipBenCSV').attr("href", queryGraficoImporteTipoBeneficiariosCSV);
	$('#descargaImpTipBenJSON').attr("href", queryGraficoImporteTipoBeneficiarios);
	$('#urlAPIDoc').attr("href", docAPI);
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
	
	var chart = am4core.create("chartIndicadoresGlobales", am4charts.XYChart);
	
	chart.data = indicadoresGlobales;
	chart.language.locale._decimalSeparator= ",";
	chart.language.locale._thousandSeparator= ".";
	
	// Create category axis
	var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
	categoryAxis.dataFields.category = "anyo";
	categoryAxis.renderer.opposite = true;
	categoryAxis.title.text = anyoCadena;
	
	// Create series
	var valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
	valueAxis1.title.text = noSubvencionCadena;
	var series1 = chart.series.push(new am4charts.LineSeries());
	series1.dataFields.valueY = "subvencion";
	series1.dataFields.categoryX = "anyo";
	series1.name = noSubvencionCadena;
	series1.yAxis = valueAxis1;
	series1.strokeWidth = 3;
	series1.bullets.push(new am4charts.CircleBullet());
	series1.tooltipText = "{name} in {categoryX}: {valueY}";
	series1.legendSettings.valueText = "{valueY}";
	
	var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
	var series2 = chart.series.push(new am4charts.LineSeries());
	series2.dataFields.valueY = "beneficiario";
	series2.dataFields.categoryX = "anyo";
	series2.name = noBeneficiarioCadena;
	valueAxis2.title.text = noBeneficiarioCadena;
	series2.yAxis = valueAxis2;
	series2.strokeWidth = 3;
	series2.bullets.push(new am4charts.CircleBullet());
	series2.tooltipText = "{name} in {categoryX}: {valueY}";
	series2.legendSettings.valueText = "{valueY}";
	
	var valueAxis3 = chart.yAxes.push(new am4charts.ValueAxis());
	var series3 = chart.series.push(new am4charts.LineSeries());
	series3.dataFields.valueY = "importe";
	series3.dataFields.categoryX = "anyo";	
	series3.name = importeCadena;
	valueAxis3.title.text = importeCadena;
	series3.yAxis = valueAxis3;
	series3.strokeWidth = 3;
	series3.bullets.push(new am4charts.CircleBullet());
	series3.tooltipText = "{name} in {categoryX}: {valueY}";
	series3.legendSettings.valueText = "{valueY}";
	
	// Add chart cursor
	chart.cursor = new am4charts.XYCursor();
	chart.cursor.behavior = "zoomY";
	
	// Add legend
	chart.legend = new am4charts.Legend();
	
	if (inIframe())
	{	
		$("#chartIndicadoresGlobales").height(parent.heightIndicadoresGlobal);		
	}
	else
	{		
		var h = window.innerHeight;
		h=h-($(".panel-heading").height()*4);		
		var p=porcentaje(h,93);
		$("#chartIndicadoresGlobales").height(p);
	}
}

/*
	Función que pinta el gráfico
*/
function pintaIndicadoresGlobales2(indicadoresGlobales)
{
	if(logDebugIndicadoresGlobales)
	{
		console.log("pintaIndicadoresGlobales2");
	}
	var chart = am4core.create("chartIndicadoresGlobales", am4charts.XYChart);
	chart.colors.step = 2;
	
	chart.data = indicadoresGlobales;
	
	// Create axes
	var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
	categoryAxis.renderer.minGridDistance = 50;
	categoryAxis.title.text = anyoCadena;

	function createAxisAndSeries(field, name, opposite, bullet) {
		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		var series = chart.series.push(new am4charts.LineSeries());
		
		

		series.dataFields.valueY = field;
		series.dataFields.categoryX = "anyo";
		series.strokeWidth = 2;
		series.yAxis = valueAxis;
		
		series.name = name;
		series.tooltipText = "{name}: [bold]{valueY}[/]";
		series.tensionX = 0.8;
		
		var interfaceColors = new am4core.InterfaceColorSet();
		
		switch(bullet) {
			case "triangle":
			  var bullet = series.bullets.push(new am4charts.Bullet());
			  bullet.width = 12;
			  bullet.height = 12;
			  bullet.horizontalCenter = "middle";
			  bullet.verticalCenter = "middle";
			  
			  var triangle = bullet.createChild(am4core.Triangle);
			  triangle.stroke = interfaceColors.getFor("background");
			  triangle.strokeWidth = 2;
			  triangle.direction = "top";
			  triangle.width = 12;
			  triangle.height = 12;
			  break;
			case "rectangle":
			  var bullet = series.bullets.push(new am4charts.Bullet());
			  bullet.width = 10;
			  bullet.height = 10;
			  bullet.horizontalCenter = "middle";
			  bullet.verticalCenter = "middle";
			  
			  var rectangle = bullet.createChild(am4core.Rectangle);
			  rectangle.stroke = interfaceColors.getFor("background");
			  rectangle.strokeWidth = 2;
			  rectangle.width = 10;
			  rectangle.height = 10;
			  break;
			default:
			  var bullet = series.bullets.push(new am4charts.CircleBullet());
			  bullet.circle.stroke = interfaceColors.getFor("background");
			  bullet.circle.strokeWidth = 2;
			  break;
		}
		
		valueAxis.renderer.line.strokeOpacity = 1;
		valueAxis.renderer.line.strokeWidth = 2;
		valueAxis.renderer.line.stroke = series.stroke;
		valueAxis.renderer.labels.template.fill = series.stroke;
		valueAxis.renderer.opposite = opposite;
		valueAxis.renderer.grid.template.disabled = true;
	}
	
	createAxisAndSeries("subvencion", noSubvencionCadena, false, "circle");
	createAxisAndSeries("beneficiario", noBeneficiarioCadena, true, "triangle");
	createAxisAndSeries("importe", importeCadena, true, "rectangle");
	
	// Add legend
	chart.legend = new am4charts.Legend();

	if (inIframe())
	{	
		$("#chartImporteTipo").height(parent.heightTipoBeneficiario);		
	}
	else
	{		
		var h = window.innerHeight;
		h=h-($(".panel-heading").height()*4);		
		var p=porcentaje(h,93);
		$("#chartImporteTipo").height(p);
	}

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
