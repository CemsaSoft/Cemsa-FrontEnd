//SISTEMA
import { Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-consultar-fumigaciones',
  templateUrl: './consultar-fumigaciones.component.html',
  styleUrls: ['./consultar-fumigaciones.component.css']
})

export class ConsultarFumigacionesComponent implements OnInit {

  //TABLA Central
  displayedColumnsCentral: string[] = ['cenNro', 'cenImei', 'cenCoorX', 'cenCoorY', 'columnaVacia', 'seleccionar'];
  @ViewChild('paginatorCentral', { static: false }) paginatorCentral: MatPaginator | undefined;
  @ViewChild('matSortCentral', { static: false }) sortCentral: MatSort | undefined;
  dataSourceCentral: MatTableDataSource<any>;
  pageSizeCentral = 5; // Número de elementos por página
  currentPageCentral = 1; // Página actual

  //TABLA Fumigaciones
  displayedColumnsFumigacion: string[] = ['fumId', 'fumFechaAlta', 'fumFechaRealizacion', 'fumObservacion', 'columnaVacia', 'desactivar', 'seleccionar'];
  @ViewChild('matSortFumigacion', { static: false }) sortFumigacion: MatSort | undefined;
  @ViewChild('paginatorFumigacion', { static: false }) paginatorFumigacion: MatPaginator | undefined;
  dataSourceFumigacion: MatTableDataSource<any>;
  pageSizeFumigacion = 5; // Número de elementos por página
  currentPageFumigacion = 1; // Página actual

  //STEPPER
  titulo1 = 'Seleccionar Central para Consultar sus Fumigaciones';
  titulo2 = 'Fumigaciones de la Central N°:';
  titulo3 = 'Modificar Datos de la Fumigación N°:';
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
  propiedadOrdenamientoFum: string = "fumId";
  titulo: string = '';
  caracteresValidosObservacion: string = "No se admiten: ! # $ & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";                                        
  filtroCentral: string = '';

  centralNroSeleccionada: number=0;
  idFumSeleccionado: number=0;
  idUsuario: any = 0;
  
  isCollapsed1 = false;
  isCollapsed2 = false;
  isCollapsed3 = false;

  //FORMULARIOS DE AGRUPACION DE DATOS
  formModificar: FormGroup;

  constructor(
    private centralConsultar: CentralService, 
    private fumigacionesConsulta: FumigacionesService
  ) {
    this.dataSourceCentral = new MatTableDataSource<any>();
    this.dataSourceFumigacion = new MatTableDataSource<any>();

    this.formModificar = new FormGroup({
      nroCentral: new FormControl(null, []),
      idFum: new FormControl(null, []), 
      fechaAlta: new FormControl(null, []),
      fechaRealizacion: new FormControl(null, []),
      observacion: new FormControl(null, [
        Validators.pattern("^[A-Za-zÑñáéíóúÁÉÍÓÚ'°0-9/%ºª ]{1,50}$"),
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

  handlePageChangeFumigacion(event: any) {
    this.currentPageFumigacion = event.pageIndex + 1;
    this.pageSizeFumigacion = event.pageSize;
  }

  set nroCentral(valor: any) {
    this.formModificar.get('nroCentral')?.setValue(valor);
  }
  set idFum(valor: any) {
    this.formModificar.get('idFum')?.setValue(valor);
  }
  set fechaAlta(valor: any) {
    this.formModificar.get('fechaAlta')?.setValue(valor);
  }
  set fechaRealizacion(valor: any) {
    this.formModificar.get('fechaRealizacion')?.setValue(valor);
  }
  set observacion(valor: any) {
    this.formModificar.get('observacion')?.setValue(valor);
  }
  
  get nroCentral() {
    return this.formModificar.get('nroCentral');
  }
  get idFum() {
    return this.formModificar.get('idFum');
  }
  get fechaAlta() {
    return this.formModificar.get('fechaAlta');
  }
  get fechaRealizacion() {
    return this.formModificar.get('fechaRealizacion');
  }
  get observacion() {
    return this.formModificar.get('observacion');
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

  //Valida que exista alguna Fumigación en Central que responda al filtro.
  validarFiltradoFumigacion(): Boolean {
    if (this.Fumigaciones.length == 0) {
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

    this.fumigacionesConsulta.obtenerFumigacionesDeCentral(this.centralNroSeleccionada).subscribe(data => {
      this.Fumigaciones = data; 

      this.dataSourceFumigacion = new MatTableDataSource(data);
      if (this.paginatorFumigacion) {
        this.dataSourceFumigacion.paginator = this.paginatorFumigacion;
        this.paginatorFumigacion.firstPage();
      }
      if (this.sortFumigacion) {
        this.dataSourceFumigacion.sort = this.sortFumigacion;
      }

    })
    this.isCollapsed1 = !this.isCollapsed1;
    this.titulo2 = 'Fumigaciones de la Central N°' + this.centralNroSeleccionada + ':';

    this.goToNextStep(1)
  }

  seleccionarFumigacion(element: any) {

    this.nroCentral = this.centralNroSeleccionada;
    this.idFum = element.fumId;  
    this.idFumSeleccionado = element.fumId;  
    this.fechaAlta= element.fumFechaAlta ? new Date(element.fumFechaAlta).toLocaleDateString("es-AR") : '';
    this.fechaRealizacion=element.fumFechaRealizacion ? new Date(element.fumFechaRealizacion).toLocaleDateString("es-AR") : ''; ;
    this.observacion = element.fumObservacion;

    this.isCollapsed2 = !this.isCollapsed2;
    this.titulo3 = 'Modificar Datos de la Fumigación N°' + element.fumId + ':';

    this.goToNextStep(2)
  }

  //Modificación de la fumigacion seleccionado.
  modificarFumigacion() {

    //Verifica que este completo el formulario y que no tenga errores.
    if (this.formModificar.valid == false) {      
        Swal.fire({
        title: 'Error',
        text: `Verificar los datos ingresados:              
          ${this.observacion?.invalid && this.observacion.errors?.['pattern'] ? '\n* Observación no debe contener caracteres especiales ni tener más de 50 caracteres.' : ''}`,                      
        icon: 'warning',
        position: 'center',
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
        footer: 'Por favor, corrija los errores e inténtelo de nuevo.'
      });     
    } else {

    let Fumigaciones: FumigacionesClass = new FumigacionesClass(      
      this.formModificar.get('idFum')?.value,
      this.centralNroSeleccionada,
      new Date(),
      new Date(),
      this.formModificar.get('observacion')?.value,      
    );
    this.fumigacionesConsulta
      .modificarFumigacion(Fumigaciones)  
      .subscribe(() => {
        Swal.fire({
          text:
          'Se ha modificado con éxito la fumigación identificada con el código ' +
          this.idFumSeleccionado +
          ' y la fecha de realización ' +
          this.formModificar.get('fechaRealizacion')?.value ,
          icon: 'success',
          position: 'center',
          showConfirmButton: true,
          confirmButtonColor: '#0f425b',
          confirmButtonText: 'Aceptar',
        } as SweetAlertOptions).then((result) => {
          if (result.value == true) {
            window.scrollTo(0, 0); 
            location.reload();  
            window.scrollTo(0, 0);    
            return;     
          }
        });
    }, (error) => {
        Swal.fire({
          text: 'No es posible modificar esta Fumigación',
          icon: 'error',
          position: 'center',
          showConfirmButton: true,
          confirmButtonColor: '#0f425b',
          confirmButtonText: 'Aceptar',
        } as SweetAlertOptions);    
    });          
    }
  }

  //Baja fisica del servicio seleccionado.
  desactivarFumigacion(element: any) {

    const fechaAlta = new Date(element.fumFechaAlta);
    const dia = fechaAlta.getDate();
    const mes = fechaAlta.getMonth() + 1;
    const año = fechaAlta.getFullYear();

    const fechaFormateada = `${dia < 10 ? '0' : ''}${dia}-${mes < 10 ? '0' : ''}${mes}-${año}`;

    Swal.fire({
      text: '¿Estás seguro que deseas eliminar la Fumigación con Código ' + element.fumId + ', realizada en la fecha ' + fechaFormateada + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f425b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    } as SweetAlertOptions).then((result) => {
      if (result.isConfirmed) {
        this.fumigacionesConsulta    
        .eliminarFumigacion(element.fumId)
        .subscribe(() => {
          Swal.fire({
            text:
            'Se ha eliminado con éxito la fumigación identificada con el código ' +
            element.fumId + ' y la fecha de realización ' + fechaFormateada,
            icon: 'success',
            position: 'center',
            showConfirmButton: true,
            confirmButtonColor: '#0f425b',
            confirmButtonText: 'Aceptar',
          } as SweetAlertOptions).then((result) => {
            if (result.value == true) {
              return location.reload();
            }
          });
        },(error) => {
          Swal.fire({
            text: 'No es posible eliminar esta fumigación',
            icon: 'error',
            position: 'center',
            showConfirmButton: true,
            confirmButtonColor: '#0f425b',
            confirmButtonText: 'Aceptar',
          } as SweetAlertOptions);    
        });
      }
    });
  }

}
