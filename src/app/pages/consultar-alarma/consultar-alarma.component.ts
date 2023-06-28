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
import { NgModule } from '@angular/core';

import {ThemePalette} from '@angular/material/core';
import {FormsModule} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import {ReactiveFormsModule} from '@angular/forms';
import {NgIf, JsonPipe} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';

import { MatDateRangeInput, MatDateRangePicker, MatStartDate, MatEndDate } from '@angular/material/datepicker';



//COMPONENTES
import { AlarmaConsultaClass } from 'src/app/core/models/alarmaConsulta';
import { AlarmaClass } from 'src/app/core/models/alarma';

//SERVICIOS
import { AlarmaService } from 'src/app/core/services/alarma.service';

@Component({
  selector: 'app-consultar-alarma',
  templateUrl: './consultar-alarma.component.html',
  styleUrls: ['./consultar-alarma.component.css'],
})

export class ConsultarAlarmaComponent implements OnInit {  
    
  // Reemplaza el código del formulario actual con el siguiente código

range = new FormGroup({
  start: new FormControl(null),
  end: new FormControl(null),
});


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
    });    

    this.formfiltro.get('fecha_desde')?.disable();
    this.formfiltro.get('fecha_hasta')?.disable();
  }

  //Filtro de Alarmas
  esFiltrar(event: Event) {
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

      return (
        (!filtronNoAlarma || valorAlmId.includes(filtronNoAlarma)) &&
        (!filtroNroCentral || valorCenNro.includes(filtroNroCentral)) &&
        (!filtroNroMed || valorAlmIdMedicion.includes(filtroNroMed)) &&
        (!filtronNombreServ || valorSerDescripcion.includes(filtronNombreServ)) &&
        (!filtroNombreMensaje || valorAlmMensaje.includes(filtroNombreMensaje)) &&
        (!filtroValorMed || valorMedValor.includes(filtroValorMed))
      );
    });
  }
  
  
  //filtro de Alarma por Fecha
  filtarXFechas(){
    var hoy = new Date();
    var desde = new Date();
    var hasta = new Date();

    var fechaDesde = document.getElementById('fecha_desde') as HTMLInputElement;
    var fechaSeleccionada = new Date(fechaDesde.value);
    fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1); // Sumar un día
    fechaSeleccionada.setHours(0, 0, 0, 0);
    desde = fechaSeleccionada;

    var fechaHasta = document.getElementById('fecha_hasta') as HTMLInputElement;
    fechaSeleccionada = new Date(fechaHasta.value);
    fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1); // Sumar un día
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

    if (isNaN(desde.getTime())) {
      mostrarError('Ingrese una fecha de desde válida.', 'Por favor, ingrese una fecha de hasta válida para generar el filtro.');
    } else if (isNaN(hasta.getTime())) {
      mostrarError('Ingrese una fecha de hasta válida.', 'Por favor, ingrese una fecha de hasta válida para generar el filtro.');
    } else if (desde > hasta) {
      mostrarError('La fecha "desde" es posterior a la fecha "hasta".', 'Por favor, cambie el rango de fechas seleccionado para generar el filtro.');
    } else if (hasta > hoy) {
      mostrarError('La fecha "desde" no puede ser posterior a la fecha actual.', 'Por favor, cambie el rango de fechas seleccionado para generar el filtro.');
    } else {
      
      hasta.setDate(hasta.getDate() + 1); // Sumar un día al valor de 'hasta'

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
        (fechaAlarma >= desde && fechaAlarma < hasta)
      );
      });

      // this.AlarmaConsultaFiltrados = this.AlarmaConsulta.filter((alarma) => {
      //   const fechaAlarma = new Date(alarma.almFechaHoraBD);
      //   return fechaAlarma >= desde && fechaAlarma < hasta;
      // });
    }
  }

  // valida para que un solo selector de frecuencia este seleccionado a la vez
  filtroFecha(event: any) {
    if (event.target.checked === true) {
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

  esfilaSeleccionadaAlarma(alarma: AlarmaConsultaClass) {
    // this.centralNroSeleccionada = centralConsulta.cenNro;    
  }

}
