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
var paramAreaId;
var organizaciones=new Array();

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
	obtieneOrganizaciones(queryIniOrganization);
	
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
	paramId = getUrlVars()["id"];
	if(paramId!=undefined)
	{
		paramId = decodeURI(paramId);
	}
	paramAreaId = getUrlVars()["areaId"];
	if(paramAreaId!=undefined)
	{
		paramAreaId = decodeURI(paramAreaId);
	}
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
					obtieneDatosFicha(paramId,paramAreaId);
					preparaTablaFichaSubvenciones(paramId, paramAreaId);
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
	Función que inicializa los datos de la ficha
*/
function obtieneDatosFicha( id, areaid )
{
	if(logDebugFichaSubvenciones)
	{
		console.log("obtieneDatosFicha");
	}
	
	$.getJSON(dameURL(queryFichaIndicadorNumSubvenciones_1+id+queryFichaIndicadorNumSubvenciones_2)).done(function( data ) 
	{
		var subvencionesNum=numeral(data.records[0].numero);
		$('#fichaBeneficiariosNum').html(subvencionesNum.format());	
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});

	$.getJSON(dameURL(queryFichaIndicadorSumSubvenciones_1+id)).done(function( data ) 
	{
		var subvencionesSuma=numeral(data.records[0].importeTotalConcedido);
		$('#fichaSubvencionesSuma').html(subvencionesSuma.format(importeFormatoSinDecimales,Math.ceil));
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});

	$.getJSON(dameURL(queryTablaFichaSubvencionAdj+id+queryTablaFichaSubvencionAdj_2)).done(function( data ) 
	{
		pintaGrafico(data.records);
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	});

	$.getJSON(dameURL(queryTablaFichaSubvenciones_1+id+queryTablaFichaSubvenciones_2)).done(function( data ) 
	{
		if(data.records[0].title!=undefined)
		{
			$('#titleSubvencion').append(data.records[0].title);
		}
		if(data.records[0].entidadFinanciadoraId!=undefined)
		{
			$('#datos_ficha_convocatorias').append('<p><b>'+$.i18n( 'entidad_financiadora' )+':</b> '+organizaciones[data.records[0].entidadFinanciadoraId]+'</p>');
		}
		if(data.records[0].areaId!=undefined)
		{
			$('#datos_ficha_convocatorias').append('<p><b>'+$.i18n( 'area' )+':</b> '+organizaciones[data.records[0].areaId]+'</p>');
		}
		if(data.records[0].servicioId!=undefined)
		{
			$('#datos_ficha_convocatorias').append('<p><b>'+$.i18n( 'servicio' )+':</b> '+organizaciones[data.records[0].servicioId]+'</p>');
		}
		if(data.records[0].title!=undefined)
		{
			$('#datos_ficha_convocatorias').append('<p><b>'+$.i18n( 'tipo_instrumento' )+':</b> '+etiquetasTipoInstrumento.get(data.records[0].tipoInstrumento)+'</p>');
		}
		if(data.records[0].tipoProcedimiento!=undefined)
		{
			$('#datos_ficha_convocatorias').append('<p><b>'+$.i18n( 'tipo_procedimiento' )+':</b> '+etiquetasTipoProcedimiento.get(data.records[0].tipoProcedimiento)+'</p>');
		}
		if(data.records[0].nominativa!=undefined)
		{
			$('#datos_ficha_convocatorias').append('<p><b>'+$.i18n( 'nominativa' )+':</b> '+etiquetasSiNo.get(data.records[0].nominativa.toString())+'</p>');
		}
		if(data.records[0].objeto!=undefined)
		{
			$('#datos_ficha_convocatorias').append('<p><b>'+$.i18n( 'finalidad' )+': </b> '+data.records[0].objeto+'</p>');
		}
		if(data.records[0].instrumentaTitle!=undefined)
		{
			$('#datos_ficha_convocatorias').append('<p><b>'+$.i18n( 'convenio' )+': </b> '+data.records[0].instrumentaTitle+'</p>');
		}
		if(data.records[0].fechaAcuerdo!=undefined)
		{
			$('#datos_ficha_convocatorias').append('<p><b>'+$.i18n( 'fecha_acuerdo' )+': </b> '+(Date.parse(data.records[0].fechaAcuerdo)).toString('dd-MM-yyyy')+'</p>');
		}
		if(data.records[0].clasificacionPrograma!=undefined)
		{
			$('#datos_ficha_convocatorias').append('<p><b>'+$.i18n( 'clasificacionPrograma' )+': </b> '+data.records[0].clasificacionPrograma+'</p>');
		}
		if(data.records[0].clasificacionEconomicaGasto!=undefined)
		{
			$('#datos_ficha_convocatorias').append('<p><b>'+$.i18n( 'clasificacionEconomicaGasto' )+': </b> '+data.records[0].clasificacionEconomicaGasto+'</p>');
		}
		if(data.records[0].basesReguladoras!=undefined)
		{
			$('#datos_ficha_convocatorias').append('<p><b>'+$.i18n( 'base_reguladora' )+': </b> <a id="urlBaseReguladora" text-overflow: "" href='+data.records[0].basesReguladoras+' target="_blank">'+$.i18n( 'pulse_aqui' )+'</a></p>');
		}
		if(data.records[0].importeTotalConcedido!=undefined)
		{
			$('#datos_ficha_convocatorias').append('<p><b>'+$.i18n( 'importe_total_concedido' )+': </b> '+(numeral(data.records[0].importeTotalConcedido)).format(importeFormato,Math.ceil)+'</p>');
		}


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
function preparaTablaFichaSubvenciones(id,areaId)
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

	nombreBeneficiarioCadena=$.i18n( 'nombre_del_beneficiario' );
	identificadorBeneficiarioCadena=$.i18n( 'dni_cif' );
	tipoEntidadCadena=$.i18n( 'tipo' );
	fechaCadena=$.i18n( 'fecha_adjudicacion' );
	importeCadena=$.i18n( 'importe_concedido' );
	copyCadena=$.i18n( 'copiar' );
	
	cabecerasTablaSubvenciones=	"<th>"+nombreBeneficiarioCadena+"</th><th>"+identificadorBeneficiarioCadena+"</th><th>"+tipoEntidadCadena+"</th><th>"+fechaCadena+"</th><th>"+importeCadena+"</th>";	
	
	var urlLanguaje = "vendor/datatables/i18n/"+$.i18n().locale+".json";
	
	$('#tablaFichaSubvencionesTHead').empty();
	$('#tablaFichaSubvencionesTHead').append(cabecerasTablaSubvenciones);

	var table = $('#tablaFichaSubvenciones').DataTable();
	table.destroy();
	
	$('#tablaFichaSubvenciones').DataTable(
	{
		"processing": true,
		"serverSide": true,
		"paging": true,
		"searching": false,
		"order": [[4, "desc" ]],
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
			"url": dameURL(queryTablaFichaSubvencionAdj+id),
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
				var actualPage;
				newD.pageSize = d.length;
				if(d.length!=0){
					actualPage=(d.start/d.length);
				}else{
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

		"columns":  
		[
			{'data': null , 'render': function(data,type,row) {return (organizaciones[data.beneficiario]);}, "title": nombreBeneficiarioCadena, 'name':'beneficiario'},
			{'data': 'beneficiario', "title": identificadorBeneficiarioCadena, 'name':'beneficiario'},
			{'data': null, 'render': function(data,type,row) {return (dameTipoEntidad(data.beneficiario));}, "title": tipoEntidadCadena, 'name':'beneficiario' },
			{'data': null, 'render': function(data,type,row) {return (Date.parse(data.fechaConcesion)).toString('dd-MM-yyyy');}, "title": fechaCadena, 'name':'fechaConcesion' },
			// {'data': null, 'render': function(data,type,row) {return (numeral(data.importeConcedido)).format(importeFormato,Math.ceil);}, "title": importeCadena, 'name':'importeConcedido' },
			{'data': null, 'render': function(data,type,row) {var num = $.fn.dataTable.render.number(".", ",", 2, '', '€').display(data.importeConcedido); return num;}, "title": importeCadena, 'name':'importeConcedido' },
		],
		dom: '<"row"<"col-sm-6"fi><"col-sm-6"p>>rt<"row"<"col-sm-6"fiB><"col-sm-6"p>>',
		buttons: 
		[				
			{
				extend: 'csv',
				text: 'CSV <span class="fa fa-table"></span>',
				className: 'btn btn-primary',				
				bom: true,
				fieldSeparator: ';',
				fieldBoundary: ''
			},
			{
				text: 'JSON <span class="fa fa-list-alt "></span>',
				className: 'btn btn-primary',
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
			},
			{
				text: 'PDF <span class="fa fa-file-pdf-o"></span>',
				className: 'btn btn-primary',
				extend: 'pdfHtml5',
					filename: 'ficha_convocatoria',
					orientation: 'landscape',
					pageSize: 'A4',
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
										text: ['Ficha de convocatoria de subvenciones']
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
			},								
		]
	});

	//Esta linea es para que no haya warnings en dataTables
	$.fn.dataTable.ext.errMode = 'none';
	
}


/*
Función que crear el gráfico de la ficha
*/
function pintaGrafico(beneficiarios)
{
	if(logDebugFichaSubvenciones)
	{
		console.log("pintaGraficoDistribuciónBeneficiarios");
	}
	
	var datosBen=new Array();
	for (var i=0;i<beneficiarios.length;i++)
	{
		var celda=new Object();
		celda.importe=beneficiarios[i].importeConcedido;			
		celda.adjudicatarioTitle=beneficiarios[i].beneficiario;
		datosBen.push(celda);
	}

	am4core.useTheme(am4themes_frozen);
	am4core.useTheme(am4themes_animated);
	
	var chart = am4core.create("chartdiv", am4charts.XYChart);

	chart.data = datosBen;
	chart.language.locale._decimalSeparator= ",";
	chart.language.locale._thousandSeparator= ".";
	// chart.language.locale = am4lang_es_ES;

	var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
	categoryAxis.dataFields.category = "adjudicatarioTitle";
	categoryAxis.renderer.grid.template.location = 0;
	categoryAxis.renderer.minGridDistance = 1;

	categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) {
		if (target.dataItem && target.dataItem.index & 2 == 2) {
		  return dy + 25;
		}
		return dy;
	});

	chart.yAxes.push(new am4charts.ValueAxis());

	var series = chart.series.push(new am4charts.ColumnSeries());
	series.dataFields.valueY = "importe";
	series.dataFields.categoryX = "adjudicatarioTitle";
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