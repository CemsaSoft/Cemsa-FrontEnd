//SISTEMA
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';

//COMPONENTES
import { CentralConsultaClass } from 'src/app/core/models/centralConsulta';

//SERVICIOS
import { CentralService } from 'src/app/core/services/central.service';

@Component({
  selector: 'app-consultar-central',
  templateUrl: './consultar-central.component.html',
  styleUrls: ['./consultar-central.component.css']
})
export class ConsultarCentralComponent implements OnInit {

//VARIABLES DE OBJETOS LIST
CentralConsulta: CentralConsultaClass[] = [];
CentralConsultaFiltrados: CentralConsultaClass [] = [];

//VARIABLES DE DATOS
titulo: string = '';
propiedadOrdenamiento: string = 'cenNro';


tipoOrdenamiento: number = 1;


//FORMULARIOS DE AGRUPACION DE DATOS

  constructor(
    private fb: FormBuilder,
    private centralRegistrar: CentralService,
    private centralConsultar: CentralService,   
    )    
   { }

  ngOnInit(): void {
    this.centralConsultar.obtenerCentral().subscribe(data => {
      this.CentralConsulta = data;  
      this.CentralConsultaFiltrados = data;
      
  })
  }

  //Valida que exista alguna Central que responda al filtro.
  validarFiltrado(): Boolean {
    if (this.CentralConsultaFiltrados.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  //Filtro de Central por Nombre.
  esFiltrar(event: Event){
    let txtBuscar = (event.target as HTMLInputElement).value;
    let filtro = txtBuscar
      .replace(/[^\w\s]/g, '')
      .trim()
      .toLowerCase();
    this.CentralConsultaFiltrados = [];
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

  
}
