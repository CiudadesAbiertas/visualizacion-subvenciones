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

var gestionados=new Array();	
var anyo;
var organizaciones=new Array();

/*
	Función de inicialización del script
*/
function inicializaGestionado()
{
	if(logDebugGestionado)
	{
		console.log("inicializaGestionado");
	}
	
	inicializaMultidiomaGestionado();
}

/*
	Función para inicializar el multidioma
*/
function inicializaMultidiomaGestionado()
{
	if(logDebugGestionado)
	{
		console.log("inicializaMultidiomaGestionado");
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
			obtieneOrganizaciones(queryIniOrganization);
		});
	});
	
	// Enable debug
	$.i18n.debug = logDebugGestionado;
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
					inicializaDatosGestionado();
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
function inicializaDatosGestionado()
{
	if(logDebugGestionado)
	{
		console.log("inicializaDatosGestionado");
	}
	
	anyo = getUrlVars()["anyo"];
	if(anyo==undefined)
	{
		anyo='2020';
	}
	
	var urlFiltroAnyo="";
	if(anyo!=undefined && anyo!='Todos')
	{
		urlFiltroAnyo="&"+paramWhereAPI+"=fechaAcuerdo>='"+anyo+"-01-01T00:00:00' and fechaAcuerdo<='"+anyo+"-12-31T23:59:59' and gestionadoPorOrganization=1";
	}
	
	var texto = $.i18n( 'gestionado_organizacion' );
	$('#textoGestionadoOrg').html(texto+' '+anyo);

	texto = $.i18n( 'gestionado_distrito' );
	$('#textoGestionadoDestrito').html(texto+' '+anyo);
		
	$.getJSON(dameURL(queryGraficoGestOrg+urlFiltroAnyo)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			var gestionadoCadena=$.i18n( 'gestionado' );
			var importeCadena=$.i18n( 'importe' );
			var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+gestionadoCadena+"</th><th>"+importeCadena+"</th></tr>";
			for (var i = 0; i < data.records.length; i++) 
			{
				if(data.records[i].organizacion!=null)
				{
					var gestionado=new Object();
					gestionado.name=organizaciones[data.records[i].organizacion].substring(0, limiteCadenasTexto);
					gestionado.nameCompl=organizaciones[data.records[i].organizacion];
					gestionado.value=data.records[i].suma;
					gestionados.push(gestionado);

					var importe=numeral(data.records[i].suma);
					htmlContent = htmlContent + "<tr>" + "<td>" + organizaciones[data.records[i].organizacion].toString() + "</td>" + "<td>" + importe.format(numFormato) + "</td>" + "</tr>";
				}
			}
			var mensaje_mostar_ocultar_datos =  $.i18n( 'mostar_ocultar_datos' );
			htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos()\">"+mensaje_mostar_ocultar_datos+"</button></div></div>";
			$('#datos_gestIzq').html(htmlContent);
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
		pintaGraficoGestOrg(gestionados);			
		modificaTaskMaster("iframeGestionado");
	});

	var gestionadosDis=new Array();
	urlFiltroAnyo="";
	if(anyo!=undefined && anyo!='Todos')
	{
		urlFiltroAnyo="&"+paramWhereAPI+"=fechaAcuerdo>='"+anyo+"-01-01T00:00:00' and fechaAcuerdo<='"+anyo+"-12-31T23:59:59' and gestionadoPorDistrito=1";
	}

	$.getJSON(dameURL(queryGraficoGestDis+urlFiltroAnyo)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			var gestionadoCadena=$.i18n( 'gestionado' );
			var importeCadena=$.i18n( 'importe' );
			var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+gestionadoCadena+"</th><th>"+importeCadena+"</th></tr>";
			for (var i = 0; i < data.records.length; i++) 
			{
				if(data.records[i].distrito!=null)
				{
					var gestionado=new Object();
					gestionado.name=data.records[i].distrito.substring(0, limiteCadenasTexto);
					gestionado.nameCompl=data.records[i].distrito; 
					gestionado.value=data.records[i].suma;
					gestionadosDis.push(gestionado);

					var importe=numeral(data.records[i].suma);
					htmlContent = htmlContent + "<tr>" + "<td>" + data.records[i].distrito.toString() + "</td>" + "<td>" + importe.format(numFormato) + "</td>" + "</tr>";
				}
			}			
			var mensaje_mostar_ocultar_datos =  $.i18n( 'mostar_ocultar_datos' );
			htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos()\">"+mensaje_mostar_ocultar_datos+"</button></div></div>";
			$('#datos_gestDer').html(htmlContent);
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
		pintaGraficoGestDist(gestionadosDis);			
		modificaTaskMaster("iframeGestionado");
	});
}

/*
	Función que pinta el gráfico
*/
function pintaGraficoGestOrg(gestionados)
{
	if(logDebugGestionado)
	{
		console.log("pintaGestionado Organizacion");
	}

	am4core.useTheme(am4themes_frozen);
	am4core.useTheme(am4themes_animated);
	
	var chart = am4core.create("chartdivSuperiorIzquierda", am4charts.XYChart);

	chart.data = gestionados;
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
	series.columns.template.tooltipText = "{nameCompl}: [bold]{valueX}[/]";
	series.columns.template.fillOpacity = .8;
	series.columns.template.strokeOpacity = 0;

	series.columns.template.events.on("hit", function(ev) 
	{
		var paramName = ev.target.dataItem.dataContext.nameCompl;
		console.log("paramName "+paramName);
	}, this);	

	var columnTemplate = series.columns.template;
	columnTemplate.strokeWidth = 2;
	columnTemplate.strokeOpacity = 1;
}

/*
	Función que pinta el gráfico
*/
function pintaGraficoGestDist(gestionados)
{
	if(logDebugGestionado)
	{
		console.log("pintaGestionado Distrito");
	}

	am4core.useTheme(am4themes_frozen);
	am4core.useTheme(am4themes_animated);
	
	var chart = am4core.create("chartdivSuperiorDerecha", am4charts.XYChart);

	chart.data = gestionados;
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
	series.columns.template.tooltipText = "{nameCompl}: [bold]{valueX}[/]";
	series.columns.template.fillOpacity = .8;
	series.columns.template.strokeOpacity = 0;

	series.columns.template.events.on("hit", function(ev) 
	{
		var paramName = ev.target.dataItem.dataContext.nameCompl;
		console.log("paramName "+paramName);
	}, this);	

	var columnTemplate = series.columns.template;
	columnTemplate.strokeWidth = 2;
	columnTemplate.strokeOpacity = 1;
}

/*
	Función que muestra la tabla de debajo del gráfico
*/
function mostrarDatos(capa) 
{
	if(logDebugGestionado)
	{
		console.log("mostrarDatos");
	}
	$('#'+capa).toggle();

	var isVisible = $('#capa').is(':visible');
	if (isVisible === true) 
	{
		var cachito = (5 / 100) * $( document ).height();
		$('#iframeGestionado', window.parent.document).height($( document ).height()+cachito);
	}else
	{
		$("#iframeGestionado", window.parent.document).height(394+120);
	}
}