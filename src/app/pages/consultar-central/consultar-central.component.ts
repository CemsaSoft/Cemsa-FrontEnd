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
}
