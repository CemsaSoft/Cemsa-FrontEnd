//SISTEMA
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { Map, Marker, icon } from 'leaflet';
import * as L from 'leaflet';

//COMPONENTES
import { CentralConsultaClass } from 'src/app/core/models/centralConsulta';
import { CentralClass } from 'src/app/core/models/central';
import { ServicioClass } from 'src/app/core/models/servicio';

//SERVICIOS
import { CentralService } from 'src/app/core/services/central.service';

@Component({
  selector: 'app-consultar-centrales-cliente',
  templateUrl: './consultar-centrales-cliente.component.html',
  styleUrls: ['./consultar-centrales-cliente.component.css']
})
export class ConsultarCentralesClienteComponent implements OnInit {

//VARIABLES DE OBJETOS LIST
CentralConsulta: CentralConsultaClass[] = [];
CentralConsultaFiltrados: CentralConsultaClass [] = [];
ServiciosDeCentral: ServicioClass [] = [];

//VARIABLES DE DATOS
propiedadOrdenamiento: string = 'cenNro';
propiedadOrdenamientoServicioCentral: string = 'serId';

tipoOrdenamiento: number = 1;
tipoOrdenamientoServicioCentral: number = 1;
centralNroSeleccionada: number=0;
idUsuario: any = 0;
coordenadaXSeleccionado: string = '';
coordenadaYSeleccionado: string = '';

isCollapsed1 = false;
isCollapsed2 = false;
isCollapsed3 = false;

map: L.Map | undefined;
marker: L.Marker | undefined;


  constructor(
    private centralConsultar: CentralService, 
  ) { 
    this.map = undefined;
    this.marker = undefined;
  }

  ngOnInit(): void {
    this.idUsuario = localStorage.getItem('idUsuario');    
    this.centralConsultar.listaCentralesCliente(this.idUsuario).subscribe(data => {
      this.CentralConsulta = data;  
      this.CentralConsultaFiltrados = data;
    });

    this.coordenadaXSeleccionado = '-31.420083';
    this.coordenadaYSeleccionado = '-64.188776';

    this.map = L.map('map').setView([-31.420083, -64.188776], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(this.map);
  }

  toggleCollapse1() {
    this.isCollapsed1 = !this.isCollapsed1;
  }

  toggleCollapse2() {
    this.isCollapsed2 = !this.isCollapsed2;
  }

  toggleCollapse3() {
    this.isCollapsed3 = !this.isCollapsed3;
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

  //Almacena los datos del servicio que fue seleccionado en la tabla de servicio filtrados dentro de variables locales.
  esfilaSeleccionada(centralConsulta: CentralConsultaClass) {
    this.centralNroSeleccionada = centralConsulta.cenNro;
    this.coordenadaXSeleccionado = centralConsulta.cenCoorX;
    this.coordenadaYSeleccionado = centralConsulta.cenCoorY;  

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
  }

  //Filtro de Central por código de central.
  esFiltrar(event: Event, campo: string) {
    let txtBuscar = (event.target as HTMLInputElement).value;
    let filtro = txtBuscar
      .replace(/[^\w\s]/g, '')
      .trim()
      .toLowerCase();
    this.CentralConsultaFiltrados = [];
    this.CentralConsulta.forEach((centralConsulta) => {
      if (
        (campo === 'codigo' && centralConsulta.cenNro.toString().toLowerCase().includes(filtro)) 
      ) {
        this.CentralConsultaFiltrados.push(centralConsulta);
      }
    });
  }

  //Metodos para grilla
  //Almacena en una variable la propiedad por la cual se quiere ordenar la consulta de Central.
  ordenarPor(propiedad: string) {
    this.tipoOrdenamiento =
      propiedad === this.propiedadOrdenamiento ? this.tipoOrdenamiento * -1 : 1;
    this.propiedadOrdenamiento = propiedad;
  }

  //En base a la propiedad por la que se quiera ordenar y el tipo de orden muestra un icono.
  ordenarIcono(propiedad: string) {
    if (propiedad === this.propiedadOrdenamiento) {
      return this.tipoOrdenamiento === 1 ? '🠉' : '🠋';
    } else {
      return '🠋🠉';
    }
  }  

  //Almacena en una variable la propiedad por la cual se quiere ordenar la consulta de Servicio Central.
  ordenarServicioCentralPor(propiedad: string) {
    this.tipoOrdenamientoServicioCentral =
      propiedad === this.propiedadOrdenamientoServicioCentral ? this.tipoOrdenamientoServicioCentral * -1 : 1;
    this.propiedadOrdenamientoServicioCentral = propiedad;
  }

  //En base a la propiedad por la que se quiera ordenar y el tipo de orden muestra un icono.
  ordenarIconoServicioCentral(propiedad: string) {
    if (propiedad === this.propiedadOrdenamientoServicioCentral) {
      return this.tipoOrdenamientoServicioCentral === 1 ? '🠉' : '🠋';
    } else {
      return '🠋🠉';
    }
  }

  seleccionarCentral(){
    this.centralConsultar.obtenerServiciosXCentral(this.centralNroSeleccionada).subscribe(data => {
      this.ServiciosDeCentral = data; 
    })
    this.isCollapsed1 = !this.isCollapsed1;
  }
}
