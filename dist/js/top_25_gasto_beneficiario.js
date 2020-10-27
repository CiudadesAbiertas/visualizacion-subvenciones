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

/*
	Función de inicialización del script
*/
function inicializaTop25GastoBeneficiario()
{
	if(logDebugTop25GastoBeneficiario)
	{
		console.log("inicializaTop25GastoBeneficiario");
	}
	
	inicializaMultidiomaTop25GastoBeneficiario();
}

/*
	Función para inicializar el multidioma
*/
function inicializaMultidiomaTop25GastoBeneficiario()
{
	if(logDebugTop25GastoBeneficiario)
	{
		console.log("inicializaMultidiomaTop25GastoBeneficiario");
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
			inicializaDatosTop25GastoBeneficiario();
			insertaURLSAPI();
		});
	});
	
	// Enable debug
	$.i18n.debug = logDebugTop25GastoBeneficiario;
}

/*
	Función que inicializa los datos que dependen de la API
*/
function inicializaDatosTop25GastoBeneficiario()
{
	if(logDebugTop25GastoBeneficiario)
	{
		console.log("inicializaDatosTop25GastoBeneficiario");
	}
	
	var beneficiariosSumImporte=new Array();
	var jqxhr = $.getJSON(dameURL(queryGraficoBusquedaSumImporteBeneficiarios)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			for (var i = 0; i < data.records.length; i++) 
			{
				var beneficiario=new Object();
				beneficiario.sumImporte=data.records[i][0];
				beneficiario.adjudicatarioId=data.records[i][1];
				beneficiario.adjudicatarioTitle=data.records[i][2].substring(0, 30);
				beneficiario.adjudicatarioTitleCompleto=data.records[i][2];
				beneficiariosSumImporte.push(beneficiario);
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
	}).always(function() 
	{
		pintaGraficoInferiorIzquierda(beneficiariosSumImporte,$( window.parent.document ).width());
	});
	
}

/*
	Función que inserta las URLs de la API
*/
function insertaURLSAPI()
{
	if(logDebugTop25GastoBeneficiario)
	{
		console.log("insertaURLSAPI");
	}
	$('#urlAPIImpTipBen').attr("href", queryGraficoBusquedaSumImporteBeneficiarios);
	$('#descargaImpTipBenCSV').attr("href", queryGraficoBusquedaSumImporteBeneficiariosCSV);
	$('#descargaImpTipBenJSON').attr("href", queryGraficoBusquedaSumImporteBeneficiarios);
	$('#urlAPIDoc').attr("href", docAPI);
	$('#urlMax').attr("href", window.location.href);
	$('#urlMax').attr("target", '_blank');
	
}

/*
	Función para crear el gráfico inferior izquierda
*/
function pintaGraficoInferiorIzquierda(sumSubvencionesBeneficiarios,width)
{
	if(logDebugTop25GastoBeneficiario)
	{
		console.log("pintaGraficoInferiorIzquierda "+width);
	}
	var labels = true;
	if (width<700)
	{
		labels=false;
	}
	
	AmCharts.makeChart("chartTop25GastoBeneficiario", 
	{
		type: "serial",
		rotate: true,
		dataProvider: sumSubvencionesBeneficiarios,
		decimalSeparator: ",",
		thousandsSeparator: ".",
		categoryField: "adjudicatarioTitle",
		categoryAxis: 
		{
			"labelsEnabled": labels
		},
		graphs: 
		[{
			"balloonFunction": function( item, content ) 
			{				  
				var html = item.dataContext.adjudicatarioTitleCompleto+"\n"+item.dataContext.sumImporte.toLocaleString('es-ES',{ style: 'currency', currency: 'EUR' });				  
				return html;
			},
			"cornerRadiusTop": 3,
			"fillAlphas": 1,
			"lineColor": "#006AA0",
			"type": "column",
			"valueField": "sumImporte"
		}],
		autoMarginOffset: 0,
		marginBottom: 0,
		marginLeft: 0,
		marginRight: 0,
		marginTop: 0,
	});
	
	if (inIframe())
	{	
		$("#chartTop25GastoBeneficiario").height(parent.heightTop25GastoBeneficiario);		
	}
	else
	{		
		var h = window.innerHeight;
		h=h-($(".panel-heading").height()*4);		
		var p=porcentaje(h,93);
		$("#chartTop25GastoBeneficiario").height(p);
	}
}


