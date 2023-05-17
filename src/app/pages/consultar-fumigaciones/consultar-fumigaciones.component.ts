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
import { FumigacionesClass } from 'src/app/core/models/fumigaciones'; 

//SERVICIOS
import { CentralService } from 'src/app/core/services/central.service';
import { FumigacionesService } from 'src/app/core/services/fumigaciones.service';

@Component({
  selector: 'app-consultar-fumigaciones',
  templateUrl: './consultar-fumigaciones.component.html',
  styleUrls: ['./consultar-fumigaciones.component.css']
})
export class ConsultarFumigacionesComponent implements OnInit {
  //VARIABLES DE OBJETOS LIST
  CentralConsulta: CentralConsultaClass[] = [];
  CentralConsultaFiltrados: CentralConsultaClass [] = [];
  Fumigaciones: FumigacionesClass[] =[];

  //VARIABLES DE DATOS
  propiedadOrdenamiento: string = 'cenNro';
  propiedadOrdenamientoFum: string = 'fumId';

  tipoOrdenamiento: number = 1;
  tipoOrdenamientoFum: number = 1;
  centralNroSeleccionada: number=0;
  idUsuario: any = 0;

  isCollapsed1 = false;
  isCollapsed2 = false;

  constructor(
    private centralConsultar: CentralService, 
    private fumigacionesConsulta: FumigacionesService
  ) { }

  ngOnInit(): void {
    this.idUsuario = localStorage.getItem('idUsuario');    
    this.centralConsultar.listaCentralesCliente(this.idUsuario).subscribe(data => {
      this.CentralConsulta = data;  
      this.CentralConsultaFiltrados = data;
    });
  }

  toggleCollapse1() {
    this.isCollapsed1 = !this.isCollapsed1;
  }

  toggleCollapse2() {
    this.isCollapsed2 = !this.isCollapsed2;
  }

  //Valida que exista alguna Central que responda al filtro.
  validarFiltrado(): Boolean {
    if (this.CentralConsultaFiltrados.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  //Valida que exista alguna Fumigación en Central que responda al filtro.
  validarFiltradoFumigacion(): Boolean {
    if (this.Fumigaciones.length == 0) {
      return false;
    } else {
      return true;
    }
  }
  
  //Almacena los datos del servicio que fue seleccionado en la tabla de servicio filtrados dentro de variables locales.
  esfilaSeleccionada(centralConsulta: CentralConsultaClass) {
    this.centralNroSeleccionada = centralConsulta.cenNro;    
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

  //Almacena en una variable la propiedad por la cual se quiere ordenar la consulta de fumigaciones.
  ordenarPorFum(propiedad: string) {
    this.tipoOrdenamientoFum =
      propiedad === this.propiedadOrdenamientoFum ? this.tipoOrdenamientoFum * -1 : 1;
    this.propiedadOrdenamientoFum = propiedad;
  }

  //En base a la propiedad por la que se quiera ordenar y el tipo de orden muestra un icono.
  ordenarIconoFum(propiedad: string) {
    if (propiedad === this.propiedadOrdenamientoFum) {
      return this.tipoOrdenamientoFum === 1 ? '🠉' : '🠋';
    } else {
      return '🠋🠉';
    }
  }  

  seleccionarCentral(){
    this.fumigacionesConsulta.obtenerFumigacionesDeCentral(this.centralNroSeleccionada).subscribe(data => {
      this.Fumigaciones = data; 
    })

    this.isCollapsed1 = !this.isCollapsed1;
  }
}
