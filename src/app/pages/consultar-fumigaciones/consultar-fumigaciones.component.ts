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
  public habilitarBoton: boolean = false;  
  isStep1Completed = false;
  isStep2Completed = false;
  isStep3Completed = false;

  @ViewChild(MatStepper, { static: false }) stepper: MatStepper | undefined;
  
  //VARIABLES DE OBJETOS LIST
  CentralConsulta: CentralConsultaClass[] = [];
  CentralConsultaFiltrados: CentralConsultaClass [] = [];
  Fumigaciones: FumigacionesClass[] =[];
  FumigacionesFiltrados: FumigacionesClass[] =[];


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
  formfiltroFumigacion: FormGroup;

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

    this.formfiltroFumigacion = new FormGroup({
      codFum: new FormControl(null, []),
      observacion: new FormControl(null, []),
      fecha_desde: new FormControl(null, []),
      fecha_hasta: new FormControl(null, []),
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
    this.formfiltroFumigacion.get('fecha_desde')?.disable();
    this.formfiltroFumigacion.get('fecha_hasta')?.disable();
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
    if (this.FumigacionesFiltrados.length == 0) {
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

  //Filtro de Alarmas
  esFiltrarFumigacion(event: Event) {
    const filtronCodFum = (this.formfiltroFumigacion.get('codFum') as FormControl).value?.toLowerCase();
    const filtroObservacion = (this.formfiltroFumigacion.get('observacion') as FormControl).value?.toLowerCase();

    this.FumigacionesFiltrados = this.Fumigaciones.filter((fumigaciones) => {
      const valorCodFum = fumigaciones.fumId !== null ? fumigaciones.fumId.toString().toLowerCase() : '';
      const valorObservacion = fumigaciones.fumObservacion !== null ? fumigaciones.fumObservacion.toString().toLowerCase() : '';

      return (
        (!filtronCodFum || valorCodFum.includes(filtronCodFum)) &&
        (!filtroObservacion || valorObservacion.includes(filtroObservacion)) 
      );
    });

    this.dataSourceFumigacion= new MatTableDataSource(this.FumigacionesFiltrados);
    if (this.paginatorFumigacion) {
      this.dataSourceFumigacion.paginator = this.paginatorFumigacion;
    }
    if (this.sortFumigacion) {
      this.dataSourceFumigacion.sort = this.sortFumigacion;
    }
  }  
  
  //filtro de Alarma por Fecha
  filtarXFechas(){
    var hoy = new Date();
    var desde = new Date();
    var hasta = new Date();

    var fechaDesde = this.formfiltroFumigacion.value.fecha_desde ?? null;
    var fechaSeleccionada = new Date(fechaDesde);
    fechaSeleccionada.setDate(fechaSeleccionada.getDate() ); // Sumar un día
    fechaSeleccionada.setHours(0, 0, 0, 0);
    desde = fechaSeleccionada;

    var fechaHasta = this.formfiltroFumigacion.value.fecha_hasta ?? null;
    fechaSeleccionada = new Date(fechaHasta);
    fechaSeleccionada.setDate(fechaSeleccionada.getDate() ); // Sumar un día
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

    if (fechaDesde === null || isNaN(desde.getTime())) {
      mostrarError('Ingrese una fecha de desde válida.', 'Por favor, ingrese una fecha de hasta válida para generar el filtro.');
    } else if (fechaHasta === null || isNaN(hasta.getTime())) {
      mostrarError('Ingrese una fecha de hasta válida.', 'Por favor, ingrese una fecha de hasta válida para generar el filtro.');
    } else if (desde > hasta) {
      mostrarError('La fecha "desde" es posterior a la fecha "hasta".', 'Por favor, cambie el rango de fechas seleccionado para generar el filtro.');
    } else if (hasta > hoy) {
      mostrarError('La fecha "desde" no puede ser posterior a la fecha actual.', 'Por favor, cambie el rango de fechas seleccionado para generar el filtro.');
    } else {
      
    // if (desde.getTime() === hasta.getTime()) {
      // Agregar un día a la fecha 'hasta'
      hasta.setDate(hasta.getDate() + 1);

      const filtronCodFum = ((this.formfiltroFumigacion.get('codFum') as FormControl).value ?? "").toLowerCase();
      const filtroObservacion = ((this.formfiltroFumigacion.get('observacion') as FormControl).value ?? "").toLowerCase();

      this.FumigacionesFiltrados = this.Fumigaciones.filter((fumigaciones) => {
      const valorCodFum = fumigaciones.fumId !== null ? fumigaciones.fumId.toString().toLowerCase() : '';
      const valorObservacion = fumigaciones.fumObservacion !== null ? fumigaciones.fumObservacion.toString().toLowerCase() : '';
      const fechaFumigacion = new Date(fumigaciones.fumFechaRealizacion);

      return (
        (!filtronCodFum || valorCodFum.includes(filtronCodFum)) &&
        (!filtroObservacion || valorObservacion.includes(filtroObservacion)) &&
        (fechaFumigacion >= desde && fechaFumigacion <= hasta)
      );
      });

    }

    this.dataSourceFumigacion = new MatTableDataSource(this.FumigacionesFiltrados);
    if (this.paginatorFumigacion) {
      this.dataSourceFumigacion.paginator = this.paginatorFumigacion;
    }
    if (this.sortFumigacion) {
      this.dataSourceFumigacion.sort = this.sortFumigacion;
    }
  }
  
  // valida para que un solo selector de frecuencia este seleccionado a la vez
  filtroFecha(event: any) {
    if (event.checked === true) {
      this.formfiltroFumigacion.get('codFum')?.disable();
      this.formfiltroFumigacion.get('observacion')?.disable();
      this.formfiltroFumigacion.get('fecha_desde')?.enable();
      this.formfiltroFumigacion.get('fecha_hasta')?.enable();
      this.habilitarBoton = true;
    }
    else {
      this.formfiltroFumigacion.get('codFum')?.enable();      
      this.formfiltroFumigacion.get('observacion')?.enable();
      this.formfiltroFumigacion.get('fecha_desde')?.disable();
      this.formfiltroFumigacion.get('fecha_hasta')?.disable();
      this.habilitarBoton = false;
    }
  }
  seleccionarCentral(element: any) {

    this.centralNroSeleccionada = element.cenNro;  

    this.fumigacionesConsulta.obtenerFumigacionesDeCentral(this.centralNroSeleccionada).subscribe(data => {
      this.Fumigaciones = data; 
      this.FumigacionesFiltrados=data;

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
