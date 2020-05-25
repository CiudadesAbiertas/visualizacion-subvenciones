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
var paramAdjudicatarioTitle = undefined;
var paramAdjudicatarioId = undefined;

/*
	Función de inicialización del script
*/
function inicializaFichaBeneficiarios(){
	if(logDebugFichaBeneficiarios)
	{
		console.log("inicializaFichaBeneficiarios");
	}
	
	inicializaMultidiomaFichaBeneficiarios();
}

/*
	Función para inicializar el multidioma
*/
function inicializaMultidiomaFichaBeneficiarios()
{
	if(logDebugFichaBeneficiarios)
	{
		console.log("inicializaMultidiomaFichaBeneficiarios");
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
		$.i18n().load( {
			en: './dist/i18n/en.json',
			es: './dist/i18n/es.json',
			gl: './dist/i18n/gl.json'
		}).done(function() 
		{
			$('html').i18n();
			inicializaDatosFichaBeneficiarios();
		});

	});
	
	// Enable debug
	$.i18n.debug = logDebugFichaBeneficiarios;
}

/*
	Función que iniciliza los datos de los indicadores que dependen de la API
*/
function inicializaDatosFichaBeneficiarios()
{
	if(logDebugFichaBeneficiarios)
	{
		console.log("inicializaDatosFichaBeneficiarios");
	}
	
	capturaParam();
	obtieneDatosFicha(paramAdjudicatarioTitle,paramAdjudicatarioId);
	preparaTablaFichaBeneficiarios(paramAdjudicatarioTitle, paramAdjudicatarioId);
}

/*
	Función que captura los parámetros de la web
*/
function capturaParam()
{
	if(logDebugFichaBeneficiarios)
	{
		console.log("capturaParam");
	}

	paramAdjudicatarioTitle = getUrlVars()["nombre"];
	if(paramAdjudicatarioTitle!=undefined)
	{
		paramAdjudicatarioTitle = decodeURI(paramAdjudicatarioTitle);
	}
	paramAdjudicatarioId = getUrlVars()["dnicif"];
	if(paramAdjudicatarioId!=undefined)
	{
		paramAdjudicatarioId = decodeURI(paramAdjudicatarioId);
	}
}

/*
	Función que inicializa los datos de la ficha
*/
function obtieneDatosFicha( adjudicatarioTitle,adjudicatarioId )
{
	if(logDebugFichaBeneficiarios)
	{
		console.log("obtieneDatosFicha");
	}
	
	var jqxhr = $.getJSON(dameURL(queryFichaIndicadorSumImporteBeneficiarios_1+adjudicatarioId+queryFichaIndicadorSumImporteBeneficiarios_2)).done(function( data ) 
	{
		var subvencionesSuma=numeral(data.records[0]);
		$('#fichaBeneficiariosSuma').html(subvencionesSuma.format(importeFormatoSinDecimales,Math.ceil));	
	}).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});
	
	jqxhr = $.getJSON(dameURL(queryFichaIndicadorNumSubvencionesBeneficiarios_1+adjudicatarioId+queryFichaIndicadorNumSubvencionesBeneficiarios_2)).done(function( data ) 
	{
		var subvencionesNum=numeral(data.records[0]);
		$('#fichaBeneficiariosNum').html(subvencionesNum.format());	
	}).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});
	
	jqxhr = $.getJSON(dameURL(queryTablaFichaBeneficiarios+adjudicatarioId)).done(function( data ) 
	{
		$('#datos_ficha_beneficiarios').append('<p><b>'+data.records[0].adjudicatarioTitle+'</b></p>');
		$('#datos_ficha_beneficiarios').append('<p><b>'+$.i18n( 'identificador_del_beneficiario' )+':</b> '+data.records[0].adjudicatarioId+'</p>');
		$('#datos_ficha_beneficiarios').append('<p><b>'+$.i18n( 'tipo' )+':</b> '+dameTipoEntidad(data.records[0].adjudicatarioId)+'</p>');
		$('#datos_ficha_beneficiarios').append('<p><b>'+$.i18n( 'fecha_adjudicacion' )+':</b> '+(Date.parse(data.records[0].fechaAdjudicacion)).toString('dd-MM-yyyy')+'</p>');
		$('#datos_ficha_beneficiarios').append('<p><b>'+$.i18n( 'importe_concedido' )+':</b> '+(numeral(data.records[0].importe)).format(importeFormato,Math.ceil)+'</p>');
		
		$('#datos_ficha_beneficiarios').append('<p><b>'+$.i18n( 'subvencion' )+':</b> '+data.records[0].title+'</p>');
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});
	
	jqxhr = $.getJSON(dameURL(queryFichaGraficoSumImporteBeneficiarioAnyo_1+adjudicatarioId+queryFichaGraficoSumImporteBeneficiarioAnyo_2)).done(function( data ) 
	{
		pintaGraficoSumImporteSubvencionesAnyo(data.records);
	}).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});
}

/*
	Función que inicializa la tabla de la ficha
*/
function preparaTablaFichaBeneficiarios(adjudicatarioTitle,adjudicatarioId)
{
	if(logDebugFichaBeneficiarios)
	{
		console.log("preparaTablaFichaBeneficiarios");
	}
	
	var cabecerastablaBeneficiarios="";
	var nombreCadena="";
	var nombreAreaCadena="";
	var fechaCadena="";
	var importeCadena="";
	var copyCadena="";
	
	nombreCadena=$.i18n( 'subvencion' );
	nombreAreaCadena=$.i18n( 'area' );
	fechaCadena=$.i18n( 'fecha_adjudicacion' );
	importeCadena=$.i18n( 'importe_concedido' );
	copyCadena=$.i18n( 'copiar' );
	
	cabecerastablaBeneficiarios="<th>"+nombreCadena+"</th><th>"+nombreAreaCadena+"</th><th>"+fechaCadena+"</th><th>"+importeCadena+"</th>";	
	
	var urlLanguaje = "vendor/datatables/i18n/"+$.i18n().locale+".json";
	
	$('#tablaFichaBeneficiariosTHead').empty();
	$('#tablaFichaBeneficiariosTHead').append(cabecerastablaBeneficiarios);

	var table = $('#tablaFichaBeneficiarios').DataTable();
	table.destroy();
	
	tablaFichaBeneficiarios=$('#tablaFichaBeneficiarios').DataTable(
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
			"url": dameURL(queryTablaFichaBeneficiarios+adjudicatarioId),
			"dataSrc": function ( data ) 
			{						
				var total=data.totalRecords;
				data.recordsTotal=total;
				data.recordsFiltered=total;
				
				return data.records;
			},
			"data": function ( d ) 
			{
				var newD = new Object();
				newD.pageSize = d.length;
				if(d.length!=0)
				{
					actualPage=(d.start/d.length)
				}else
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
					}else
					{
						newD.sort = '-'+dataColumnaSeleccionada;
					}
				}
				
				return newD;
			}
		},
		"order": [2, 'asc'],
		"columns":  
		[
			{'data': 'title' , "title": nombreCadena, 'name':'title'},
			{'data': 'areaTitle', "title": nombreAreaCadena, 'name':'areaTitle'},
			{'data': null, 'render': function(data,type,row) {return (Date.parse(data.fechaAdjudicacion)).toString('dd-MM-yyyy')}, "title": fechaCadena , 'name':'fechaAdjudicacion'},
			{'data': null, 'render': function(data,type,row) {return (numeral(data.importe)).format(importeFormato,Math.ceil)}, "title": importeCadena, 'name':'importe'},
		],
		dom: '<"row"<"col-sm-6"fi><"col-sm-6"p>>rt<"row"<"col-sm-6"fiB><"col-sm-6"p>>',
		buttons: 
		[				
			{
				extend: 'csv',
				text: 'CSV <span class="fa fa-table"></span>',
				className: 'btn btn-primary',				
				exportOptions: 
				{
					columns: ':visible',
					search: 'applied',
					order: 'applied'
				},
				bom: true
			},
			{
				text: 'JSON <span class="fa fa-list-alt "></span>',
				className: 'btn btn-primary',
				exportOptions: 
				{
					columns: ':visible',
					search: 'applied',
					order: 'applied'
				},
				action: function ( e, dt, button, config )
				{
					var data = dt.buttons.exportData();
 
					$.fn.dataTable.fileSave(
						new Blob( [ JSON.stringify( data ) ] ),
						'beneficiarios.json'
					);
				}
			},
			{
				extend: 'excel',
				text: 'EXCEL <span class="fa fa-file-excel-o"></span>',
				className: 'btn btn-primary',				
				exportOptions: 
				{
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
					pageSize: 'A4', //A3 , A5 , A6 , legal , letter
					exportOptions: {
						columns: ':visible',
						search: 'applied',
						order: 'applied'
					},
					customize: function (doc) 
					{
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
				exportOptions: 
				{
					columns: ':visible',
					search: 'applied',
					order: 'applied'
				},
			},								
		]
	});
	
	var sortedCol = $('#tablaFichaBeneficiarios').dataTable().fnSettings().aaSorting[0][0];
	var sortedDir = $('#tablaFichaBeneficiarios').dataTable().fnSettings().aaSorting[0][1];
	
	//Esta linea es para que no haya warnings en dataTables
	$.fn.dataTable.ext.errMode = 'none';
	
}

/*
	Función que crear el gráfico de la ficha
*/
function pintaGraficoSumImporteSubvencionesAnyo(beneficiarios)
{
	if(logDebugFichaBeneficiarios)
	{
		console.log("pintaGraficoSumImporteSubvencionesAnyo");
	}
	
	var datosSub=new Array();
	for (var i=0;i<beneficiarios.length;i++)
	{
		var celda=new Object();
		celda.importe=beneficiarios[i][0];			
		celda.anyo=beneficiarios[i][1];
		datosSub.push(celda);
	}

	AmCharts.makeChart("chartDistribucionSubvenciones", 
	{
		type: "serial",
		dataProvider: datosSub,
		categoryField: "anyo",
		categoryAxis: 
		{
			"labelsEnabled": true,
			title: $.i18n( 'anyos' )
		},
		valueAxes: [
		{
			"title": $.i18n( 'Importe' )
		}],
		graphs: 
		[{
			"balloonFunction": function( item, content ) 
			{				  
				var html = item.dataContext.importe.toLocaleString('es-ES',{ style: 'currency', currency: 'EUR' });				  
				return html;
			},
			"fillAlphas": 0.9,
			"lineAlpha": 0.2,
			"type": "column",
			"valueField": "importe"
		}],
		"numberFormatter": 
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
	if(logDebugFichaBeneficiarios)
	{
		console.log("volverBusqueda");
	}

	$("#capaInicio", window.parent.document).hide();
	$("#capaSubvenciones", window.parent.document).hide();
	$("#capaBeneficiarios", window.parent.document).show();
	$("#capaAyuda", window.parent.document).hide();
	$("#capaFicha", window.parent.document).hide();
}