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
var peticionesInicialesSub = [false,false,false,false];
var peticionesParamSub = [false,false];

/*
	Función de inicialización del script
*/
function inicializaBusquedaSubvenciones()
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("inicializaBusquedaSubvenciones");
	}
	
	inicializaMultidiomaBusquedaSubvenciones();
}

/*
	Función que invoca a todas las funciones que se realizan al inicializar el script
*/
function inicializaTablaBusquedaSubvenciones()
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("inicializaTablaBusquedaSubvenciones");
	}
	
	inicializaDatos();
	camposFecha();
	preparaTablaSubvenciones(false);			
	$("#lineaGraficosBusquedaSub").hide();
	$(".table-responsive").hide();
	$("#iframeBusquedaSubvenciones", window.parent.document).height(884);
	$( "#buscarListado" ).click(function() 
	{
		buscar()
		this.blur();
	});
	
}

/* 
	Función para inicializar el multidioma
*/
function inicializaMultidiomaBusquedaSubvenciones()
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("inicializaMultidiomaBusquedaSubvenciones");
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
		}
		).done(function() 
		{
			$('html').i18n();
			inicializaTablaBusquedaSubvenciones();
		}
		);
	}
	);
	
	$.i18n.debug = logDebugBusquedasubvenciones;
}

/*
	Función que iniciliza los datos que dependen de la API
*/
function inicializaDatos()
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("inicializaDatos");
	}
	
	var areas=new Array();	
	var mesesConDatos=new Array();
	var areasGasto=new Array();
	var anyos=new Array();
	var importeNombre=new Array();
	var importeArea=new Array();
	var lineaFinanciacion=new Array();
	
	var jqxhr = $.getJSON(dameURL(queryIniAreas)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			for (var i = 0; i < data.records.length; i++) 
			{
				areas.push(data.records[i]);
			}
		}
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() 
	{
		$('#selectNombreArea').empty().append("<option value=''></option>").attr("selected","selected");				
		for (var i=0;i<areas.length;i++)
		{
			if (areas[i].trim()!="")
			{
				$('#selectNombreArea').append("<option value='"+areas[i]+"'>"+areas[i]+"</option>");				
			}
		}
	
		peticionesInicialesSub[0]=true;
		peticionesParamSub[0]=true;
		if(logDebugBusquedasubvenciones)
		{
			console.log("fin peticion 0");
		}
		if (checkBooleanArray(peticionesInicialesSub))
		{			
			modificaTaskMaster("iframeBusquedaSubvenciones");
		}
		if (checkBooleanArray(peticionesParamSub)){
			capturaParam();
		}
	}
	);
	
	anyos=new Array();
	jqxhr = $.getJSON(dameURL(queryIniAnyos)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			for (var i = 0; i < data.records.length; i++) 
			{
				anyos.push(Number(data.records[i]));
			}
		}
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() 
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
		var mySlider = $("#filtroAnyoSub").bootstrapSlider({
			ticks: anyos,
			ticks_labels: anyos,
			value: valorDefecto
		});
		
		mySlider.on('change',function( sliderValue ) 
		{
			filtraGraficos(sliderValue.value.newValue);
		});
		
		filtraGraficos(anyos[anyos.length-1]);
		
		peticionesInicialesSub[1]=true;
		peticionesParamSub[1]=true;
		if(logDebugBusquedasubvenciones)
		{
			console.log("fin peticion 1");
		}
		if (checkBooleanArray(peticionesInicialesSub))
		{			
			modificaTaskMaster("iframeBusquedaSubvenciones");
		}
		if (checkBooleanArray(peticionesParamSub)){
			capturaParam();
		}
	}
	);
	
	lineaFinanciacion=new Array();
	var jqxhr = $.getJSON(dameURL(queryIniLineaFinanciacion)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			for (var i = 0; i < data.records.length; i++) 
			{
				lineaFinanciacion.push(data.records[i]);
			}
		}
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() 
	{
		$('#selectLineaFinanciacion').empty().append("<option value=''></option>").attr("selected","selected");				
		for (var i=0;i<lineaFinanciacion.length;i++)
		{
			if (lineaFinanciacion[i].trim()!="")
			{
				$('#selectLineaFinanciacion').append("<option value='"+lineaFinanciacion[i]+"'>"+lineaFinanciacion[i]+"</option>");				
			}
		}
	
	}
	);
	
	entidadFinanciadora=new Array();
	var jqxhr = $.getJSON(dameURL(queryIniEntidadFinanciadoraTitle)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			for (var i = 0; i < data.records.length; i++) 
			{
				entidadFinanciadora.push(data.records[i]);
			}
		}
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() 
	{
		$('#selectEntidadFinanciadora').empty().append("<option value=''></option>").attr("selected","selected");				
		for (var i=0;i<entidadFinanciadora.length;i++)
		{
			if (entidadFinanciadora[i].trim()!="")
			{
				$('#selectEntidadFinanciadora').append("<option value='"+entidadFinanciadora[i]+"'>"+entidadFinanciadora[i]+"</option>");				
			}
		}
	
	}
	);
	
	tipoInstrumento=new Array();
	var jqxhr = $.getJSON(dameURL(queryIniTipoInstrumento)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			for (var i = 0; i < data.records.length; i++) 
			{
				tipoInstrumento.push(data.records[i]);
			}
		}
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() 
	{
		$('#selectTipoInstrumento').empty().append("<option value=''></option>").attr("selected","selected");				
		for (var i=0;i<tipoInstrumento.length;i++)
		{
			if (tipoInstrumento[i].trim()!="")
			{
				$('#selectTipoInstrumento').append("<option value='"+tipoInstrumento[i]+"'>"+tipoInstrumento[i]+"</option>");				
			}
		}
	
	}
	);

	tipoProcedimiento=new Array();
	var jqxhr = $.getJSON(dameURL(queryIniTipoProcedimiento)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			for (var i = 0; i < data.records.length; i++) 
			{
				tipoProcedimiento.push(data.records[i]);
			}
		}
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() 
	{
		$('#selectTipoProcedimiento').empty().append("<option value=''></option>").attr("selected","selected");				
		for (var i=0;i<tipoProcedimiento.length;i++)
		{
			if (tipoProcedimiento[i].trim()!="")
			{
				$('#selectTipoProcedimiento').append("<option value='"+tipoProcedimiento[i]+"'>"+dametipoProcedimiento(tipoProcedimiento[i])+"</option>");				
			}
		}
	
	}
	);

	nominativa=new Array();
	var jqxhr = $.getJSON(dameURL(queryIniNominativa)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			for (var i = 0; i < data.records.length; i++) 
			{
				nominativa.push(data.records[i]);
			}
		}
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() 
	{
		$('#selectNominativa').empty().append("<option value=''></option>").attr("selected","selected");				
		for (var i=0;i<nominativa.length;i++)
		{
			$('#selectNominativa').append("<option value='"+nominativa[i]+"'>"+dameSiNo(nominativa[i].toString())+"</option>");				
		}
	
	}
	);
}

/*
	Función que comprueba y captura si se han pasado parámetros a la web, en caso de haberlos ejecutará una búsqueda con ellos.
*/
function capturaParam()
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("capturaParam");
	}

	var ejecutarBusqueda=false;
	var paramNombre = getUrlVars()["nombre"];
	if(paramNombre!=undefined)
	{
		$("#buscadorNombre").val(decodeURI(paramNombre));
		ejecutarBusqueda=true;
	}
	var paramAreaNombre = getUrlVars()["areaNombre"];
	if(paramAreaNombre!=undefined)
	{
		$("#selectNombreArea").val(decodeURI(paramAreaNombre));
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
	if(ejecutarBusqueda){
		buscar();
	}
}

/*
	Funcion que filtra los gráficos superiores por el año seleccionado
*/
function filtraGraficos(filtroAnyo)
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("filtraGraficos");
	}
	
	var textoIzq = $.i18n( 'top_50_gasto_area' );
	var textoDer = $.i18n( 'numero_linea_financiacion' );
	$('#cabeceraArribaIzquierda').html(textoIzq+' '+filtroAnyo);
	$('#cabeceraArribaDerecha').html(textoDer+' '+filtroAnyo);
	
	var areasNum=new Array();
	var urlFiltroAnyo="";
	if(filtroAnyo!=undefined && filtroAnyo!='Todos')
	{
		urlFiltroAnyo="&"+paramWhereAPI+"=fechaAdjudicacion>='"+filtroAnyo+"-01-01T00:00:00' and fechaAdjudicacion<='"+filtroAnyo+"-12-31T23:59:59'";
	}	
	var jqxhr = $.getJSON(dameURL(queryGraficoAreasTop10+urlFiltroAnyo)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			var areaCadena=$.i18n( 'area' );
			var numeroSubvecionesCadena=$.i18n( 'numero_subvenciones' );
			var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+areaCadena+"</th><th>"+numeroSubvecionesCadena+"</th></tr>";
			for (var i = 0; i < data.records.length; i++) 
			{
				if(i<resgistroGráficos)
				{
					var areaNum=new Object();
					areaNum.name=data.records[i][0].substring(0, 30);
					areaNum.nameCompleto=data.records[i][0];
					areaNum.value=data.records[i][1];
					areasNum.push(areaNum);
				}
				var valor=numeral(data.records[i][1]);
				htmlContent = htmlContent + "<tr>" + "<td>" + data.records[i][0].toString() + "</td>" + "<td>" + valor.format(numFormato) + "</td>" + "</tr>";
			}
			htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos('datos_subSupIzq')\">Mostar/Ocultar datos</button></div></div>";
			
			$('#datos_subSupIzq').html(htmlContent);
		}
	}
	).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}).always(function() 
	{
		//Pintamos el treemap
		pintaGraficoSuperiorIzquierda(areasNum);

		peticionesInicialesSub[2]=true;
		if(logDebugBusquedasubvenciones)
		{
			console.log("fin peticion 2");
		}
		if (checkBooleanArray(peticionesInicialesSub))
		{			
			modificaTaskMaster("iframeBusquedaSubvenciones");
		}

	});
	
	var lineasnum=new Array();
	jqxhr = $.getJSON(dameURL(queryIniGraficoLineaNum+urlFiltroAnyo)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			var lineaFinanciacionCadena=$.i18n( 'linea_financiacion' );
			var numeroSubvecionesCadena=$.i18n( 'numero_subvenciones' );
			var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+lineaFinanciacionCadena+"</th><th>"+numeroSubvecionesCadena+"</th></tr>";
			for (var i = 0; i < data.records.length; i++) 
			{
				if(i<resgistroGráficos)
				{
					var lineanum=new Object();
					lineanum.linea=data.records[i][0].substring(0, 30);
					lineanum.lineaCompleto=data.records[i][0];
					lineanum.subNum=data.records[i][1];
					lineasnum.push(lineanum);
				}

				var valor=numeral(data.records[i][1]);
				htmlContent = htmlContent + "<tr>" + "<td>" + data.records[i][0].toString() + "</td>" + "<td>" + valor.format(numFormato) + "</td>" + "</tr>";
			}
			htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos('datos_subSupDer')\">Mostar/Ocultar datos</button></div></div>";
			
			$('#datos_subSupDer').html(htmlContent);
		}
	}).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}
	).always(function() 
	{
		//Pintamos la tarta
		pintaGraficoSuperiorDerecha(lineasnum);
		
		peticionesInicialesSub[3]=true;
		if(logDebugBusquedasubvenciones)
		{
			console.log("fin peticion 3");
		}
		if (checkBooleanArray(peticionesInicialesSub))
		{			
			modificaTaskMaster("iframeBusquedaSubvenciones");
		}
	});
	
}

/*
	Función que inicializa los botones de fecha
*/
function camposFecha()
{	
	if(logDebugBusquedasubvenciones)
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
		});
	
	} 
	);
}

/*
	Función que inicializa la tabla de búsqueda
*/
function preparaTablaSubvenciones(segundaPasada)
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("preparaTablaSubvenciones");
	}

	var cabecerasTablaSubvenciones="";
	var fichaCadena="";
	var nombreCadena="";
	var nombreAreaCadena="";
	var copyCadena="";
	var entidadFinanciadoraCadena="";
	var lineaFinanciacionCadena="";
	var tipoInstrumentoCadena="";
	var aplicacionPresupuestariaCadena="";

	fichaCadena=$.i18n( 'ficha' );
	nombreCadena=$.i18n( 'nombre' );
	nombreAreaCadena=$.i18n( 'nombre_area' );
	entidadFinanciadoraCadena=$.i18n( 'entidad_financiadora' );
	lineaFinanciacionCadena=$.i18n( 'linea_financiacion' );
	tipoInstrumentoCadena=$.i18n( 'tipo_instrumento' );
	aplicacionPresupuestariaCadena=$.i18n( 'aplicacion_presupuestaria' );
	
	copyCadena=$.i18n( 'copiar' );
	cabecerasTablaSubvenciones=	"<th>"+fichaCadena+"</th><th>"+nombreCadena+"</th><th>"+nombreAreaCadena+"</th><th>"+entidadFinanciadoraCadena+"</th><th>"+lineaFinanciacionCadena+"</th><th>"+tipoInstrumentoCadena+"</th><th>"+aplicacionPresupuestariaCadena+"</th>";	
	
	var urlLanguaje = "vendor/datatables/i18n/"+$.i18n().locale+".json"
	
	$('#tablaSubvencionesTHead').empty();
	$('#tablaSubvencionesTHead').append(cabecerasTablaSubvenciones);
	
	tablaSubvenciones=$('#tablaSubvenciones').DataTable(
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
						return_data.push({					  
						  'plus' : '',
						  'title' : data.records[i][0],
						  'areaTitle' : data.records[i][1],
						  'entidadFinanciadoraTitle' : data.records[i][2],
						  'lineaFinanciacion' : data.records[i][3],
						  'tipoInstrumento' : data.records[i][4],
						  'aplicacionPresupuestaria' : data.records[i][5]
						})
					}
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
				
				var order='areaTitle';
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
		"order": [2, 'asc'],
		"columns":  
		[
			{'data' : null, 'render': function(data,type,row) {return ('<a aria-label="Abrir ficha" href="'+data.title+'"></a>')}, className:"details-control", orderable: false , "title": fichaCadena, 'name':'Ficha'},
			{'data': 'title' , "title": nombreCadena, 'name':'title'},
			{'data': 'areaTitle' , "title": nombreAreaCadena, 'name':'areaTitle'},
			{'data': 'entidadFinanciadoraTitle' , "title": entidadFinanciadoraCadena, 'name':'entidadFinanciadoraTitle'},
			{'data': 'lineaFinanciacion' , "title": lineaFinanciacionCadena, 'name':'lineaFinanciacion'},
			{'data': 'tipoInstrumento' , "title": tipoInstrumentoCadena, 'name':'tipoInstrumento'},
			{'data': 'aplicacionPresupuestaria' , "title": aplicacionPresupuestariaCadena, 'name':'aplicacionPresupuestaria'},
		],
		dom: '<"row"<"col-sm-6"lfi><"col-sm-6"p>>rt<"row"<"col-sm-6"fiB><"col-sm-6"p>>',
		buttons: 
		[				
			{
				extend: 'csv',
				text: 'CSV <span class="fa fa-table"></span>',
				className: 'btn btn-primary',				
				exportOptions: {
					columns: [1,2,3,4,5,6],
					search: 'applied',
					order: 'applied'
				},
				bom: true
			},
			{
				text: 'JSON <span class="fa fa-list-alt "></span>',
				className: 'btn btn-primary',
				exportOptions: {
					columns: [1,2,3,4,5,6],
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
					columns: [1,2,3,4,5,6],
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
						columns: [1,2,3,4,5,6],
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
					columns: [1,2,3,4,5,6],
					search: 'applied',
					order: 'applied'
				},
			},								
		],
		initComplete: function(settings, json) {
			var cachito = (5 / 100) * $( document ).height();
			$('#iframeBusquedaSubvenciones', window.parent.document).height($( document ).height()+cachito);
		}
	});

	//Esta linea es para que no haya warnings en dataTables
	$.fn.dataTable.ext.errMode = 'none';
	
	if(!segundaPasada)
	{
		$('#tablaSubvenciones tbody').on('click', 'td.details-control', function () 
		{
			var tr = $(this).closest('tr');
			var row = tablaSubvenciones.row( tr );
			var nombre = row.data()['title'];
			var areaNombre = row.data()['areaTitle'];
						
			var url = "ficha_subvenciones.html?lang="+$.i18n().locale
			url=url+"&nombre="+nombre+"&areaNombre="+areaNombre;
			// window.open(url,'_blank');

			$('#iframeFicha', window.parent.document).attr('src',url);
			$("#iframeFicha", window.parent.document).height($( document ).height());
			
			
			$("#capaInicio", window.parent.document).hide();
			$("#capaSubvenciones", window.parent.document).hide();
			$("#capaBeneficiarios", window.parent.document).hide();
			$("#capaAyuda", window.parent.document).hide();
			$("#capaFicha", window.parent.document).show();

			$('html,body', window.parent.document).scrollTop(0);
		} );
	}

}

/*
	Funcion que realiza las busquedas en la tabla
*/
function buscar()
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("buscar");
	}
	
	$("#lineaGraficosBusquedaSub").show();
	$(".table-responsive").show();
	
	var mesesAreaConDatos=new Array();
	var mesesConDatos=new Array();
	var areasGasto=new Array();
	var importeNombre=new Array();
	var subvencionesLineaFinanciacion=new Array();
	var subvencionesTipoInstrumento=new Array();
	var textoBusqueda="";
	var textoBusquedaTabla = "";
	var textoBusquedaGrafico = "";
	var busquedaTodo = true;
	
	var title=$("#buscadorNombre").val().trim();	
	var paramTitle="title=='*"+title+"*'";
	if($("#buscadorNombre").val().length >= caracteresMinimosBusqueda)
	{
		paramTitle="title=='*"+title+"*'";
	}else
	{
		paramTitle="title=='"+title+"'";
	}

	var areaTitle=$("#selectNombreArea").val();	
	var paramAreaTitle="areaTitle=='*"+areaTitle+"*'";
	
	var entidadFinanciadoraTitle=$("#selectEntidadFinanciadora").val();	
	var paramEntidadFinanciadoraTitle="entidadFinanciadoraTitle=='*"+entidadFinanciadoraTitle+"*'";
	
	var lineaFinanciacion=$("#selectLineaFinanciacion").val();	
	var paramLineaFinanciacion="lineaFinanciacion=='*"+lineaFinanciacion+"*'";
	
	var tipoInstrumento=$("#selectTipoInstrumento").val();	
	var paramTipoInstrumento="tipoInstrumento=='*"+tipoInstrumento+"*'";
	
	var aplicacionPresupuestaria=$("#buscadorAplicacionPresupuestaria").val().trim();	
	var paramAplicacionPresupuestaria="aplicacionPresupuestaria=='*"+aplicacionPresupuestaria+"*'";
	if($("#buscadorAplicacionPresupuestaria").val().length >= caracteresMinimosBusqueda)
	{
		paramAplicacionPresupuestaria="aplicacionPresupuestaria=='*"+aplicacionPresupuestaria+"*'";
	}else
	{
		paramAplicacionPresupuestaria="aplicacionPresupuestaria=='"+aplicacionPresupuestaria+"'";
	}

	var tipoProcedimiento=$("#selectTipoProcedimiento").val();	
	var paramTipoProcedimiento="tipoProcedimiento=='"+tipoProcedimiento+"'";

	var nominativa=$("#selectNominativa").val();	
	var paramNominativa="nominativa="+nominativa+"";
	
	var busquedas=0;
	var URLParam=""
	if (title!='')	
	{
		URLParam=URLParam+paramTitle;
		textoBusqueda='<span class="textoNegrita">'+$.i18n( 'nombre:' )+'</span>'+" "+title;
		busquedaTodo=false;
	}
	if (areaTitle!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
		}
		URLParam=URLParam+paramAreaTitle;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'nombre_area:' )+'</span>'+" "+areaTitle;
		busquedaTodo=false;
	}
	if (entidadFinanciadoraTitle!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
		}
		URLParam=URLParam+paramEntidadFinanciadoraTitle;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'entidad_financiadora:' )+'</span>'+" "+entidadFinanciadoraTitle;
		busquedaTodo=false;
	}
	if (lineaFinanciacion!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
		}
		URLParam=URLParam+paramLineaFinanciacion;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'linea_financiacion:' )+'</span>'+" "+lineaFinanciacion;
		busquedaTodo=false;
	}
	if (tipoInstrumento!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
		}
		URLParam=URLParam+paramTipoInstrumento;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'tipo_instrumento:' )+'</span>'+" "+tipoInstrumento;
		busquedaTodo=false;
	}
	if (aplicacionPresupuestaria!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
		}
		URLParam=URLParam+paramAplicacionPresupuestaria;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'aplicacion_presupuestaria:' )+'</span>'+" "+aplicacionPresupuestaria;
		busquedaTodo=false;
	}
	if (tipoProcedimiento!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
		}
		URLParam=URLParam+paramTipoProcedimiento;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'tipo_procedimiento:' )+'</span>'+" "+tipoProcedimiento;
		busquedaTodo=false;
	}
	if (nominativa!='')	
	{
		if(URLParam!="")
		{
			URLParam=URLParam+" and ";
		}
		URLParam=URLParam+paramNominativa;
		if(textoBusqueda!="")
		{
			textoBusqueda=textoBusqueda+" | ";
		}
		textoBusqueda=textoBusqueda+'<span class="textoNegrita">'+$.i18n( 'nominativa:' )+'</span>'+" "+nominativa;
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
	while (URLParam.indexOf("%")>=0){
		URLParam=URLParam.replace("%","*");
	}
	
	var urlBuscar = queryBusquedaSubvenciones+URLParam;
	var table = $('#tablaSubvenciones').DataTable();
	table.ajax.url( dameURL(urlBuscar) ).load(null, false);
	if(logDebugBusquedasubvenciones)
	{
		console.log("fin de busqueda");
		console.log(urlBuscar);
	}
	$('#panelFichaSubvenciones').hide();
	
	subvencionesLineaFinanciacion=new Array();
	var jqxhr = $.getJSON(dameURL(queryIniGraficoSubvencionesLineaFinanciacion+URLParam)).done(function( data ) 
	{			
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{
			var lineaFinanciacionCadena=$.i18n( 'linea_financiacion' );
			var numeroSubvecionesCadena=$.i18n( 'numero_subvenciones' );
			var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+lineaFinanciacionCadena+"</th><th>"+numeroSubvecionesCadena+"</th></tr>";
			for (var i = 0; i < data.records.length; i++) 
			{
				if(i<resgistroGráficos)
				{
					var subvencion=new Object();
					subvencion.lineaFinanciacion=data.records[i][0].substring(0, 30);
					subvencion.numSub=data.records[i][1];
					subvencionesLineaFinanciacion.push(subvencion);
				}

				var valor=numeral(data.records[i][1]);
				htmlContent = htmlContent + "<tr>" + "<td>" + data.records[i][0].toString() + "</td>" + "<td>" + valor.format(numFormato) + "</td>" + "</tr>";
			}
			htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos('datos_subInfIzq')\">Mostar/Ocultar datos</button></div></div>";
			
			$('#datos_subInfIzq').html(htmlContent);
		}
	}).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}).always(function() 
	{
		pintaGraficoInferiorIzquierda(subvencionesLineaFinanciacion,$( window.parent.document ).width());
	});
	
	subvencionesTipoInstrumento=new Array();
	jqxhr = $.getJSON(dameURL(queryIniGraficoSubvencionesLineaFinanciacion+URLParam)).done(function( data ) 
	{
		if ((data!=null)&&(data.records!=null)&&(data.records.length>0))
		{				
			var tipoInstrumentoCadena=$.i18n( 'tipo_instrumento' );
			var numeroSubvecionesCadena=$.i18n( 'numero_subvenciones' );
			var htmlContent = "<div class='row'><div class='col-md-12'><table style='width: 100%;'><tr><th>"+tipoInstrumentoCadena+"</th><th>"+numeroSubvecionesCadena+"</th></tr>";
			for (var i = 0; i < data.records.length; i++) 
			{
				if(i<resgistroGráficos)
				{
					var subvencion=new Object();
					subvencion.tipoInstrumento=data.records[i][0].substring(0, 30);
					subvencion.numSub=data.records[i][1];
					subvencionesTipoInstrumento.push(subvencion);
				}

				var valor=numeral(data.records[i][1]);
				htmlContent = htmlContent + "<tr>" + "<td>" + data.records[i][0].toString() + "</td>" + "<td>" + valor.format(numFormato) + "</td>" + "</tr>";
			}
			htmlContent = htmlContent + "</table><button id='mostarDatos' type='button' class='btn btn-link' onclick=\"mostrarDatos('datos_subInfDer')\">Mostar/Ocultar datos</button></div></div>";
			
			$('#datos_subInfDer').html(htmlContent);
		}
	}).fail(function( jqxhr, textStatus, error ) 
	{
		var err = textStatus + ", " + error;
		console.log( "Request Failed: " + err );
	}).always(function() 
	{
		pintaGraficoInferiorDerecha(subvencionesTipoInstrumento,$( window.parent.document ).width());
	});
}

/*
	Función para crear el gráfico superior derecha
*/
function pintaGraficoSuperiorDerecha(importeLinea)
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("pintaGraficoSuperiorDerecha");
	}

	var labels = true;
	// if (width<700)
	// {
	// 	labels=false;
	// }
	
	AmCharts.makeChart("chartSuperiorDerecha", 
	{
		type: "serial",
		rotate: true,
		dataProvider: importeLinea,
		categoryField: "linea",
		categoryAxis: 
		{
			"labelsEnabled": labels
		},
		graphs: [{			
			"balloonText": "[[subNum]]",
			"fillAlphas": 1,
			"lineAlpha": 0.2,
			"type": "column",
			"valueField": "subNum",
			"urlField": ""
		}],
		"numberFormatter": 
		{
            "decimalSeparator": ",",
            "thousandsSeparator": "."
        },
		colors: ["#006AA0"],
		autoMarginOffset: 0,
		marginBottom: 0,
		marginLeft: 0,
		marginRight: 0,
		marginTop: 0,
		
	});
}

/*
	Función auxiliar para realizar los gráficos
*/
function adjustBalloonText(item, content)
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("adjustBalloonText");
	}
	var html = item.dataContext.lineaCompleto+"\n"+item.dataContext.importe.toLocaleString('es-ES',{ style: 'currency', currency: 'EUR' });				  
	return html;
}

/*
	Función auxiliar para realizar los gráficos
*/
function adjustLabelText(item, content)
{	
	if(logDebugBusquedasubvenciones)
	{
		console.log("adjustBalloonText");
	}
	var html = item.dataContext.linea+"\n"+item.dataContext.importe.toLocaleString('es-ES',{ style: 'currency', currency: 'EUR' });
	return html;
}
	
/*
	Función para crear el gráfico superior izquierda
*/
function pintaGraficoSuperiorIzquierda2(areasGasto)
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("pintaGraficoSuperiorIzquierda");
	}
	
	var chart = am4core.create("chartSuperiorIzquierda", am4charts.TreeMap);
	chart.data = areasGasto;

	chart.dataFields.value = "value";
	chart.dataFields.name = "name";
	
	chart.language.locale._decimalSeparator= ",";
	chart.language.locale._thousandSeparator= ".";
	chart.fontSize = 14;
	
	chart.colors.step = 0;
	chart.colors.list = [
	  am4core.color("#006AA0")
	];
	
	var level1 = chart.seriesTemplates.create("0");
	var level1_column = level1.columns.template;
	level1_column.column.cornerRadius(10, 10, 10, 10);
	level1_column.fillOpacity = 0.8;
	level1_column.stroke = am4core.color("#fff");
	level1_column.strokeWidth = 5;
	level1_column.strokeOpacity = 1;
	level1_column.properties.tooltipText= "{parentName} {nameCompleto}\n{value}";
	
	var level1_bullet = level1.bullets.push(new am4charts.LabelBullet());
	level1_bullet.locationY = 0.5;
	level1_bullet.locationX = 0.5;
	level1_bullet.label.text = "{name}\n{value}";
	level1_bullet.label.fill = am4core.color("#fff");
	level1_bullet.label.truncate = false;
	level1_bullet.label.wrap  = true;
}

/*
	Función para crear el gráfico superior izquierda
*/
function pintaGraficoSuperiorIzquierda(areasGasto)
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("pintaGraficoSuperiorIzquierda");
	}

	var labels = true;

	AmCharts.makeChart("chartSuperiorIzquierda", 
	{
		type: "serial",
		rotate: true,
		dataProvider: areasGasto,
		categoryField: "name",
		categoryAxis: 
		{
			"labelsEnabled": labels
		},
		graphs: [{			
			"balloonText": "[[value]]",
			"fillAlphas": 1,
			"lineAlpha": 0.2,
			"type": "column",
			"valueField": "value",
			"urlField": ""
		}],
		"numberFormatter": 
		{
            "decimalSeparator": ",",
            "thousandsSeparator": "."
        },
		colors: ["#006AA0"],
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
function pintaGraficoInferiorIzquierda(subvenciones,width)
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("pintaGraficoInferiorIzquierda");
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
		dataProvider: subvenciones,
		categoryField: "lineaFinanciacion",
		categoryAxis: 
		{
			"labelsEnabled": labels
		},
		graphs: [{			
			"balloonText": "[[numSub]]",
			"fillAlphas": 1,
			"lineAlpha": 0.2,
			"type": "column",
			"valueField": "numSub",
			"urlField": ""
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
	Función para crear el gráfico inferior derecha
*/
function pintaGraficoInferiorDerecha(subvenciones,width)
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("pintaGraficoInferiorDerecha");
	}
	
	var labels = true;
	if (width<700)
	{
		labels=false;
	}
	
	AmCharts.makeChart("graficoInferiorDerecha", 
	{
		type: "serial",
		rotate: true,
		dataProvider: subvenciones,
		categoryField: "tipoInstrumento",
		categoryAxis: 
		{
			"labelsEnabled": labels
		},
		graphs: [{			
			"balloonText": "[[numSub]]",
			"fillAlphas": 1,
			"lineAlpha": 0.2,
			"type": "column",
			"valueField": "numSub",
			"urlField": ""
		}],
		"numberFormatter": 
		{
            "decimalSeparator": ",",
            "thousandsSeparator": "."
        },
		colors: ["#006AA0"],
		
	});
}

/*
	Función para mostrar la tabla de debajo de los gráficos
*/
function mostrarDatos( capa ) 
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("mostrarDatos");
	}

	$('#'+capa).toggle();

	var isVisible = $('#'+capa).is(':visible');
	if (isVisible === true) 
	{
		var cachito = (5 / 100) * $( document ).height();
		$('#iframeBusquedaSubvenciones', window.parent.document).height($( document ).height()+cachito);
	}else
	{
		$("#iframeBusquedaSubvenciones", window.parent.document).height($( document ).height());
	}
}

/*
	Función para limpiar el formulario de beneficiarios
*/
function limpiarFormularioSub()
{
	if(logDebugBusquedasubvenciones)
	{
		console.log("limpiarFormularioSub");
	}
	
	$("#buscadorNombre").val("");
	$("#selectNombreArea").val("");
	$("#selectEntidadFinanciadora").val("");
	$("#selectLineaFinanciacion").val("");
	$("#selectTipoInstrumento").val("");
	$("#buscadorAplicacionPresupuestaria").val("");
	$("#selectTipoProcedimiento").val("");
	$("#selectNominativa").val("");

	$("#lineaGraficosBusquedaSub").hide();
	$(".table-responsive").hide();
}