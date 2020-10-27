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
var peticionesInicialesBen = [false,false,false];

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
	
	inicializaDatos();
	camposFecha();
	creaSelectTipoEntidad();
	preparaTablaBeneficiarios(false);			
	$("#lineaGraficosBusquedaBen").hide();
	$(".table-responsive").hide();
	$("#iframeBusquedaBeneficiarios", window.parent.document).height(520);
	$( "#buscarListado" ).click(function() 
	{
		buscar()
		this.blur();
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
	$('html').i18n()
	
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

/*
	Función que iniciliza los datos que dependen de la API
*/
function inicializaDatos()
{
	if(logDebugBusquedaBeneficiarios){
		console.log("inicializaDatos");
	}
	
	// var peticiones = [false,false,false,false,false];
	
	var areas=new Array();	
	var mesesConDatos=new Array();
	var areasGasto=new Array();
	var anyos=new Array();
	var anyosFiltro="";
	var anyosFiltro2="";
	var importeNombre=new Array();
	var importeArea=new Array();
	var beneficiariosSumImporte=new Array();
	var beneficiariosNumSubvenciones=new Array();
	
	anyos=new Array();
	var jqxhr = $.getJSON(dameURL(queryIniAnyos)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			for (var i = 0; i < data.records.length; i++) 
			{
				anyos.push(Number(data.records[i]));
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
		$('#selectAnyo').empty().append("<option value=''></option>").attr("selected","selected");				
		for (var i=0;i<anyos.length;i++)
		{
			$('#selectAnyo').append("<option value='"+anyos[i]+"'>"+anyos[i]+"</option>");				
		}
		
		var valorDefecto=anyos[anyos.length-1];
		if(getUrlVars()["anyo"]!=undefined){
			valorDefecto=decodeURI(getUrlVars()["anyo"])
		}
		// Instantiate a slider
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
		$("#selectTipoBeneficiario").val(dameLetraTipoEntidad(decodeURI(paramTipoBeneficiario)));
		ejecutarBusqueda=true;
	}
	var paramAnyo = getUrlVars()["anyo"];
	if(paramAnyo!=undefined)
	{
		$("#selectAnyo").val(decodeURI(paramAnyo));
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
	
	var textoIzq = $.i18n( 'top_10_beneficiarios_por_importe' );
	var textoDer = $.i18n( 'top_10_beneficiarios_por_numero_de_subvenciones' );
	$('#cabeceraArribaIzquierda').html(textoIzq+' '+filtroAnyo);
	$('#cabeceraArribaDerecha').html(textoDer+' '+filtroAnyo);
	// $('#selectAnyo').val(filtroAnyo);
	
	var urlFiltroAnyo="";
	if(filtroAnyo!=undefined && filtroAnyo!='Todos')
	{
		urlFiltroAnyo="&"+paramWhereAPI+"=fechaAdjudicacion>='"+filtroAnyo+"-01-01T00:00:00' and fechaAdjudicacion<='"+filtroAnyo+"-12-31T23:59:59'";
	}
	var sumImporteBeneficiarios=new Array();
	var jqxhr = $.getJSON(dameURL(queryIniGraficoSumImporteBeneficiarios+urlFiltroAnyo))
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
					sumImporteBeneficiario.sumSubvenciones=data.records[i][0];
					sumImporteBeneficiario.adjudicatarioId=data.records[i][1];
					sumImporteBeneficiario.adjudicatarioTitle=data.records[i][2].substring(0, 30);
					sumImporteBeneficiario.adjudicatarioTitleCompleto=data.records[i][2];
					sumImporteBeneficiarios.push(sumImporteBeneficiario);
				}	
					var importe=numeral(data.records[i][0]);
					htmlContent = htmlContent + "<tr>" + "<td>" + data.records[i][2].toString() + "</td>" + "<td>" + importe.format(numFormato) + "</td>" + "</tr>";
				
			}
			htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos('datos_benSupIzq')\">Mostar/Ocultar datos</button></div></div>";
			
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
	
	var numSubvencionesBeneficiarios=new Array()
	var jqxhr = $.getJSON(dameURL(queryIniGraficoNumSubvencionesBeneficiarios+urlFiltroAnyo))
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
					numSubvencionesBeneficiario.numSubvenciones=data.records[i][0];
					numSubvencionesBeneficiario.adjudicatarioId=data.records[i][1];
					numSubvencionesBeneficiario.adjudicatarioTitle=data.records[i][2].substring(0, 30);
					numSubvencionesBeneficiario.adjudicatarioTitleCompleto=data.records[i][2];
					numSubvencionesBeneficiarios.push(numSubvencionesBeneficiario);
				}

				var importe=numeral(data.records[i][0]);
				htmlContent = htmlContent + "<tr>" + "<td>" + data.records[i][2].toString() + "</td>" + "<td>" + importe.format(numFormato) + "</td>" + "</tr>";
				
			}
			htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos('datos_benSupDer')\">Mostar/Ocultar datos</button></div></div>";
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
		//Pintamos la tarta
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
		$( "#desde, #hasta" ).datepicker(
		{		
			showButtonPanel:  false,
			dateFormat: "dd/mm/yy"
		}
		);
	
		$('#botonDesde').click(function() 
		{
			if ($("#desde").datepicker( "widget" ).is(":visible"))
			{
				$('#desde').datepicker('hide');
			}
			else
			{
				$('#desde').datepicker('show');
			}
		}
		);
		
		$('#botonHasta').click(function() 
		{
			if ($("#hasta").datepicker( "widget" ).is(":visible"))	
			{
				$('#hasta').datepicker('hide');
			}
			else
			{
				$('#hasta').datepicker('show');
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
		
	var cabecerasTablaBeneficiarios="";
	
	fichaCadena=$.i18n( 'ficha' );
	nombreBeneficiarioCadena=$.i18n( 'nombre_del_beneficiario' );
	identificadorBeneficiarioCadena=$.i18n( 'identificador_del_beneficiario' );
	tipoEntidadCadena=$.i18n( 'tipo' );
	fechaAdjudicacionCadena=$.i18n( 'fecha_adjudicacion' );
	importeCondedidoCadena=$.i18n( 'importe_concedido' );
	copyCadena=$.i18n( 'copiar' );
	
	cabecerasTablaSubvenciones=	"<th>Identificador</th><th>"+nombreBeneficiarioCadena+"</th><th>"+identificadorBeneficiarioCadena+"</th><th>"+tipoEntidadCadena+"</th>";	
	
	var urlLanguaje = "vendor/datatables/i18n/"+$.i18n().locale+".json"
	
	$('#tablaBeneficiariosTHead').empty();
	$('#tablaBeneficiariosTHead').append(cabecerasTablaBeneficiarios);
	
	tablaBeneficiarios=$('#tablaBeneficiarios').DataTable(
	{
		"processing": true,
		"serverSide": true,
		"paging": true,
		"searching": false,
		"pageLength": registrosTablabusqueda,
		"language": 
		{
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
						'adjudicatarioId' : data.records[i].adjudicatarioId,
						'adjudicatarioTitle' : data.records[i].adjudicatarioTitle,
						'importe' : data.records[i].importe,
						'fechaAdjudicacion' : data.records[i].fechaAdjudicacion
					}
					)
				  }
				}else
				{
					console.log( msgErrorAPIResVacio );
				}
				
				return return_data;
			},
			"data": function ( d ) 
			{
				var newD = new Object();
				newD.pageSize = d.length;
				if(d.length!=0)
				{
					actualPage=(d.start/d.length)
				}
				else
				{
					actualPage=1;
				}
				newD.page=(actualPage+1);
				
				var order='fechaAdjudicacion';
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
		"order": [5, 'asc'],
		"columns":  
		[
			{'data' : null, 'render': function(data,type,row) {return ('<a aria-label="Abrir ficha" href="'+data.adjudicatarioTitle+'"></a>')}, className:"details-control", orderable: false , "title": fichaCadena, 'name':'Ficha'},
			{'data': 'id' , "title": "Identificador", 'name':'Identificador'},
			{'data': 'adjudicatarioTitle' , "title": nombreBeneficiarioCadena, 'name':'adjudicatarioTitle'},
			{'data': 'adjudicatarioId' , "title": identificadorBeneficiarioCadena, 'name':'adjudicatarioId'},
			{'data': null, 'render': function(data,type,row) {return (dameTipoEntidad(data.adjudicatarioId))}, "title": tipoEntidadCadena, 'name':'adjudicatarioId' },
			{'data': null, 'render': function(data,type,row) {return (numeral(data.importe)).format(importeFormato,Math.ceil)} , "title": importeCondedidoCadena, 'name':'importe'},
			{'data': null, 'render': function(data,type,row) {return (Date.parse(data.fechaAdjudicacion)).toString('dd-MM-yyyy')} , "title": fechaAdjudicacionCadena, 'name':'fechaAdjudicacion'}
		],
		dom: '<"row"<"col-sm-6"lfi><"col-sm-6"p>>rt<"row"<"col-sm-6"fiB><"col-sm-6"p>>',
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
					filename: 'dt_custom_pdf',
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
						var logo = logoBase64;
						doc.pageMargins = [20,60,20,30];
						doc.defaultStyle.fontSize = 7;
						doc.styles.tableHeader.fontSize = 7;
						doc['header']=(function() {
							return {
								columns: [
									{
										image: logoBase64,
										width: 96
									}
								],
								margin: 20
							}
						});
						doc['footer']=(function(page, pages) {
							return {
								columns: [
									{
										alignment: 'left',
										text: ['Created on: ', { text: jsDate.toString() }]
									},
									{
										alignment: 'right',
										text: ['page ', { text: page.toString() },	' of ',	{ text: pages.toString() }]
									}
								],
								margin: 20
							}
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
			var cachito = (5 / 100) * $( document ).height();
			$('#iframeBusquedaBeneficiarios', window.parent.document).height($( document ).height()+cachito);
		}
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
			var adjudicatarioTitle = row.data()['adjudicatarioTitle'];
			var adjudicatarioId = row.data()['adjudicatarioId'];
			var fechaAdjudicacion = row.data()['fechaAdjudicacion'];
			
			var url = "ficha_beneficiarios.html?lang="+$.i18n().locale
			url=url+"&id="+id+"&nombre="+adjudicatarioTitle+"&dnicif="+adjudicatarioId+"&fechaAdjudicacion="+fechaAdjudicacion;
			// window.open(url,'_blank');

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
	
	var mesesAreaConDatos=new Array();
	var mesesConDatos=new Array();
	var areasGasto=new Array();
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
		paramAdjudicatarioTitle="adjudicatarioTitle like '*"+adjudicatarioTitle+"*'";
		paramAdjudicatarioTitleq="adjudicatarioTitle=='*"+adjudicatarioTitle+"*'";
	}else
	{
		paramAdjudicatarioTitle="adjudicatarioTitle like '"+adjudicatarioTitle+"'";
		paramAdjudicatarioTitleq="adjudicatarioTitle=='"+adjudicatarioTitle+"'";
	}

	var adjudicatarioId=$("#buscadorDNI").val().trim();	
	var paramAdjudicatarioId="";
	var paramAdjudicatarioIdq="";
	if($("#buscadorNombre").val().length >= caracteresMinimosBusqueda)
	{
		paramAdjudicatarioId="adjudicatarioId like '*"+adjudicatarioId+"*'";
		paramAdjudicatarioIdq="adjudicatarioId='*"+adjudicatarioId+"*'";
	}else{
		paramAdjudicatarioId="adjudicatarioId like '"+adjudicatarioId+"'";
		paramAdjudicatarioIdq="adjudicatarioId=='"+adjudicatarioId+"'";
	}
	
	var tipoBeneficiario=$("#selectTipoBeneficiario").val().trim();	
	var paramTipoBeneficiario="adjudicatarioId like '"+tipoBeneficiario+"*'";
	var paramTipoBeneficiarioq="adjudicatarioId=='"+tipoBeneficiario+"*'";
	
	var anyo=$("#selectAnyo").val();	
	
	var fechaAdjudicacionDesde=$("#desde").val().trim();
	var fechaAdjudicacionDesdeISO;
	var paramFechaAdjudicacionDesde;

	var fechaAdjudicacionHasta=$("#hasta").val().trim();	
	var fechaAdjudicacionHastaISO;
	var paramFechaAdjudicacionHasta;
	
	var importeDesde=$("#importeDesde").val().trim();	
	var paramImporteDesde="importe>="+importeDesde;		

	var importeHasta=$("#importeHasta").val().trim();	
	var paramImporteHasta="importe<"+importeHasta;
	
	var busquedas=0;
	var URLParam=""
	var URLParamQ=""
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
		paramFechaAdjudicacionDesde="fechaAdjudicacion>='"+fechaAdjudicacionDesdeISO+"'";
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
		paramFechaAdjudicacionHasta="fechaAdjudicacion<'"+fechaAdjudicacionHastaISO+"'";
		URLParam=URLParam+paramFechaAdjudicacionHasta;
		URLParamQ=URLParamQ+paramFechaAdjudicacionHasta;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'fecha' )+" "+$.i18n( 'hasta:' )+'</span>'+" "+fechaAdjudicacionHasta;
		busquedaTodo=false;
	}
	if(anyo!='')
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		fechaAdjudicacionDesdeISO=Date.parse(anyo+"-01-01T00:00:00").toString('yyyy-MM-ddThh:mm:ss');
		paramFechaAdjudicacionDesde="fechaAdjudicacion>='"+fechaAdjudicacionDesdeISO+"'";
		URLParam=URLParam+paramFechaAdjudicacionDesde;
		URLParamQ=URLParamQ+paramFechaAdjudicacionDesde;
		fechaAdjudicacionHastaISO=Date.parse(anyo+"-12-31T23:59:59").toString('yyyy-MM-ddThh:mm:ss');
		paramFechaAdjudicacionHasta=" and fechaAdjudicacion<'"+fechaAdjudicacionHastaISO+"'";
		URLParam=URLParam+paramFechaAdjudicacionHasta;
		URLParamQ=URLParamQ+paramFechaAdjudicacionHasta;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'anyo' )+'</span>'+" "+anyo;
		busquedaTodo=false;
	}
	if (importeDesde!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramImporteDesde;
		URLParamQ=URLParamQ+paramImporteDesde;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'importe' )+" "+$.i18n( 'desde:' )+'</span>'+" "+importeDesde;
		busquedaTodo=false;
	}
	if (importeHasta!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
			URLParamQ=URLParamQ+" and ";
		}
		URLParam=URLParam+paramImporteHasta;
		URLParamQ=URLParamQ+paramImporteHasta;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'importe' )+" "+$.i18n( 'hasta:' )+'</span>'+" "+importeHasta;
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
		URLParam=URLParam.replace("=="," like ");
	while (URLParam.indexOf("%")>=0)
		URLParam=URLParam.replace("%","*");
	
	var urlBuscar;
	if(URLParamQ!="") 
	{
		urlBuscar = subvencionURL+'?q='+URLParamQ;
	}else{
		urlBuscar = subvencionURL;
	}
	var table = $('#tablaBeneficiarios').DataTable();
	table.ajax.url( dameURL(urlBuscar) ).load(null, false);
	
	if(logDebugBusquedaBeneficiarios)
	{
		console.log("fin de busqueda");
		console.log(urlBuscar);
	}
	$('#panelFichaBeneficiarios').hide();

	
	beneficiariosSumImporte=new Array();
	var jqxhr = $.getJSON(dameURL(queryGraficoBusquedaSumImporteBeneficiarios+URLParam)).done(function( data ) 
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
						beneficiario.sumImporte=data.records[i][0];
						beneficiario.adjudicatarioId=data.records[i][1];
						beneficiario.adjudicatarioTitle=data.records[i][2].substring(0, 30);
						beneficiario.adjudicatarioTitleCompleto=data.records[i][2];
						beneficiariosSumImporte.push(beneficiario);
					}

					var importe=numeral(data.records[i][0]);
					htmlContent = htmlContent + "<tr>" + "<td>" + data.records[i][2].toString() + "</td>" + "<td>" + importe.format(numFormato) + "</td>" + "</tr>";
				}
				htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos('datos_benInfIzq')\">Mostar/Ocultar datos</button></div></div>";
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
	var jqxhr = $.getJSON(dameURL(queryGraficoBusquedaNumSubvencionesBeneficiarios+URLParam)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			var beneficiarioCadena=$.i18n( 'beneficiario' );
			var numeroSubvencionesCadena=$.i18n( 'numero_subvenciones' );
			var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+beneficiarioCadena+"</th><th>"+numeroSubvencionesCadena+"</th></tr>";
			for (var i = 0; i < data.records.length; i++) 
			{
				if(i < resgistroGráficos)
				{
					var beneficiario=new Object();
					beneficiario.sumImporte=data.records[i][0];
					beneficiario.adjudicatarioId=data.records[i][1];
					beneficiario.adjudicatarioTitle=data.records[i][2].substring(0, 30);
					beneficiario.adjudicatarioTitleCompleto=data.records[i][2];
					beneficiariosNumSubvenciones.push(beneficiario);
				}

				var conteo=numeral(data.records[i][0]);
				htmlContent = htmlContent + "<tr>" + "<td>" + data.records[i][2].toString() + "</td>" + "<td>" + conteo.format(numFormato) + "</td>" + "</tr>";
			}
			htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos('datos_benInfDer')\">Mostar/Ocultar datos</button></div></div>";
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

/*
	Función para crear el gráfico superior izquierda
*/
function pintaGraficoSuperiorIzquierda(sumSubvencionesBeneficiarios){
	if(logDebugBusquedaBeneficiarios)
	{
		console.log("pintaGraficoSuperiorIzquierda");
	}

	var chart = AmCharts.makeChart("chartGeneralSuperiorIzquierda", 
	{
		type: "serial",
		rotate: true,
		dataProvider: sumSubvencionesBeneficiarios,
		decimalSeparator: ",",
		thousandsSeparator: ".",
		categoryField: "adjudicatarioTitle",
		categoryAxis: 
		{
			"labelsEnabled": true
		},
		graphs: 
		[{
			"balloonFunction": function( item, content ) 
			{				  
				var html = item.dataContext.adjudicatarioTitleCompleto+"\n"+item.dataContext.sumSubvenciones.toLocaleString('es-ES',{ style: 'currency', currency: 'EUR' });				  
				return html;
			},
			"cornerRadiusTop": 3,
			"fillAlphas": 1,
			"lineColor": "#006AA0",
			"type": "column",
			"valueField": "sumSubvenciones"
		}],
		autoMarginOffset: 0,
		marginBottom: 0,
		marginLeft: 0,
		marginRight: 0,
		marginTop: 0,
		
	});
	
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

	var chart = AmCharts.makeChart("chartGeneralSuperiorDerecha", 
	{
		type: "serial",
		rotate: true,
		dataProvider: numSubvencionesBeneficiarios,
		decimalSeparator: ",",
		thousandsSeparator: ".",
		categoryField: "adjudicatarioTitle",
		categoryAxis: 
		{
			"labelsEnabled": true
		},
		graphs: 
		[{
			"balloonText": "[[adjudicatarioTitleCompleto]]\n[[numSubvenciones]]",
			"cornerRadiusTop": 3,
			"fillAlphas": 1,
			"lineColor": "#006AA0",
			"type": "column",
			"valueField": "numSubvenciones"
		}],
		autoMarginOffset: 0,
		marginBottom: 0,
		marginLeft: 0,
		marginRight: 0,
		marginTop: 0,
		
	});
}

/*
	Función para crear el gráfico inferior izquierda
*/
function pintaGraficoInferiorIzquierda(sumSubvencionesBeneficiarios,width)
{
	if(logDebugBusquedaBeneficiarios)
	{
		console.log("pintaGraficoInferiorIzquierda "+width);
	}

	var labels = true;
	if (width<700)
	{
		labels=false;
	}
	
	AmCharts.makeChart("graficoInferiorIzquierda", 
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
	
	var cachito = (5 / 100) * $( document ).height();
	$('#iframeBusquedaBeneficiarios', window.parent.document).height($( document ).height()+cachito);
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
	
	AmCharts.makeChart("chartInferiorDerecha", 
	{
		type: "serial",
		rotate: true,
		dataProvider: numSubvencionesBeneficiarios,
		decimalSeparator: ",",
		thousandsSeparator: ".",
		categoryField: "adjudicatarioTitle",
		categoryAxis: 
		{
			"labelsEnabled": labels
		},
		graphs: 
		[{
			"balloonText": "[[adjudicatarioTitleCompleto]]\n[[sumImporte]]",
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
	
	var cachito = (5 / 100) * $( document ).height();
	$('#iframeBusquedaBeneficiarios', window.parent.document).height($( document ).height()+cachito);
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

	var heightFisrt = $('#'+capa).height();
	$('#'+capa).toggle();
	var heightSecond = $('#'+capa).height();

	var isVisible = $('#'+capa).is(':visible');
	if (isVisible === true) 
	{
		var cachito = (5 / 100) * $( document ).height();
		$('#iframeBusquedaBeneficiarios', window.parent.document).height($( document ).height()+cachito);
	}else
	{
		var height = $( document ).height()-(heightFisrt-heightSecond);
		$("#iframeBusquedaBeneficiarios", window.parent.document).height(height);
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
	$("#selectAnyo").val("");
	$("#desde").val("");
	$("#hasta").val("");
	$("#importeDesde").val("");
	$("#importeHasta").val("");
	
	$('#panelFichaBeneficiarios').hide();
	$("#lineaGraficosBusquedaBen").hide();
	$(".table-responsive").hide();
}