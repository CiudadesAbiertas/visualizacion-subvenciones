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


var peticionesInicialesBen = [false,false,false];
var urlBusqueda = "";
var organizaciones=new Array();
var organizacionesTitle=new Array();
var heightInicial;
var heightConTabla;

/*
	Función de inicialización del script
*/
function inicializaBusquedaBeneficiarios()
{
	if(logDebugBusquedaBeneficiarios)
	{
		console.log("inicializaBusquedaBeneficiarios");
	}
	
	inicializaMultidiomaBusquedaBeneficiarios();
}

/*
	Función que invoca a todas las funciones que se realizan al inicializar el script
*/
function inicializaTablaBusquedaBeneficiarios()
{
	if(logDebugBusquedaBeneficiarios)
	{
		console.log("inicializaTablaBusquedaBeneficiarios");
	}
	obtieneOrganizaciones(queryIniOrganization);
	camposFecha();
	creaSelectTipoEntidad();			
	preparaTablaBeneficiarios(false);
	$("#lineaGraficosBusquedaBen").hide();
	$(".table-responsive").hide();
	$("#botoneraDescarga").hide();
	$("#tablaBeneficiariosCompleta").hide();
	$( "#buscarListado" ).click(function() 
	{
		buscar();
		this.blur();
	});
	
	$( "#descargaCSV" ).click(function() 
	{
		$('.modal').modal('show');
		if(!urlBusqueda.includes("pageSize=500"))
		{
			if(urlBusqueda.includes("?")){
				urlBusqueda = urlBusqueda+"&pageSize=500";
			}else{
				urlBusqueda = urlBusqueda+"?pageSize=500";
			}
		}
		descargaTabla(urlBusqueda,'.buttons-csv');
	});
	$( "#descargaJSON" ).click(function() 
	{
		$('.modal').modal('show');
		if(!urlBusqueda.includes("pageSize=500"))
		{
			if(urlBusqueda.includes("?")){
				urlBusqueda = urlBusqueda+"&pageSize=500";
			}else{
				urlBusqueda = urlBusqueda+"?pageSize=500";
			}
		}
		descargaTabla(urlBusqueda,'.buttons-json');
	});
	$( "#descargaExcel" ).click(function() 
	{
		$('.modal').modal('show');
		if(!urlBusqueda.includes("pageSize=500"))
		{
			if(urlBusqueda.includes("?")){
				urlBusqueda = urlBusqueda+"&pageSize=500";
			}else{
				urlBusqueda = urlBusqueda+"?pageSize=500";
			}
		}
		descargaTabla(urlBusqueda,'.buttons-excel');
	});
	$( "#descargaPDF" ).click(function() 
	{
		$('.modal').modal('show');
		if(!urlBusqueda.includes("pageSize=500"))
		{
			if(urlBusqueda.includes("?")){
				urlBusqueda = urlBusqueda+"&pageSize=500";
			}else{
				urlBusqueda = urlBusqueda+"?pageSize=500";
			}
		}
		descargaTabla(urlBusqueda,'.buttons-pdf');
	});
	$( "#descargaCopiar" ).click(function() 
	{
		$('.modal').modal('show');
		if(!urlBusqueda.includes("pageSize=500"))
		{
			if(urlBusqueda.includes("?")){
				urlBusqueda = urlBusqueda+"&pageSize=500";
			}else{
				urlBusqueda = urlBusqueda+"?pageSize=500";
			}
		}
		descargaTabla(urlBusqueda,'.buttons-copy');
	});
	
}

/* 
	Función para inicializar el multidioma
*/
function inicializaMultidiomaBusquedaBeneficiarios()
{
	if(logDebugBusquedaBeneficiarios)
	{
		console.log("inicializaMultidiomaBusquedaBeneficiarios");
	}
	
	var langUrl = getUrlVars()["lang"];
	if(langUrl==undefined)
	{
		langUrl='es';
	}
	$.i18n().locale = langUrl;
	document.documentElement.lang=$.i18n().locale;
	$('html').i18n();
	
	jQuery(function($) 
	{
		$.i18n().load( 
		{
			en: './dist/i18n/en.json',
			es: './dist/i18n/es.json',
			gl: './dist/i18n/gl.json'
		} ).done(function() 
		{
			$('html').i18n();
			inicializaTablaBusquedaBeneficiarios();
		});
	});
	$.i18n.debug = logDebugBusquedaBeneficiarios;
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
					organizacionesTitle.push(data.records[i].title);
				}
				if(data.next!=undefined)
				{
					obtieneOrganizaciones(data.next);
				}
				else {
					inicializaDatos();
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
function inicializaDatos()
{
	if(logDebugBusquedaBeneficiarios){
		console.log("inicializaDatos");
	}

	var anyos=new Array();
	
	$.getJSON(dameURL(queryIniAnyosConcesiones)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			for (var i = 0; i < data.records.length; i++) 
			{
				anyos.push(data.records[i].anyo);
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
		anyos.sort(function(a, b){return a-b;});

		$('#selectAnyoAdj').empty().append("<option value=''></option>").attr("selected","selected");				
		$('#selectAnyoSol').empty().append("<option value=''></option>").attr("selected","selected");				
		for (var i=0;i<anyos.length;i++)
		{
			$('#selectAnyoAdj').append("<option value='"+anyos[i]+"'>"+anyos[i]+"</option>");				
			$('#selectAnyoSol').append("<option value='"+anyos[i]+"'>"+anyos[i]+"</option>");				
		}
		
		var valorDefecto=anyos[anyos.length-1];
		if(getUrlVars()["anyo"]!=undefined){
			valorDefecto=decodeURI(getUrlVars()["anyo"]);
		}
		var mySlider = $("#filtroAnyoBen").bootstrapSlider({
			ticks: anyos,
			ticks_labels: anyos,
			value: valorDefecto
		});
		
		mySlider.on('change',function( sliderValue ) 
		{
			filtraGraficos(sliderValue.value.newValue);
		});
		
		peticionesInicialesBen[0]=true;
		if(logDebugBusquedaBeneficiarios)
		{
			console.log("fin peticion 0");
		}
		if (checkBooleanArray(peticionesInicialesBen))
		{	
			modificaTaskMaster("iframeBusquedaBeneficiarios");
		}
		
		filtraGraficos(anyos[anyos.length-1]);
		
		capturaParam();
	});

}

/*
	Función que comprueba y captura si se han pasado parámetros a la web, en caso de haberlos ejecutará una búsqueda con ellos.
*/
function capturaParam()
{
	var ejecutarBusqueda=false;
	
	var paramAdjudicatarioTitle = getUrlVars()["nombre"];
	if(paramAdjudicatarioTitle!=undefined)
	{
		$("#buscadorNombre").val(decodeURI(paramAdjudicatarioTitle));
		ejecutarBusqueda=true;
	}
	var paramAdjudicatarioId = getUrlVars()["dnicif"];
	if(paramAdjudicatarioId!=undefined)
	{
		$("#buscadorDNI").val(decodeURI(paramAdjudicatarioId));
		ejecutarBusqueda=true;
	}
	var paramTipoBeneficiario = getUrlVars()["tipo"];
	if(paramTipoBeneficiario!=undefined)
	{
		$("#selectTipoBeneficiario").val(identificadorTipoEntidad.get(decodeURI(paramTipoBeneficiario)));
		ejecutarBusqueda=true;
	}
	var paramAnyo = getUrlVars()["anyo"];
	if(paramAnyo!=undefined)
	{
		$("#selectAnyoAdj").val(decodeURI(paramAnyo));
		ejecutarBusqueda=true;
	}
	var paramFechaAdjudicacionDesde = getUrlVars()["fechaDesde"];
	if(paramFechaAdjudicacionDesde!=undefined)
	{
		$("#desde").val(decodeURI(paramFechaAdjudicacionDesde));
		ejecutarBusqueda=true;
	}
	var paramFechaAdjudicacionHasta = getUrlVars()["fechaHasta"];
	if(paramFechaAdjudicacionHasta!=undefined)
	{
		$("#hasta").val(decodeURI(paramFechaAdjudicacionHasta));
		ejecutarBusqueda=true;
	}
	var paramImporteDesde = getUrlVars()["importeDesde"];
	if(paramImporteDesde!=undefined)
	{
		$("#importeDesde").val(decodeURI(paramImporteDesde));
		ejecutarBusqueda=true;
	}
	var paramImporteHasta = getUrlVars()["importeHasta"];
	if(paramImporteHasta!=undefined)
	{
		$("#importeHasta").val(decodeURI(paramImporteHasta));
		ejecutarBusqueda=true;
	}
	var paramPageSize = getUrlVars()["pageSize"];
	if(paramPageSize!=undefined)
	{
		$("#selectPageSize").val(decodeURI(paramPageSize));
	}
	if(ejecutarBusqueda){
		buscar();
	}
}

/*
	Funcion que filtra los gráficos superiores por el año seleccionado
*/
function filtraGraficos(filtroAnyo)
{
	if(logDebugBusquedaBeneficiarios){
		console.log("inicializaDatos");
	}
	
	var textoIzq = $.i18n( 'top_10_concesiones_por_importe' );
	var textoDer = $.i18n( 'top_10_concesiones_por_numero' );
	$('#cabeceraArribaIzquierda').html(textoIzq+' '+filtroAnyo);
	$('#cabeceraArribaDerecha').html(textoDer+' '+filtroAnyo);
	
	var urlFiltroAnyo="";
	if(filtroAnyo!=undefined && filtroAnyo!='Todos')
	{
		urlFiltroAnyo="&"+paramWhereAPI+"=fechaConcesion>='"+filtroAnyo+"-01-01T00:00:00' and fechaConcesion<='"+filtroAnyo+"-12-31T23:59:59'";
	}
	var sumImporteBeneficiarios=new Array();
	$.getJSON(dameURL(queryIniGraficoSumImporteBeneficiarios+urlFiltroAnyo))
	.done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			var beneficiarioCadena=$.i18n( 'beneficiario' );
			var importeCadena=$.i18n( 'importe' );
			var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+beneficiarioCadena+"</th><th>"+importeCadena+"</th></tr>";
			for (var i = 0; i < data.records.length; i++) 
			{
				if(i<resgistroGráficos)
				{
					var sumImporteBeneficiario=new Object();
					sumImporteBeneficiario.sumConvocatorias=data.records[i].suma;
					sumImporteBeneficiario.adjudicatarioId=data.records[i].beneficiario;
					sumImporteBeneficiario.adjudicatarioTitle=organizaciones[data.records[i].beneficiario].substring(0, limiteCadenasTexto);
					sumImporteBeneficiario.adjudicatarioTitleCompleto=organizaciones[data.records[i].beneficiario];
					sumImporteBeneficiarios.push(sumImporteBeneficiario);
				}	
					var importe=numeral(data.records[i].suma);
					htmlContent = htmlContent + "<tr>" + "<td>" + organizaciones[data.records[i].beneficiario].toString() + "</td>" + "<td>" + importe.format(numFormato) + "</td>" + "</tr>";
				
			}
			var mensaje_mostar_ocultar_datos =  $.i18n( 'mostar_ocultar_datos' );
			htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos('datos_benSupIzq')\">"+mensaje_mostar_ocultar_datos+"</button></div></div>";
			
			$('#datos_benSupIzq').html(htmlContent);
		}else
		{
			console.log( msgErrorAPIResVacio );
		}
	}
	).fail(function( jqxhr, textStatus, error ) 
	{	
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() {
		pintaGraficoSuperiorIzquierda(sumImporteBeneficiarios);

		peticionesInicialesBen[1]=true;
		if(logDebugBusquedaBeneficiarios)
		{
			console.log("fin peticion 1");
		}
		if (checkBooleanArray(peticionesInicialesBen))
		{			
			modificaTaskMaster("iframeBusquedaBeneficiarios");
		}
	}
	);
	
	var numSubvencionesBeneficiarios=new Array();
	$.getJSON(dameURL(queryIniGraficoNumSubvencionesBeneficiarios+urlFiltroAnyo))
	.done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			var beneficiarioCadena=$.i18n( 'beneficiario' );
			var importeCadena=$.i18n( 'importe' );
			var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+beneficiarioCadena+"</th><th>"+importeCadena+"</th></tr>";
			for (var i = 0; i < data.records.length; i++) 
			{
				if(i<resgistroGráficos)
				{
					var numSubvencionesBeneficiario=new Object();
					numSubvencionesBeneficiario.numSubvenciones=data.records[i].numero;
					numSubvencionesBeneficiario.adjudicatarioId=data.records[i].beneficiario;
					numSubvencionesBeneficiario.adjudicatarioTitle=organizaciones[data.records[i].beneficiario].substring(0, limiteCadenasTexto);
					numSubvencionesBeneficiario.adjudicatarioTitleCompleto=organizaciones[data.records[i].beneficiario];
					numSubvencionesBeneficiarios.push(numSubvencionesBeneficiario);
				}

				var importe=numeral(data.records[i].numero);
				htmlContent = htmlContent + "<tr>" + "<td>" + organizaciones[data.records[i].beneficiario].toString() + "</td>" + "<td>" + importe.format(numFormato) + "</td>" + "</tr>";
				
			}
			
			var mensaje_mostar_ocultar_datos =  $.i18n( 'mostar_ocultar_datos' );
			htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos('datos_benSupDer')\">"+mensaje_mostar_ocultar_datos+"</button></div></div>";
			$('#datos_benSupDer').html(htmlContent);
		}
		else
		{
			console.log( msgErrorAPIResVacio );
		}
	}
	).fail(function( jqxhr, textStatus, error ) {
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() 
	{
		pintaGraficoSuperiorDerecha(numSubvencionesBeneficiarios);

		peticionesInicialesBen[2]=true;
		if(logDebugBusquedaBeneficiarios)
		{
			console.log("fin peticion 2");
		}
		if (checkBooleanArray(peticionesInicialesBen))
		{			
			modificaTaskMaster("iframeBusquedaBeneficiarios");
		}
	}
	);

}

/*
	Función que inicializa los botones de fecha
*/
function camposFecha()
{	
	if(logDebugBusquedaBeneficiarios)
	{
		console.log("camposFecha");
	}

	$( function() 
	{
		$( "#fechaAdjDesde, #fechaAdjHasta, #fechaSolDesde, #fechaSolHasta" ).datepicker(
		{		
			showButtonPanel:  false,
			dateFormat: "dd/mm/yy"
		}
		);
	
		$('#botonAdjDesde').click(function() 
		{
			if ($("#fechaAdjDesde").datepicker( "widget" ).is(":visible"))
			{
				$('#fechaAdjDesde').datepicker('hide');
			}
			else
			{
				$('#fechaAdjDesde').datepicker('show');
			}
		}
		);
		
		$('#botonAdjHasta').click(function() 
		{
			if ($("#fechaAdjHasta").datepicker( "widget" ).is(":visible"))	
			{
				$('#fechaAdjHasta').datepicker('hide');
			}
			else
			{
				$('#fechaAdjHasta').datepicker('show');
			}
		}
		);

		$('#botonSolDesde').click(function() 
		{
			if ($("#fechaSolDesde").datepicker( "widget" ).is(":visible"))
			{
				$('#fechaSolDesde').datepicker('hide');
			}
			else
			{
				$('#fechaSolDesde').datepicker('show');
			}
		}
		);
		
		$('#botonSolHasta').click(function() 
		{
			if ($("#fechaSolHasta").datepicker( "widget" ).is(":visible"))	
			{
				$('#fechaSolHasta').datepicker('hide');
			}
			else
			{
				$('#fechaSolHasta').datepicker('show');
			}
		}
		);
	} 
	);
}

/*
	Función que inicializa la tabla de búsqueda
*/
function preparaTablaBeneficiarios(segundaPasada)
{
	if(logDebugBusquedaBeneficiarios)
	{
		console.log("preparaTablaBeneficiarios");
	}
	
	var fichaCadena=$.i18n( 'ficha' );
	var identificadorCadena=$.i18n( 'identificador' );
	var nombreBeneficiarioCadena=$.i18n( 'nombre_del_beneficiario' );
	var identificadorBeneficiarioCadena=$.i18n( 'identificador_del_beneficiario' );
	var tipoEntidadCadena=$.i18n( 'tipo' );
	var fechaAdjudicacionCadena=$.i18n( 'fecha_adjudicacion' );
	var importeCondedidoCadena=$.i18n( 'importe_concedido' );
	var copyCadena=$.i18n( 'copiar' );
	
	var urlLanguaje = "vendor/datatables/i18n/"+$.i18n().locale+".json";
	
	var tablaBeneficiarios = $('#tablaBeneficiarios').DataTable(
	{
		"processing": true,
		"serverSide": true,
		"paging": true,
		"searching": false,
		"pageLength": registrosTablabusqueda,
		"formatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
			  /\B(?=(\d{3})+(?!\d))/g, "."
			);
		},
		"language": 
		{
			"decimal": ",",
			"thousands": ".",
			"url": urlLanguaje,		
		},
		"ajax": 
		{
			"dataSrc": function ( data ) 
			{						
				var total=data.totalRecords;
				data.recordsTotal=total;
				data.recordsFiltered=total;
				
				var return_data = new Array();
				if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
				{
				  for(var i=0;i< data.records.length; i++)
				  {
					return_data.push(
					{
						'plus' : '',
						'id' : data.records[i].id,
						'beneficiario' : data.records[i].beneficiario,
						'beneficiarioTitle' : organizaciones[data.records[i].beneficiario],
						'importeConcedido' : data.records[i].importeConcedido,
						'fechaConcesion' : data.records[i].fechaConcesion
					}
					);
				  }
				}else
				{
					console.log( msgErrorAPIResVacio );
				}
				
				return return_data;
			},
			"data": function ( d ) 
			{
				var actualPage;
				var newD = new Object();
				newD.pageSize = d.length;
				if(d.length!=0)
				{
					actualPage=(d.start/d.length);
				}
				else
				{
					actualPage=1;
				}
				newD.page=(actualPage+1);
				
				if (d.order.length>0)
				{
					var numColumnaSeleccionada=d.order[0].column;
					var dirColumnaSeleccionada=d.order[0].dir;
					var dataColumnaSeleccionada=d.columns[numColumnaSeleccionada].name;
					if(dirColumnaSeleccionada=='asc')
					{
						newD.sort = dataColumnaSeleccionada;
					}else{
						newD.sort = '-'+dataColumnaSeleccionada;
					}
				}
				
				return newD;
			}
		},
		"order": [5, 'desc'],
		"columns":  
		[
			{'data' : null, 'render': function(data,type,row) {return ('<a aria-label="Abrir ficha">'+data.id+'</a>');}, className:"details-control", orderable: false , "title": identificadorCadena, 'name':'id'},
			{'data': 'beneficiarioTitle' , "title": nombreBeneficiarioCadena, 'name':'beneficiario'},
			{'data': 'beneficiario' , "title": identificadorBeneficiarioCadena, 'name':'beneficiario'},
			{'data': null, 'render': function(data,type,row) {return (dameTipoEntidad(data.beneficiario));}, "title": tipoEntidadCadena, 'name':'beneficiario' },
			// {'data': null, 'render': function(data,type,row) {return (numeral(data.importeConcedido)).format(importeFormato,Math.ceil);} , "title": importeCondedidoCadena, 'name':'importeConcedido'},
			{'data': null, 'render': function(data,type,row) {var num = $.fn.dataTable.render.number(".", ",", 2, '', '€').display(data.importeConcedido); return num;}, "title": importeCondedidoCadena, 'name':'importeConcedido'},
			{'data': null, 'render': function(data,type,row) {return (Date.parse(data.fechaConcesion)).toString('dd-MM-yyyy');} , "title": fechaAdjudicacionCadena, 'name':'fechaConcesion'}
		],
		dom: '<"row"<"col-sm-6"lfi><"col-sm-6"p>>rt<"row"<"col-sm-6"fi><"col-sm-6"p>>',
		buttons: 
		[				
			{
				extend: 'csv',
				text: 'CSV <span class="fa fa-table"></span>',
				className: 'btn btn-primary',				
				exportOptions: {
					columns: ':visible',
					search: 'applied',
					order: 'applied'
				},
				bom: true
			},
			{
				text: 'JSON <span class="fa fa-list-alt "></span>',
				className: 'btn btn-primary',
				exportOptions: {
					columns: ':visible',
					search: 'applied',
					order: 'applied'
				},
				action: function ( e, dt, button, config ) 
				{
					var data = dt.buttons.exportData();
 
					$.fn.dataTable.fileSave(
						new Blob( [ JSON.stringify( data ) ] ),
						'Beneficiarios.json'
					);
				}
			},
			{
				extend: 'excel',
				text: 'EXCEL <span class="fa fa-file-excel-o"></span>',
				className: 'btn btn-primary',				
				exportOptions: {
					columns: ':visible',
					search: 'applied',
					order: 'applied'
				},
			},
			{
				text: 'PDF <span class="fa fa-file-pdf-o"></span>',
				className: 'btn btn-primary',
				extend: 'pdfHtml5',
					filename: 'listado_concesiones',
					orientation: 'landscape', //portrait
					pageSize: 'A4',
					exportOptions: {
						columns: ':visible',
						search: 'applied',
						order: 'applied'
					},
					customize: function (doc) {
						doc.content.splice(0,1);
						var now = new Date();
						var jsDate = now.getDate()+'-'+(now.getMonth()+1)+'-'+now.getFullYear();
						doc.pageMargins = [20,60,20,30];
						doc.defaultStyle.fontSize = 7;
						doc.styles.tableHeader.fontSize = 7;
						doc['header']=(function() {
							return {
								columns: [
									{
										image: logoBase64,
										width: 96
									},
									{
										alignment: 'center',
										fontSize: '14',
										text: ['Listado de concesiones']
									}
								],
								margin: 20
							};
						});
						doc['footer']=(function(page, pages) {
							return {
								columns: [
									{
										alignment: 'left',
										text: ['Creado el: ', { text: jsDate.toString() }]
									},
									{
										alignment: 'right',
										text: ['Pag.', { text: page.toString() },	' de ',	{ text: pages.toString() }]
									}
								],
								margin: 20
							};
						});
						var objLayout = {};
						objLayout['hLineWidth'] = function(i) { return .5; };
						objLayout['vLineWidth'] = function(i) { return .5; };
						objLayout['hLineColor'] = function(i) { return '#aaa'; };
						objLayout['vLineColor'] = function(i) { return '#aaa'; };
						objLayout['paddingLeft'] = function(i) { return 4; };
						objLayout['paddingRight'] = function(i) { return 4; };
						doc.content[0].layout = objLayout;			
					}
			},       
			{
				extend: 'copy',
				text: copyCadena+' <span class="fa fa-copy  "></span>',
				className: 'btn btn-primary',
				exportOptions: {
					columns: ':visible',
					search: 'applied',
					order: 'applied'
				},
			},								
		],
		initComplete: function(settings, json) {
			heightConTabla=$( 'body' ).height();
			$('#iframeBusquedaBeneficiarios', window.parent.document).height($( 'body' ).height());
		},
		drawCallback: function(settings, json) {
			heightConTabla=$( 'body' ).height();
			$('#iframeBusquedaBeneficiarios', window.parent.document).height($( 'body' ).height());
		},
	});

	//Esta linea es para que no haya warnings en dataTables
	$.fn.dataTable.ext.errMode = 'none';
	
	if(!segundaPasada)
	{
		$('#tablaBeneficiarios tbody').on('click', 'td.details-control', function () 
		{
			var tr = $(this).closest('tr');
			var row = tablaBeneficiarios.row( tr );
			var id = row.data()['id'];

			var adjudicatarioId = row.data()['beneficiario'];
			
			var url = "ficha_beneficiarios.html?lang="+$.i18n().locale;
			url=url+"&id="+id+"&dnicif="+adjudicatarioId;

			$('#iframeFicha', window.parent.document).attr('src',url);
			$("#iframeFicha", window.parent.document).height($( document ).height());
			
			$("#capaInicio", window.parent.document).hide();
			$("#capaSubvenciones", window.parent.document).hide();
			$("#capaBeneficiarios", window.parent.document).hide();
			$("#capaAyuda", window.parent.document).hide();
			$("#capaFicha", window.parent.document).show();

			$('html,body', window.parent.document).scrollTop(0);
		
		});
	}
}

/*
	Funcion que realiza las busquedas en la tabla
*/
function buscar()
{
	if(logDebugBusquedaBeneficiarios)
	{
		console.log("buscar");
	}
	
	$("#lineaGraficosBusquedaBen").show();
	$(".table-responsive").show();
	$("#botoneraDescarga").show();
	
	if(heightInicial==undefined)
	{
		heightInicial=$("#iframeBusquedaBeneficiarios", window.parent.document).height();
	}
	
	var beneficiariosSumImporte=new Array();
	var beneficiariosNumSubvenciones=new Array();
	var textoBusqueda="";
	var textoBusquedaTabla = "";
	var textoBusquedaGrafico = "";
	var busquedaTodo = true;
	
	var adjudicatarioTitle=$("#buscadorNombre").val().trim();	
	var paramAdjudicatarioTitle="";
	var paramAdjudicatarioTitleq="";
	if($("#buscadorNombre").val().length >= caracteresMinimosBusqueda)
	{
		paramAdjudicatarioTitle=dameRSQLBusquedaNombreSQL(adjudicatarioTitle,true);
		paramAdjudicatarioTitleq=dameRSQLBusquedaNombreRSQL(adjudicatarioTitle,true);
		
	}else
	{
		paramAdjudicatarioTitle=dameRSQLBusquedaNombreSQL(adjudicatarioTitle,false);
		paramAdjudicatarioTitleq=dameRSQLBusquedaNombreSQL(adjudicatarioTitle,false);
	}

	var adjudicatarioId=$("#buscadorDNI").val().trim();	
	var paramAdjudicatarioId="";
	var paramAdjudicatarioIdq="";
	if($("#buscadorDNI").val().length >= caracteresMinimosBusqueda)
	{
		paramAdjudicatarioId="beneficiario like '*"+adjudicatarioId+"*'";
		paramAdjudicatarioIdq="beneficiario=='*"+adjudicatarioId+"*'";
	}else{
		paramAdjudicatarioId="beneficiario like '"+adjudicatarioId+"'";
		paramAdjudicatarioIdq="beneficiario=='"+adjudicatarioId+"'";
	}
	
	var tipoBeneficiario=$("#selectTipoBeneficiario").val().trim();	
	var paramTipoBeneficiario="beneficiario like '"+tipoBeneficiario+"*'";
	var paramTipoBeneficiarioq="beneficiario=='"+tipoBeneficiario+"1*',beneficiario=='"+tipoBeneficiario+"2*',beneficiario=='"+tipoBeneficiario+"3*',beneficiario=='"+tipoBeneficiario+"4*',beneficiario=='"+tipoBeneficiario+"5*',beneficiario=='"+tipoBeneficiario+"6*',beneficiario=='"+tipoBeneficiario+"7*',beneficiario=='"+tipoBeneficiario+"8*',beneficiario=='"+tipoBeneficiario+"9*'";
	
	var anyoAdj=$("#selectAnyoAdj").val();	
	
	var fechaAdjudicacionDesde=$("#fechaAdjDesde").val().trim();
	var fechaAdjudicacionDesdeISO;
	var paramFechaAdjudicacionDesde;

	var fechaAdjudicacionHasta=$("#fechaAdjHasta").val().trim();	
	var fechaAdjudicacionHastaISO;
	var paramFechaAdjudicacionHasta;

	var anyoSol=$("#selectAnyoSol").val();	
	
	var fechaSolicitudDesde=$("#fechaSolDesde").val().trim();
	var fechaSolicitudDesdeISO;
	var paramFechaSolicitudDesde;

	var fechaSolicitudHasta=$("#fechaSolHasta").val().trim();	
	var fechaSolicitudHastaISO;
	var paramFechaSolicitudHasta;
	
	var importeConDesde=$("#importeConDesde").val().trim();	
	var paramImporteConDesde="importeConcedido>="+importeConDesde;		

	var importeConHasta=$("#importeConHasta").val().trim();	
	var paramImporteConHasta="importeConcedido<"+importeConHasta;

	var importeSolDesde=$("#importeSolDesde").val().trim();	
	var paramImporteSolDesde="importeConcedido>="+importeSolDesde;		

	var importeSolHasta=$("#importeSolHasta").val().trim();	
	var paramImporteSolHasta="importeConcedido<"+importeSolHasta;
	
	var URLParam="";
	var URLParamQ="";
	if (adjudicatarioTitle!='')	
	{
		URLParam=URLParam+paramAdjudicatarioTitle;
		URLParamQ=URLParamQ+paramAdjudicatarioTitleq;
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'nombre:' )+'</span>'+" "+adjudicatarioTitle;
		busquedaTodo=false;
	}
	if (adjudicatarioId!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramAdjudicatarioId;
		URLParamQ=URLParamQ+paramAdjudicatarioIdq;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'dni_cif:' )+'</span>'+" "+adjudicatarioId;
		busquedaTodo=false;
	}
	if (tipoBeneficiario!='') 
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramTipoBeneficiario;
		URLParamQ=URLParamQ+paramTipoBeneficiarioq;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'tipo:' )+'</span>'+" "+dameTipoEntidad(tipoBeneficiario);
		busquedaTodo=false;
	}
	if (fechaAdjudicacionDesde!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		fechaAdjudicacionDesdeISO=Date.parse(fechaAdjudicacionDesde).toString('yyyy-MM-ddThh:mm:ss');
		paramFechaAdjudicacionDesde="fechaConcesion>='"+fechaAdjudicacionDesdeISO+"'";
		URLParam=URLParam+paramFechaAdjudicacionDesde;
		URLParamQ=URLParamQ+paramFechaAdjudicacionDesde;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'fecha' )+" "+$.i18n( 'desde:' )+'</span>'+" "+fechaAdjudicacionDesde;
		busquedaTodo=false;
	}
	if (fechaAdjudicacionHasta!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		fechaAdjudicacionHastaISO=Date.parse(fechaAdjudicacionHasta).toString('yyyy-MM-ddThh:mm:ss');
		paramFechaAdjudicacionHasta="fechaConcesion<'"+fechaAdjudicacionHastaISO+"'";
		URLParam=URLParam+paramFechaAdjudicacionHasta;
		URLParamQ=URLParamQ+paramFechaAdjudicacionHasta;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'fecha' )+" "+$.i18n( 'hasta:' )+'</span>'+" "+fechaAdjudicacionHasta;
		busquedaTodo=false;
	}
	if(anyoAdj!='')
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		fechaAdjudicacionDesdeISO=Date.parse(anyoAdj+"-01-01T00:00:00").toString('yyyy-MM-ddThh:mm:ss');
		paramFechaAdjudicacionDesde="fechaConcesion>='"+fechaAdjudicacionDesdeISO+"'";
		URLParam=URLParam+paramFechaAdjudicacionDesde;
		URLParamQ=URLParamQ+paramFechaAdjudicacionDesde;
		fechaAdjudicacionHastaISO=Date.parse(anyoAdj+"-12-31T23:59:59").toString('yyyy-MM-ddThh:mm:ss');
		paramFechaAdjudicacionHasta=" and fechaConcesion<'"+fechaAdjudicacionHastaISO+"'";
		URLParam=URLParam+paramFechaAdjudicacionHasta;
		URLParamQ=URLParamQ+paramFechaAdjudicacionHasta;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'anyo' )+'</span>'+" "+anyoAdj;
		busquedaTodo=false;
	}
	if (fechaSolicitudDesde!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		fechaSolicitudDesdeISO=Date.parse(fechaSolicitudDesde).toString('yyyy-MM-ddThh:mm:ss');
		paramFechaSolicitudDesde="fechaSolicitud>='"+fechaSolicitudDesdeISO+"'";
		URLParam=URLParam+paramFechaSolicitudDesde;
		URLParamQ=URLParamQ+paramFechaSolicitudDesde;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'fecha' )+" "+$.i18n( 'desde:' )+'</span>'+" "+fechaSolicitudDesde;
		busquedaTodo=false;
	}
	if (fechaSolicitudHasta!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		fechaSolicitudHastaISO=Date.parse(fechaSolicitudHasta).toString('yyyy-MM-ddThh:mm:ss');
		paramFechaSolicitudHasta="fechaSolicitud<'"+fechaSolicitudHastaISO+"'";
		URLParam=URLParam+paramFechaSolicitudHasta;
		URLParamQ=URLParamQ+paramFechaSolicitudHasta;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'fecha' )+" "+$.i18n( 'hasta:' )+'</span>'+" "+fechaSolicitudHasta;
		busquedaTodo=false;
	}
	if(anyoSol!='')
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		fechaAdjudicacionDesdeISO=Date.parse(anyoSol+"-01-01T00:00:00").toString('yyyy-MM-ddThh:mm:ss');
		paramFechaAdjudicacionDesde="fechaConcesion>='"+fechaAdjudicacionDesdeISO+"'";
		URLParam=URLParam+paramFechaAdjudicacionDesde;
		URLParamQ=URLParamQ+paramFechaAdjudicacionDesde;
		fechaAdjudicacionHastaISO=Date.parse(anyoSol+"-12-31T23:59:59").toString('yyyy-MM-ddThh:mm:ss');
		paramFechaAdjudicacionHasta=" and fechaConcesion<'"+fechaAdjudicacionHastaISO+"'";
		URLParam=URLParam+paramFechaAdjudicacionHasta;
		URLParamQ=URLParamQ+paramFechaAdjudicacionHasta;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'anyo' )+'</span>'+" "+anyoSol;
		busquedaTodo=false;
	}
	if (importeConDesde!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramImporteConDesde;
		URLParamQ=URLParamQ+paramImporteConDesde; 
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'importe_concedido' )+" "+$.i18n( 'desde:' )+'</span>'+" "+importeConDesde;
		busquedaTodo=false;
	}
	if (importeConHasta!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramImporteConHasta;
		URLParamQ=URLParamQ+paramImporteConHasta;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'importe_concedido' )+" "+$.i18n( 'hasta:' )+'</span>'+" "+importeConHasta;
		busquedaTodo=false;
	}

	if (importeSolDesde!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramImporteSolDesde;
		URLParamQ=URLParamQ+paramImporteSolDesde;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'importe_solicitado' )+" "+$.i18n( 'desde:' )+'</span>'+" "+importeSolDesde;
		busquedaTodo=false;
	}
	if (importeSolHasta!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramImporteSolHasta;
		URLParamQ=URLParamQ+paramImporteSolHasta;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'importe_solicitado' )+" "+$.i18n( 'hasta:' )+'</span>'+" "+importeSolHasta;
		busquedaTodo=false;
	}
	
	if(busquedaTodo)
	{
		textoBusquedaTabla=$.i18n( 'datos_tabla_filtrar' );
		textoBusquedaGrafico=$.i18n( 'datos_grafico_filtrar' );
	}
	$('#textoBusquedaTabla').html(textoBusquedaTabla+textoBusqueda);
	$('#textoBusquedaGraficos').html(textoBusquedaGrafico+textoBusqueda);
	
	
	if(URLParam!="")
	{
		URLParam="&"+paramWhereAPI+"="+URLParam;
	}
	while (URLParam.indexOf("==")>=0)
	{
		URLParam=URLParam.replace("=="," like ");
	}
	while (URLParam.indexOf("%")>=0)
	{
		URLParam=URLParam.replace("%","*");
	}
	var urlBuscar;
	if(URLParamQ!="") 
	{
		urlBuscar = concesionURL+'?q='+URLParamQ;
	}else{
		urlBuscar = concesionURL;
	}

	urlBusqueda = urlBuscar;
	var table = $('#tablaBeneficiarios').DataTable();
	table.ajax.url( dameURL(urlBuscar) ).load(null, false);
	
	if(logDebugBusquedaBeneficiarios)
	{
		console.log("fin de busqueda");
		console.log(urlBuscar);
	}
	$('#panelFichaBeneficiarios').hide();

	
	beneficiariosSumImporte=new Array();
	$.getJSON(dameURL(queryGraficoBusquedaSumImporteBeneficiarios+URLParam)).done(function( data ) 
	{
			if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
			{
				var beneficiarioCadena=$.i18n( 'beneficiario' );
				var importeCadena=$.i18n( 'importe' );
				var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+beneficiarioCadena+"</th><th>"+importeCadena+"</th></tr>";
				for (var i = 0; i < data.records.length; i++) 
				{
					if(i < resgistroGráficos)
					{
						var beneficiario=new Object();
						beneficiario.sumImporte=data.records[i].suma;
						beneficiario.adjudicatarioId=data.records[i].beneficiario;
						beneficiario.adjudicatarioTitle=organizaciones[data.records[i].beneficiario].substring(0, limiteCadenasTexto);
						beneficiario.adjudicatarioTitleCompleto=organizaciones[data.records[i].beneficiario];
						beneficiariosSumImporte.push(beneficiario);
					}

					var importe=numeral(data.records[i].suma);
					var ben = organizaciones[data.records[i].beneficiario];
					if(ben==undefined)
					{
						ben=data.records[i].beneficiario;
					}
					htmlContent = htmlContent + "<tr>" + "<td>" + ben.toString() + "</td>" + "<td>" + importe.format(numFormato) + "</td>" + "</tr>";
				}
				
				var mensaje_mostar_ocultar_datos =  $.i18n( 'mostar_ocultar_datos' );
				htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos('datos_benInfIzq')\">"+mensaje_mostar_ocultar_datos+"</button></div></div>";
				$('#datos_benInfIzq').html(htmlContent);
			}else
			{
				console.log( msgErrorAPIResVacio );
			}
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() 
	{
		pintaGraficoInferiorIzquierda(beneficiariosSumImporte,$( window.parent.document ).width());
		
		
		
	});
	beneficiariosNumSubvenciones=new Array();
	$.getJSON(dameURL(queryGraficoBusquedaNumSubvencionesBeneficiarios+URLParam)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			var beneficiarioCadena=$.i18n( 'beneficiario' );
			var numeroSubvencionesCadena=$.i18n( 'numero_convocatorias' );
			var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+beneficiarioCadena+"</th><th>"+numeroSubvencionesCadena+"</th></tr>";
			for (var i = 0; i < data.records.length; i++) 
			{
				if(i < resgistroGráficos)
				{
					var beneficiario=new Object();
					beneficiario.sumImporte=data.records[i].numero;
					beneficiario.adjudicatarioId=data.records[i].beneficiario;
					beneficiario.adjudicatarioTitle=organizaciones[data.records[i].beneficiario].substring(0, limiteCadenasTexto);
					beneficiario.adjudicatarioTitleCompleto=organizaciones[data.records[i].beneficiario];
					beneficiariosNumSubvenciones.push(beneficiario);
				}

				var conteo=numeral(data.records[i].numero);
				var ben = organizaciones[data.records[i].beneficiario];
				if(ben==undefined)
				{
					ben=data.records[i].beneficiario;
				}
				htmlContent = htmlContent + "<tr>" + "<td>" + ben.toString() + "</td>" + "<td>" + conteo.format(numFormato) + "</td>" + "</tr>";
			}

			var mensaje_mostar_ocultar_datos =  $.i18n( 'mostar_ocultar_datos' );
			htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos('datos_benInfDer')\">"+mensaje_mostar_ocultar_datos+"</button></div></div>";
			$('#datos_benInfDer').html(htmlContent);
		}else
		{
			console.log( msgErrorAPIResVacio );
		}
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() 
	{
		pintaGraficoInferiorDerecha(beneficiariosNumSubvenciones,$( window.parent.document ).width());
			
		
		
	});
}

function dameRSQLBusquedaNombreRSQL(nombre,comodin)
{
	var resultado="(";
	for(var key in organizaciones)
	{
		if(comodin)
		{
			if(organizaciones[key].toString().toLowerCase().includes(nombre.toString().toLowerCase()))
			{
				resultado=resultado+key+",";
			}
		}else
		{
			if(organizaciones[key].toString().toLowerCase()==nombre.toString().toLowerCase())
			{
				resultado=resultado+key+",";
			}
		}
		
	}
	resultado=resultado.slice(0, -1)+")";
	resultado="beneficiario=in="+resultado;
	console.log(resultado);
	return resultado;
}

function dameRSQLBusquedaNombreSQL(nombre,comodin)
{
	var resultado="(";
	for(var key in organizaciones)
	{
		if(comodin)
		{
			if(organizaciones[key].toString().toLowerCase().includes(nombre.toString().toLowerCase()))
			{
				resultado=resultado+"'"+key+"',";
			}
		}else
		{
			if(organizaciones[key].toString().toLowerCase()==nombre.toString().toLowerCase())
			{
				resultado=resultado+"'"+key+"',";
			}
		}
		
	}
	resultado=resultado.slice(0, -1)+")";
	resultado="beneficiario in "+resultado;
	console.log(resultado);
	return resultado;
}

function descargaTabla(url, boton)
{
	var copyCadena=$.i18n( 'copiar' );
	var urlLanguaje = "vendor/datatables/i18n/"+$.i18n().locale+".json";

	var nombreBeneficiarioCadena=$.i18n( 'nombre_del_beneficiario' );
	var identificadorBeneficiarioCadena=$.i18n( 'identificador_del_beneficiario' );
	var tipoEntidadCadena=$.i18n( 'tipo' );
	var fechaAdjudicacionCadena=$.i18n( 'fecha_adjudicacion' );
	var importeCondedidoCadena=$.i18n( 'importe_concedido' );
	
	var cabecerasTablaBeneficiarios =	"<th>"+nombreBeneficiarioCadena+"</th><th>"+identificadorBeneficiarioCadena+"</th><th>"+tipoEntidadCadena+"</th><th>"+importeCondedidoCadena+"</th><th>"+fechaAdjudicacionCadena+"</th>";	
		
	$('#tablaBeneficiariosCompletaTHead').empty();
	$('#tablaBeneficiariosCompletaTHead').append(cabecerasTablaBeneficiarios);

	$.getJSON(dameURL(url)).done(function( data ) 
	{			
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			
			for (var i = 0; i < data.records.length; i++) 
			{
				
				var beneficiario = data.records[i].beneficiario;
				var beneficiarioOrg;
				var beneficiariotip;
				if(beneficiario==undefined)
				{
					beneficiario='';
					beneficiarioOrg='';
					beneficiarioTip='';
				}else{
					beneficiarioOrg = organizaciones[data.records[i].beneficiario];
					beneficiarioTip = dameTipoEntidad(data.records[i].beneficiario);
				}	
				var importeConcedido = data.records[i].importeConcedido;
				if(importeConcedido==undefined)
				{
					importeConcedido='';
				}else{
					importeConcedido=numeral(data.records[i].importeConcedido).format(numFormatoCSV,Math.ceil);
				}
				var fechaConcesion = data.records[i].fechaConcesion;
				if(fechaConcesion==undefined)
				{
					fechaConcesion='';
				}else{
					fechaConcesion = Date.parse(data.records[i].fechaConcesion).toString('dd-MM-yyyy');
				}
				$('#tablaBeneficiariosCompleta').append("<tr><td>"+beneficiarioOrg+"</td>"+"<td>"+beneficiario+"</td>"+"<td>"+beneficiarioTip+"</td>"+"<td>"+importeConcedido+"</td>"+"<td>"+fechaConcesion+"</td>"+"</tr>");
			}
			if(data.next!=null && data.records!=null){

				descargaTabla(data.next, boton);
			}
			else{			
				$('#tablaBeneficiariosCompleta').DataTable(
				{
					"paging": true,
					"searching": false,
					"pageLength": registrosTablabusqueda,
					"formatNumber": function ( toFormat ) {
						return toFormat.toString().replace(
						  /\B(?=(\d{3})+(?!\d))/g, "."
						);
					},
					"language": 
					{
						"decimal": ",",
						"thousands": ".",
						"url": urlLanguaje,		
					},
					"order": [4, 'asc'],
					dom: '<"row">t<"row"<"col-sm-6"B>>',
					buttons: 
					[				
						{
							extend: 'csv',
							text: 'CSV <span class="fa fa-table"></span>',
							title: 'concesiones',
							className: 'btn btn-primary',				
							exportOptions: {
								search: 'applied',
								order: 'applied'
							},
							bom: true,
							fieldSeparator: ';',
							fieldBoundary: ''
						},
						{
							text: 'JSON <span class="fa fa-list-alt "></span>',
							title: 'concesiones',
							className: 'buttons-json btn btn-primary',
							exportOptions: {
								search: 'applied',
								order: 'applied'
							},
							action: function ( e, dt, button, config ) 
							{
								var exportData = dt.buttons.exportData();
			
								$.fn.dataTable.fileSave(
									new Blob( [ JSON.stringify( exportData ) ] ),
									'concesiones.json'
								);
							}
						},
						{
							extend: 'excel',
							text: 'EXCEL <span class="fa fa-file-excel-o"></span>',
							title: 'concesiones',
							className: 'btn btn-primary',				
							exportOptions: {
								search: 'applied',
								order: 'applied'
							},
						},
						{
							text: 'PDF <span class="fa fa-file-pdf-o"></span>',
							title: 'listado_concesiones',
							className: 'btn btn-primary',
							extend: 'pdfHtml5',
								filename: 'concesiones',
								orientation: 'landscape',
								pageSize: 'A4',
								exportOptions: {
									search: 'applied',
									order: 'applied'
								},
								customize: function (doc) {
									doc.content.splice(0,1);
									var now = new Date();
									var jsDate = now.getDate()+'-'+(now.getMonth()+1)+'-'+now.getFullYear();
									var logo = logoBase64;
									doc.pageMargins = [20,60,20,30];
									doc.defaultStyle.fontSize = 7;
									doc.styles.tableHeader.fontSize = 7;
									doc['header']=(function() {
										return {
											columns: [
												{
													image: logo,
													width: 96
												},
												{
													alignment: 'center',
													fontSize: '14',
													text: ['Listado de concesiones de subvenciones']
												}
											],
											margin: 20
										};
									});
									doc['footer']=(function(page, pages) {
										return {
											columns: [
												{
													alignment: 'left',
													text: ['Creado el: ', { text: jsDate.toString() }]
												},
												{
													alignment: 'right',
													text: ['Pag.', { text: page.toString() },	' de ',	{ text: pages.toString() }]
												}
											],
											margin: 20
										};
									});
									var objLayout = {};
									objLayout['hLineWidth'] = function() { return .5; };
									objLayout['vLineWidth'] = function() { return .5; };
									objLayout['hLineColor'] = function() { return '#aaa'; };
									objLayout['vLineColor'] = function() { return '#aaa'; };
									objLayout['paddingLeft'] = function() { return 4; };
									objLayout['paddingRight'] = function() { return 4; };
									doc.content[0].layout = objLayout;			
								}
						},       
						{
							extend: 'copy',
							text: copyCadena+' <span class="fa fa-copy  "></span>',
							title: 'concesiones',
							className: 'btn btn-primary',
							exportOptions: {
								search: 'applied',
								order: 'applied'
							},
						},								
					],
					initComplete: function(settings, json) {
						$("#tablaBeneficiariosCompleta_wrapper > div:nth-child(3) > div > div").hide();
						var table = $('#tablaBeneficiariosCompleta').DataTable();
						$('.modal').modal('hide');
						table.button(boton).trigger();
						table.destroy();
						$('#tablaBeneficiariosCompletaBody').empty();
					}
				});
				
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
	});
}


/*
	Función para crear el gráfico superior izquierda
*/
function pintaGraficoSuperiorIzquierda(sumSubvencionesBeneficiarios){
	if(logDebugBusquedaBeneficiarios)
	{
		console.log("pintaGraficoSuperiorIzquierda");
	}

	am4core.useTheme(am4themes_frozen);
	am4core.useTheme(am4themes_animated);
	
	var chart = am4core.create("chartdivGraficoSuperiorIzquierda", am4charts.XYChart);

	chart.data = sumSubvencionesBeneficiarios;
	chart.language.locale._decimalSeparator= ",";
	chart.language.locale._thousandSeparator= ".";
	// chart.language.locale = am4lang_es_ES;

	var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
	categoryAxis.dataFields.category = "adjudicatarioTitle";
	categoryAxis.renderer.inversed = true;
	categoryAxis.renderer.grid.template.location = 0;
	categoryAxis.renderer.minGridDistance = 1;

	var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
	valueAxis.min = 0;
	valueAxis.strictMinMax = true;

	var series = chart.series.push(new am4charts.ColumnSeries());
	series.dataFields.categoryY = "adjudicatarioTitle";
	series.dataFields.valueX = "sumConvocatorias";
	series.name = "sumConvocatorias";
	series.columns.template.tooltipText = "{adjudicatarioTitleCompleto}: [bold]{valueX}€[/]";
	series.columns.template.fillOpacity = .8;
	series.columns.template.strokeOpacity = 0;

	var columnTemplate = series.columns.template;
	columnTemplate.strokeWidth = 2;
	columnTemplate.strokeOpacity = 1;
	
}


/*
	Función para crear el gráfico superior derecha
*/
function pintaGraficoSuperiorDerecha(numSubvencionesBeneficiarios)
{
	if(logDebugBusquedaBeneficiarios)
	{
		console.log("pintaGraficoSuperiorDerecha");
	}

	am4core.useTheme(am4themes_frozen);
	am4core.useTheme(am4themes_animated);
	
	var chart = am4core.create("chartdivGraficoSuperiorDerecha", am4charts.XYChart);

	chart.data = numSubvencionesBeneficiarios;
	chart.language.locale._decimalSeparator= ",";
	chart.language.locale._thousandSeparator= ".";
	// chart.language.locale = am4lang_es_ES;

	var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
	categoryAxis.dataFields.category = "adjudicatarioTitle";
	categoryAxis.renderer.inversed = true;
	categoryAxis.renderer.grid.template.location = 0;
	categoryAxis.renderer.minGridDistance = 1;

	var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
	valueAxis.min = 0;
	valueAxis.strictMinMax = true;

	var series = chart.series.push(new am4charts.ColumnSeries());
	series.dataFields.categoryY = "adjudicatarioTitle";
	series.dataFields.valueX = "numSubvenciones";
	series.name = "numSubvenciones";
	series.columns.template.tooltipText = "{adjudicatarioTitleCompleto}: [bold]{valueX}[/]";
	series.columns.template.fillOpacity = .8;
	series.columns.template.strokeOpacity = 0;

	var columnTemplate = series.columns.template;
	columnTemplate.strokeWidth = 2;
	columnTemplate.strokeOpacity = 1;
}


/*
	Función para crear el gráfico inferior izquierda
*/
function pintaGraficoInferiorIzquierda(sumSubvencionesBeneficiarios,width)
{
	if(logDebugBusquedaBeneficiarios)
	{
		console.log("pintaGraficoInferiorIzquierda");
	}

	var labels = true;
	if (width<700)
	{
		labels=false;
	}
	
	am4core.useTheme(am4themes_frozen);
	am4core.useTheme(am4themes_animated);
	
	var chart = am4core.create("chartdivGraficoInferiorIzquierda", am4charts.XYChart);

	chart.data = sumSubvencionesBeneficiarios;
	chart.language.locale._decimalSeparator= ",";
	chart.language.locale._thousandSeparator= ".";
	// chart.language.locale = am4lang_es_ES;

	var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
	categoryAxis.dataFields.category = "adjudicatarioTitle";
	categoryAxis.renderer.inversed = true;
	categoryAxis.renderer.grid.template.location = 0;
	categoryAxis.renderer.minGridDistance = 1;

	var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
	valueAxis.min = 0;
	valueAxis.strictMinMax = true;

	var series = chart.series.push(new am4charts.ColumnSeries());
	series.dataFields.categoryY = "adjudicatarioTitle";
	series.dataFields.valueX = "sumImporte";
	series.name = "sumImporte";
	series.columns.template.tooltipText = "{adjudicatarioTitleCompleto}: [bold]{valueX}€[/]";
	series.columns.template.fillOpacity = .8;
	series.columns.template.strokeOpacity = 0;

	var columnTemplate = series.columns.template;
	columnTemplate.strokeWidth = 2;
	columnTemplate.strokeOpacity = 1;
	
	// var cachito = (5 / 100) * $( document ).height();
	// $('#iframeBusquedaBeneficiarios', window.parent.document).height($( document ).height()+cachito);
}


/*
	Función para crear el gráfico inferior derecha
*/
function pintaGraficoInferiorDerecha(numSubvencionesBeneficiarios,width)
{
	if(logDebugBusquedaBeneficiarios)
	{
		console.log("pintaGraficoInferiorDerecha ");
	}
	
	var labels = true;
	if (width<700)
	{
		labels=false;
	}
	
	am4core.useTheme(am4themes_frozen);
	am4core.useTheme(am4themes_animated);
	
	var chart = am4core.create("chartdivGraficoInferiorDerecha", am4charts.XYChart);

	chart.data = numSubvencionesBeneficiarios;
	chart.language.locale._decimalSeparator= ",";
	chart.language.locale._thousandSeparator= ".";
	// chart.language.locale = am4lang_es_ES;

	var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
	categoryAxis.dataFields.category = "adjudicatarioTitle";
	categoryAxis.renderer.inversed = true;
	categoryAxis.renderer.grid.template.location = 0;
	categoryAxis.renderer.minGridDistance = 1;

	var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
	valueAxis.min = 0;
	valueAxis.strictMinMax = true;

	var series = chart.series.push(new am4charts.ColumnSeries());
	series.dataFields.categoryY = "adjudicatarioTitle";
	series.dataFields.valueX = "sumImporte";
	series.name = "sumImporte";
	series.columns.template.tooltipText = "{adjudicatarioTitleCompleto}: [bold]{valueX}[/]";
	series.columns.template.fillOpacity = .8;
	series.columns.template.strokeOpacity = 0;

	var columnTemplate = series.columns.template;
	columnTemplate.strokeWidth = 2;
	columnTemplate.strokeOpacity = 1;
	
	// var cachito = (5 / 100) * $( document ).height();
	// $('#iframeBusquedaBeneficiarios', window.parent.document).height($( document ).height()+cachito);
	
}

/*
	Función para mostrar u ocultar la tabla de datos denajo d elos gráficos
*/
function mostrarDatos( capa ) 
{
	if(logDebugBusquedaBeneficiarios)
	{
		console.log("mostrarDatos ");
	}

	if(heightInicial==undefined)
	{
		heightInicial=$("#iframeBusquedaBeneficiarios", window.parent.document).height();
	}

	var heightFisrt = $('#'+capa).height();
	$('#'+capa).toggle();
	var heightSecond = $('#'+capa).height();

	var isVisible = $('#'+capa).is(':visible');
	if (isVisible === true) 
	{
		$("#iframeBusquedaBeneficiarios", window.parent.document).height($( 'body' ).height());
	}else
	{
		if($(".table-responsive").is(':visible'))
		{
			$('#iframeBusquedaBeneficiarios', window.parent.document).height(heightConTabla);
		}else
		{
			$('#iframeBusquedaBeneficiarios', window.parent.document).height(heightInicial);
		}
	}
}

/*
	Función para limpiar el formulario de beneficiarios
*/
function limpiarFormularioBen()
{
	if(logDebugBusquedaBeneficiarios)
	{
		console.log("limpiarFormularioBen");
	}
		
	$("#buscadorNombre").val("");
	$("#buscadorDNI").val("");
	$("#selectTipoBeneficiario").val("");
	$("#selectAnyoAdj").val("");
	$("#fechaAdjDesde").val("");
	$("#fechaAdjHasta").val("");
	$("#selectAnyoSol").val("");
	$("#fechaSolDesde").val("");
	$("#fechaSolHasta").val("");
	$("#importeConDesde").val("");
	$("#importeConHasta").val("");
	$("#importeSolDesde").val("");
	$("#importeSolHasta").val("");
	
	$('#panelFichaBeneficiarios').hide();
	$("#lineaGraficosBusquedaBen").hide();
	$(".table-responsive").hide();
	$("#botoneraDescarga").hide();

	$("#iframeBusquedaBeneficiarios", window.parent.document).height(heightInicial);
}