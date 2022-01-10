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
var organizaciones=new Array();
var urlFiltroAnyo="";

/*
	Función de inicialización del script
*/
function inicializaImporteServicio()
{
	if(logDebugImporteArea)
	{
		console.log("ImporteServicio");
	}
	
	inicializaMultidiomaImporteArea();
}

/*
	Función para inicializar el multidioma
*/
function inicializaMultidiomaImporteArea()
{
	if(logDebugImporteArea)
	{
		console.log("inicializaMultidiomaImporteArea");
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
			obtieneOrganizaciones(queryOrganizationIdAreas);
			// insertaURLSAPI();
		});
	});
	
	// Enable debug
	$.i18n.debug = logDebugImporteArea;
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
					inicializaDatosImporteArea();
					insertaURLSAPI();
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
function inicializaDatosImporteArea()
{
	if(logDebugImporteArea)
	{
		console.log("inicializaDatosImporteArea");
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
	
	var texto = $.i18n( 'importe_servicio' );
	$('#textoImporteServicio').html(texto+' '+anyo);
	
	var servicios=new Array();
	
	$.getJSON(dameURL(queryServicioImporte+urlFiltroAnyo)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			var servicioCadena=$.i18n( 'servicio' );
			var importeCadena=$.i18n( 'importe' );
			var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+servicioCadena+"</th><th>"+importeCadena+"</th></tr>";
			for (var i = 0; i < data.records.length; i++) 
			{
				var title = organizaciones[data.records[i].servicio];
				var servicio=new Object();
				servicio.name=title.substring(0, limiteCadenasTexto);
				servicio.nameCompl=title;
				servicio.value=data.records[i].suma;
				servicios.push(servicio);

				var importe=numeral(data.records[i].suma);
				htmlContent = htmlContent + "<tr>" + "<td>" + title.toString() + "</td>" + "<td>" + importe.format(numFormato) + "</td>" + "</tr>";
			}
			var mensaje_mostar_ocultar_datos =  $.i18n( 'mostar_ocultar_datos' );
			htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos()\">"+mensaje_mostar_ocultar_datos+"</button></div></div>";
			$('#datos_gasAre').html(htmlContent);
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
		pintaTarta(servicios);			
		modificaTaskMaster("iframeImporteServicio");
	});
}

/*
	Función que inserta las URLs de la API
*/
function insertaURLSAPI()
{
	if(logDebugImporteArea)
	{
		console.log("insertaURLSAPI");
	}
	if (!inIframe())
	{
		$('#urlMax').hide();
	}
	$('#urlAPIImpSer').attr("href", queryServicioImporte+urlFiltroAnyo);
	$('#descargaImpSerCSV').attr("href", queryServicioImporteCSV+urlFiltroAnyo);
	$('#descargaImpSerJSON').attr("href", queryServicioImporte+urlFiltroAnyo);
	$('#urlAPIDoc').attr("href", docAPIConvocatoria);
	$('#urlMax').attr("href", window.location.href);
	$('#urlMax').attr("target", '_blank');
}


/*
	Función que pinta el gráfico
*/
function pintaTarta(areasGasto)
{
	if(logDebugImporteArea)
	{
		console.log("pintaTreeMap");
	}
	
	am4core.useTheme(am4themes_frozen);
	am4core.useTheme(am4themes_animated);

	var chart = am4core.create("chartdiv", am4charts.PieChart);
	chart.hiddenState.properties.opacity = 0; 
	chart.language.locale = am4lang_es_ES;

	var series = chart.series.push(new am4charts.PieSeries());
	series.dataFields.value = "value";
	series.dataFields.category = "name";
	series.labels.template.disabled = true;
	series.ticks.template.disabled = true;
	series.slices.template.tooltipText = "{nameCompl}: [bold]{value}[/]";

	chart.data = areasGasto;
	
	chart.legend = new am4charts.Legend();
	chart.legend.position = "right";
	chart.legend.valign = "top";
	chart.legend.maxWidth = 500;
	chart.legend.maxHeight = 400;
	chart.legend.scrollable = true;
	chart.legend.itemContainers.template.paddingTop = 5;
	chart.legend.itemContainers.template.paddingBottom = 5;
	
	chart.focusFilter.stroke = am4core.color("#0f0");
	chart.focusFilter.strokeWidth = 4;
	
	// Evento para abrir la búsqueda relacionada
	series.slices.template.events.on("hit", function(ev) 
	{
		var paramName = ev.target.dataItem.dataContext.nameCompl;
		var paramOrgId;
		$.getJSON(queryOrganizationTitle+paramName).done(function( data ) 
		{
			if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
			{
				paramOrgId=data.records[0].id;
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
			if(window.self!=window.top)
			{
				console.log('Llamada a general.js');
				window.parent.cambioCapaSubvencionesServicio(paramOrgId,anyo);
			}else
			{
				console.log('Ejecutar enlace');
				var url = "busqueda_convocatorias.html?lang="+$.i18n().locale;
				url=url+"&servicio="+paramOrgId+"&anyo="+anyo;
				window.open(url,'_blank');
			}
		}
		);

		
	}, this);
		
}

/*
	Función que muestra la tabla de debajo del gráfico
*/
function mostrarDatos() 
{
	if(logDebugImporteArea)
	{
		console.log("mostrarDatos");
	}
	$('#datos_gasAre').toggle();

	var isVisible = $('#datos_gasAre').is(':visible');
	if (isVisible === true) 
	{
		var cachito = (5 / 100) * $( document ).height();
		$('#iframeImporteServicio', window.parent.document).height($( document ).height()+cachito);
	}else
	{
		$("#iframeImporteServicio", window.parent.document).height(394+120);
	}
}