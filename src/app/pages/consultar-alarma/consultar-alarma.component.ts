//SISTEMA
import { JsonpClientBackend } from '@angular/common/http';
import { Component, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';

//COMPONENTES
import { AlarmaClass } from 'src/app/core/models/alarma';

//SERVICIOS
import { AlarmaService } from 'src/app/core/services/alarma.service';

@Component({
  selector: 'app-consultar-alarma',
  templateUrl: './consultar-alarma.component.html',
  styleUrls: ['./consultar-alarma.component.css']
})
export class ConsultarAlarmaComponent implements OnInit {
  //VARIABLES DE OBJETOS LIST
  AlarmaConsulta: AlarmaClass[] = [];
  AlarmaConsultaFiltrados: AlarmaClass [] = [];

  //VARIABLES DE DATOS
  propiedadOrdenamiento: string = "cenNro";                                         

  tipoOrdenamiento: number = 1;
  idUsuario: any = 0;

  //FORMULARIOS DE AGRUPACION DE DATOS
  
  constructor(
    private alarmaConsultar: AlarmaService, 
  ) { }

  ngOnInit(): void {
    this.idUsuario = localStorage.getItem('idUsuario');    
    this.alarmaConsultar.obtenerAlarmasCliente(this.idUsuario).subscribe(data => {
      this.AlarmaConsulta = data;  
      this.AlarmaConsultaFiltrados = data;
    });
  }

  //Filtro de Central por código de central.
  esFiltrar(event: Event, campo: string) {
    let txtBuscar = (event.target as HTMLInputElement).value;
    let filtro = txtBuscar
      .replace(/[^\w\s]/g, '')
      .trim()
      .toLowerCase();
    this.AlarmaConsultaFiltrados = [];
    this.AlarmaConsulta.forEach((alarma) => {
      if (
        (campo === 'codigo' && alarma.almId.toString().toLowerCase().includes(filtro)) 
      ) {
        this.AlarmaConsultaFiltrados.push(alarma);
      }
    });
  }

  //Metodos para grilla
  //Almacena en una variable la propiedad por la cual se quiere ordenar la consulta de alarma.
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

  //Valida que exista alguna Alarma en el Usuario que responda al filtro.
  validarFiltradoAlarma(): Boolean {
    if (this.AlarmaConsultaFiltrados.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  esfilaSeleccionadaAlarma(alarma: AlarmaClass) {
    // this.centralNroSeleccionada = centralConsulta.cenNro;    
  }

}
