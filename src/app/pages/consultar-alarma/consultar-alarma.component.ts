//SISTEMA
import { Component, OnInit, Output, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';

import {ThemePalette} from '@angular/material/core';

import { MatStepper } from '@angular/material/stepper';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

//COMPONENTES
import { AlarmaConsultaClass } from 'src/app/core/models/alarmaConsulta';

//SERVICIOS
import { AlarmaService } from 'src/app/core/services/alarma.service';

@Component({
  selector: 'app-consultar-alarma',
  templateUrl: './consultar-alarma.component.html',
  styleUrls: ['./consultar-alarma.component.css'],
})

export class ConsultarAlarmaComponent implements OnInit {  
    
  //TABLA Alarmas
  displayedColumnsAlarmas: string[] = ['almId', 'almIdMedicion', 'cenNro', 'serDescripcion', 'almMensaje', 'medValor', 'almFechaHoraBD', 'columnaVacia', 'visto'];
  @ViewChild('paginatorAlarmas', { static: false }) paginatorAlarmas: MatPaginator | undefined;
  @ViewChild('matSortAlarmas', { static: false }) sortAlarmas: MatSort | undefined;
  dataSourceAlarmas: MatTableDataSource<any>;
  pageSizeAlarmas = 15; // Número de elementos por página
  currentPageAlarmas = 1; // Página actual

  //STEPPER
  titulo1 = 'Alarmas';
  titulo2 = '';
  titulo3 = '';
  isStep1Completed = false;
  isStep2Completed = false;
  isStep3Completed = false;

  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;

  //VARIABLES DE OBJETOS LIST
  AlarmaConsulta: AlarmaConsultaClass[] = [];
  AlarmaConsultaFiltrados: AlarmaConsultaClass [] = [];

  //VARIABLES DE DATOS
  propiedadOrdenamiento: string = "almId";                                         

  tipoOrdenamiento: number = 1;
  idUsuario: any = 0;

  public habilitarBoton: boolean = false;  
  isCollapsed1 = false;
  isCollapsed2 = false;
  isCollapsed3 = false;

  //FORMULARIOS DE AGRUPACION DE DATOS
  formfiltro: FormGroup;

  constructor(
    private alarmaConsultar: AlarmaService, 
  ) {     
    this.dataSourceAlarmas = new MatTableDataSource<any>();

    this.formfiltro = new FormGroup({
      nroAlarma: new FormControl(null, []),
      nroCentral: new FormControl(null, []),
      nroMed: new FormControl(null, []),
      nombreServ: new FormControl(null, []),
      nombreMensaje: new FormControl(null, []),
      valorMed: new FormControl(null, []),
      fecha_desde: new FormControl(null, []),
      fecha_hasta: new FormControl(null, []),
    });
  }

  ngOnInit(): void {
    this.idUsuario = localStorage.getItem('idUsuario');    
    this.alarmaConsultar.obtenerAlarmasClienteModificaEstado(this.idUsuario).subscribe(data => {
      this.AlarmaConsulta = data.sort((a: { almId: number; }, b: { almId: number; }) => b.almId - a.almId);
      this.AlarmaConsultaFiltrados = data.sort((a: { almId: number; }, b: { almId: number; }) => b.almId - a.almId);       
    
      this.dataSourceAlarmas = new MatTableDataSource(this.AlarmaConsultaFiltrados);
      if (this.paginatorAlarmas) {
        this.dataSourceAlarmas.paginator = this.paginatorAlarmas;
      }
      if (this.sortAlarmas) {
        this.dataSourceAlarmas.sort = this.sortAlarmas;
      }
    
    });    

    this.formfiltro.get('fecha_desde')?.disable();
    this.formfiltro.get('fecha_hasta')?.disable();
  }

  handlePageChangeAlarmas(event: any) {
    this.currentPageAlarmas = event.pageIndex + 1;
    this.pageSizeAlarmas = event.pageSize;
  }

  //Filtro de Alarmas
  esFiltrar(event: Event) {
    const filtronNoAlarma = ((this.formfiltro.get('nroAlarma') as FormControl).value ?? "").toLowerCase();
    const filtroNroCentral = ((this.formfiltro.get('nroCentral') as FormControl).value ?? "").toLowerCase();
    const filtroNroMed = ((this.formfiltro.get('nroMed') as FormControl).value ?? "").toLowerCase();
    const filtronNombreServ = ((this.formfiltro.get('nombreServ') as FormControl).value ?? "").toLowerCase();
    const filtroNombreMensaje = ((this.formfiltro.get('nombreMensaje') as FormControl).value ?? "").toLowerCase();
    const filtroValorMed = ((this.formfiltro.get('valorMed') as FormControl).value ?? "").toLowerCase();

    this.AlarmaConsultaFiltrados = this.AlarmaConsulta.filter((alarma) => {
      const valorAlmId= alarma.almId.toString().toLowerCase();
      const valorCenNro = alarma.cenNro.toString().toLowerCase();
      const valorAlmIdMedicion = alarma.almIdMedicion.toString().toLowerCase();
      const valorSerDescripcion= alarma.serDescripcion.toString().toLowerCase();
      const valorAlmMensaje = alarma.almMensaje.toString().toLowerCase();
      const valorMedValor = alarma.medValor.toString().toLowerCase();

      return (
        (!filtronNoAlarma || valorAlmId.includes(filtronNoAlarma)) &&
        (!filtroNroCentral || valorCenNro.includes(filtroNroCentral)) &&
        (!filtroNroMed || valorAlmIdMedicion.includes(filtroNroMed)) &&
        (!filtronNombreServ || valorSerDescripcion.includes(filtronNombreServ)) &&
        (!filtroNombreMensaje || valorAlmMensaje.includes(filtroNombreMensaje)) &&
        (!filtroValorMed || valorMedValor.includes(filtroValorMed))
      );
    });

    this.dataSourceAlarmas = new MatTableDataSource(this.AlarmaConsultaFiltrados);
    if (this.paginatorAlarmas) {
      this.dataSourceAlarmas.paginator = this.paginatorAlarmas;
    }
    if (this.sortAlarmas) {
      this.dataSourceAlarmas.sort = this.sortAlarmas;
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
      
    // if (desde.getTime() === hasta.getTime()) {
      // Agregar un día a la fecha 'hasta'
      hasta.setDate(hasta.getDate() + 1);

      const filtronNoAlarma = (this.formfiltro.get('nroAlarma') as FormControl).value?.toLowerCase();
      const filtroNroCentral = (this.formfiltro.get('nroCentral') as FormControl).value?.toLowerCase();
      const filtroNroMed = (this.formfiltro.get('nroMed') as FormControl).value?.toLowerCase();
      const filtronNombreServ = (this.formfiltro.get('nombreServ') as FormControl).value?.toLowerCase();
      const filtroNombreMensaje = (this.formfiltro.get('nombreMensaje') as FormControl).value?.toLowerCase();
      const filtroValorMed = (this.formfiltro.get('valorMed') as FormControl).value?.toLowerCase();

      this.AlarmaConsultaFiltrados = this.AlarmaConsulta.filter((alarma) => {
      const valorAlmId= alarma.almId.toString().toLowerCase();
      const valorCenNro = alarma.cenNro.toString().toLowerCase();
      const valorAlmIdMedicion = alarma.almIdMedicion.toString().toLowerCase();
      const valorSerDescripcion= alarma.serDescripcion.toString().toLowerCase();
      const valorAlmMensaje = alarma.almMensaje.toString().toLowerCase();
      const valorMedValor = alarma.medValor.toString().toLowerCase();
      const fechaAlarma = new Date(alarma.almFechaHoraBD);

      return (
        (!filtronNoAlarma || valorAlmId.includes(filtronNoAlarma)) &&
        (!filtroNroCentral || valorCenNro.includes(filtroNroCentral)) &&
        (!filtroNroMed || valorAlmIdMedicion.includes(filtroNroMed)) &&
        (!filtronNombreServ || valorSerDescripcion.includes(filtronNombreServ)) &&
        (!filtroNombreMensaje || valorAlmMensaje.includes(filtroNombreMensaje)) &&
        (!filtroValorMed || valorMedValor.includes(filtroValorMed)) &&
        (fechaAlarma >= desde && fechaAlarma <= hasta)
      );
      });

      // this.AlarmaConsultaFiltrados = this.AlarmaConsulta.filter((alarma) => {
      //   const fechaAlarma = new Date(alarma.almFechaHoraBD);
      //   return fechaAlarma >= desde && fechaAlarma < hasta;
      // });
    }

    this.dataSourceAlarmas = new MatTableDataSource(this.AlarmaConsultaFiltrados);
    if (this.paginatorAlarmas) {
      this.dataSourceAlarmas.paginator = this.paginatorAlarmas;
    }
    if (this.sortAlarmas) {
      this.dataSourceAlarmas.sort = this.sortAlarmas;
    }
  }

  // valida para que un solo selector de frecuencia este seleccionado a la vez
  filtroFecha(event: any) {
    if (event.checked === true) {
      this.formfiltro.get('nroAlarma')?.disable();
      this.formfiltro.get('nroCentral')?.disable();
      this.formfiltro.get('nroMed')?.disable();
      this.formfiltro.get('nombreServ')?.disable();
      this.formfiltro.get('nombreMensaje')?.disable();
      this.formfiltro.get('valorMed')?.disable();
      this.formfiltro.get('fecha_desde')?.enable();
      this.formfiltro.get('fecha_hasta')?.enable();
      this.habilitarBoton = true;
    }
    else {
      this.formfiltro.get('nroAlarma')?.enable();      
      this.formfiltro.get('nroCentral')?.enable();
      this.formfiltro.get('nroMed')?.enable();
      this.formfiltro.get('nombreServ')?.enable();
      this.formfiltro.get('nombreMensaje')?.enable();
      this.formfiltro.get('valorMed')?.enable();
      this.formfiltro.get('fecha_desde')?.disable();
      this.formfiltro.get('fecha_hasta')?.disable();
      this.habilitarBoton = false;
    }
  }
    
  //Valida que exista alguna Alarma en el Usuario que responda al filtro.
  validarFiltradoAlarma(): Boolean {
    if (this.AlarmaConsultaFiltrados.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  esfilaSeleccionadaAlarma(alarma: AlarmaConsultaClass) {
    // this.centralNroSeleccionada = centralConsulta.cenNro;    
  }
 
}
