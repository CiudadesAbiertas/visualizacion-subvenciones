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
var areas=new Array();	
var anyo=undefined;

/*
	Función de inicialización del script
*/
function inicializaDepartamentosGastoGlobal()
{
	if(logDebugDepartamentosGastoGlobal)
	{
		console.log("inicializaDepartamentosGastoGlobal");
	}
	
	inicializaMultidiomaDepartamentosGastoGlobal();
}

/*
	Función para inicializar el multidioma
*/
function inicializaMultidiomaDepartamentosGastoGlobal()
{
	if(logDebugDepartamentosGastoGlobal)
	{
		console.log("inicializaMultidiomaDepartamentosGastoGlobal");
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
			inicializaDatosDepartamentosGastoGlobal();
			insertaURLSAPI();
		});
	});
	
	// Enable debug
	$.i18n.debug = logDebugDepartamentosGastoGlobal;
}

/*
	Función que iniciliza los datos que dependen de la API
*/
function inicializaDatosDepartamentosGastoGlobal()
{
	if(logDebugDepartamentosGastoGlobal)
	{
		console.log("inicializaDatosDepartamentosGastoGlobal");
	}
	
	anyo = getUrlVars()["anyo"];
	if(anyo==undefined)
	{
		anyo='2020';
	}
	
	var urlFiltroAnyo="";
	if(anyo!=undefined && anyo!='Todos')
	{
		urlFiltroAnyo="&"+paramWhereAPI+"=fechaAdjudicacion>='"+anyo+"-01-01T00:00:00' and fechaAdjudicacion<='"+anyo+"-12-31T23:59:59'";
	}
	
	var texto = $.i18n( 'gasto_area' );
	$('#textoCabeceraDepDastGlob').html(texto+' '+anyo);
	
	var areasGasto=new Array();
	
	var jqxhr = $.getJSON(dameURL(queryGraficoDepGasto+urlFiltroAnyo)).done(function( data ) 
	{
		var areaCadena=$.i18n( 'area' );
		var importeCadena=$.i18n( 'importe' );
		var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+areaCadena+"</th><th>"+importeCadena+"</th></tr>";
		for (var i = 0; i < data.records.length; i++) 
		{
			areas.push(data.records[i][0]);
			var areaGasto=new Object();
			areaGasto.name=data.records[i][0];
			areaGasto.value=data.records[i][1];
			areasGasto.push(areaGasto);

			var importe=numeral(data.records[i][1]);
			htmlContent = htmlContent + "<tr>" + "<td>" + data.records[i][0].toString() + "</td>" + "<td>" + importe.format(numFormato) + "</td>" + "</tr>";
		}
		htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos()\">Mostar/Ocultar datos</button></div></div>";
		$('#datos_gasAre').html(htmlContent);
		
	}).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}).always(function() 
	{
		pintaTreeMap(areasGasto);			
		modificaTaskMaster("iframeDepartamentosGastoGlobal");
	});
}

/*
	Función que inserta las URLs de la API
*/
function insertaURLSAPI()
{
	if(logDebugDepartamentosGastoGlobal)
	{
		console.log("insertaURLSAPI");
	}
	$('#urlAPIDepGasGlo').attr("href", queryGraficoDepGasto);
	$('#descargaDepGasGloCSV').attr("href", queryGraficoDepGastoCSV);
	$('#descargaDepGasGloJSON').attr("href", queryGraficoDepGasto);
	$('#urlAPIDoc').attr("href", docAPI);
	$('#urlMax').attr("href", window.location.href);
	$('#urlMax').attr("target", '_blank');
}

/*
	Función que pinta el gráfico
*/
function pintaTreeMap(areasGasto)
{
	if(logDebugDepartamentosGastoGlobal)
	{
		console.log("pintaTreeMap");
	}
	
	var chart = am4core.create("chartdivTree", am4charts.TreeMap);
	chart.layoutAlgorithm = chart.binaryTree;
	chart.data = areasGasto;
	chart.dataFields.value = "value";
	chart.dataFields.name = "name";
	chart.language.locale._decimalSeparator= ",";
	chart.language.locale._thousandSeparator= ".";
	chart.fontSize = 14;
	
	chart.accessibleLabel=true;

	chart.colors.list = [
	  am4core.color("#1b4f72"),
	  am4core.color("#21618c"),
	  am4core.color("#2874a6"),
	  am4core.color("#2e86c1"),
	  am4core.color("#3498db"),
	  am4core.color("#5dade2"),
	  am4core.color("#85c1e9"),
	  am4core.color("#aed6f1"),
	  am4core.color("#d6eaf8"),
	  am4core.color("#ebf5fb"),
	  am4core.color("#1b4f72"),
	  am4core.color("#21618c"),
	  am4core.color("#2874a6"),
	  am4core.color("#2e86c1"),
	  am4core.color("#3498db"),
	  am4core.color("#5dade2"),
	  am4core.color("#85c1e9"),
	  am4core.color("#aed6f1"),
	  am4core.color("#d6eaf8"),
	  am4core.color("#ebf5fb"),
	  am4core.color("#1b4f72"),
	  am4core.color("#21618c"),
	  am4core.color("#2874a6"),
	  am4core.color("#2e86c1"),
	  am4core.color("#3498db"),
	  am4core.color("#5dade2"),
	  am4core.color("#85c1e9"),
	  am4core.color("#aed6f1"),
	  am4core.color("#d6eaf8"),
	  am4core.color("#ebf5fb")
	];
	
	var level1 = chart.seriesTemplates.create("0");
	var level1_column = level1.columns.template;
	// Evento para abrir la búsqueda relacionada
	level1_column.events.on("hit", function(ev) 
	{
		var paramName = ev.target.dataItem.dataContext.dataContext.name;
		
		if(window.self!=window.top)
		{
			console.log('Llamada a general.js');
			window.parent.cambioCapaSubvencionesAreaNombre(paramName,anyo);
		}else
		{
			console.log('Ejecutar enlace');
			var url = "busqueda_subvenciones.html?lang="+$.i18n().locale
			url=url+"&areaNombre="+paramName+"&anyo="+anyo;
			window.open(url,'_blank');
		}
	}, this);
	level1_column.column.cornerRadius(10, 10, 10, 10);
	level1_column.fillOpacity = 0.8;
	level1_column.stroke = am4core.color("#fff");
	level1_column.strokeWidth = 5;
	level1_column.strokeOpacity = 1;
	level1_column.properties.tooltipText= "{parentName} {name}: {value} €";
	
	var level1_bullet = level1.bullets.push(new am4charts.LabelBullet());
	level1_bullet.locationY = 0.5;
	level1_bullet.locationX = 0.5;
	level1_bullet.label.text = "{name}\n{value}€";
	level1_bullet.label.fill = am4core.color("#fff");
	level1_bullet.width = 100;
	level1_bullet.label.truncate = false;
	level1_bullet.label.wrap  = true;
		
	if (inIframe())
	{	
		var altura=parent.heightImporteMeses-$(".panel-heading").height()			
		$("#chartdivTree").height(altura);
	}else
	{		
		var h = window.innerHeight;
		h=h-($(".panel-heading").height()*4);		
		var p=porcentaje(h,88);
		$("#chartdivTree").height(p);
	}
}

/*
	Función que muestra la tabla de debajo del gráfico
*/
function mostrarDatos() 
{
	if(logDebugDepartamentosGastoGlobal)
	{
		console.log("mostrarDatos");
	}
	$('#datos_gasAre').toggle();

	var isVisible = $('#datos_gasAre').is(':visible');
	if (isVisible === true) 
	{
		var cachito = (5 / 100) * $( document ).height();
		$('#iframeDepartamentosGastoGlobal', window.parent.document).height($( document ).height()+cachito);
	}else
	{
		$("#iframeDepartamentosGastoGlobal", window.parent.document).height(394+120);
	}
}