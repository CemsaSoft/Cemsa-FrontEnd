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
import { AlarmaConsultaClass } from 'src/app/core/models/alarmaConsulta';
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
  AlarmaConsulta: AlarmaConsultaClass[] = [];
  AlarmaConsultaFiltrados: AlarmaConsultaClass [] = [];

  //VARIABLES DE DATOS
  propiedadOrdenamiento: string = "almId";                                         

  tipoOrdenamiento: number = 1;
  idUsuario: any = 0;

  public habilitarBoton: boolean = false;

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
  esFiltrar(event: Event, campo: string) {  
    let txtBuscar = (event.target as HTMLInputElement).value;
    let filtro = txtBuscar
      .replace(/[^\w\s]/g, '')
      .trim()
      .toLowerCase();
    this.AlarmaConsultaFiltrados = [];
    this.AlarmaConsulta.forEach((alarma) => { 
      if (
        (campo === 'nroAlarma' && alarma.almId.toString().toLowerCase().includes(filtro)) ||
        (campo === 'nroCentral' && alarma.cenNro.toString().toLowerCase().includes(filtro)) ||
        (campo === 'nroMed' && alarma.almIdMedicion.toString().toLowerCase().includes(filtro)) ||
        (campo === 'nombreServ' && alarma.serDescripcion.toString().toLowerCase().includes(filtro)) ||
        (campo === 'nombreMensaje' && alarma.almMensaje.toString().toLowerCase().includes(filtro)) ||
        (campo === 'valorMed' && alarma.medValor.toString().toLowerCase().includes(filtro))         
      ) {
        this.AlarmaConsultaFiltrados.push(alarma);
      }
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
      this.AlarmaConsultaFiltrados = this.AlarmaConsulta.filter((alarma) => {
        const fechaAlarma = new Date(alarma.almFechaHoraBD);
        return fechaAlarma >= desde && fechaAlarma < hasta;
      });
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
