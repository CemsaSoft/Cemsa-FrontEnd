//SISTEMA
import { JsonpClientBackend } from '@angular/common/http';
import { Component, OnInit, Output, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { MatStepper } from '@angular/material/stepper';


//COMPONENTES
import { CentralConsultaClass } from 'src/app/core/models/centralConsulta';
import { FumigacionesClass } from 'src/app/core/models/fumigaciones'; 

//SERVICIOS
import { CentralService } from 'src/app/core/services/central.service';
import { FumigacionesService } from 'src/app/core/services/fumigaciones.service';

@Component({
  selector: 'app-registrar-fumigacion',
  templateUrl: './registrar-fumigacion.component.html',
  styleUrls: ['./registrar-fumigacion.component.css'],
})


export class RegistrarFumigacionComponent implements OnInit {
  //STEPPER
  titulo1 = 'Seleccionar Central para Registar Fumigaciones';
  titulo2 = 'Registrar Fumigaciones a la Central N°:';
  titulo3 = ':';
  isStep1Completed = false;
  isStep2Completed = false;
  isStep3Completed = false;

  @ViewChild(MatStepper, { static: false }) stepper: MatStepper | undefined;
 
  //VARIABLES DE OBJETOS LIST
  CentralConsulta: CentralConsultaClass[] = [];
  CentralConsultaFiltrados: CentralConsultaClass [] = [];
  Fumigaciones: FumigacionesClass[] =[];

  //VARIABLES DE DATOS
  propiedadOrdenamiento: string = "cenNro";
  titulo: string = '';
  caracteresValidosObservacion: string = "No se admiten: ! # $ & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
                                        
  tipoOrdenamiento: number = 1;
  centralNroSeleccionada: number=0;
  idUsuario: any = 0;
  validadorCamposAgregar: string = '1';

  //PAGINADO
  pageSizeCentral = 5; // Número de elementos por página
  currentPageCentral = 1; // Página actual
  totalItemsCentral = 0; // Total de elementos en la tabla

  isCollapsed1 = false;
  isCollapsed2 = false;

  //FORMULARIOS DE AGRUPACION DE DATOS
  formAgregar: FormGroup;
  
  constructor(
    private centralConsultar: CentralService, 
    private fumigacionesConsulta: FumigacionesService
  ) {    
    this.formAgregar = new FormGroup({
      nroCentralA: new FormControl(null, []),
      fechaRealizacionA: new FormControl(null, []),
      observacionA: new FormControl(null, [
        Validators.pattern("^[A-Za-zÑñáéíóúÁÉÍÓÚ'°0-9/%ºª ]{1,}$"),
      ]),
    });
  }
  
  ngOnInit(): void {
    this.idUsuario = localStorage.getItem('idUsuario');    
    this.centralConsultar.listaCentralesCliente(this.idUsuario).subscribe(data => {
      this.CentralConsulta = data;  
      this.CentralConsultaFiltrados = data;
    });
  }

  set nroCentralA(valor: any) {
    this.formAgregar.get('nroCentralA')?.setValue(valor);
  }
  // set fechaRealizacionA(valor: any) {
  //   this.formAgregar.get('fechaRealizacionA')?.setValue(valor);
  // }
  set observacionA(valor: any) {
    this.formAgregar.get('observacionA')?.setValue(valor);
  }

  get nroCentralA() {
    return this.formAgregar.get('nroCentralA');
  }
  // get fechaRealizacionA() {
  //   return this.formAgregar.get('fechaRealizacionA');
  // }
  get observacionA() {
    return this.formAgregar.get('observacionA');
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
    this.nroCentralA = this.centralNroSeleccionada;
    this.isCollapsed1 = !this.isCollapsed1;
    this.titulo2 = 'Registrar Fumigaciones a la Central N°:' + this.nroCentralA;
  }

  //Valida que los campos descripcion y uniddad se encuentren correctamente ingresados.
  validarControlesAgregar(): string {
    if (this.formAgregar.valid == false) {
      return (this.validadorCamposAgregar = '2');
    } else {
      return (this.validadorCamposAgregar = '1');
    }
  }

  //Agregar una Fumgacion 
  agregarFumigacion(): void {
    const hoy = new Date();
    var fechaSeleccionada = new Date();
    var fechaRealiz = fechaSeleccionada;
    var esFechaPosterior = false;
    var esFechaMenor = false;

    var fecha = this.formAgregar.value.fechaRealizacionA ?? null;
    if (fecha!=null) {
      fechaSeleccionada = new Date(fecha);
      fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1); // Sumar un día
      fechaSeleccionada.setHours(0, 0, 0, 0);
      fechaRealiz = fechaSeleccionada;
      esFechaPosterior = fechaRealiz > hoy;
      esFechaMenor = fechaRealiz < new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

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


    const nroCent = this.centralNroSeleccionada;
    function validarFechaRealizacion(fechaRealiz: Date) {      
      if (nroCent === 0 ) {
        mostrarError('Seleccione una central para registrar la fumigación.', 'Por favor, seleccione una central para generar el registro de la fumigación.');
        return false;
      }else if (fecha === null || isNaN(fechaRealiz.getTime())) {
        mostrarError('Ingrese una fecha de realización.', 'Por favor, ingrese una fecha de realización de la fumigación válida para generar el registro de la fumigación.');
        return false;
      }else if (esFechaPosterior || esFechaMenor) {
        if (esFechaPosterior) {
          mostrarError('La fecha de realización de la fumigación no puede ser posterior a la fecha actual.', 'Por favor, cambie la fecha de realización de la fumigación.');
        } else {
          mostrarError('La fecha de realización de la fumigación debe ser anterior a la fecha actual y no puede exceder los 7 días a partir de la fecha actual.', 'Por favor, cambie la fecha de realización de la fumigación.');
        }
        return false;
      } 
      return true;
    }

    if (!validarFechaRealizacion(fechaRealiz)) {
      return;
    }

    if (!this.formAgregar.valid) {
      Swal.fire({
        title: 'Error',
        text: `Verificar los datos ingresados:                        
            ${this.observacionA?.invalid && this.observacionA.errors?.['pattern'] ? '\n* Observación no debe contener caracteres especiales.' : ''}`,
        icon: 'warning',
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
        footer: 'Por favor, corrija los errores e inténtelo de nuevo.'
      });
      return;
    }
    
    let fumigaciones: FumigacionesClass = new FumigacionesClass(
      0,
      this.formAgregar.get('nroCentralA')?.value,
      new Date(this.formAgregar.get('fechaRealizacionA')?.value,),
      new Date(this.formAgregar.get('fechaRealizacionA')?.value,),
      this.formAgregar.get('observacionA')?.value,
    );

    this.fumigacionesConsulta.registrarFumigacion(fumigaciones).subscribe(
      (data) => {
        Swal.fire({
          text: 'La fumigación ha sido registrado con éxito con el número de Cod.: ' + data.fumId,
          icon: 'success',
          position: 'top',
          showConfirmButton: true,
          confirmButtonColor: '#0f425b',
          confirmButtonText: 'Aceptar',
        }).then((result) => {
          if (result.value) {
            window.scrollTo(0, 0); 
            location.reload();  
            window.scrollTo(0, 0);    
            return;     
        }
      });
    },
    (error) => {
      Swal.fire({
        text: 'No es posible Agregar esta fumigación',
        icon: 'error',
        position: 'top',
        showConfirmButton: true,
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
      });
    }
  );
  }

  paginaCambiadaCentral(event: any) {
    this.currentPageCentral = event;
    const cantidadPaginasCentral = Math.ceil(
      this.CentralConsultaFiltrados.length / this.pageSizeCentral
    );
    const paginasCentral = [];

    for (let i = 1; i <= cantidadPaginasCentral; i++) {
      paginasCentral.push(i);
    }
    return paginasCentral;
  } 


}
