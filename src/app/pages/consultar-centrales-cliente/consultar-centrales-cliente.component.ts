//SISTEMA
import { Component, OnInit, AfterViewInit , ViewChild } from '@angular/core';
import * as L from 'leaflet';

import { MatStepper } from '@angular/material/stepper';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

//COMPONENTES
import { CentralConsultaClass } from 'src/app/core/models/centralConsulta';
import { ServicioEstadoClass } from 'src/app/core/models/servicioEstado';

//SERVICIOS
import { CentralService } from 'src/app/core/services/central.service';

@Component({
  selector: 'app-consultar-centrales-cliente',
  templateUrl: './consultar-centrales-cliente.component.html',
  styleUrls: ['./consultar-centrales-cliente.component.css']
})

export class ConsultarCentralesClienteComponent implements OnInit, AfterViewInit  {  

  //TABLA Central
  displayedColumnsCentral: string[] = ['cenNro', 'cenImei', 'cenCoorX', 'cenCoorY', 'estDescripcion', 'columnaVacia', 'seleccionar'];
  @ViewChild('paginatorCentral', { static: false }) paginatorCentral: MatPaginator | undefined;
  @ViewChild('matSortCentral', { static: false }) sortCentral: MatSort | undefined;
  dataSourceCentral: MatTableDataSource<any>;
  pageSizeCentral = 5; // Número de elementos por página
  currentPageCentral = 1; // Página actual

  //TABLA Servicios
  displayedColumnsServicio: string[] = ['serId', 'serDescripcion', 'serUnidad', 'estDescripcion'];
  @ViewChild('matSortServicio', { static: false }) sortServicio: MatSort | undefined;
  @ViewChild('paginatorServicio', { static: false }) paginatorServicio: MatPaginator | undefined;
  dataSourceServicio: MatTableDataSource<any>;
  pageSizeServicio = 5; // Número de elementos por página
  currentPageServicio = 1; // Página actual

  //STEPPER
  titulo1 = 'Seleccionar Central para Ver sus Datos';
  titulo2 = 'Datos de la Central N°:';
  titulo3 = ':';
  isStep1Completed = false;
  isStep2Completed = false;
  isStep3Completed = false;

  @ViewChild(MatStepper, { static: false }) stepper: MatStepper | undefined;

  //VARIABLES DE OBJETOS LIST
  CentralConsulta: CentralConsultaClass[] = [];
  CentralConsultaFiltrados: CentralConsultaClass [] = [];
  ServiciosDeCentral: ServicioEstadoClass [] = [];

  //VARIABLES DE DATOS
  centralNroSeleccionada: number=0;
  idUsuario: any = 0;
  coordenadaXSeleccionado: string = '';
  coordenadaYSeleccionado: string = '';
  filtroCentral: string = '';

  isCollapsed1 = false;
  isCollapsed2 = false;
  isCollapsed3 = false;

  map: L.Map | undefined;
  marker: L.Marker | undefined;

  constructor(
    private centralConsultar: CentralService, 
  ) { 
      this.dataSourceCentral = new MatTableDataSource<any>();
      this.dataSourceServicio = new MatTableDataSource<any>();

      this.map = undefined;
      this.marker = undefined;
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

  }

  ngAfterViewInit(): void {
    this.coordenadaXSeleccionado = '-31.420083';
    this.coordenadaYSeleccionado = '-64.188776';

    this.map = L.map('map').setView([-31.420083, -64.188776], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(this.map);

  }

  handlePageChangeCentral(event: any) {
    this.currentPageCentral = event.pageIndex + 1;
    this.pageSizeCentral = event.pageSize;
  }

  handlePageChangeServicio(event: any) {
    this.currentPageServicio = event.pageIndex + 1;
    this.pageSizeServicio = event.pageSize;
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

  //Valida que exista alguna Central que responda al filtro.
  validarFiltrado(): Boolean {
    if (this.CentralConsultaFiltrados.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  //Valida que exista algún servicio que responda al seleccionado.
  validarFiltradoServiciosDeCentral(): Boolean {   
    if (this.ServiciosDeCentral.length == 0) {
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
  
  seleccionarCentral(element: any) {
    this.centralConsultar.obtenerServicioXCentralEstado(element.cenNro).subscribe(data => {
      this.ServiciosDeCentral = data; 

      this.dataSourceServicio = new MatTableDataSource(data);
      if (this.paginatorServicio) {
        this.dataSourceServicio.paginator = this.paginatorServicio;
        this.paginatorServicio.firstPage();
      }
      if (this.sortServicio) {
        this.dataSourceServicio.sort = this.sortServicio;
      }

    })
    this.isCollapsed1 = !this.isCollapsed1;
    this.titulo2 = 'Datos de la Central N°' + element.cenNro + ':';

    this.centralNroSeleccionada = element.cenNro;
    this.coordenadaXSeleccionado = element.cenCoorX;
    this.coordenadaYSeleccionado = element.cenCoorY;  

    // Si no existe un marcador en el mapa, lo creamos y lo agregamos al mapa
    if (!this.marker) {
      if (this.map) {
        this.marker = new L.Marker([parseFloat(this.coordenadaXSeleccionado), parseFloat(this.coordenadaYSeleccionado)]).addTo(this.map);
      }
    } else {      
      const newLatLng = L.latLng(parseFloat(this.coordenadaXSeleccionado), parseFloat(this.coordenadaYSeleccionado));
      this.marker.setLatLng(newLatLng);
    }
    if (this.map) {
      this.map.setView([parseFloat(this.coordenadaXSeleccionado), parseFloat(this.coordenadaYSeleccionado)], 10);
    }
    this.goToNextStep(1)
  }

}