//SISTEMA
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';

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
  
//VARIABLES DE OBJETOS LIST
CentralConsulta: CentralConsultaClass[] = [];
CentralConsultaFiltrados: CentralConsultaClass [] = [];
Mediciones : MedicionesClass[] = []; 
ServiciosCentral: ServicioClass[] = [];
ServiciosGraficar: ServicioClass[] = [];

//VARIABLES DE DATOS
propiedadOrdenamiento: string = 'cenNro';
propiedadOrdenamientoServicio: string = 'serId';
propiedadOrdenamientoServicioGraficar: string = 'serId';

tipoOrdenamiento: number = 1;
centralNroSeleccionada: number=0;
tipoOrdenamientoServicio: number = 1;
tipoOrdenamientoServicioGraficar: number = 1;
idUsuario: any = 0;
idListaServiciosSeleccionado: number=0;
idListaServiciosGraficarSeleccionado: number=0;

isCollapsed1 = false;
isCollapsed2 = false;
ingresoDireViento = false;

constructor(
  private centralConsultar: CentralService, 
  private medicionesConsultar: MedicionesService, 
  private servicioConsultar: ServicioService,
) { }

  ngOnInit(): void {
    this.idUsuario = localStorage.getItem('idUsuario');    
    this.centralConsultar.listaCentralesCliente(this.idUsuario).subscribe(data => {
      this.CentralConsulta = data;  
      this.CentralConsultaFiltrados = data;
    });

    this.medicionesConsultar.obtenerMediciones(1).subscribe(data => {
      this.Mediciones = data; 
      console.log("Mediciones");
      console.log(this.Mediciones);
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
  
  //Almacena los datos del servicio que fue seleccionado en la tabla de servicio filtrados dentro de variables locales.
  esfilaSeleccionada(centralConsulta: CentralConsultaClass) {
    this.centralNroSeleccionada = centralConsulta.cenNro;
  }

     //Almacena los datos del servicio que fue seleccionado en la tabla de servicio filtrados dentro de variables locales.
  esfilaSeleccionadaServicio(servicios: ServicioClass) {
    this.idListaServiciosSeleccionado = servicios.serId;      
  }

  //Almacena los datos del servicio que fue seleccionado en la tabla de servicio filtrados dentro de variables locales.
  esfilaSeleccionadaServicioGraficar(servicios: ServicioClass) {      
    this.idListaServiciosGraficarSeleccionado = servicios.serId;
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
  
  //En base a la propiedad por la que se quiera ordenar y el tipo de orden muestra un icono.
  ordenarIconoServicio(propiedad: string) {
    if (propiedad === this.propiedadOrdenamientoServicio) {
      return this.tipoOrdenamientoServicio === 1 ? '🠉' : '🠋';
    } else {
      return '🠋🠉';
    }
  }

  //Almacena en una variable la propiedad por la cual se quiere ordenar la consulta de Servicio.
  ordenarServicioPor(propiedad: string) {
    this.tipoOrdenamientoServicio =
      propiedad === this.propiedadOrdenamientoServicio ? this.tipoOrdenamientoServicio * -1 : 1;
    this.propiedadOrdenamientoServicio = propiedad;
  }

  //Almacena en una variable la propiedad por la cual se quiere ordenar la consulta de Servicio Graficar.
  ordenarServicioGraficarPor(propiedad: string) {
    this.tipoOrdenamientoServicioGraficar =
      propiedad === this.propiedadOrdenamientoServicioGraficar ? this.tipoOrdenamientoServicioGraficar * -1 : 1;
    this.propiedadOrdenamientoServicioGraficar = propiedad;
  }

  //En base a la propiedad por la que se quiera ordenar y el tipo de orden muestra un icono.
  ordenarIconoServicioGraficar(propiedad: string) {
    if (propiedad === this.propiedadOrdenamientoServicioGraficar) {
      return this.tipoOrdenamientoServicioGraficar === 1 ? '🠉' : '🠋';
    } else {
      return '🠋🠉';
    }
  }

    // Extraer servicios a la central selecciona
  agregarServicio(servicios: ServicioClass): void { 
    if ( (servicios.serTipoGrafico==5 && this.ServiciosGraficar.length>0) || (this.ingresoDireViento) ) {           
      Swal.fire({
        title: 'Error',
        text: `Dirección del Viento No se puede graficar con otro servicio`,      
  
        icon: 'warning',
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
        footer: 'Extraer Servicios de la Lista para Graficar.'
      });     
    } else {    
      if (servicios.serTipoGrafico==5)  { this.ingresoDireViento = true; }
      const index = this.ServiciosCentral.indexOf(servicios);
      if (index !== -1) {
        this.ServiciosCentral.splice(index, 1);
        this.ServiciosGraficar.push(servicios);
      }
      this.validarFiltradoServicios();  
    }
  }

  // Extraer servicios a la central selecciona
  extraerServicio(servicios: ServicioClass): void {
        if (servicios.serTipoGrafico==5)  { this.ingresoDireViento = false; }
    const index = this.ServiciosGraficar.indexOf(servicios);
    if (index !== -1) {
      this.ServiciosGraficar.splice(index, 1);
      this.ServiciosCentral.push(servicios);
    }
    this.validarFiltradoServiciosGraficar();  
  } 

  seleccionarCentral(){
    this.isCollapsed1 = !this.isCollapsed1;
    this.ServiciosGraficar = [];
    this.ingresoDireViento = false;
    this.centralConsultar.obtenerServicioXCentralEstado(this.centralNroSeleccionada).subscribe(data => {
      this.ServiciosCentral = data;  
      console.log(this.ServiciosCentral);
    })    
  }
}
