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
  displayedColumnsFumigacion: string[] = ['serId', 'serDescripcion', 'serUnidad', 'estDescripcion'];
  @ViewChild('matSortFumigacion', { static: false }) sortFumigacion: MatSort | undefined;
  @ViewChild('paginatorFumigacion', { static: false }) paginatorFumigacion: MatPaginator | undefined;
  dataSourceFumigacion: MatTableDataSource<any>;
  pageSizeFumigacion = 5; // Número de elementos por página
  currentPageFumigacion = 1; // Página actual

  //STEPPER
  titulo1 = 'Seleccionar Central para Consultar sus Fumigaciones';
  titulo2 = 'Fumigaciones de la Central N°:';
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
  propiedadOrdenamientoFum: string = "fumId";
  titulo: string = '';
  caracteresValidosObservacion: string = "No se admiten: ! # $ & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";                                        
  filtroCentral: string = '';

  tipoOrdenamiento: number = 1;
  tipoOrdenamientoFum: number = 1;
  centralNroSeleccionada: number=0;
  idFumSeleccionado: number=0;
  idUsuario: any = 0;
  validadorCamposModif: string = '1';
  validadorCamposAgregar: string = '1';

  //PAGINADO
  // pageSizeCentral = 5; // Número de elementos por página
  // currentPageCentral = 1; // Página actual
  // totalItemsCentral = 0; // Total de elementos en la tabla
  
  // pageSizeFumigacion = 5; // Número de elementos por página
  // currentPageFumigacion = 1; // Página actual
  totalItemsFumigacion = 0; // Total de elementos en la tabla
  
  isCollapsed1 = false;
  isCollapsed2 = false;
  mostrarBtnEditarModificacion = true;
  mostrarBtnAceptarModificacion = false;

  //FORMULARIOS DE AGRUPACION DE DATOS
  formModificar: FormGroup;
  formAgregar: FormGroup;

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
    this.formAgregar = new FormGroup({
      nroCentralA: new FormControl(null, []),
      fechaRealizacionA: new FormControl(null, []),
      observacionA: new FormControl(null, [
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

  handlePageChangeFumigaciones(event: any) {
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
  set nroCentralA(valor: any) {
    this.formAgregar.get('nroCentralA')?.setValue(valor);
  }
  set fechaRealizacionA(valor: any) {
    this.formAgregar.get('fechaRealizacionA')?.setValue(valor);
  }
  set observacionA(valor: any) {
    this.formAgregar.get('observacionA')?.setValue(valor);
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
  get nroCentralA() {
    return this.formAgregar.get('nroCentralA');
  }
  get fechaRealizacionA() {
    return this.formAgregar.get('fechaRealizacionA');
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

  // toggleCollapse1() {
  //   this.isCollapsed1 = !this.isCollapsed1;
  // }

  // toggleCollapse2() {
  //   this.isCollapsed2 = !this.isCollapsed2;
  // }

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
  
  //Almacena los datos de la fumigación que fue seleccionado en la tabla de fumigación filtrados dentro de variables locales.
  esfilaSeleccionadaFumigacion(fumigacionConsulta: FumigacionesClass) {
    this.nroCentral = this.centralNroSeleccionada;
    this.idFum = fumigacionConsulta.fumId;  
    this.idFumSeleccionado = fumigacionConsulta.fumId;  
    this.fechaAlta= fumigacionConsulta.fumFechaAlta ? new Date(fumigacionConsulta.fumFechaAlta).toLocaleDateString("es-AR") : '';
    this.fechaRealizacion=fumigacionConsulta.fumFechaRealizacion ? new Date(fumigacionConsulta.fumFechaRealizacion).toLocaleDateString("es-AR") : ''; ;
    this.observacion = fumigacionConsulta.fumObservacion;
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

  // //Metodos para grilla
  // //Almacena en una variable la propiedad por la cual se quiere ordenar la consulta de Central.
  // ordenarPor(propiedad: string) {
  //   this.tipoOrdenamiento =
  //     propiedad === this.propiedadOrdenamiento ? this.tipoOrdenamiento * -1 : 1;
  //   this.propiedadOrdenamiento = propiedad;
  // }

  // //En base a la propiedad por la que se quiera ordenar y el tipo de orden muestra un icono.
  // ordenarIcono(propiedad: string) {
  //   if (propiedad === this.propiedadOrdenamiento) {
  //     return this.tipoOrdenamiento === 1 ? '🠉' : '🠋';
  //   } else {
  //     return '🠋🠉';
  //   }
  // }  

  //Almacena en una variable la propiedad por la cual se quiere ordenar la consulta de fumigaciones.
  ordenarPorFum(propiedad: string) {
    this.tipoOrdenamientoFum =
      propiedad === this.propiedadOrdenamientoFum ? this.tipoOrdenamientoFum * -1 : 1;
    this.propiedadOrdenamientoFum = propiedad;
  }

  //En base a la propiedad por la que se quiera ordenar y el tipo de orden muestra un icono.
  ordenarIconoFum(propiedad: string) {
    if (propiedad === this.propiedadOrdenamientoFum) {
      return this.tipoOrdenamientoFum === 1 ? '🠉' : '🠋';
    } else {
      return '🠋🠉';
    }
  }  

  //Permite abrir un Modal u otro en función del titulo pasado como parametro.
  abrirModal(opcion: string) {
    if (opcion == 'Ver Mas') {
      this.titulo = opcion;
      this.bloquearEditar();
    } 
    if (opcion == 'Eliminar Fumigación') {
        this.titulo = opcion;
    }
    if (opcion == 'Agregar Fumigación') {
        this.titulo = opcion;
        this.nroCentralA = this.centralNroSeleccionada;        
    }
  }

  //Bloquea los campos ante una consulta.
  bloquearEditar(): void {
    this.formModificar.get('observacion')?.disable();
    this.mostrarBtnAceptarModificacion = false;
    this.mostrarBtnEditarModificacion = true;
  }

  //Desbloquea los campos para su modificación.
  desbloquearEditar(): void {
    this.formModificar.get('observacion')?.enable();
    this.mostrarBtnAceptarModificacion = true;   
    this.mostrarBtnEditarModificacion = false;
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
    this.titulo2 = 'Fumigaciones de la Central N°:' + this.centralNroSeleccionada +':';

    this.goToNextStep(1)
  }

  //Valida que los campos descripcion y uniddad se encuentren correctamente ingresados.
  validarControlesMod(): string {
    if (this.formModificar.valid == false) {
      return (this.validadorCamposModif = '2');
    } else {
      return (this.validadorCamposModif = '1');
    }
  }

  //Valida que los campos descripcion y uniddad se encuentren correctamente ingresados.
  validarControlesAgregar(): string {
    if (this.formAgregar.valid == false) {
      return (this.validadorCamposAgregar = '2');
    } else {
      return (this.validadorCamposAgregar = '1');
    }
  }

  //Modificación del servicio seleccionado.
  modificarFumigacion() {

    //Verifica que este completo el formulario y que no tenga errores.
    if (this.formModificar.valid == false) {      
        Swal.fire({
        title: 'Error',
        text: `Verificar los datos ingresados:              
          ${this.observacion?.invalid && this.observacion.errors?.['pattern'] ? '\n* Observación no debe contener caracteres especiales ni tener más de 50 caracteres.' : ''}`,                      
        icon: 'warning',
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
          position: 'top',
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
          position: 'top',
          showConfirmButton: true,
          confirmButtonColor: '#0f425b',
          confirmButtonText: 'Aceptar',
        } as SweetAlertOptions);    
    });          
    }
  }

  desactivarFumigacion() {
    this.fumigacionesConsulta.eliminarFumigacion(this.idFumSeleccionado).subscribe(() => {
      Swal.fire({
        text:
          'Se ha eliminado con éxito la fumigación identificada con el código ' +
          this.idFumSeleccionado +
          ' y la fecha de realización ' +
          this.formModificar.get('fechaRealizacion')?.value ,
        icon: 'success',
        position: 'top',
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
        text: 'No es posible eliminar esta fumigación',
        icon: 'error',
        position: 'top',
        showConfirmButton: true,
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
      } as SweetAlertOptions);    
   });
  }
  
  //Agregar una Fumgacion 
  agregarFumigacion(): void {
    const hoy = new Date();
    const fecha = document.getElementById('fechaRealizacionA') as HTMLInputElement;
    const fechaSeleccionada = new Date(fecha.value);
    fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1); // Sumar un día
    fechaSeleccionada.setHours(0, 0, 0, 0);
    const fechaRealiz = fechaSeleccionada;
  
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
  
    const esFechaPosterior = fechaRealiz > hoy;
    const esFechaMenor = fechaRealiz < new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    function validarFechaRealizacion(fechaRealiz: Date) {      
      if (isNaN(fechaRealiz.getTime())) {
        mostrarError('Ingrese una fecha de realización de la fumigación válida.', 'Por favor, ingrese una fecha de realización de la fumigación válida para generar el registro de la fumigación.');
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
            ${this.observacionA?.invalid && this.observacionA.errors?.['pattern'] ? '\n* Observación no debe contener caracteres especiales ni tener más de 50 caracteres.' : ''}`,
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

  // paginaCambiadaCentral(event: any) {
  //   this.currentPageCentral = event;
  //   const cantidadPaginasCentral = Math.ceil(
  //     this.CentralConsultaFiltrados.length / this.pageSizeCentral
  //   );
  //   const paginasCentral = [];

  //   for (let i = 1; i <= cantidadPaginasCentral; i++) {
  //     paginasCentral.push(i);
  //   }
  //   return paginasCentral;
  // }   

  paginaCambiadaFumigacion(event: any) {
    this.currentPageFumigacion = event;
    const cantidadPaginasFumigacion = Math.ceil(
      this.Fumigaciones.length / this.pageSizeFumigacion
    );
    const paginasFumigacion = [];

    for (let i = 1; i <= cantidadPaginasFumigacion; i++) {
      paginasFumigacion.push(i);
    }
    return paginasFumigacion;
  }   
}
