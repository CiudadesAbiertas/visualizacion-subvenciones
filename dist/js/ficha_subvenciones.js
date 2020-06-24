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
var paramNombre = undefined;
var paramAreaNombre = undefined;

/*
	Función de inicialización del script
*/
function inicializaFichaSubvenciones()
{
	if(logDebugFichaSubvenciones)
	{
		console.log("inicializaFichaSubvenciones");
	}
	
	inicializaMultidiomaFichaSubvenciones();
}

/*
	Función para inicializar el multidioma
*/
function inicializaMultidiomaFichaSubvenciones()
{
	if(logDebugFichaSubvenciones)
	{
		console.log("inicializaMultidiomaFichaSubvenciones");
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
		$.i18n().load( {
			en: './dist/i18n/en.json',
			es: './dist/i18n/es.json',
			gl: './dist/i18n/gl.json'
		}).done(function() {
			$('html').i18n();
			inicializaDatosFichaSubvenciones();
		});
	});
	
	// Enable debug
	$.i18n.debug = logDebugFichaSubvenciones;
}

/*
	Función que iniciliza los datos que dependen de la API
*/
function inicializaDatosFichaSubvenciones()
{
	if(logDebugFichaSubvenciones)
	{
		console.log("inicializaDatosFichaSubvenciones");
	}
	
	capturaParam();
	obtieneDatosFicha(paramNombre,paramAreaNombre);
	preparaTablaFichaSubvenciones(paramNombre, paramAreaNombre);
}

/*
	Función que captura los parámetros de la web
*/
function capturaParam()
{
	if(logDebugFichaSubvenciones)
	{
		console.log("capturaParam");
	}
	paramNombre = getUrlVars()["nombre"];
	if(paramNombre!=undefined)
	{
		paramNombre = decodeURI(paramNombre);
	}
	paramAreaNombre = getUrlVars()["areaNombre"];
	if(paramAreaNombre!=undefined)
	{
		paramAreaNombre = decodeURI(paramAreaNombre);
	}
}

/*
	Función que inicializa los datos de la ficha
*/
function obtieneDatosFicha( nombre, areaNombre )
{
	if(logDebugFichaSubvenciones)
	{
		console.log("obtieneDatosFicha");
	}
	
	var jqxhr = $.getJSON(dameURL(queryFichaIndicadorNumSubvenciones_1+nombre+queryFichaIndicadorNumSubvenciones_2+areaNombre+queryFichaIndicadorNumSubvenciones_3)).done(function( data ) 
	{
		var subvencionesNum=numeral(data.records[0]);
		$('#fichaBeneficiariosNum').html(subvencionesNum.format());	
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});

	jqxhr = $.getJSON(dameURL(queryFichaIndicadorSumSubvenciones_1+nombre+queryFichaIndicadorSumSubvenciones_2+areaNombre+queryFichaIndicadorNumSubvenciones_3)).done(function( data ) 
	{
		var subvencionesSuma=numeral(data.records[0]);
		$('#fichaSubvencionesSuma').html(subvencionesSuma.format(importeFormatoSinDecimales,Math.ceil));
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});

	jqxhr = $.getJSON(dameURL(queryTablaFichaSubvenciones_1+nombre+queryTablaFichaSubvenciones_2+areaNombre+queryTablaFichaSubvenciones_3)).done(function( data ) 
	{
		$('#datos_ficha_subvenciones').append('<p><b>'+data.records[0].title+'</b></p>');
		$('#datos_ficha_subvenciones').append('<p><b>'+$.i18n( 'entidad_financiadora' )+':</b> '+data.records[0].entidadFinanciadoraTitle+'</p>');
		$('#datos_ficha_subvenciones').append('<p><b>'+$.i18n( 'area' )+':</b> '+data.records[0].areaTitle+'</p>');
		$('#datos_ficha_subvenciones').append('<p><b>'+$.i18n( 'linea_financiacion' )+':</b> '+data.records[0].lineaFinanciacion+'</p>');
		$('#datos_ficha_subvenciones').append('<p><b>'+$.i18n( 'tipo_instrumento' )+':</b> '+data.records[0].tipoInstrumento+'</p>');
		$('#datos_ficha_subvenciones').append('<p><b>'+$.i18n( 'aplicacion_presupuestaria' )+': </b> '+data.records[0].aplicacionPresupuestaria+'</p>');
		$('#datos_ficha_subvenciones').append('<p><b>'+$.i18n( 'base_reguladora' )+': </b> <a id="urlBaseReguladora" text-overflow: "" href='+data.records[0].basesReguladoras+' target="_blank">'+$.i18n( 'pulse_aqui' )+'</a></p>');
		$('#datos_ficha_subvenciones').append('<p><b>'+$.i18n( 'tipo_procedimiento' )+':</b> '+dametipoProcedimiento(data.records[0].tipoProcedimiento)+'</p>');
		$('#datos_ficha_subvenciones').append('<p><b>'+$.i18n( 'nominativa' )+':</b> '+dameSiNo(data.records[0].nominativa.toString())+'</p>');
		pintaGraficoDistribuciónBeneficiarios(data.records);
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});
}

/*
	Función que inicializa la tabla de la ficha
*/
function preparaTablaFichaSubvenciones(nombre,areaNombre)
{
	if(logDebugFichaSubvenciones)
	{
		console.log("preparaTablaFichaSubvenciones");
	}
	
	var cabecerasTablaSubvenciones="";
	var nombreBeneficiarioCadena="";
	var identificadorBeneficiarioCadena="";
	var tipoEntidadCadena="";
	var fechaCadena="";
	var importeCadena="";
	var copyCadena="";
	var entidadFinanciadoraCadena="";
	var lineaFinanciacionCadena="";
	var tipoInstrumentoCadena="";
	var aplicacionPresupuestariaCadena="";

	nombreBeneficiarioCadena=$.i18n( 'nombre_del_beneficiario' );
	identificadorBeneficiarioCadena=$.i18n( 'dni_cif' );
	tipoEntidadCadena=$.i18n( 'tipo' );
	fechaCadena=$.i18n( 'fecha_adjudicacion' );
	importeCadena=$.i18n( 'importe_concedido' );
	copyCadena=$.i18n( 'copiar' );

	nombreSubvencionCadena=$.i18n( 'nombre_subvencion' );
	nombreAreaCadena=$.i18n( 'nombre_area' );
	entidadFinanciadoraCadena=$.i18n( 'entidad_financiadora' );
	lineaFinanciacionCadena=$.i18n( 'linea_financiacion' );
	tipoInstrumentoCadena=$.i18n( 'tipo_instrumento' );
	aplicacionPresupuestariaCadena=$.i18n( 'aplicacion_presupuestaria' );
	
	cabecerasTablaSubvenciones=	"<th>"+nombreBeneficiarioCadena+"</th><th>"+identificadorBeneficiarioCadena+"</th><th>"+tipoEntidadCadena+"</th><th>"+fechaCadena+"</th><th>"+importeCadena+"</th>";	
	
	var urlLanguaje = "vendor/datatables/i18n/"+$.i18n().locale+".json"
	
	$('#tablaFichaSubvencionesTHead').empty();
	$('#tablaFichaSubvencionesTHead').append(cabecerasTablaSubvenciones);

	var table = $('#tablaFichaSubvenciones').DataTable();
	table.destroy();
	
	tablaFichaSubvenciones=$('#tablaFichaSubvenciones').DataTable(
	{
		"processing": true,
		"serverSide": true,
		"paging": true,
		"searching": false,
		"order": [[0, "asc" ]],
		"pageLength": registrosTablabusqueda,
		"language": 
		{
				"url": urlLanguaje,		
		},
		"ajax": 
		{
			"url": dameURL(queryTablaFichaSubvenciones_1+nombre+queryTablaFichaSubvenciones_2+areaNombre),
			"dataSrc": function ( json ) 
			{						
				var total=json.totalRecords;
				json.recordsTotal=total;
				json.recordsFiltered=total;

				return json.records;
			},
			"data": function ( d ) 
			{
				var newD = new Object();
				newD.pageSize = d.length;
				if(d.length!=0){
					actualPage=(d.start/d.length)
				}else{
					actualPage=1;
				}
				newD.page=(actualPage+1);
				
				var order='-importe';
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
		"order": [4, 'desc'],
		"columns":  
		[
			{'data': 'adjudicatarioTitle' , "title": nombreBeneficiarioCadena, 'name':'adjudicatarioTitle'},
			{'data': 'adjudicatarioId', "title": identificadorBeneficiarioCadena, 'name':'adjudicatarioId'},
			{'data': null, 'render': function(data,type,row) {return (dameTipoEntidad(data.adjudicatarioId))}, "title": tipoEntidadCadena, 'name':'adjudicatarioId' },
			{'data': null, 'render': function(data,type,row) {return (Date.parse(data.fechaAdjudicacion)).toString('dd-MM-yyyy')}, "title": fechaCadena, 'name':'fechaAdjudicacion' },
			{'data': null, 'render': function(data,type,row) {return (numeral(data.importe)).format(importeFormato,Math.ceil)}, "title": importeCadena, 'name':'importe' },
			{'data': 'title' , "title": nombreSubvencionCadena, 'name':'title', 'visible': false},
			{'data': 'areaTitle' , "title": nombreAreaCadena, 'name':'areaTitle', 'visible': false},
			{'data': 'entidadFinanciadoraTitle' , "title": entidadFinanciadoraCadena, 'name':'entidadFinanciadoraTitle', 'visible': false},
			{'data': 'lineaFinanciacion' , "title": lineaFinanciacionCadena, 'name':'lineaFinanciacion', 'visible': false},
			{'data': 'tipoInstrumento' , "title": tipoInstrumentoCadena, 'name':'tipoInstrumento', 'visible': false},
			{'data': 'aplicacionPresupuestaria' , "title": aplicacionPresupuestariaCadena, 'name':'aplicacionPresupuestaria', 'visible': false},
		],
		dom: '<"row"<"col-sm-6"fi><"col-sm-6"p>>rt<"row"<"col-sm-6"fiB><"col-sm-6"p>>',
		
		buttons: 
		[				
			{
				extend: 'csv',
				text: 'CSV <span class="fa fa-table"></span>',
				className: 'btn btn-primary',				
				exportOptions: {
					columns: [0,1,2,3,4,5,6,7,8,9,10],
					search: 'applied',
					order: 'applied'
				},
				bom: true
			},
			{
				text: 'JSON <span class="fa fa-list-alt "></span>',
				className: 'btn btn-primary',
				exportOptions: {
					columns: [0,1,2,3,4,5,6,7,8,9,10],
					search: 'applied',
					order: 'applied'
				},
				action: function ( e, dt, button, config ) 
				{
					var data = dt.buttons.exportData();
 
					$.fn.dataTable.fileSave(
						new Blob( [ JSON.stringify( data ) ] ),
						'Subvenciones.json'
					);
				}
			},
			{
				extend: 'excel',
				text: 'EXCEL <span class="fa fa-file-excel-o"></span>',
				className: 'btn btn-primary',				
				exportOptions: {
					columns: [0,1,2,3,4,5,6,7,8,9,10],
					search: 'applied',
					order: 'applied'
				},
			},
			{
				text: 'PDF <span class="fa fa-file-pdf-o"></span>',
				className: 'btn btn-primary',
				extend: 'pdfHtml5',
					filename: 'dt_custom_pdf',
					orientation: 'landscape',
					pageSize: 'A4',
					exportOptions: {
						columns: [0,1,2,3,4,5,6,7,8,9,10],
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
					columns: [0,1,2,3,4,5,6,7,8,9,10],
					search: 'applied',
					order: 'applied'
				},
			},								
		]
	});

	//Esta linea es para que no haya warnings en dataTables
	$.fn.dataTable.ext.errMode = 'none';
	
}

/*
Función que crear el gráfico de la ficha
*/
function pintaGraficoDistribuciónBeneficiarios(beneficiarios)
{
	if(logDebugFichaSubvenciones)
	{
		console.log("pintaGraficoDistribuciónBeneficiarios");
	}
	
	var datosBen=new Array();
	for (var i=0;i<beneficiarios.length;i++)
	{
		var celda=new Object();
		celda.importe=beneficiarios[i].importe;			
		celda.adjudicatarioTitle=beneficiarios[i].adjudicatarioTitle;
		datosBen.push(celda);
	}
	
	AmCharts.makeChart("chartDistribucionBeneficiarios", 
	{
		type: "serial",
		dataProvider: datosBen,
		categoryField: "adjudicatarioTitle",
		categoryAxis: {
			"labelsEnabled": false,
			title: $.i18n( 'beneficiarios' )
		},
		valueAxes: [{
		   unit : "€",                  
		   title: $.i18n( 'Importe' )
		}],

		graphs: [{
			"balloonFunction": function( item, content ) 
			{				  
			  var html = item.dataContext.adjudicatarioTitle+"\n"+item.dataContext.importe.toLocaleString('es-ES',{ style: 'currency', currency: 'EUR' });				  
			  return html;
			},
			"fillAlphas": 0.9,
			"lineAlpha": 0.2,
			"type": "column",
			"valueField": "importe"
		}],
		numberFormatter: 
		{
            "decimalSeparator": ",",
            "thousandsSeparator": "."
        },
		colors: ["#006AA0"]
	});
}

/*
	Función que permite ocultar la ficha
*/
function volverBusqueda()
{
	if(logDebugFichaSubvenciones)
	{
		console.log("volverBusqueda");
	}

	$("#capaInicio", window.parent.document).hide();
	$("#capaSubvenciones", window.parent.document).show();
	$("#capaBeneficiarios", window.parent.document).hide();
	$("#capaAyuda", window.parent.document).hide();
	$("#capaFicha", window.parent.document).hide();
}