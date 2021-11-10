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

var anyo = 2018;
var peticiones = [false,false,false];	
var urlFiltroAnyoConvocatoria="";
var urlFiltroAnyoBeneficiario="";

/*
	Función de inicialización del script
*/
function inicializaIndicadores()
{
	if(logDebugIndicadores)
	{
		console.log("inicializaIndicadores");
	}

	inicializaMultidiomaIndicadores();
}

/*
	Función para inicializar el multidioma
*/
function inicializaMultidiomaIndicadores()
{
	if(logDebugIndicadores)
	{
		console.log("inicializaMultidiomaIndicadores");
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
	var iframe2 = '" height=300 frameborder="0" width="100%"></iframe>';
	$('#code').text(iframe1+window.location.href+iframe2);
	
	jQuery(function($) 
	{
	  $.i18n().load( 
	  {
		en: './dist/i18n/en.json',
		es: './dist/i18n/es.json',
		gl: './dist/i18n/gl.json'
	  } ).done(function() {
			$('html').i18n();
			inicializaDatosIndicadores();
			insertaURLSAPI();
		});

	});
	
	// Enable debug
	$.i18n.debug = logDebugIndicadores;
}

/*
	Función que iniciliza los datos que dependen de la API
*/
function inicializaDatosIndicadores()
{
	if(logDebugIndicadores)
	{
		console.log("inicializaDatosIndicadores");
	}
	
	anyo = getUrlVars()["anyo"];
	if(anyo==undefined)
	{
		anyo='2018';
	}
	
	if(anyo!=undefined && anyo!='Todos')
	{
		urlFiltroAnyoConvocatoria="&"+paramQAPI+"=fechaAcuerdo>='"+anyo+"-01-01T00:00:00' and fechaAcuerdo<='"+anyo+"-12-31T23:59:59'";
	}
	if(anyo!=undefined && anyo!='Todos')
	{
		urlFiltroAnyoBeneficiario="&"+paramWhereAPI+"=fechaConcesion>='"+anyo+"-01-01T00:00:00' and fechaConcesion<='"+anyo+"-12-31T23:59:59'";
	}
	
	var texto = $.i18n( 'indicadores' );
	$('#textoCabeceraIndicadores').html(texto+' '+anyo);
	
	$.getJSON(dameURL(queryIndicadorConcesiones+urlFiltroAnyoConvocatoria)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			var valor=0;
			valor = Number(data.totalRecords);

			var nSubvenciones=numeral(valor);
			$("#numConcesiones").html(nSubvenciones.format());
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
		peticiones[0]=true;
		if(logDebugIndicadores)
		{
			console.log("fin peticion 0");
		}
		if (checkBooleanArray(peticiones))
		{	
			modificaTaskMaster("iframeIndicadores");
		}
	});
	
	var jqxhr = $.getJSON(dameURL(queryIndicadorBeneficiarios+urlFiltroAnyoBeneficiario)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			var valor=0;
			valor = Number(data.totalRecords);

			var nAdjudicatarios=numeral(valor);
			$("#numAdjudicatarios").html(nAdjudicatarios.format());
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
		peticiones[1]=true;
		if(logDebugIndicadores)
		{
			console.log("fin peticion 1");
		}
		if (checkBooleanArray(peticiones))
		{
			modificaTaskMaster("iframeIndicadores");
		}
	});
	
	obtieneImporteTotal(queryIndicadorImporteTotal+urlFiltroAnyoBeneficiario);
	
	try
	{
		$('#iframeIndicadores', window.parent.document).height($( document ).height());
	}
	catch (error)
	{
	}
}

function obtieneIndicadorSubvenciones(url)
{
	
}


var valorImporteTotal=0;
var sImporteTotal;
function obtieneImporteTotal(url)
{
	var jqxhr = $.getJSON(dameURL(url)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			for(var h = 0; h < data.records.length; h++){
				valorImporteTotal=valorImporteTotal+Number(data.records[h].suma);
			}

			if(data.next!=undefined)
			{
				obtieneImporteTotal(data.next);
			}

			sImporteTotal=numeral(valorImporteTotal);
			$("#sumImporte").html(sImporteTotal.format(importeFormatoSinDecimales,Math.ceil));
		}else
		{
			console.log( msgErrorAPIResVacio );
		}
	}).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}).always(function( )
	{
		peticiones[2]=true;
		if(logDebugIndicadores)
		{
			console.log("fin peticion 2");
		}
		if (checkBooleanArray(peticiones))
		{
			modificaTaskMaster("iframeIndicadores");
		}
	});	
}

/*
	Función que inserta las URLs de la API
*/
function insertaURLSAPI()
{
	if(logDebugIndicadores)
	{
		console.log("insertaURLSAPI");
	}
	
	$('#urlAPIIndSub').attr("href", queryIndicadorConcesiones+urlFiltroAnyoConvocatoria);
	$('#urlAPIIndBen').attr("href", queryIndicadorBeneficiarios+urlFiltroAnyoBeneficiario);
	$('#urlAPIIndImpTot').attr("href", queryIndicadorImporteTotal+urlFiltroAnyoBeneficiario);
	$('#urlAPIDoc').attr("href", docAPIConcesion);
}