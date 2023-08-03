//SISTEMA
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
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
import { ServicioClass } from 'src/app/core/models/servicio';

//SERVICIOS
import { ServicioService } from 'src/app/core/services/servicio.service';

@Component({
  selector: 'app-consultar-servicio',
  templateUrl: './consultar-servicio.component.html',
  styleUrls: ['./consultar-servicio.component.css']
})
export class ConsultarServicioComponent implements OnInit {

  //TABLA Servicios
  displayedColumnsServicio: string[] = ['serId', 'serDescripcion', 'serUnidad', 'columnaVacia', 'desactivar', 'verMas'];
  @ViewChild('matSortServicio', { static: false }) sortServicio: MatSort | undefined;
  @ViewChild('paginatorServicio', { static: false }) paginatorServicio: MatPaginator | undefined;
  dataSourceServicio: MatTableDataSource<any>;
  pageSizeServicio = 5; // Número de elementos por página
  currentPageServicio = 1; // Página actual
  
  //STEPPER
  titulo1 = 'Consultá información de los servicios:';
  titulo2 = 'Modificar servicio';
  titulo3 = '';
  isStep1Completed = false;
  isStep2Completed = false;
  isStep3Completed = false;

  @ViewChild(MatStepper, { static: false }) stepper: MatStepper | undefined;

  //VARIABLES DE OBJETOS LIST
  Servicios: ServicioClass[] = [];
  ServiciosFiltrados: ServicioClass [] = [];

  opcionesTipoGrafico = [
    { codigo: 1, descripcion: 'Humedad de Suelo' },
    { codigo: 2, descripcion: 'Humedad del Ambiente' },
    { codigo: 3, descripcion: 'Temperatura' },
    { codigo: 4, descripcion: 'Velocidad del Viento' },
    { codigo: 5, descripcion: 'Dirección del Viento' }
  ];

  isCollapsed1 = false;
  isCollapsed2 = false;  

  //VARIABLES DE DATOS
  titulo: string = '';
  validadorCamposModif: string = '1';
  validadorCamposAgregar: string = '1';
  serDescripcion: string = '';
  serUnidad: string = '';
  propiedadOrdenamiento: string = 'serId';
  caracteresValidosNombreServicio: string =
    "La primera letra del Nombre del Servicio debe ser Mayúscula, más de 3 caracteres y no se admiten: ! # $ % & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
    caracteresValidosUnidad: string =
    "No se admiten: ! # $ & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
  idSeleccionado: number = 0;
  tipoOrdenamiento: number = 1;

  mostrarBtnAceptarModificacion: boolean = false;
  mostrarBtnEditarModificacion : boolean = true;

  //FORMULARIOS DE AGRUPACION DE DATOS
  formModificar: FormGroup;

  constructor(
    private fb: FormBuilder,
    private servicioConsultar: ServicioService) 
    { 
      this.dataSourceServicio = new MatTableDataSource<any>();

      this.formModificar = this.fb.group({
        id: new FormControl(null, []),
        descripcion: new FormControl(null, [
          Validators.required,
          Validators.pattern("^[A-Z][A-ZÑa-zñáéíóúÁÉÍÓÚ'° 0-9/]{2,29}$"),
        ]),
        unidad: new FormControl(null, [
          Validators.required,
          Validators.pattern("^[A-Za-zÑñáéíóúÁÉÍÓÚ'°0-9/%ºª ]{1,12}$"),
        ]),
        tipoGrafico: new FormControl(null, []),
      })      
  }
  
  ngOnInit(): void {

    this.tipoGrafico = 1;
    
    this.servicioConsultar.obtenerServicios().subscribe(data => {
      this.Servicios = data;  
      this.ServiciosFiltrados = data;

      this.dataSourceServicio = new MatTableDataSource(data);
      if (this.paginatorServicio) {
        this.dataSourceServicio.paginator = this.paginatorServicio;
        this.paginatorServicio.firstPage();
      }
      if (this.sortServicio) {
        this.dataSourceServicio.sort = this.sortServicio;
      }

    });
  }

  handlePageChangeServicio(event: any) {
    this.currentPageServicio = event.pageIndex + 1;
    this.pageSizeServicio = event.pageSize;
  }

  set id(valor: any) {
    this.formModificar.get('id')?.setValue(valor);
  }
  set descripcion(valor: any) {
    this.formModificar.get('descripcion')?.setValue(valor);
  }
  set unidad(valor: any) {
    this.formModificar.get('unidad')?.setValue(valor);
  }
  set tipoGrafico(valor: any) {
    this.formModificar.get('tipoGrafico')?.setValue(valor);
  }

  get id() {
    return this.formModificar.get('id');
  }
  get descripcion() {
    return this.formModificar.get('descripcion');
  }
  get unidad() {
    return this.formModificar.get('unidad');
  }
  get tipoGrafico() {
    return this.formModificar.get('tipoGrafico');
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
  
  //Filtro de Servicios por Descripcion.
  esFiltrar(event: Event){
    let txtBuscar = (event.target as HTMLInputElement).value;
    let filtro = txtBuscar
      .replace(/[^\w\s]/g, '')
      .trim()
      .toLowerCase();
    this.ServiciosFiltrados = [];

    this.Servicios.forEach((servicio) => {
      if(
        servicio.serDescripcion.toString().toLowerCase().includes(filtro)
      ){
        this.ServiciosFiltrados.push(servicio);
      }
    }
    );

    this.dataSourceServicio = new MatTableDataSource(this.ServiciosFiltrados);
    if (this.paginatorServicio) {
      this.dataSourceServicio.paginator = this.paginatorServicio;
      this.paginatorServicio.firstPage();
    }
    if (this.sortServicio) {
      this.dataSourceServicio.sort = this.sortServicio;
    }
  }

  //Valida que exista algún servicio que responda al filtro.
  validarFiltrado(): Boolean {
    if (this.ServiciosFiltrados.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  seleccionarServicio(element: any) {

    this.idSeleccionado = element.serId;
    this.id = element.serId;
    this.descripcion = element.serDescripcion;
    this.unidad = element.serUnidad;
    this.tipoGrafico = element.serTipoGrafico;

    this.isCollapsed1 = !this.isCollapsed1;
    this.titulo2 = 'Modificar servicio' + element.serDescripcion + ':';

    this.goToNextStep(1)
  }

  //Modificación del servicio seleccionado.
  modificarServicio() {

    //Verifica que este completo el formulario y que no tenga errores.
    if (this.formModificar.valid == false) {      
      Swal.fire({
        title: 'Error',
        text: `Verificar los datos ingresados:              
          ${this.descripcion?.invalid && this.descripcion.errors?.['required'] ? '\n* La descripción es requerida.' : ''}          
          ${this.descripcion?.invalid && this.descripcion.errors?.['pattern'] ? '\n* La primera letra debe ser mayúscula y no debe contener caracteres especiales. Además, debe tener más de 3 caracteres y menos de 30 caracteres.' : ''}
          ${this.unidad?.invalid && this.unidad.errors?.['required'] ? '\n* La unidad es requerida.' : ''}          
          ${this.unidad?.invalid && this.unidad.errors?.['pattern'] ? '\n* La unidad no debe contener caracteres especiales ni tener más de 12 caracteres.' : ''}`,      
        icon: 'warning',
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
        footer: 'Por favor, corrija los errores e inténtelo de nuevo.'
      });     
    } else {

    let Servicios: ServicioClass = new ServicioClass(
      this.idSeleccionado,
      this.formModificar.get('descripcion')?.value,
      this.formModificar.get('unidad')?.value,
      this.formModificar.get('tipoGrafico')?.value
    );
    this.servicioConsultar
      .modificarServicio(this.idSeleccionado, Servicios)  
      .subscribe(() => {
        Swal.fire({
          text:
            'El Servicio ' +
            this.formModificar.get('descripcion')?.value +
            ' Unidad: ' +
            this.formModificar.get('unidad')?.value +
            ' Cod.: ' +
            this.idSeleccionado +
            ' ha sido modificado con éxito.',
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
      }, (error) => {
        Swal.fire({
          text: 'No es posible modificar este servicio',
          icon: 'error',
          position: 'top',
          showConfirmButton: true,
          confirmButtonColor: '#0f425b',
          confirmButtonText: 'Aceptar',
        } as SweetAlertOptions);    
      });          
    }
  }

  //Baja fisica del servicio seleccionado.
  desactivarServicio(element: any) {
    Swal.fire({
      text: '¿ Estás seguro que deseas eliminar el servicio ' + element.serDescripcion + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f425b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    } as SweetAlertOptions).then((result) => {
      if (result.isConfirmed) {
        this.servicioConsultar    
        .eliminarServicio(element.serId)
        .subscribe(() => {
          Swal.fire({
            text:
              'Se ha eliminado con éxito el servicio  ' +
              element.serDescripcion +
              ' identificado con el código ' +
              element.serId,
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
            text: 'No es posible eliminar este servicio',
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
