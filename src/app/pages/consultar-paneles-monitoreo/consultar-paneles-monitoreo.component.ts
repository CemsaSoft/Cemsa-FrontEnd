//SISTEMA
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';

//COMPONENTES
import { CentralConsultaClass } from 'src/app/core/models/centralConsulta';
import { MedicionesClass } from 'src/app/core/models/mediciones';

//SERVICIOS
import { CentralService } from 'src/app/core/services/central.service';
import { MedicionesService } from 'src/app/core/services/mediciones.service';

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

//VARIABLES DE DATOS
propiedadOrdenamiento: string = 'cenNro';

tipoOrdenamiento: number = 1;
centralNroSeleccionada: number=0;
idUsuario: any = 0;

isCollapsed1 = false;

constructor(
  private centralConsultar: CentralService, 
  private medicionesConsultar: MedicionesService, 
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

  //Valida que exista alguna Central que responda al filtro.
  validarFiltrado(): Boolean {
    if (this.CentralConsultaFiltrados.length == 0) {
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

  seleccionarCentral(){

    
  }
}
