//SISTEMA
import { Component, OnInit, Output, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';

import { MatStepper } from '@angular/material/stepper';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

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

  //TABLA Central
  displayedColumnsCentral: string[] = ['cenNro', 'cenImei', 'cenCoorX', 'cenCoorY', 'columnaVacia', 'seleccionar'];
  @ViewChild('paginatorCentral', { static: false }) paginatorCentral: MatPaginator | undefined;
  @ViewChild('matSortCentral', { static: false }) sortCentral: MatSort | undefined;
  dataSourceCentral: MatTableDataSource<any>;
  pageSizeCentral = 5; // Número de elementos por página
  currentPageCentral = 1; // Página actual

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
  filtroCentral: string = '';
   
  tipoOrdenamiento: number = 1;
  centralNroSeleccionada: number=0;
  idUsuario: any = 0;
  validadorCamposAgregar: string = '1';

  isCollapsed1 = false;
  isCollapsed2 = false;

  //FORMULARIOS DE AGRUPACION DE DATOS
  formAgregar: FormGroup;
  
  constructor(
    private centralConsultar: CentralService, 
    private fumigacionesConsulta: FumigacionesService
  ) {    
    this.dataSourceCentral = new MatTableDataSource<any>();

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

      this.dataSourceCentral = new MatTableDataSource(data);
      if (this.paginatorCentral) {
        this.dataSourceCentral.paginator = this.paginatorCentral;
      }
      if (this.sortCentral) {
        this.dataSourceCentral.sort = this.sortCentral;
      }
    });
  }

  handlePageChangeCentral(event: any) {
    this.currentPageCentral = event.pageIndex + 1;
    this.pageSizeCentral = event.pageSize;
  }

  set nroCentralA(valor: any) {
    this.formAgregar.get('nroCentralA')?.setValue(valor);
  }
  set observacionA(valor: any) {
    this.formAgregar.get('observacionA')?.setValue(valor);
  }

  get nroCentralA() {
    return this.formAgregar.get('nroCentralA');
  }
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
  
  //Valida que exista alguna Central que responda al filtro.
  validarFiltrado(): Boolean {
    if (this.CentralConsultaFiltrados.length == 0) {
      return false;
    } else {
      return true;
    }
  }

 //Filtro de Central por código de central.
 esFiltrar(event: Event, campo: string) {
    let txtBuscar = (event.target as HTMLInputElement).value;
    this.filtroCentral = txtBuscar
      .replace(/[^\w\s]/g, '')
      .trim()
      .toLowerCase();
    this.CentralConsultaFiltrados = [];
    this.CentralConsulta.forEach((centralConsulta) => {
      if (
        (campo === 'codigo' && centralConsulta.cenNro.toString().toLowerCase().includes(this.filtroCentral)) 
      ) {
        this.CentralConsultaFiltrados.push(centralConsulta);
      }    
    });

    this.dataSourceCentral = new MatTableDataSource(this.CentralConsultaFiltrados);
    if (this.paginatorCentral) {
      this.dataSourceCentral.paginator = this.paginatorCentral;
    }
    if (this.sortCentral) {
      this.dataSourceCentral.sort = this.sortCentral;
    }
  }

  seleccionarCentral(element: any) {
    this.centralNroSeleccionada = element.cenNro;

    this.nroCentralA = this.centralNroSeleccionada;
    this.isCollapsed1 = !this.isCollapsed1;
    this.titulo2 = 'Fumigaciones de la Central N°' + this.centralNroSeleccionada + ':';

    this.goToNextStep(1)

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
      fechaSeleccionada.setDate(fechaSeleccionada.getDate() ); // Sumar un día
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
          mostrarError('La fecha de realización de la fumigación debe ser anterior o igual a la fecha actual y no puede exceder los 7 días a partir de hoy.', 'Por favor, seleccione una fecha válida.');
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
          position: 'center',
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
        position: 'center',
        showConfirmButton: true,
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
      });
    }
  );
  }

}
