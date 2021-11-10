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


// variables para normalizar datos
var numFormatoSinDecimales='0,0';
var numFormato='0,0.[00]';
var numFormatoCSV='0.[00]';
var importeFormato='0,0.[00] $';
var importeFormatoSinDecimales='0,0 $';

// Lista para almnacenar los años de las subvenciones
// var anyos=new Array();
var anyosNumber=new Array();
var anyosString=new Array();
var anyoPorDefecto;
var organizacionesIni;
var mySlider;
var datosIniciados=false;

/* 
	Métodos para el arranque de la web
*/
function initComun()
{
	if(logDebugComun)
	{
		console.log("initComun");
	}
	
	multidiomaComun();
	numeralInit();
}

/* 
	Función para el multiidioma 
*/
function multidiomaComun()
{
	if(logDebugComun)
	{
		console.log("multidiomaComun");
	}
	
	jQuery(function($){
		//carga de los idiomas
		$.i18n().load({
			en: 'dist/i18n/en.json',
			es: 'dist/i18n/es.json',
			gl: 'dist/i18n/gl.json'
		}).done(function(){
			$('html').i18n();
		});
		
		//configuración del botón que cambia de idioma
		$(".switch-locale").click(function(){
			
			
			var mensaje_cambio_idioma =  $.i18n( 'mensaje_cambio_idioma' );
			var r = confirm(mensaje_cambio_idioma);
			if (r == true) 
			{
				$('.modal').modal('show');
				$('#capaInicio').show();
				$('#capaSubvenciones').show();
				$('#capaBeneficiarios').show();
				$('#capaAyuda').show();
				$.i18n().locale = $(this).data('locale');
				$('html').i18n();
				document.documentElement.lang=$.i18n().locale; 
				
				var url = "";
				url = $('#iframeBusquedaBeneficiarios').attr('src');
				var pos = url.search('lang=');
				url = url.substring(0,pos)+'lang='+$(this).data('locale');
				$('#iframeBusquedaBeneficiarios').attr('src',url);

				url = $('#iframeBusquedaSubvenciones').attr('src');
				pos = url.search('lang=');
				url = url.substring(0,pos)+'lang='+$(this).data('locale');
				$('#iframeBusquedaSubvenciones').attr('src',url);

				url = $('#iframeIndicadores').attr('src');
				pos = url.search('lang=');
				url = url.substring(0,pos)+'anyo='+anyosString[anyosString.length-1]+'&lang='+$(this).data('locale');
				$('#iframeIndicadores').attr('src',url);

				url = $('#iframeIndicadoresGlobales').attr('src');
				pos = url.search('lang=');
				url = url.substring(0,pos)+'anyo='+anyosString[anyosString.length-1]+'&lang='+$(this).data('locale');
				$('#iframeIndicadoresGlobales').attr('src',url);

				url = $('#iframeImporteTipoBeneficiarios').attr('src');
				pos = url.search('lang=');
				url = url.substring(0,pos)+'anyo='+anyosString[anyosString.length-1]+'&lang='+$(this).data('locale');
				$('#iframeImporteTipoBeneficiarios').attr('src',url);

				url = $('#iframeImporteArea').attr('src');
				pos = url.search('lang=');
				url = url.substring(0,pos)+'anyo='+anyosString[anyosString.length-1]+'&lang='+$(this).data('locale');
				$('#iframeImporteArea').attr('src',url);

				url = $('#iframeImporteServicio').attr('src');
				pos = url.search('lang=');
				url = url.substring(0,pos)+'anyo='+anyosString[anyosString.length-1]+'&lang='+$(this).data('locale');
				$('#iframeImporteServicio').attr('src',url);

				url = $('#iframeGestionado').attr('src');
				pos = url.search('lang=');
				url = url.substring(0,pos)+'anyo='+anyosString[anyosString.length-1]+'&lang='+$(this).data('locale');
				$('#iframeGestionado').attr('src',url);

				url = $('#iframeConvenio').attr('src');
				pos = url.search('lang=');
				url = url.substring(0,pos)+'anyo='+anyosString[anyosString.length-1]+'&lang='+$(this).data('locale');
				$('#iframeConvenio').attr('src',url);

				url = $('#iframeClasificacionPrograma').attr('src');
				pos = url.search('lang=');
				url = url.substring(0,pos)+'anyo='+anyosString[anyosString.length-1]+'&lang='+$(this).data('locale');
				$('#iframeClasificacionPrograma').attr('src',url);


				url = $('#iframeClasificacionEconGast').attr('src');
				pos = url.search('lang=');
				url = url.substring(0,pos)+'anyo='+anyosString[anyosString.length-1]+'&lang='+$(this).data('locale');
				$('#iframeClasificacionEconGast').attr('src',url);


				taskMaster = {
					iframeIndicadores:true, 
					iframeImporteArea:true, 
					iframeBusquedaSubvenciones:false, 
					iframeBusquedaBeneficiarios:false,
					iframeImporteTipoBeneficiarios:true,
					iframeClasificacionPrograma:true,
					iframeClasificacionEconomicaGasto:true
				};
				
				checkTaskMaster();
				cambioCapaInicio();
			}  
		}); 
	});
	
	// Enable debug
	$.i18n.debug = logDebugComun;
}

/*
	Función que iniciliza los datos que dependen de la API
*/
function inicializaDatosInicio()
{
	if(logDebugComun){
		console.log("inicializaDatosInicio");
	}
	if(seguridad)
	{
		generarToken();
	}

	$.ajaxSetup({
		beforeSend: function (xhr)
		{
			var authorization = sessionStorage.getItem("authorization");
			xhr.setRequestHeader("Accept","application/json");
			xhr.setRequestHeader("Authorization",authorization);        
		}
	});

		
	var theURL = dameURL(queryIniAnyosConcesiones);
	$.ajax({
		type: 'GET',
		url: theURL,
		dataType: "json",
		crossDomain: true,
		contentType: "application/json; charset=utf-8",
		timeout: valTimeout ,
		
		success: function (data) 
		{
			console.log("Llamada queryIniAnyosConcesiones");
			if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
			{
				for (var i = 0; i < data.records.length; i++) 
				{
					anyosString.push(data.records[i].anyo);
					anyosNumber.push(Number(data.records[i].anyo));
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
		
		},
		
		complete: function (data) 
		{
			if(mySlider==undefined)
			{
				anyosNumber.sort(function(a, b){return a-b;});
				anyosString.sort();
			
				var valorDefecto=anyosString[anyosString.length-1];
				mySlider = $("#filtroAnyoInicio").bootstrapSlider({
					ticks: anyosNumber,
					ticks_labels: anyosString,
					value: valorDefecto
				});
				
				mySlider.on('change',function( sliderValue ) 
				{
					filtraGraficosInicio(sliderValue.value.newValue);
				});
				
				filtraGraficosInicio(valorDefecto);
				}
			
		}
	});
		

}

function obtieneOrganizacionesGeneral(url)
{
	if(logDebugComun)
	{
		console.log("obtieneOrganizacionesGeneral url:"+url);
	}

	$.getJSON(dameURL(url)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
			{
				for (var i = 0; i < data.records.length; i++) 
				{
					organizacionesIni[data.records[i].id] = data.records[i].title;
				}
			}else
			{
				console.log( msgErrorAPIResVacio );
			}

			if ((data!=null)&&(data.next!=null))
			{
				obtieneOrganizacionesGeneral(data.next);
			}
	}).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});
	
}

function obtieneTitleOrganizaciones(url)
{
	if(logDebugComun)
	{
		console.log("obtieneOrganizacionesGeneral url:"+url);
	}

	$.getJSON(dameURL(url)).done(function( data ) 
	{
		if ((data!=null)&&(data.title!=null)&&(data.records.length>0))
		{
			
			return data.records[0].title;

		}else
		{
			console.log( msgErrorAPIResVacio );
		}
	}).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});
}

/*
	Se inicializa la librería para tratar los formatos de los números
*/ 
function numeralInit()
{
	if(logDebugComun)
	{
		console.log("numeralInit");
	}
	
	numeral.register('locale', 'es',{
		delimiters: 
		{
			thousands: '.',
			decimal: ','
		},
		abbreviations: 
		{
			thousand: 'k',
			million: 'm',
			billion: 'b',
			trillion: 't'
		},
		ordinal : function (number) 
		{
			return number === 1 ? 'er' : 'o';
		},
		currency: 
		{
			symbol: '€'
		}
	});
	numeral.locale('es');
}

/* 
	Función que permite cambiar a la capa de inicio 
*/
function cambioCapaInicio()
{
	if(logDebugComun)
	{
		console.log("cambioCapaInicio");
	}
	
	$('#liInicio').css("background-color", "#666");
	$('#buttonInicio').css("color", "#fff");
	$('#liSubvenciones').css("background-color", "#fff");
	$('#buttonSubvenciones').css("color", "#666");
	$('#liBeneficiarios').css("background-color", "#fff");
	$('#buttonBeneficiarios').css("color", "#666");
	$('#liGlosario').css("background-color", "#fff");
	$('#buttonGlosario').css("color", "#666");
	
	$('#capaInicio').show();
	$('#capaSubvenciones').hide();
	$('#capaBeneficiarios').hide();
	$('#capaAyuda').hide();
	$('#capaFicha').hide();
}

/* 
	Función que permite cambiar a la capa de subvenciones 
*/
function cambioCapaSubvenciones()
{
	if(logDebugComun)
	{
		console.log("cambioCapaSubvenciones");
	}
	
	$('#liInicio').css("background-color", "#fff");
	$('#buttonInicio').css("color", "#666");
	$('#liSubvenciones').css("background-color", "#666");
	$('#buttonSubvenciones').css("color", "#fff");
	$('#liBeneficiarios').css("background-color", "#fff");
	$('#buttonBeneficiarios').css("color", "#666");
	$('#liGlosario').css("background-color", "#fff");
	$('#buttonGlosario').css("color", "#666");
	
	$('#capaInicio').hide();
	$('#capaSubvenciones').show();
	$('#capaBeneficiarios').hide();
	$('#capaAyuda').hide();
	$('#capaFicha').hide();
	$('#iframeBusquedaSubvenciones').height($( document ).height());
}

/* 
	Función que permite cambiar a la capa de subvenciones filtrando por area y año
*/
function cambioCapaSubvencionesAreaNombre(areaNombre,anyo)
{
	if(logDebugComun)
	{
		console.log("cambioCapaSubvencionesAreaNombre");
	}
	cambioCapaSubvenciones();
	// var url = $('#iframeBusquedaSubvenciones').attr('src');
	// var pos = url.search('areaNombre=');
	// if(pos!=-1)
	// {
	// 	url = url.substring(0,pos);
	// }
	var url = "busqueda_convocatorias.html?lang="+$.i18n().locale;
	url = url+'&areaNombre='+areaNombre;
	url = url+'&anyo='+anyo;
	$('#iframeBusquedaSubvenciones').attr('src',url);
}

/* 
	Función que permite cambiar a la capa de subvenciones filtrando por area y año
*/
function cambioCapaSubvencionesConvenio(convenio,anyo)
{
	if(logDebugComun)
	{
		console.log("cambioCapaSubvencionesConvenio");
	}
	cambioCapaSubvenciones();
	// var url = $('#iframeBusquedaSubvenciones').attr('src');
	// var pos = url.search('convenio=');
	// if(pos!=-1)
	// {
	// 	url = url.substring(0,pos);
	// }
	var url = "busqueda_convocatorias.html?lang="+$.i18n().locale;
	url = url+'&convenio='+convenio;
	url = url+'&anyo='+anyo;
	$('#iframeBusquedaSubvenciones').attr('src',url);
}
/* 
	Función que permite cambiar a la capa de subvenciones filtrando por area y año
*/
function cambioCapaSubvencionesServicio(areaNombre,anyo)
{
	if(logDebugComun)
	{
		console.log("cambioCapaSubvencionesServicio");
	}
	cambioCapaSubvenciones();
	// var url = $('#iframeBusquedaSubvenciones').attr('src');
	// var pos = url.search('servicio=');
	// if(pos!=-1)
	// {
	// 	url = url.substring(0,pos);
	// }
	var url = "busqueda_convocatorias.html?lang="+$.i18n().locale;
	url = url+'&servicio='+areaNombre;
	url = url+'&anyo='+anyo;
	$('#iframeBusquedaSubvenciones').attr('src',url);
}

/* 
	Función que permite cambiar a la capa de subvenciones filtrando por area y año
*/
function cambioCapaSubvencionesInstrumentaTitle(instrumentaTitle,anyo)
{
	if(logDebugComun)
	{
		console.log("cambioCapaSubvencionesInstrumentaTitle");
	}
	cambioCapaSubvenciones();
	// var url = $('#iframeBusquedaSubvenciones').attr('src');
	// var pos = url.search('convenio=');
	// if(pos!=-1)
	// {
	// 	url = url.substring(0,pos);
	// }
	var url = "busqueda_convocatorias.html?lang="+$.i18n().locale;
	url = url+'&convenio='+instrumentaTitle;
	url = url+'&anyo='+anyo;
	$('#iframeBusquedaSubvenciones').attr('src',url);
}

/* 
	Función que permite cambiar a la capa de beneficiarios 
*/
function cambioCapaBeneficiarios()
{
	if(logDebugComun)
	{
		console.log("cambioCapaBeneficiarios");
	}
	
	$('#liInicio').css("background-color", "#fff");
	$('#buttonInicio').css("color", "#666");
	$('#liSubvenciones').css("background-color", "#fff");
	$('#buttonSubvenciones').css("color", "#666");
	$('#liBeneficiarios').css("background-color", "#666");
	$('#buttonBeneficiarios').css("color", "#fff");
	$('#liGlosario').css("background-color", "#fff");
	$('#buttonGlosario').css("color", "#666");
	
	$('#capaInicio').hide();
	$('#capaSubvenciones').hide();
	$('#capaBeneficiarios').show();
	$('#capaAyuda').hide();
	$('#capaFicha').hide();
	$('#iframeBusquedaBeneficiarios').height($( document ).height());
}

/* 
	Función que permite cambiar a la capa de beneficiarios filtrando por tipo
*/
function cambioCapaBeneficiariosTipo(tipo,anyo)
{
	if(logDebugComun)
	{
		console.log("cambioCapaBeneficiariosTipo");
	}

	cambioCapaBeneficiarios();
	// var url = $('#iframeBusquedaBeneficiarios').attr('src');
	// var pos = url.search('tipo=');
	// if(pos!=-1)
	// {
	// 	url = url.substring(0,pos);
	// }
	var url = "busqueda_concesiones.html?lang="+$.i18n().locale;
	url = url+'&tipo='+tipo;
	url = url+'&anyo='+anyo;
	$('#iframeBusquedaBeneficiarios').attr('src',url);
}

/* 
	Función que permite cambiar a la capa de beneficiarios filtrando por tipo
*/
function cambioCapaSubvencionesClasiProg(clasificacionPrograma,anyo)
{
	if(logDebugComun)
	{
		console.log("cambioCapaSubvencionesClasiProg");
	}

	cambioCapaSubvenciones();
	// var url = $('#iframeBusquedaSubvenciones').attr('src');
	// var pos = url.search('clasificacionPrograma=');
	// if(pos!=-1)
	// {
	// 	url = url.substring(0,pos);
	// }
	var url = "busqueda_convocatorias.html?lang="+$.i18n().locale;
	url = url+'&clasificacionPrograma='+identificadorClasificacionPro.get(clasificacionPrograma)+"*";
	url = url+'&anyo='+anyo;
	$('#iframeBusquedaSubvenciones').attr('src',url);
}

/* 
	Función que permite cambiar a la capa de beneficiarios filtrando por tipo
*/
function cambioCapaSubvencionesClasiEconGast(clasificacionEconGast,anyo)
{
	if(logDebugComun)
	{
		console.log("cambioCapaSubvencionesClasiEconGast");
	}

	cambioCapaSubvenciones();
	// var url = $('#iframeBusquedaSubvenciones').attr('src');
	// var pos = url.search('clasificacionEconomicaGasto=');
	// if(pos!=-1)
	// {
	// 	url = url.substring(0,pos);
	// }
	var url = "busqueda_convocatorias.html?lang="+$.i18n().locale;
	url = url+'&clasificacionEconomicaGasto='+identificadorClasificacionEco.get(clasificacionEconGast)+"*";
	url = url+'&anyo='+anyo;
	$('#iframeBusquedaSubvenciones').attr('src',url);
}
/* 
	Función que permite cambiar a la capa de ayuda 
*/
function cambioCapaAyuda()
{
	if(logDebugComun)
	{
		console.log("cambioCapaAyuda");
	}
	
	$('#liInicio').css("background-color", "#fff");
	$('#buttonInicio').css("color", "#666");
	$('#liSubvenciones').css("background-color", "#fff");
	$('#buttonSubvenciones').css("color", "#666");
	$('#liBeneficiarios').css("background-color", "#fff");
	$('#buttonBeneficiarios').css("color", "#666");
	$('#liGlosario').css("background-color", "#666");
	$('#buttonGlosario').css("color", "#fff");
	
	$('#capaInicio').hide();
	$('#capaSubvenciones').hide();
	$('#capaBeneficiarios').hide();
	$('#capaAyuda').show();
	$('#capaFicha').hide();
}

/* 
	Función que permite cambiar a la capa de ayuda 
*/
function cambioCapaAyudaQueEsSubvencion()
{
	if(logDebugComun)
	{
		console.log("cambioCapaAyudaQueEsSubvencion");
	}
	
	$('#liInicio').css("background-color", "#fff");
	$('#buttonInicio').css("color", "#666");
	$('#liSubvenciones').css("background-color", "#fff");
	$('#buttonSubvenciones').css("color", "#666");
	$('#liBeneficiarios').css("background-color", "#fff");
	$('#buttonBeneficiarios').css("color", "#666");
	$('#liGlosario').css("background-color", "#666");
	$('#buttonGlosario').css("color", "#fff");
	
	$('#capaInicio').hide();
	$('#capaSubvenciones').hide();
	$('#capaBeneficiarios').hide();
	$('#capaAyuda').show();
	$('#capaFicha').hide();
	
	var new_position = $('#bloque_ayuda_que_es_subvencion').offset();
	window.scrollTo(new_position.left,new_position.top);
}

/* 
	Función que permite cambiar a la capa de ayuda 
*/
function cambioCapaAyudaEncontrarPortal()
{
	if(logDebugComun)
	{
		console.log("cambioCapaAyudaEncontrarPortal");
	}
	
	$('#liInicio').css("background-color", "#fff");
	$('#buttonInicio').css("color", "#666");
	$('#liSubvenciones').css("background-color", "#fff");
	$('#buttonSubvenciones').css("color", "#666");
	$('#liBeneficiarios').css("background-color", "#fff");
	$('#buttonBeneficiarios').css("color", "#666");
	$('#liGlosario').css("background-color", "#666");
	$('#buttonGlosario').css("color", "#fff");
	
	$('#capaInicio').hide();
	$('#capaSubvenciones').hide();
	$('#capaBeneficiarios').hide();
	$('#capaAyuda').show();
	$('#capaFicha').hide();
	
	var new_position = $('#bloque_ayuda_encontrar_portal').offset();
	window.scrollTo(new_position.left,new_position.top);
	
}

/*
	Función que filtra los iframes por el año seleccionado
*/
function filtraGraficosInicio(filtroAnyo) 
{
	if(logDebugComun)
	{
		console.log("filtraGraficosInicio "+filtroAnyo);
	}
	
	var url = "indicadores.html";
	url = url +'?anyo='+filtroAnyo+'&lang='+$.i18n().locale;
	$('#iframeIndicadores').attr('src',url); 
	
	url = "importe_tipo_beneficiarios.html";
	url = url +'?anyo='+filtroAnyo+'&lang='+$.i18n().locale;
	$('#iframeImporteTipoBeneficiarios').attr('src',url); 
	
	url = "importe_area.html";
	url = url +'?anyo='+filtroAnyo+'&lang='+$.i18n().locale;
	$('#iframeImporteArea').attr('src',url); 

	url = "importe_servicio.html";
	url = url +'?anyo='+filtroAnyo+'&lang='+$.i18n().locale;
	$('#iframeImporteServicio').attr('src',url); 
	
	url = "importe_clasificacion_programa.html";
	url = url +'?anyo='+filtroAnyo+'&lang='+$.i18n().locale;
	$('#iframeClasificacionPrograma').attr('src',url); 

	url = "importe_clasificacion_economica_gasto.html";
	url = url +'?anyo='+filtroAnyo+'&lang='+$.i18n().locale;
	$('#iframeClasificacionEconGast').attr('src',url); 

	url = "convenio.html";
	url = url +'?anyo='+filtroAnyo+'&lang='+$.i18n().locale;
	$('#iframeConvenio').attr('src',url);

	url = "gestionado.html";
	url = url +'?anyo='+filtroAnyo+'&lang='+$.i18n().locale;
	$('#iframeGestionado').attr('src',url);

}

/*
	Función encodea la URL y usa la seguridad de la API en caso de ser necesario
*/
function dameURL(URL)
{
	if(logDebugComun)
	{
		console.log("dameURL: "+URL);
	}
	
	var resultado;
	resultado = encodeURI(URL);
	if(seguridad)
	{
		var fechaActual = new Date();
		var fechaExpiracion = sessionStorage.getItem("fechaExpiracion");
		if(fechaExpiracion == undefined || fechaExpiracion =='Invalid Date'){
			fechaExpiracion = new Date();
		}

		if(fechaActual>=fechaExpiracion)
		{
			generarToken();			
		}
		
		$.ajaxSetup({
			beforeSend: function (xhr)
			{
				var authorization = sessionStorage.getItem("authorization");
				xhr.setRequestHeader("Accept","application/json");
			   	xhr.setRequestHeader("Authorization",authorization);        
			}
		});

	}

	return resultado;
}

/*
	Función que genera el token para realizar la autenticación con la API
*/
function generarToken()
{	
	if(logDebugComun)
	{
		console.log("generarToken");
	}
	var urlT=tokenUrl+"?username="+user+"&password="+pass+"&grant_type=password";
	var basicA="Basic "+btoa(appname+":"+appsecret);	
		
	$.ajax({
		type: 'POST',
	    url: urlT,
        contentType: "application/json; charset=utf-8",
		async:false,
		timeout: valTimeout ,

        headers: {
	        'Accept': 'application/json',
            'Authorization': basicA
	    },  
        
	    success: function (data) {	        
	 
			var fechaExpiracion = new Date().getTime();
			var timeSeconds = (Number(data.expires_in)-1); 
			fechaExpiracion = new Date(fechaExpiracion + (timeSeconds * 1000));
			sessionStorage.setItem("fechaExpiracion", fechaExpiracion);
			
			var authorization='Bearer '+data.access_token;
			sessionStorage.setItem("authorization", authorization);
	        
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
     Función que devuelve el tipo de beneficiario pasando como parámetro el DNI / CIF
*/
function dameTipoEntidad(dniNif)
{
	if(logDebugComun)
	{
		console.log("dameTipoEntidad");
	}

	if(dniNif==undefined)
	{
		return '';
	}
	
	var result="";
	var firstchar = dniNif[0];
	var secondchar = dniNif[1];
	if(secondchar==undefined)
	{
		secondchar='0';
	}
	if(isNaN(firstchar) && !isNaN(secondchar))
	{
		result = etiquetasTipoEntidad.get(firstchar);
	}
	
	else{
		result=etiquetaTipEntPersona;
	}
	if(result==undefined)
	{
		result=etiquetaTipEntPersona;
	}
	return result;
	
	
}

/*
	Función que crea un campo de selección para los formularios que tienen tipo de beneficiario
*/
function creaSelectTipoEntidad()
{
	if(logDebugComun)
	{
		console.log("creaSelectTipoEntidad");
	}
	
	$('#selectTipoBeneficiario').empty().append("<option value=''></option>").attr("selected","selected");
	$('#selectTipoBeneficiario').append("<option value='A'>Sociedades anónimas</option>");
	$('#selectTipoBeneficiario').append("<option value='B'>Sociedades de responsabilidad limitada</option>");
	$('#selectTipoBeneficiario').append("<option value='C'>Sociedades colectivas</option>");
	$('#selectTipoBeneficiario').append("<option value='D'>Sociedades comanditarias</option>");
	$('#selectTipoBeneficiario').append("<option value='E'>Comunidades de bienes, herencias yacentes y demás entidades carentes de personalidad jurídica no incluidas expresamente en otras claves</option>");
	$('#selectTipoBeneficiario').append("<option value='F'>Sociedades cooperativas</option>");
	$('#selectTipoBeneficiario').append("<option value='G'>Asociaciones</option>");
	$('#selectTipoBeneficiario').append("<option value='H'>Comunidades de propietarios en régimen de propiedad horizontal</option>");
	$('#selectTipoBeneficiario').append("<option value='J'>Sociedades civiles</option>");
	$('#selectTipoBeneficiario').append("<option value='P'>Corporaciones Locales</option>");
	$('#selectTipoBeneficiario').append("<option value='Q'>Organismos públicos</option>");
	$('#selectTipoBeneficiario').append("<option value='R'>Congregaciones e instituciones religiosas</option>");
	$('#selectTipoBeneficiario').append("<option value='S'>Órganos de la Administración del Estado y de las Comunidades Autónomas</option>");
	$('#selectTipoBeneficiario').append("<option value='U'>Uniones Temporales de Empresas</option>");
	$('#selectTipoBeneficiario').append("<option value='V'>Otros tipos no definidos en el resto de claves</option>");
	$('#selectTipoBeneficiario').append("<option value='N'>Entidades extranjeras</option>");
	$('#selectTipoBeneficiario').append("<option value='W'>Establecimientos permanentes de entidades no residentes en territorio español</option>");
}

/*
	Funcion para obtener parametros de la URL
*/
function getUrlVars() 
{
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

/*
	Funcion que chequea si un array de booleans esta entero a true
*/
function checkBooleanArray(vector)
{
	for (var i=0;i<vector.length;i++)
	{
		var temp=vector[i];
		if (temp==false)
		{
			return temp;
		}
	}
	return true;
}

/*
	Funcion que chequea el objecto taskMaster
*/	
function checkTaskMaster()
{	
	if (taskMaster==null)
	{
		return false;
	}
	
	if (taskMaster.iframeIndicadores==false)
	{
		return false;
	}

	if (taskMaster.iframeImporteArea==false)
	{
		return false;
	}

	if (taskMaster.iframeImporteServicio==false)
	{
		return false;
	}
	
	if (taskMaster.iframeBusquedaSubvenciones==false)
	{
		return false;
	}
	
	if (taskMaster.iframeBusquedaBeneficiarios==false)
	{
		return false;
	}
	
	if (taskMaster.iframeImporteTipoBeneficiarios==false)
	{
		return false;
	}

	if (taskMaster.iframeClasificacionPrograma==false)
	{
		return false;
	}

	if (taskMaster.iframeClasificacionEconomicaGasto==false)
	{
		return false;
	}
	
	setTimeout(function(){ cargaTerminada(); }, 500);				
}
	
/*
	Funcion que se invoca cuando se han terminado todas las llamadas ajax desde la funcion checkTaskMaster
*/	
function cargaTerminada()
{		
	$("#iframeIndicadoresGlobales").height(heightIndicadoresGlobal);
	$("#iframeIndicadores").height(heighIndicadores);
	$("#iframeImporteArea").height(heightImporteArea);
	$("#iframeImporteServicio").height(heightImporteServicio);
	$("#iframeImporteTipoBeneficiarios").height(heightTipoBeneficiario);
	$("#iframeClasificacionPrograma").height(heightClasificacionPrograma);
	$("#iframeClasificacionEconGast").height(heightClasificacionEconGast);
	$("#iframeConvenio").height(heightConvenios);
	$("#iframeGestionado").height(heightGestionado);
	
	$('.modal').modal('hide');
}	
	
/*
	Funcion que modifica un attributo del objeto taskmaster del padre (si existe)
*/	
function modificaTaskMaster(attr)
{
	try
	{
		if ((parent!=null)&&(parent.taskMaster!=null))
		{
			eval("parent.taskMaster."+attr+"=true");
			parent.checkTaskMaster();
		}
	}
	catch(errorTM)
	{
	}
}

/*
	Función que devuelve true si se ejecuta dentro de un iframe
*/
function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

/*
	Función que calcula el porcentaje de un numero
*/
function porcentaje(numero, porciento)
{
	var p=Math.floor(numero*porciento)/100;
	p=Math.round(p);
	return p;
}

/*
	Función que situa el scroll de la pantalla arriba del todo
*/
function scrollTop()
{
	window.scrollTo(0, 0); 
}

