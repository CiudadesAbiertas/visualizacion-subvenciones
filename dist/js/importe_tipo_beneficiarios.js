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
function inicializaImporteTipo()
{
	if(logDebugImporteTipoBeneficiarios)
	{
		console.log("inicializaImporteTipo");
	}
	
	inicializaMultidiomaImporteTipo();
}

/*
	Función para inicializar el multidioma
*/
function inicializaMultidiomaImporteTipo()
{
	if(logDebugImporteTipoBeneficiarios)
	{
		console.log("inicializaMultidiomaImporteTipo");
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
			inicializaDatosImporteTipo();
		});
	});
	
	// Enable debug
	$.i18n.debug = logDebugImporteTipoBeneficiarios;
}

/*
	Función que iniciliza los datos que dependen de la API
*/
function inicializaDatosImporteTipo()
{
	if(logDebugImporteTipoBeneficiarios)
	{
		console.log("inicializaDatosImporteTipo");
	}
	
	anyo = getUrlVars()["anyo"];
	if(anyo==undefined)
	{
		anyo='2018';
	}
	
	if(anyo!=undefined && anyo!='Todos')
	{
		urlFiltroAnyo="&"+paramWhereAPI+"=fechaConcesion>='"+anyo+"-01-01T00:00:00' and fechaConcesion<='"+anyo+"-12-31T23:59:59'";
	}
	
	var texto = $.i18n( 'suma_importe_tipo_beneficiario' );
	$('#textoCabeceraImpTipBen').html(texto+' '+anyo);
	
	var importeTipos=new Array();

	var jqxhr = $.getJSON(dameURL(queryGraficoImporteTipoBeneficiarios+urlFiltroAnyo)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			var importePersonasFisicas = Number(0);
			var importeTipo=new Object();
			
			for (var i = 0; i < data.records.length; i++) 
			{
				var tipo=dameTipoEntidad(data.records[i].tipo.toString());
				var importe=data.records[i].suma;
				if(tipo=='Persona física')
				{
					importePersonasFisicas = Number(importe) + Number(importePersonasFisicas);
					importe = importePersonasFisicas;
				}else
				{
					importeTipo=new Object();
					importeTipo.tipo=tipo.substring(0, limiteCadenasTexto);
					importeTipo.tipoCompl=tipo;
					importeTipo.importe=importe;
					importeTipos.push(importeTipo);
				}
				
			}

			importeTipo=new Object();
			importeTipo.tipo='Persona física';
			importeTipo.importe=importePersonasFisicas;
			importeTipos.push(importeTipo);

			importeTipos.sort(function(a, b){return b.importe-a.importe;});

			var tipoBeneficiarioCadena=$.i18n( 'tipo_beneficiario' );
			var importeCadena=$.i18n( 'importe' );
			var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+tipoBeneficiarioCadena+"</th><th>"+importeCadena+"</th></tr>";
			for(var h = 0; h < importeTipos.length; h++){
				var tipo = importeTipos[h].tipo;
				var importe=importeTipos[h].importe;
				importe=numeral(importe);
				htmlContent = htmlContent + "<tr>" + "<td>" + tipo + "</td>" + "<td>" + importe.format(numFormato) + "</td>" + "</tr>";
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
		insertaURLSAPI();
		pintaImporteTipo(importeTipos);
		modificaTaskMaster("iframeImporteTipoBeneficiarios");		
	});
}

/*
	Función que inserta las URLs de la API
*/
function insertaURLSAPI()
{
	if(logDebugImporteTipoBeneficiarios)
	{
		console.log("insertaURLSAPI");
	}
	if (!inIframe())
	{
		$('#urlMax').hide();
	}
	$('#urlAPIImpTipBen').attr("href", queryGraficoImporteTipoBeneficiarios+urlFiltroAnyo);
	$('#descargaImpTipBenCSV').attr("href", queryGraficoImporteTipoBeneficiariosCSV+urlFiltroAnyo);
	$('#descargaImpTipBenJSON').attr("href", queryGraficoImporteTipoBeneficiarios+urlFiltroAnyo);
	$('#urlAPIDoc').attr("href", docAPIConcesion);
	$('#urlMax').attr("href", window.location.href);
	$('#urlMax').attr("target", '_blank');
	
}

/*
	Función que pinta el gráfico
*/
function pintaImporteTipo(importeTipos)
{
	if(logDebugImporteTipoBeneficiarios)
	{
		console.log("pintaImporteTipo");
	}
	
	am4core.useTheme(am4themes_frozen);
	am4core.useTheme(am4themes_animated);

	var chart = am4core.create("chartdiv", am4charts.TreeMap);
	chart.data = importeTipos;
	chart.language.locale._decimalSeparator= ",";
	chart.language.locale._thousandSeparator= ".";
	chart.layoutAlgorithm = chart.squarify;

	chart.dataFields.value = "importe";
	chart.dataFields.name = "tipo";
	
	chart.focusFilter.stroke = am4core.color("#0f0");
	chart.focusFilter.strokeWidth = 4;
	
	var level1 = chart.seriesTemplates.create("0");
	var level1_column = level1.columns.template;
	level1_column.events.on("hit", function(ev) 
	{
		var paramTipo = ev.target.dataItem.dataContext.dataContext.tipoCompl;
		
		if(window.self!=window.top)
		{
			console.log('Llamada a general.js');
			window.parent.cambioCapaBeneficiariosTipo(paramTipo,anyo);
		}else
		{
			console.log('Ejecutar enlace');
			var url = "busqueda_concesiones.html?lang="+$.i18n().locale;
			url=url+"&tipo="+paramTipo+"&anyo="+anyo;
			window.open(url,'_blank');
		}
	}, this);
	
	level1_column.column.cornerRadius(10, 10, 10, 10);
	level1_column.fillOpacity = 0.8;
	level1_column.stroke = am4core.color("#fff");
	level1_column.strokeWidth = 5;
	level1_column.strokeOpacity = 1;
	level1_column.properties.tooltipText= "{name}: {value} €";
	
	var level1_bullet = level1.bullets.push(new am4charts.LabelBullet());
	level1_bullet.locationY = 0.5;
	level1_bullet.locationX = 0.5;
	level1_bullet.label.text = "{name}\n{value}€";
	level1_bullet.label.fill = am4core.color("#222");
	level1_bullet.label.truncate = false;

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
	if(logDebugImporteTipoBeneficiarios)
	{
		console.log("mostrarDatos");
	}

	$('#datos_ImpTipBen').toggle();

	var isVisible = $('#datos_ImpTipBen').is(':visible');
	if (isVisible === true) 
	{
		var cachito = (5 / 100) * $( document ).height();
		$('#iframeImporteTipoBeneficiarios', window.parent.document).height($( document ).height()+cachito);
	}else
	{
		$("#iframeImporteTipoBeneficiarios", window.parent.document).height(394+120);
	}
}
