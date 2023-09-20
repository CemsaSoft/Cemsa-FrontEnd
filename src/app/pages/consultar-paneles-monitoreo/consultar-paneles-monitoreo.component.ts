//SISTEMA
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl, FormGroup,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';

import { MatStepper } from '@angular/material/stepper';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

//libreria para los graficos
import * as echarts from 'echarts';

//COMPONENTES
import { CentralConsultaClass } from 'src/app/core/models/centralConsulta';
import { MedicionesClass } from 'src/app/core/models/mediciones';
import { ServicioClass } from 'src/app/core/models/servicio';

//SERVICIOS
import { CentralService } from 'src/app/core/services/central.service';
import { MedicionesService } from 'src/app/core/services/mediciones.service';
import { ServicioService } from 'src/app/core/services/servicio.service';

@Component({
  selector: 'app-consultar-paneles-monitoreo',
  templateUrl: './consultar-paneles-monitoreo.component.html',
  styleUrls: ['./consultar-paneles-monitoreo.component.css']
})

export class ConsultarPanelesMonitoreoComponent implements OnInit {
  
  //TABLA Central
  displayedColumnsCentral: string[] = ['cenNro', 'cenImei', 'cenCoorX', 'cenCoorY', 'columnaVacia', 'seleccionar'];
  @ViewChild('paginatorCentral', { static: false }) paginatorCentral: MatPaginator | undefined;
  @ViewChild('matSortCentral', { static: false }) sortCentral: MatSort | undefined;
  dataSourceCentral: MatTableDataSource<any>;
  pageSizeCentral = 5; // Número de elementos por página
  currentPageCentral = 1; // Página actual

  //TABLA Servicios Disponibles
  displayedColumnsServicioDisponible: string[] = ['serId', 'serDescripcion', 'AgregarServ'];
  @ViewChild('matSortServicioDisponible', { static: false }) sortServicioDisponible: MatSort | undefined;
  @ViewChild('paginatorServicioDisponible', { static: false }) paginatorServicioDisponible: MatPaginator | undefined;
  dataSourceServicioDisponible: MatTableDataSource<any>;
  pageSizeServicioDisponible = 5; // Número de elementos por página
  currentPageServicioDisponible = 1; // Página actual

  //TABLA Servicios Graficar
  displayedColumnsServicioGraficar: string[] = ['serId', 'serDescripcion', 'ExtraerServ'];
  @ViewChild('matSortServicioGraficar', { static: false }) sortServicioGraficar: MatSort | undefined;
  @ViewChild('paginatorServicioGraficar', { static: false }) paginatorServicioGraficar: MatPaginator | undefined;
  dataSourceServicioGraficar: MatTableDataSource<any>;
  pageSizeServicioGraficar = 5; // Número de elementos por página
  currentPageServicioGraficar = 1; // Página actual

  //TABLA Mediciones
  displayedColumnsMediciones: string[] = ['medId', 'serDescripcion', 'medValor', 'medFechaHoraSms'];
  @ViewChild('matSortMediciones', { static: false }) sortMediciones: MatSort | undefined;
  @ViewChild('paginatorMediciones', { static: false }) paginatorMediciones: MatPaginator | undefined;
  dataSourceMediciones: MatTableDataSource<any>;
  pageSizeMediciones = 50; // Número de elementos por página
  currentPageMediciones = 1; // Página actual

  //STEPPER
  titulo1 = 'Seleccionar Central para Ver Panel de Monitoreo';
  titulo2 = 'Panel de Monitoreo de la Central N°:';
  titulo3 = ':';
  isStep1Completed = false;
  isStep2Completed = false;
  isStep3Completed = false;

  @ViewChild(MatStepper, { static: false }) stepper: MatStepper | undefined;
  
  //VARIABLES DE OBJETOS LIST
  CentralConsulta: CentralConsultaClass[] = [];
  CentralConsultaFiltrados: CentralConsultaClass [] = [];
  Mediciones: MedicionesClass[] = []; 
  MedicionesTabla: MedicionesClass[] = []; 
  MedicionesTablaFiltrados: MedicionesClass[] = []; 
  ServiciosCentral: ServicioClass[] = [];
  ServiciosGraficar: ServicioClass[] = [];

  //VARIABLES DE DATOS
  propiedadOrdenamiento: string = 'cenNro';
  propiedadOrdenamientoServicio: string = 'serId';
  propiedadOrdenamientoServicioGraficar: string = 'serId';
  propiedadOrdenamientoMedicion: string = 'medId';
  filtroCentral: string = '';

  tipoOrdenamiento: number = 1;
  centralNroSeleccionada: number=0;
  tipoOrdenamientoServicio: number = 1;
  tipoOrdenamientoServicioGraficar: number = 1;
  tipoOrdenamientoMedicion: number = 1;
  idUsuario: any = 0;
  idListaServiciosSeleccionado: number=0;
  idListaServiciosGraficarSeleccionado: number=0;

  isCollapsed1 = false;
  isCollapsed2 = false;
  op1 = true; op2 = false; op3 = false; op4 = false;
  op1G = true; op2G = false;
  op1T = true;
  ingresoDireViento = false;
  public habilitarBoton: boolean = false;

  //FORMS PARA LA AGRUPACIÓN DE DATOS
  formGraficar: FormGroup;
  formfiltro: FormGroup;

  constructor(
    private centralConsultar: CentralService, 
    private medicionesConsultar: MedicionesService, 
  ) { 
    this.dataSourceCentral = new MatTableDataSource<any>();
    this.dataSourceServicioDisponible = new MatTableDataSource<any>();
    this.dataSourceServicioGraficar = new MatTableDataSource<any>();
    this.dataSourceMediciones = new MatTableDataSource<any>();

    this.formGraficar = new FormGroup({
      fecha_desde: new FormControl(null, []),
      fecha_hasta: new FormControl(null, []),
    });

    this.formfiltro = new FormGroup({
      medId: new FormControl(null, []),
      serDescripcion: new FormControl(null, []),
      medValor: new FormControl(null, []),
      fecha_desde: new FormControl(null, []),
      fecha_hasta: new FormControl(null, []),
    });
  }
  
  ngOnInit(): void {
    this.idUsuario = localStorage.getItem('idUsuario');    
    this.centralConsultar.listaCentralesCliente(this.idUsuario).subscribe(data => {
      this.CentralConsulta = data;  
      this.CentralConsultaFiltrados = data;

      this.dataSourceCentral = new MatTableDataSource(data);
      if (this.paginatorCentral) {
        this.dataSourceCentral.paginator = this.paginatorCentral;
      }
      if (this.sortCentral) {
        this.dataSourceCentral.sort = this.sortCentral;
      }
    });  

    this.formfiltro.get('fecha_desde')?.disable();
    this.formfiltro.get('fecha_hasta')?.disable();

    this.formGraficar.get('fecha_desde')?.disable();
    this.formGraficar.get('fecha_hasta')?.disable();
  }

  handlePageChangeCentral(event: any) {
    this.currentPageCentral = event.pageIndex + 1;
    this.pageSizeCentral = event.pageSize;
  }

  handlePageChangeServicioDisponible(event: any) {
    this.currentPageServicioDisponible = event.pageIndex + 1;
    this.pageSizeServicioDisponible = event.pageSize;
  }

  handlePageChangeServicioGraficar(event: any) {
    this.currentPageServicioGraficar = event.pageIndex + 1;
    this.pageSizeServicioGraficar = event.pageSize;
  }

  handlePageChangeMediciones(event: any) {
    this.currentPageMediciones = event.pageIndex + 1;
    this.pageSizeMediciones = event.pageSize;
  }
  
  //STEP
  goToNextStep(stepNumber: number): void {    
    if (this.stepper) {
      this.stepper.selectedIndex = stepNumber;
    }
  }
  
  goToPreviousStep(): void {     
    if (this.stepper) {
      this.stepper.previous();
    }    
  }

  // valida para que un solo selector de frecuencia este seleccionado a la vez
  selOp(option: string, event: any) {
    this.op1 = this.op2 = this.op3 = this.op4 = false;
    this.formGraficar.get('fecha_desde')?.disable();
    this.formGraficar.get('fecha_hasta')?.disable();

    if (option === 'op1') { this.op1 = event.checked; } 
    if (option === 'op2') { this.op2 = event.checked; }
    if (option === 'op3') { this.op3 = event.checked; } 
    if (option === 'op4') { 
      this.op4 = event.checked; 
      this.formGraficar.get('fecha_desde')?.enable();
      this.formGraficar.get('fecha_hasta')?.enable();
    }    
  }

  // valida para que un solo selector de tipo de representar los servicios este seleccionado a la vez
  selOpG(option: string, event: any) {
    this.op1G = this.op2G = false;
    if (option === 'op1G') {
      this.op1G = event.checked;
      this.op2G = !event.checked;
    } 
    if (option === 'op2G') {
      this.op2G = event.checked;
      this.op1G = !event.checked; 
    }   
  }

  // valida para msotrar tabla con mediciones
  selOpT(event: any) {
    this.op1T = !this.op1T; 
  }

  //Valida que exista alguna Central que responda al filtro.
  validarFiltrado(): Boolean {
    if (this.CentralConsultaFiltrados.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  //Valida que exista alguna Medicion que responda al filtro.
  validarFiltradoMedicion(): Boolean {
    if (this.MedicionesTablaFiltrados.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  //Valida que exista algún servicio que responda al filtro.
  validarFiltradoServicios(): Boolean {
    if (this.ServiciosCentral.length == 0) {
      return false;
    } else {
      return true;
    }    
  }

  //Valida que exista algún servicio que responda al filtro.
  validarFiltradoServiciosGraficar(): Boolean {   
    if (this.ServiciosGraficar.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  //Filtro de Central por código de central.
  esFiltrar(event: Event, campo: string) {
    let txtBuscar = (event.target as HTMLInputElement).value;
    this.filtroCentral = txtBuscar
      .replace(/[^\w\s]/g, '')
      .trim()
      .toLowerCase();
    this.CentralConsultaFiltrados = [];
    this.CentralConsulta.forEach((centralConsulta) => {
      if (
        (campo === 'codigo' && centralConsulta.cenNro.toString().toLowerCase().includes(this.filtroCentral)) 
      ) {
        this.CentralConsultaFiltrados.push(centralConsulta);
      }    
    });

    this.dataSourceCentral = new MatTableDataSource(this.CentralConsultaFiltrados);
    if (this.paginatorCentral) {
      this.dataSourceCentral.paginator = this.paginatorCentral;
    }
    if (this.sortCentral) {
      this.dataSourceCentral.sort = this.sortCentral;
    }
  } 

  //Filtro de Mediciones
  esFiltrarMedicion(event: Event) {
    const filtroMedId = (this.formfiltro.get('medId') as FormControl).value?.toLowerCase();
    const filtroSerDescripcion = (this.formfiltro.get('serDescripcion') as FormControl).value?.toLowerCase();
    const filtroMedValor = (this.formfiltro.get('medValor') as FormControl).value?.toLowerCase();
  
    this.MedicionesTablaFiltrados = this.MedicionesTabla.filter((medicion) => {
      const valorMedId = medicion.medId.toString().toLowerCase();
      const valorSerDescripcion = medicion.serDescripcion.toString().toLowerCase();
      const valorMedValor = medicion.medValor.toString().toLowerCase();
  
      return (
        (!filtroMedId || valorMedId.includes(filtroMedId)) &&
        (!filtroSerDescripcion || valorSerDescripcion.includes(filtroSerDescripcion)) &&
        (!filtroMedValor || valorMedValor.includes(filtroMedValor))
      );
    });

    this.MedicionesTablaFiltrados = this.MedicionesTablaFiltrados.filter(medicion => {
      const servicio = this.ServiciosGraficar.find(servicio => servicio.serId === medicion.medSer);
      return servicio;        
    });

    this.dataSourceMediciones = new MatTableDataSource(this.MedicionesTablaFiltrados);
    if (this.paginatorMediciones) {
      this.dataSourceMediciones.paginator = this.paginatorMediciones;
      this.paginatorMediciones.firstPage();
    }
    if (this.sortMediciones) {
      this.dataSourceMediciones.sort = this.sortMediciones;
    }  
  }
  
  // valida para que un solo selector de frecuencia este seleccionado a la vez
  filtroFecha(event: any) {
    if (event.checked === true) {
      this.formfiltro.get('medId')?.disable();
      this.formfiltro.get('serDescripcion')?.disable();
      this.formfiltro.get('medValor')?.disable();
      this.formfiltro.get('fecha_desde')?.enable();
      this.formfiltro.get('fecha_hasta')?.enable();
      this.habilitarBoton = true;
    }
    else {
      this.formfiltro.get('medId')?.enable();      
      this.formfiltro.get('serDescripcion')?.enable();
      this.formfiltro.get('medValor')?.enable();
      this.formfiltro.get('fecha_desde')?.disable();
      this.formfiltro.get('fecha_hasta')?.disable();
      this.habilitarBoton = false;
    }
  }


  //filtro de Alarma por Fecha
  filtarXFechas(){
    var hoy = new Date();
    var desde = new Date();
    var hasta = new Date();

    var fechaDesde = this.formfiltro.value.fecha_desde ?? null;
    var fechaSeleccionada = new Date(fechaDesde);
    fechaSeleccionada.setDate(fechaSeleccionada.getDate() ); // Sumar un día
    fechaSeleccionada.setHours(0, 0, 0, 0);
    desde = fechaSeleccionada;

    var fechaHasta = this.formfiltro.value.fecha_hasta ?? null;
    fechaSeleccionada = new Date(fechaHasta);
    fechaSeleccionada.setDate(fechaSeleccionada.getDate() ); // Sumar un día
    fechaSeleccionada.setHours(0, 0, 0, 0);
    hasta = fechaSeleccionada;     

    function mostrarError(mensaje: string, footer: string) {
      Swal.fire({
        title: 'Error',
        text: mensaje,
        icon: 'warning',
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
        footer: footer
      });
    }

    if (fechaDesde === null || isNaN(desde.getTime())) {
      mostrarError('Ingrese una fecha de desde válida.', 'Por favor, ingrese una fecha de hasta válida para generar el filtro.');
    } else if (fechaHasta === null || isNaN(hasta.getTime())) {
      mostrarError('Ingrese una fecha de hasta válida.', 'Por favor, ingrese una fecha de hasta válida para generar el filtro.');
    } else if (desde > hasta) {
      mostrarError('La fecha "desde" es posterior a la fecha "hasta".', 'Por favor, cambie el rango de fechas seleccionado para generar el filtro.');
    } else if (hasta > hoy) {
      mostrarError('La fecha "desde" no puede ser posterior a la fecha actual.', 'Por favor, cambie el rango de fechas seleccionado para generar el filtro.');
    } else {
      
      hasta.setDate(hasta.getDate() + 1); // Sumar un día al valor de 'hasta'

      const filtroMedId = (this.formfiltro.get('medId') as FormControl).value?.toLowerCase();
      const filtroSerDescripcion = (this.formfiltro.get('serDescripcion') as FormControl).value?.toLowerCase();
      const filtroMedValor = (this.formfiltro.get('medValor') as FormControl).value?.toLowerCase();
  
      this.MedicionesTablaFiltrados = this.MedicionesTabla.filter((medicion) => {
      const valorMedId = medicion.medId.toString().toLowerCase();
      const valorSerDescripcion = medicion.serDescripcion.toString().toLowerCase();
      const valorMedValor = medicion.medValor.toString().toLowerCase();
      const fechaAlarma = new Date(medicion.medFechaHoraSms);

      return (
          (!filtroMedId || valorMedId.includes(filtroMedId)) &&
          (!filtroSerDescripcion || valorSerDescripcion.includes(filtroSerDescripcion)) &&
          (!filtroMedValor || valorMedValor.includes(filtroMedValor)) &&
          (fechaAlarma >= desde && fechaAlarma <= hasta)
        );
      });

      this.MedicionesTablaFiltrados = this.MedicionesTablaFiltrados.filter(medicion => {
        const servicio = this.ServiciosGraficar.find(servicio => servicio.serId === medicion.medSer);
        return servicio;        
      });
      
      this.dataSourceMediciones = new MatTableDataSource(this.MedicionesTablaFiltrados);
      if (this.paginatorMediciones) {
        this.dataSourceMediciones.paginator = this.paginatorMediciones;
        this.paginatorMediciones.firstPage();
      }
      if (this.sortMediciones) {
        this.dataSourceMediciones.sort = this.sortMediciones;
      }  
    }
  }

  // Extraer servicios a la central selecciona
  agregarServicio(element: any): void { 
    if (element.serTipoGrafico==5)  { this.ingresoDireViento = true; }
    const index = this.ServiciosCentral.indexOf(element);
    if (index !== -1) {
      this.ServiciosCentral.splice(index, 1);
      this.ServiciosGraficar.push(element);
    }
    this.validarFiltradoServicios();   

    this.dataSourceServicioDisponible = new MatTableDataSource(this.ServiciosCentral);
    if (this.paginatorServicioDisponible) {
      this.dataSourceServicioDisponible.paginator = this.paginatorServicioDisponible;
      this.paginatorServicioDisponible.firstPage();
    }
    if (this.sortServicioDisponible) {
      this.dataSourceServicioDisponible.sort = this.sortServicioDisponible;
    }     

    this.dataSourceServicioGraficar = new MatTableDataSource(this.ServiciosGraficar);
    if (this.paginatorServicioGraficar) {
      this.dataSourceServicioGraficar.paginator = this.paginatorServicioGraficar;
      this.paginatorServicioGraficar.firstPage();
    }
    if (this.sortServicioGraficar) {
      this.dataSourceServicioGraficar.sort = this.sortServicioGraficar;
    }  
  }

  // Extraer servicios a la central selecciona
  extraerServicio(element: any): void {
    if (element.serTipoGrafico==5)  { this.ingresoDireViento = false; }
    const index = this.ServiciosGraficar.indexOf(element);
    if (index !== -1) {
      this.ServiciosGraficar.splice(index, 1);
      this.ServiciosCentral.push(element);
    }
    this.validarFiltradoServiciosGraficar();  

    this.dataSourceServicioDisponible = new MatTableDataSource(this.ServiciosCentral);
    if (this.paginatorServicioDisponible) {
      this.dataSourceServicioDisponible.paginator = this.paginatorServicioDisponible;
      this.paginatorServicioDisponible.firstPage();
    }
    if (this.sortServicioDisponible) {
      this.dataSourceServicioDisponible.sort = this.sortServicioDisponible;
    }     
    
    this.dataSourceServicioGraficar = new MatTableDataSource(this.ServiciosGraficar);
    if (this.paginatorServicioGraficar) {
      this.dataSourceServicioGraficar.paginator = this.paginatorServicioGraficar;
      this.paginatorServicioGraficar.firstPage();
    }
    if (this.sortServicioGraficar) {
      this.dataSourceServicioGraficar.sort = this.sortServicioGraficar;
    }  
  } 

  seleccionarCentral(element: any) {
    this.isCollapsed1 = !this.isCollapsed1;
    this.centralNroSeleccionada = element.cenNro;
    this.titulo2 = 'Panel de Monitoreo de la Central N°' + element.cenNro + ':';

    this.ingresoDireViento = false;
    this.isCollapsed1 = !this.isCollapsed1;
    this.ServiciosGraficar = [];
    this.centralConsultar.obtenerServicioXCentralEstado(this.centralNroSeleccionada).subscribe(data => {
      this.ServiciosCentral = data; 

      this.dataSourceServicioDisponible = new MatTableDataSource(data);
      if (this.paginatorServicioDisponible) {
        this.dataSourceServicioDisponible.paginator = this.paginatorServicioDisponible;
        this.paginatorServicioDisponible.firstPage();
      }
      if (this.sortServicioDisponible) {
        this.dataSourceServicioDisponible.sort = this.sortServicioDisponible;
      }

    })    

    this.goToNextStep(1)

  }

  graficar(): void {
    var hoy = new Date();
    var desde = new Date();
    var hasta = new Date();
    if (this.op1) { desde.setDate(desde.getDate() - 7); }
    if (this.op2) { desde.setDate(desde.getDate() - 15); }
    if (this.op3) { desde.setMonth(desde.getMonth() - 1); }
    if (this.op4) {

      var fechaDesde = this.formGraficar.value.fecha_desde ?? null;
      var fechaSeleccionada = new Date(fechaDesde);
      fechaSeleccionada.setDate(fechaSeleccionada.getDate() ); // Sumar un día
      fechaSeleccionada.setHours(0, 0, 0, 0);
      desde = fechaSeleccionada;
  
      var fechaHasta = this.formGraficar.value.fecha_hasta ?? null;
      fechaSeleccionada = new Date(fechaHasta);
      fechaSeleccionada.setDate(fechaSeleccionada.getDate() ); // Sumar un día
      fechaSeleccionada.setHours(0, 0, 0, 0);
      hasta = fechaSeleccionada;        
    }

    function mostrarError(mensaje: string, footer: string) {
      Swal.fire({
        title: 'Error',
        text: mensaje,
        icon: 'warning',
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
        footer: footer
      });
    }

    if (this.ServiciosGraficar.length === 0) {
      mostrarError('Debe seleccionar al menos un servicio para graficar.', 'Ingrese un Servicio para Graficar.');
    } else if (!this.op1G && !this.op2G) {
      mostrarError('Por favor, ingrese un tipo de visualización de los Servicios.', 'Por favor, introduzca un tipo de visualización de los Servicios.');
    } else if (!this.op1 && !this.op2 && !this.op3 && !this.op4) {
      mostrarError('Por favor, ingrese un periodo a monitorear.', 'Por favor, introduzca un periodo a monitorear.');
    }else if (fechaDesde === null || isNaN(desde.getTime())) {
      mostrarError('Ingrese una fecha de desde válida.', 'Por favor, ingrese una fecha de hasta válida para generar el gráfico.');
    } else if (fechaHasta === null || isNaN(hasta.getTime())) {
      mostrarError('Ingrese una fecha de hasta válida.', 'Por favor, ingrese una fecha de hasta válida para generar el gráfico.');
    } else if (desde > hasta) {
      mostrarError('La fecha "desde" es posterior a la fecha "hasta".', 'Por favor, cambie el rango de fechas seleccionado para generar el gráfico.');
    } else if (hasta > hoy) {
      mostrarError('La fecha "desde" no puede ser posterior a la fecha actual.', 'Por favor, cambie el rango de fechas seleccionado para generar el gráfico.');
    } else {

    // Obtén el contenedor de los gráficos
    const contenedor = document.getElementById('contenedor-graficos');

    // Remueve todos los hijos del contenedor
    while (contenedor?.firstChild) {
      contenedor.removeChild(contenedor.firstChild);
    }   

    // Agregar un día a la fecha 'hasta'    
    hasta.setDate(hasta.getDate() + 1);
    

    var mostrarValores: boolean = true;

    this.medicionesConsultar.obtenerMediciones(this.centralNroSeleccionada, desde, hasta).subscribe(data => {
      this.Mediciones = data; 
      this.MedicionesTabla = data; 

      this.MedicionesTablaFiltrados = data;
      
      this.MedicionesTablaFiltrados = this.MedicionesTablaFiltrados.filter(medicion => {
        const servicio = this.ServiciosGraficar.find(servicio => servicio.serId === medicion.medSer);
        return servicio;        
      });

      this.dataSourceMediciones = new MatTableDataSource(this.MedicionesTablaFiltrados);
      if (this.paginatorMediciones) {
        this.dataSourceMediciones.paginator = this.paginatorMediciones;
        this.paginatorMediciones.firstPage();
      }
      if (this.sortMediciones) {
        this.dataSourceMediciones.sort = this.sortMediciones;
      }  

      const contenedor = document.getElementById('contenedor-graficos')!;
      if ( (this.op1G && this.ServiciosGraficar.length > 1) || (this.op1G && !this.ingresoDireViento && this.ServiciosGraficar.length === 1) ) {
        this.Mediciones = this.Mediciones.filter(medicion => {
          const servicio = this.ServiciosGraficar.find(servicio => servicio.serId === medicion.medSer);
          return servicio && servicio.serTipoGrafico !== 5;
        });
        createAndRenderChart(contenedor, this.Mediciones, 1, this.ServiciosGraficar, 1);    
      }
      if (this.op1G && this.ingresoDireViento) { 
        const idMedSer = this.ServiciosGraficar
        .filter(servicio => servicio.serTipoGrafico === 5)
        .map(servicio => servicio.serId);
        this.Mediciones = data.filter((medicion: { medSer: number; }) => medicion.medSer === idMedSer[0]);
        createAndRenderChart(contenedor, this.Mediciones, 2, this.ServiciosGraficar, 2);
      }
      if (!this.op1G ) { 
        for (let i = 0; i < this.ServiciosGraficar.length; i++) {
          this.Mediciones = data.filter((medicion: { medSer: number; }) => medicion.medSer === this.ServiciosGraficar[i].serId); 
          createAndRenderChart(contenedor, this.Mediciones, i, [this.ServiciosGraficar[i]], 3);
        }
      }
    });    

    function createAndRenderChart(container: HTMLElement, mediciones: any[], i: number, servicios: any[], nroIf: number): void {
      const graficoId = `grafico${i}`;

      const graficoDiv = document.createElement('div');
      graficoDiv.id = graficoId;
      graficoDiv.style.width = '1000px';
      graficoDiv.style.height = '500px';
    
      const contenedorDiv = document.createElement('div');
      contenedorDiv.style.float = 'left';
      contenedorDiv.appendChild(graficoDiv);
      container.appendChild(contenedorDiv);
    
      const chartDom = document.getElementById(graficoId)!;
      const myChart = echarts.init(chartDom);

      const xAxisData = mediciones.map((medicion: any) => {
        const fecha = new Date(medicion.medFechaHoraSms);
        const year = fecha.getFullYear();
        const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const day = fecha.getDate().toString().padStart(2, '0');
        const hours = fecha.getHours().toString().padStart(2, '0');
        const minutes = fecha.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      });
      
      const uniqueDates = Array.from(new Set(xAxisData));
      
      // Utiliza uniqueDates para generar las etiquetas del eje X sin duplicaciones
      const xAxisLabels = uniqueDates.map((fecha: string) => fecha);
    
      interface SeriesOption {
        name: string;
        type: string;
        areaStyle: any;
        lineStyle: { width: number };
        emphasis: { focus: string };
        markArea: { silent: boolean; itemStyle: { opacity: number } };
        data: number[];
        markPoint?: { data: any[] };
        markLine?: { data: any[] };
      }
      
      function filterServicios(servicios: any[], mediciones: any[], nroIf: number): { dataLegend: string[]; series: SeriesOption[] } {
        let dataLegend: string[] = [];
        let series: SeriesOption[] = [];
      
        switch (nroIf) {
          case 1:
            dataLegend = servicios
              .filter(servicio => servicio.serTipoGrafico !== 5)
              .map(servicio => servicio.serDescripcion);
            series = filterSeries(servicios, mediciones, servicio => servicio.serTipoGrafico !== 5);
            break;
          case 2:
            dataLegend = servicios
              .filter(servicio => servicio.serTipoGrafico === 5)
              .map(servicio => servicio.serDescripcion);        
            series = filterSeries(servicios, mediciones, servicio => servicio.serTipoGrafico === 5);
            break;
          case 3:
            dataLegend = servicios.map(servicio => servicio.serDescripcion);
            series = filterSeries(servicios, mediciones, servicio => servicio.serId === servicio.serId);
            break;
        }      
        return { dataLegend, series };
      }
      
      function filterSeries(servicios: any[], mediciones: any[], filterFn: (servicio: any) => boolean): SeriesOption[] {
        const uniqueDates = [...new Set(mediciones.map((medicion: any) => medicion.medFechaHoraSms))];
        
        return servicios
          .filter(filterFn)
          .map((servicio) => {
            const seriesData = uniqueDates.map((fecha) => {
              const medicion = mediciones.find((medicion: any) => medicion.medSer === servicio.serId && medicion.medFechaHoraSms === fecha);
              return medicion ? medicion.medValor : null;
            });
            
            return {
              name: servicio.serDescripcion,
              type: 'line',
              areaStyle: {},
              lineStyle: { width: 1 },
              emphasis: { focus: 'series' },
              markArea: { silent: true, itemStyle: { opacity: 0.3 } },
              data: seriesData,
              markPoint: { data: mostrarValores ? [{ type: 'max', name: 'Maximo' }, { type: 'min', name: 'Minimo' }] : [] },
              markLine: {
                data: mostrarValores ? [
                  { type: 'average', name: 'Promedio' },
                  { type: 'max', name: 'Maximo' },
                  { type: 'min', name: 'Minimo' },
                  [{ symbol: 'none', x: '80%', yAxis: 'max' },
                  {  label: { position: 'start', formatter: 'Maximo' },
                    type: 'max', name: 'Maximo' }
                  ],
                  [{ symbol: 'none', x: '80%', yAxis: 'min' },
                  { label: { position: 'start', formatter: 'Minimo' },
                    type: 'min', name: 'Minimo' }
                  ],
                  [{ symbol: 'none', x: '80%', yAxis: 'average' },
                  { label: { position: 'start', formatter: 'Promedio' },
                    type: 'average', name: 'Promedio' }
                  ]
                ] : []              
              } 
            };
          });
      }
      
      const { dataLegend, series } = filterServicios(servicios, mediciones, nroIf);
      
      const option = {
        grid: { bottom: 80 },
        toolbox: { feature: { dataZoom: { yAxisIndex: 'none' },
        //dataView: { readOnly: false },
        dataView: {
          readOnly: false,
          optionToContent: function (opt: any) {
            const xAxisData = opt.xAxis[0].data;
            const seriesData = opt.series.map((serie: any) => serie.data);
            const seriesNames = opt.series.map((serie: any) => serie.name);
    
            let content = '<table style="width:100%;text-align:center"><tbody><tr>';
            content += '<td style="padding: 0 10px;"></td>'; // Celda vacía para alinear la primera columna
    
            for (let i = 0; i < seriesNames.length; i++) {
              content += `<td style="padding: 0 10px;"><strong>${seriesNames[i]}</strong></td>`; // Agregar el nombre de la serie
            }    
            content += '</tr>';
    
            for (let j = 0; j < xAxisData.length; j++) {
              content += '<tr>';
              content += `<td style="padding: 0 10px;">${xAxisData[j]}</td>`; // Agregar el valor del eje X
    
              for (let k = 0; k < seriesData.length; k++) {
                const value = seriesData[k][j] || 'NaN'; // Obtener el valor de la serie o 'NaN' si es nulo
                content += `<td style="padding: 0 10px;">${value}</td>`; // Agregar el valor de la serie
              }
    
              content += '</tr>';
            }
    
            content += '</tbody></table>';
    
            return content;
          },
          title: 'Vista de datos',
          lang: ['Vista de datos', 'Cerrar', 'Actualizar']
        },
        magicType: { type: ['line', 'bar'] },
        restore: {}, saveAsImage: {},
        myTool2: {
          show: true,
          title: 'Mostrar Máximos y Mínimos',
          icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
          onclick: ()=> {
            mostrarValores = !mostrarValores;
            for (let i = 0; i < option.series.length; i++) {

            if (option.series instanceof Array && option.series[i]) {
              option.series[i].markPoint = {
                data: mostrarValores ? [{ type: 'max', name: 'Maximo' }, { type: 'min', name: 'Minimo' }] : []
              };
              option.series[i].markLine = {
                data: mostrarValores ? [
                  { type: 'average', name: 'Promedio' },
                  { yAxis: 'max', name: 'Maximo' },
                  { yAxis: 'min', name: 'Minimo' },

                  [{ symbol: 'none', x: '80%', yAxis: 'max' },
                    {  label: { position: 'start', formatter: 'Maximo' },
                      type: 'max', name: 'Maximo' }
                  ],
                  [{ symbol: 'none', x: '80%', yAxis: 'min' },
                  { label: { position: 'start', formatter: 'Minimo' },
                    type: 'min', name: 'Minimo' }
                  ],
                  [{ symbol: 'none', x: '80%', yAxis: 'average' },
                  { label: { position: 'start', formatter: 'Promedio' },
                    type: 'average', name: 'Promedio' }
                  ]
                ] : []
              };
            }
          }
            myChart.setOption(option);
          }
        }
      
        } },
        tooltip: { trigger: 'axis', axisPointer: { type: 'cross', animation: false, label: { backgroundColor: '#505765' } } },
        legend: { data: dataLegend, left: 10 },
        dataZoom: [{ show: true, realtime: true, start: 0, end: 100 }, { type: 'inside', realtime: true, start: 0, end: 100 }],        
        xAxis: [ { type: 'category', boundaryGap: false, axisLine: { onZero: false }, data: xAxisLabels.map((str: string) => str.replace(' ', '\n')), }, ],
        yAxis: [{ type: 'value' }, { nameLocation: 'start', alignTicks: true, type: 'value', inverse: true }],
        series: series,                        
      };    
      myChart.setOption(option);
    }
    }
  }
}
