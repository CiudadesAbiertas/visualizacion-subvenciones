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

var paramId;
var paramAdjudicatarioTitle;
var paramAdjudicatarioId;
var organizaciones=new Array();
var convocatorias=new Array();

/*
	Función de inicialización del script
*/
function inicializaFichaBeneficiarios()
{
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
			obtieneOrganizaciones(queryIniOrganization);
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
	obtieneDatosFicha(paramId,paramAdjudicatarioId);
	preparaTablaFichaBeneficiarios(paramAdjudicatarioId);
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

	paramId = getUrlVars()["id"];
	if(paramId!=undefined)
	{
		paramId = decodeURI(paramId);
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
function obtieneDatosFicha( id,adjudicatarioId )
{
	if(logDebugFichaBeneficiarios)
	{
		console.log("obtieneDatosFicha");
	}
	
	var jqxhr = $.getJSON(dameURL(queryFichaIndicadorSumImporteBeneficiarios_1+adjudicatarioId+queryFichaIndicadorSumImporteBeneficiarios_2)).done(function( data ) 
	{
		var subvencionesSuma=numeral(data.records[0].suma);
		$('#fichaBeneficiariosSuma').html(subvencionesSuma.format(importeFormatoSinDecimales,Math.ceil));	
	}).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});
	
	jqxhr = $.getJSON(dameURL(queryFichaIndicadorNumSubvencionesBeneficiarios_1+adjudicatarioId+queryFichaIndicadorNumSubvencionesBeneficiarios_2)).done(function( data ) 
	{
		var subvencionesNum=numeral(data.records[0].numero);
		$('#fichaBeneficiariosNum').html(subvencionesNum.format());	
	}).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});
	
	jqxhr = $.getJSON(dameURL(queryTablaFichaBeneficiariosId+id)).done(function( data ) 
	{
		
		if(data.records[0].beneficiario!=undefined)
		{
			$('#titleBeneficiario').append(organizaciones[data.records[0].beneficiario]);
		}
		if(data.records[0].beneficiario!=undefined)
		{
			$('#datos_ficha_beneficiarios').append('<p><b>'+$.i18n( 'identificador_del_beneficiario' )+':</b> '+data.records[0].beneficiario+'</p>');
		}
		if(data.records[0].beneficiario!=undefined)
		{
			$('#datos_ficha_beneficiarios').append('<p><b>'+$.i18n( 'tipo' )+':</b> '+dameTipoEntidad(data.records[0].beneficiario)+'</p>');
		 
		}
	}).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});
	
	jqxhr = $.getJSON(dameURL(queryFichaGraficoSumImporteBeneficiarioAnyo_1+adjudicatarioId+queryFichaGraficoSumImporteBeneficiarioAnyo_2)).done(function( data ) 
	{
		pintaGrafico(data.records);
	}).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});
}

/*
	Función que inicializa la tabla de la ficha
*/
function preparaTablaFichaBeneficiarios(adjudicatarioId)
{
	if(logDebugFichaBeneficiarios)
	{
		console.log("preparaTablaFichaBeneficiarios");
		console.log(queryTablaFichaBeneficiariosAdj+adjudicatarioId);
	}
	
	var cabecerastablaBeneficiarios="";
	var convocatoriaCadena="";
	var fechaCadena="";
	var importeCadena="";
	var copyCadena="";
	
	var identificadorCadena=$.i18n( 'identificador' );
	convocatoriaCadena=$.i18n( 'convocatoria' );
	fechaCadena=$.i18n( 'fecha_acuerdo' );
	importeCadena=$.i18n( 'importe_total_concedido' );
	copyCadena=$.i18n( 'copiar' );
	
	cabecerastablaBeneficiarios="<th>"+identificadorCadena+"</th><th>"+convocatoriaCadena+"</th><th>"+fechaCadena+"</th><th>"+importeCadena+"</th>";	
	
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
			"url": dameURL(queryTablaFichaBeneficiariosAdj+adjudicatarioId),
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
				var actualPage;
				if(d.length!=0)
				{
					actualPage=(d.start/d.length);
				}else
				{
					actualPage=1;
				}
				newD.page=(actualPage+1);
				
				var order='fechaConcesion';
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
		"order": [3, 'desc'], 
		"columns":  
		[
			{'data': 'convocatoria' , "title": identificadorCadena, 'name':'identificador', "width": "100px"},
			{'data': null, 'render': function(data,type,row) {return convocatorias[data.convocatoria];}, "title": convocatoriaCadena , 'name':'beneficiario', "width": "50px"},
			{'data': null, 'render': function(data,type,row) {return (Date.parse(data.fechaConcesion)).toString('dd-MM-yyyy');}, "title": fechaCadena , 'name':'fechaConcesion', "width": "50px"},
			// {'data': null, 'render': function(data,type,row) {return (numeral(data.importeConcedido)).format(importeFormato,Math.ceil);}, "title": importeCadena, 'name':'importeConcedido', "width": "50px"},
			{'data': null, 'render': function(data,type,row) {var num = $.fn.dataTable.render.number(".", ",", 2, '', '€').display(data.importeConcedido); return num;}, "title": importeCadena, 'name':'importeConcedido', "width": "50px"},
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
				bom: true,
				fieldSeparator: ';',
				fieldBoundary: ''
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
					filename: 'ficha_beneficiario',
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
									},
									{
										alignment: 'center',
										fontSize: '14',
										text: ['Ficha de beneficiario de subvenciónes']
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
function pintaGrafico(beneficiarios)
{
	if(logDebugFichaBeneficiarios)
	{
		console.log("pintaGraficoSumImporteSubvencionesAnyo");
	}
	
	var datosSub=new Array();
	for (var i=0;i<beneficiarios.length;i++)
	{
		var celda=new Object();
		celda.importe=beneficiarios[i].suma;			
		celda.anyo=beneficiarios[i].anyo;
		datosSub.push(celda);
	}

	am4core.useTheme(am4themes_frozen);
	am4core.useTheme(am4themes_animated);
	
	var chart = am4core.create("chartdiv", am4charts.XYChart);

	chart.data = datosSub;
	chart.language.locale._decimalSeparator= ",";
	chart.language.locale._thousandSeparator= ".";
	// chart.language.locale = am4lang_es_ES;

	var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
	categoryAxis.dataFields.category = "anyo";
	categoryAxis.sortBySeries = series;
	categoryAxis.renderer.inversed = true;
	categoryAxis.renderer.grid.template.location = 0;
	categoryAxis.renderer.minGridDistance = 1;

	chart.yAxes.push(new am4charts.ValueAxis());

	var series = chart.series.push(new am4charts.ColumnSeries());
	series.dataFields.valueY = "importe";
	series.dataFields.categoryX = "anyo";
	series.name = $.i18n( 'Importe' );
	series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
	series.columns.template.fillOpacity = .8;

	var columnTemplate = series.columns.template;
	columnTemplate.strokeWidth = 2;
	columnTemplate.strokeOpacity = 1;

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
					obtieneConvocatorias(convocatoriaURL);
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

function obtieneConvocatorias(url)
{
	$.getJSON(dameURL(url)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			for (var i = 0; i < data.records.length; i++) 
			{
				convocatorias[data.records[i].id]=data.records[i].title;
			}
			if(data.next!=undefined)
			{
				obtieneConvocatorias(data.next);
			}
			else {
				inicializaDatosFichaBeneficiarios();
			}
		}else
		{
			console.log( msgErrorAPIResVacio );
		}
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});
}