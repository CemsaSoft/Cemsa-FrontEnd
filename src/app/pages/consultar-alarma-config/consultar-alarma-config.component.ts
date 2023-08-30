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
import { AlarmaConfigConsultaClass } from 'src/app/core/models/alarmaConfigConsulta';
import { AlarmaConfigClass } from 'src/app/core/models/alarmaConfig';
import { ServicioClass } from 'src/app/core/models/servicio';

//SERVICIOS
import { CentralService } from 'src/app/core/services/central.service';
import { AlarmaConfigService } from 'src/app/core/services/alarmaConfig.service';

@Component({
  selector: 'app-consultar-alarma-config',
  templateUrl: './consultar-alarma-config.component.html',
  styleUrls: ['./consultar-alarma-config.component.css']
})
export class ConsultarAlarmaConfigComponent implements OnInit {

  //TABLA Central
  displayedColumnsCentral: string[] = ['cenNro', 'cenImei', 'cenCoorX', 'cenCoorY', 'columnaVacia', 'seleccionar'];
  @ViewChild('paginatorCentral', { static: false }) paginatorCentral: MatPaginator | undefined;
  @ViewChild('matSortCentral', { static: false }) sortCentral: MatSort | undefined;
  dataSourceCentral: MatTableDataSource<any>;
  pageSizeCentral = 5; // Número de elementos por página
  currentPageCentral = 1; // Página actual
  
  //TABLA Alarma
  displayedColumnsAlarma: string[] = ['cfgId', 'serDescripcion', 'cfgNombre', 'cfgFechaAlta', 'cfgFechaBaja', 'cfgValorSuperiorA', 'cfgValorInferiorA', 'cfgObservacion', 'modEstado', 'seleccionar'];
  @ViewChild('paginatorAlarma', { static: false }) paginatorAlarma: MatPaginator | undefined;
  @ViewChild('matSortAlarma', { static: false }) sortAlarma: MatSort | undefined;
  dataSourceAlarma: MatTableDataSource<any>;
  pageSizeAlarma = 5; // Número de elementos por página
  currentPageAlarma = 1; // Página actual
  
  //STEPPER
  titulo1 = 'Seleccionar Central para Consultar Configuración de Alarma';
  titulo2 = 'Alarmas Configurada de la Central N°:';
  titulo3 = 'Modificar Datos de la Alarma N°:';
  isStep1Completed = false;
  isStep2Completed = false;
  isStep3Completed = false;

  @ViewChild(MatStepper, { static: false }) stepper: MatStepper | undefined;

  //VARIABLES DE OBJETOS LIST
  CentralConsulta: CentralConsultaClass[] = [];
  CentralConsultaFiltrados: CentralConsultaClass [] = [];
  AlarmaConfigConsulta: AlarmaConfigConsultaClass[] = [];
  ServiciosCentral: ServicioClass[] = [];

  //VARIABLES DE DATOS
  propiedadOrdenamiento: string = "cenNro";
  propiedadOrdenamientoCA: string = "cfgId";
  titulo: string = '';
  caracteresValidosObservacion: string = "No se admiten: ! # $ & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
  caracteresValidosNombre: string = "No se admiten: ! # $ & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
  caracteresValidosLimites: string = "Solo se admiten números y no se admiten: ! # $ & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
  validadorCamposAgregar: string = '1';
  validadorCamposModif: string = '1';
  filtroCentral: string = '';

  centralNroSeleccionada: number=0;
  idServicioSeleccionado: number=0;
  alarmaIdSeleccionado: number=0;
  nombreServicioSeleccionado: number=0;
  smallestId: number=0;

  idUsuario: any = 0;

  isCollapsed1 = false;
  isCollapsed2 = false;
  isCollapsed3 = false;

  //FORMULARIOS DE AGRUPACION DE DATOS
  formModificar: FormGroup;

  constructor(
    private centralConsultar: CentralService, 
    private alarmaConfigConsula: AlarmaConfigService,
  ) {
    this.dataSourceCentral = new MatTableDataSource<any>();
    this.dataSourceAlarma = new MatTableDataSource<any>();

    this.formModificar = new FormGroup({
      nroCentral: new FormControl(null, []),
      cfgId: new FormControl(null, []), 
      nombreAlarma: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[A-Za-zÑñáéíóúÁÉÍÓÚ'°0-9/%ºª ]{1,50}$"),        
      ]),
      nombreServicio: new FormControl(null, []),
      cfgFechaAlta: new FormControl(null, []),
      cfgFechaBaja: new FormControl(null, []),
      // cfgValorSuperiorA: new FormControl(null, [
      //   Validators.required,
      //   Validators.pattern(/^-?\d+([.,]\d{1,2})?$/)
      // ]),
      // cfgValorInferiorA: new FormControl(null, [
      //   Validators.required,
      //   Validators.pattern(/^-?\d+([.,]\d{1,2})?$/)
      // ]),
      cfgValorSuperiorA: new FormControl(null, [
        Validators.pattern(/^-?\d+([.,]\d{1,2})?$/)
      ]),
      cfgValorInferiorA: new FormControl(null, [
        Validators.pattern(/^-?\d+([.,]\d{1,2})?$/)
      ]),
      cfgObservacion: new FormControl(null, [
        Validators.pattern("^[A-Za-zÑñáéíóúÁÉÍÓÚ'°0-9/%ºª ]{1,100}$"),
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

  handlePageChangeAlarma(event: any) {
    this.currentPageAlarma = event.pageIndex + 1;
    this.pageSizeAlarma = event.pageSize;
  }

  set nroCentral(valor: any) {
    this.formModificar.get('nroCentral')?.setValue(valor);
  }
  set cfgId(valor: any) {
    this.formModificar.get('cfgId')?.setValue(valor);
  }
  set nombreAlarma(valor: any) {
    this.formModificar.get('nombreAlarma')?.setValue(valor);
  }
  set nombreServicio(valor: any) {
    this.formModificar.get('nombreServicio')?.setValue(valor);
  }
  set cfgFechaAlta(valor: any) {
    this.formModificar.get('cfgFechaAlta')?.setValue(valor);
  }
  set cfgFechaBaja(valor: any) {
    this.formModificar.get('cfgFechaBaja')?.setValue(valor);
  }
  set cfgValorSuperiorA(valor: any) {
    this.formModificar.get('cfgValorSuperiorA')?.setValue(valor);
  }
  set cfgValorInferiorA(valor: any) {
    this.formModificar.get('cfgValorInferiorA')?.setValue(valor);
  }
  set cfgObservacion(valor: any) {
    this.formModificar.get('cfgObservacion')?.setValue(valor);
  }
  
  get nroCentral() {
    return this.formModificar.get('nroCentral');
  }
  get cfgId() {
    return this.formModificar.get('cfgId');
  }
  get nombreAlarma() {
    return this.formModificar.get('nombreAlarma');
  }
  get nombreServicio() {
    return this.formModificar.get('nombreServicio');
  }
  get cfgFechaAlta() {
    return this.formModificar.get('cfgFechaAlta');
  }
  get cfgFechaBaja() {
    return this.formModificar.get('cfgFechaBaja');
  }
  get cfgValorSuperiorA() {
    return this.formModificar.get('cfgValorSuperiorA');
  }
  get cfgValorInferiorA() {
    return this.formModificar.get('cfgValorInferiorA');
  }
  get cfgObservacion() {
    return this.formModificar.get('cfgObservacion');
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

  //Valida que exista alguna Alarma que responda al filtro.
  validarFiltradoAlarma(): Boolean {
    if (this.AlarmaConfigConsulta.length == 0) {
      return false;
    } else {
      return true;
    }
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

    this.alarmaConfigConsula.obtenerAlarmaConfigDeCentral(this.centralNroSeleccionada).subscribe(data => {
      this.AlarmaConfigConsulta = data; 

      this.dataSourceAlarma = new MatTableDataSource(this.AlarmaConfigConsulta);
      if (this.paginatorAlarma) {
        this.dataSourceAlarma.paginator = this.paginatorAlarma;
      }
      if (this.sortAlarma) {
        this.dataSourceAlarma.sort = this.sortAlarma;
      }    
    })
    
    this.isCollapsed1 = !this.isCollapsed1;
    this.titulo2 = 'Alarmas Configurada de la Central N°' + this.centralNroSeleccionada + ':';

    this.goToNextStep(1)

  }

  seleccionarAlarma(element: any) {
    this.alarmaIdSeleccionado = element.cfgId

    this.nroCentral = element.cfgNro;

    this.centralConsultar.obtenerServicioXCentral(this.centralNroSeleccionada).subscribe(data => {
      this.ServiciosCentral = data.filter((servicio: { serTipoGrafico: number; }) => servicio.serTipoGrafico != 5);
    });

    this.cfgId = element.cfgId;
    this.nombreAlarma = element.cfgNombre;
    this.cfgFechaAlta= element.cfgFechaAlta ? new Date(element.cfgFechaAlta).toLocaleDateString("es-AR") : '';
    this.cfgFechaBaja= element.cfgFechaBaja ? new Date(element.cfgFechaBaja).toLocaleDateString("es-AR") : '';
    this.cfgValorSuperiorA = element.cfgValorSuperiorA
    this.cfgValorInferiorA = element.cfgValorInferiorA
    this.cfgObservacion = element.cfgObservacion
    this.nombreServicio = element.cfgSer;  
    this.nombreServicioSeleccionado = element.cfgSer;  

    this.isCollapsed2 = !this.isCollapsed2;
    this.titulo3 = 'Modificar Datos de la Alarma N°' + this.alarmaIdSeleccionado + ':';

    this.goToNextStep(2)

  }

    ModificarEstadoAlarma(element: any, estIdSeleccionado: number, estado:string): void {
      
      if (estIdSeleccionado===0)
      {
        const filteredAlarms = this.AlarmaConfigConsulta.filter(alarma => alarma.cfgId !== element.cfgId && alarma.cfgSer === element.cfgSer);
        const areAllSameServiceAndActive = filteredAlarms.every(alarma => alarma.cfgFechaBaja);
        if (!areAllSameServiceAndActive) {
          Swal.fire({
            text: 'No es posible, ya que hay otras alarmas activas para el mismo servicio.',
            icon: 'error',
            position: 'center',
            showConfirmButton: true,
            confirmButtonColor: '#0f425b',
            confirmButtonText: 'Aceptar',
          } as SweetAlertOptions);
          return; // Sale de la función si se cumple la condición de error
        }
      }
        Swal.fire({
          text: '¿Estás seguro de que deseas modificar el estado de la alarma: ' + element.cfgNombre + ' del servicio: ' + element.serDescripcion + ' al estado ' + estado + '?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#0f425b',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
          position: 'center'

        } as SweetAlertOptions).then((result) => {
          if (result.isConfirmed) {
            this.alarmaConfigConsula.modificarEstado(estIdSeleccionado, element.cfgId ).subscribe(
              result => {
                Swal.fire({
                  text: 'Se ha actualizado el estado a '+ estado,
                  icon: 'success',
                  // position: 'center',
                  showConfirmButton: true,
                  confirmButtonColor: '#0f425b',
                  confirmButtonText: 'Aceptar',
                } as SweetAlertOptions).then((result) => {
                  if (result.value == true) {
                    return location.reload();
                    
                  }
                });
              },
              error => {
                Swal.fire({
                  text: 'No es posible modificar el estado de esta Alarma',
                  icon: 'error',
                  // position: 'center',
                  showConfirmButton: true,
                  confirmButtonColor: '#0f425b',
                  confirmButtonText: 'Aceptar',
                } as SweetAlertOptions);    
              }
            );
          }
        });    
    }
    
  modificarAlarmaConfig():void {
    //Verifica que este completo el formulario y que no tenga errores.
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

    let cfgValorSuperiorA = this.formModificar.get('cfgValorSuperiorA')?.value;
    let cfgValorInferiorA = this.formModificar.get('cfgValorInferiorA')?.value;
    
    if (typeof cfgValorSuperiorA === 'string') {
      cfgValorSuperiorA = cfgValorSuperiorA.replace(',', '.');
    }    
    if (typeof cfgValorInferiorA === 'string') {
      cfgValorInferiorA = cfgValorInferiorA.replace(',', '.');
    }

    var areAllSameServiceAndActive = true;
    if ( this.formModificar.get('nombreServicio')?.value != this.nombreServicioSeleccionado )
    {
      const filteredAlarms = this.AlarmaConfigConsulta.filter(alarma => alarma.cfgId !== this.formModificar.get('cfgId')?.value && alarma.cfgSer === this.formModificar.get('nombreServicio')?.value );
      areAllSameServiceAndActive = filteredAlarms.every(alarma => alarma.cfgFechaBaja);
    }    

    if (!areAllSameServiceAndActive) {
      mostrarError('Ese Servicio ya tiene una alarma activa', 'Por favor, seleccione otro servicio.');
    } else if (this.centralNroSeleccionada === 0) {
      mostrarError('Debe ingresar una central', 'Por favor, seleccione una Central.');
    } else if (this.nombreAlarma?.invalid) {
      if (this.nombreAlarma.errors?.['required']) {
        mostrarError('Debe ingresar un nombre de alarma', 'Por favor, introduzca un nombre de alarma.');
      } else if (this.nombreAlarma.errors?.['pattern']) {
        mostrarError('El nombre no debe contener caracteres especiales ni tener más de 50 carácteres.', 'Por favor, corrija el nombre e inténtelo de nuevo.');
      }
    } else if (
      (this.formModificar.get('cfgValorSuperiorA')?.value === null || this.formModificar.get('cfgValorSuperiorA')?.value === '') &&
      (this.formModificar.get('cfgValorInferiorA')?.value === null || this.formModificar.get('cfgValorInferiorA')?.value === '')
    ) {
      mostrarError('Debe ingresar un valor superior o un valor inferior', 'Por favor, introduzca un valor superior o un valor inferior.');    
    } else if (this.cfgValorSuperiorA?.invalid && this.cfgValorSuperiorA.errors?.['pattern']) {
      mostrarError('El valor superior no es valido', 'Por favor, corrija el valor superior e inténtelo de nuevo.');        
    } else if (this.cfgValorInferiorA?.invalid && this.cfgValorInferiorA.errors?.['pattern']) {
      mostrarError('El valor inferior no es valido', 'Por favor, corrija el valor inferior e inténtelo de nuevo.');    
    } else if (this.cfgObservacion?.invalid && this.cfgObservacion.errors?.['pattern']) {
      mostrarError('La observación no debe contener caracteres especiales ni tener más de 100 carácteres.', 'Por favor, corrija la observación e inténtelo de nuevo.');  
    } else if ( 
      !(this.formModificar.get('cfgValorSuperiorA')?.value === null || this.formModificar.get('cfgValorSuperiorA')?.value === '') &&
      !(this.formModificar.get('cfgValorInferiorA')?.value === null || this.formModificar.get('cfgValorInferiorA')?.value === '') &&
      (this.formModificar.get('cfgValorInferiorA')?.value >= this.formModificar.get('cfgValorSuperiorA')?.value)
    ) { 
        mostrarError('El valor del valor inferior debe ser menor que el valor superior', 'Por favor, cambie el valor'); 
    } else { 
    
    let alarmaC: AlarmaConfigClass = new AlarmaConfigClass(
      this.formModificar.get('cfgId')?.value,
      this.formModificar.get('nroCentral')?.value,
      this.formModificar.get('nombreServicio')?.value,
      this.formModificar.get('nombreAlarma')?.value,
      new Date(),
      new Date(),
      cfgValorSuperiorA,
      cfgValorInferiorA,
      this.formModificar.get('cfgObservacion')?.value
    );
    
    this.alarmaConfigConsula
      .modificarAlarmaConfig(alarmaC)  
      .subscribe(() => {
        Swal.fire({
          text:
          'Se ha modificado con éxito la Alarma con el código ' +
          this.formModificar.get('cfgId')?.value +
          ' de la central número ' +
          this.formModificar.get('nroCentral')?.value,
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
          text: 'No es posible modificar esta Alarma',
          icon: 'error',
          position: 'center',
          showConfirmButton: true,
          confirmButtonColor: '#0f425b',
          confirmButtonText: 'Aceptar',
        } as SweetAlertOptions);    
      });          
    }

  }

}
