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
import { AlarmaConfigClass } from 'src/app/core/models/alarmaConfig';
import { ServicioClass } from 'src/app/core/models/servicio';
import { AlarmaConfigConsultaClass } from 'src/app/core/models/alarmaConfigConsulta';

//SERVICIOS
import { CentralService } from 'src/app/core/services/central.service';
import { AlarmaConfigService } from 'src/app/core/services/alarmaConfig.service';

@Component({
  selector: 'app-registrar-alarma-config',
  templateUrl: './registrar-alarma-config.component.html',
  styleUrls: ['./registrar-alarma-config.component.css']
})
export class RegistrarAlarmaConfigComponent implements OnInit {

  //TABLA Central
  displayedColumnsCentral: string[] = ['cenNro', 'cenImei', 'cenCoorX', 'cenCoorY', 'columnaVacia', 'seleccionar'];
  @ViewChild('paginatorCentral', { static: false }) paginatorCentral: MatPaginator | undefined;
  @ViewChild('matSortCentral', { static: false }) sortCentral: MatSort | undefined;
  dataSourceCentral: MatTableDataSource<any>;
  pageSizeCentral = 5; // Número de elementos por página
  currentPageCentral = 1; // Página actual
  
  //STEPPER
  titulo1 = 'Seleccionar Central para Registar Configuración de Alarma';
  titulo2 = 'Registrar Configuración de Alarma a la Central N°:';
  titulo3 = ':';
  isStep1Completed = false;
  isStep2Completed = false;
  isStep3Completed = false;

  @ViewChild(MatStepper, { static: false }) stepper: MatStepper | undefined;

  //VARIABLES DE OBJETOS LIST
  CentralConsulta: CentralConsultaClass[] = [];
  CentralConsultaFiltrados: CentralConsultaClass [] = [];
  ServiciosCentralA: ServicioClass[] = [];
  AlarmaConfigConsulta: AlarmaConfigConsultaClass[] = [];


  //VARIABLES DE DATOS
  propiedadOrdenamiento: string = "cenNro";
  caracteresValidosObservacion: string = "No se admiten: ! # $ & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
  caracteresValidosNombre: string = "No se admiten: ! # $ & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
  caracteresValidosLimites: string = "Solo se admiten números y no se admiten: ! # $ & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
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
    private alarmaConfigConsula: AlarmaConfigService,
  ) {
    this.dataSourceCentral = new MatTableDataSource<any>();

    this.formAgregar = new FormGroup({
      nroCentralA: new FormControl(null, []),
      nombreAlarmaA: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[A-Za-zÑñáéíóúÁÉÍÓÚ'°0-9/%ºª ]{1,50}$"),
      ]),
      nombreServicioA: new FormControl(null, [
        Validators.required,
      ]),
      cfgValorSuperiorAA: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^-?\d+([.,]\d{1,2})?$/)
      ]),
      cfgValorInferiorAA: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^-?\d+([.,]\d{1,2})?$/)
      ]),
      cfgObservacionA: new FormControl(null, [
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

  set nroCentralA(valor: any) {
    this.formAgregar.get('nroCentralA')?.setValue(valor);
  }
  set nombreAlarmaA(valor: any) {
    this.formAgregar.get('nombreAlarmaA')?.setValue(valor);
  }
  set nombreServicioA(valor: any) {
    this.formAgregar.get('nombreServicioA')?.setValue(valor);
  }
  set cfgValorSuperiorAA(valor: any) {
    this.formAgregar.get('cfgValorSuperiorAA')?.setValue(valor);
  }
  set cfgValorInferiorAA(valor: any) {
    this.formAgregar.get('cfgValorInferiorAA')?.setValue(valor);
  }
  set cfgObservacionA(valor: any) {
    this.formAgregar.get('cfgObservacionA')?.setValue(valor);
  }

  get nroCentralA() {
    return this.formAgregar.get('nroCentralA');
  }
  get nombreAlarmaA() {
    return this.formAgregar.get('nombreAlarmaA');
  }
  get nombreServicioA() {
    return this.formAgregar.get('nombreServicioA');
  }
  get cfgValorSuperiorAA() {
    return this.formAgregar.get('cfgValorSuperiorAA');
  }
  get cfgValorInferiorAA() {
    return this.formAgregar.get('cfgValorInferiorAA');
  }
  get cfgObservacionA() {
    return this.formAgregar.get('cfgObservacionA');
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

    this.isCollapsed1 = !this.isCollapsed1;
    this.titulo2 = 'Registrar Configuración de Alarma a la Central N°' + this.centralNroSeleccionada + ':';

    this.centralNroSeleccionada = element.cenNro;    
    this.nroCentralA = element.cenNro;        
        this.centralConsultar.obtenerServicioXCentral(element.cenNro).subscribe(data => {
          this.ServiciosCentralA = data.filter((servicio: { serTipoGrafico: number; }) => servicio.serTipoGrafico != 5)
          //Verifico que la central tenga servicios
          function mostrarError(mensaje: string, footer: string): Promise<void> {
            return new Promise<void>((resolve) => {
              Swal.fire({
                title: 'Error',
                text: mensaje,
                icon: 'warning',
                confirmButtonColor: '#0f425b',
                confirmButtonText: 'Aceptar',
                footer: footer
              }).then(() => {
                resolve();
              });
            });
          }          
          if (this.ServiciosCentralA.length == 0) {
            mostrarError('La Central Seleccionada No tiene Servicios asignados', 'Por favor, comunicarse con su Administrador.')
              .then(() => {
                location.reload();
              });
          } else {
            this.nombreServicioA = this.ServiciosCentralA[0].serId;   
          }       

        });        

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

 //Agregar una Alarma Configuracion 
 agregarAlarmaConfig(): void {
    
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

  let cfgValorSuperiorA = this.formAgregar.get('cfgValorSuperiorAA')?.value;
  let cfgValorInferiorA = this.formAgregar.get('cfgValorInferiorAA')?.value;
  
  if (typeof cfgValorSuperiorA === 'string') {
    cfgValorSuperiorA = cfgValorSuperiorA.replace(',', '.');
  }    
  if (typeof cfgValorInferiorA === 'string') {
    cfgValorInferiorA = cfgValorInferiorA.replace(',', '.');
  }

  var areAllSameServiceAndActive = true;
  this.alarmaConfigConsula.obtenerAlarmaConfigDeCentral(this.centralNroSeleccionada).subscribe(data => {
    this.AlarmaConfigConsulta = data; 

    const filteredAlarms = this.AlarmaConfigConsulta.filter(alarma => alarma.cfgSer === this.formAgregar.get('nombreServicioA')?.value );
    const areAllSameServiceAndActive = filteredAlarms.every(alarma => alarma.cfgFechaBaja);

  if (!(this.centralNroSeleccionada !=0 )) {
    mostrarError('Debe ingresar una central', 'Por favor, seleccione una Central.');
  } else if (!areAllSameServiceAndActive) {
    mostrarError('Ese Servicio ya tiene una alarma activa', 'Por favor, seleccione otro servicio.');
  } else if (this.nombreAlarmaA?.invalid && this.nombreAlarmaA.errors?.['required'] ) {
    mostrarError('Debe ingresar un nombre de alarma', 'Por favor, introduzca un nombre de alarma.');
  } else if (this.nombreAlarmaA?.invalid && this.nombreAlarmaA.errors?.['pattern'] ) {
    mostrarError('El nombre no debe contener caracteres especiales ni tener más de 50 carácteres.', 'Por favor, corrija el nombre e inténtelo de nuevo.');
  } else if (this.cfgValorSuperiorAA?.invalid && this.cfgValorSuperiorAA.errors?.['required'] ) {
    mostrarError('Debe ingresar un límite superior', 'Por favor, introduzca un límite superior.');    
  } else if (this.cfgValorSuperiorAA?.invalid && this.cfgValorSuperiorAA.errors?.['pattern'] ) {
    mostrarError('El límite superior no es valido', 'Por favor, corrija el límite superior e inténtelo de nuevo.');        
  } else if (this.cfgValorInferiorAA?.invalid && this.cfgValorInferiorAA.errors?.['required'] ) {
    mostrarError('Debe ingresar un límite inferior', 'Por favor, introduzca un límite límite.');
  } else if (this.cfgValorSuperiorAA?.invalid && this.cfgValorSuperiorAA.errors?.['pattern'] ) {
    mostrarError('El límite inferior no es valido', 'Por favor, corrija el límite inferior e inténtelo de nuevo.');    
  } else if (cfgValorInferiorA >= cfgValorSuperiorA) {
    mostrarError('El valor del límite inferior debe ser menor que el límite superior', 'Por favor, cambie el límite');  
  } else if (this.cfgObservacionA?.invalid && this.cfgObservacionA.errors?.['pattern'] ) {
    mostrarError('La observación no debe contener caracteres especiales ni tener más de 100 carácteres.', 'Por favor, Por favor, corrija la observación e inténtelo de nuevo.');
  } else {
  
  let alarmaC: AlarmaConfigClass = new AlarmaConfigClass(
    0,
    this.formAgregar.get('nroCentralA')?.value,
    this.formAgregar.get('nombreServicioA')?.value,
    this.formAgregar.get('nombreAlarmaA')?.value,
    new Date(),
    new Date(),
    cfgValorSuperiorA,
    cfgValorInferiorA,
    this.formAgregar.get('cfgObservacionA')?.value
  );
  this.alarmaConfigConsula
    .registrarAlarmaConfig(alarmaC)  
    .subscribe(() => {
      Swal.fire({
        text:
        'Se ha registrado con éxito la Configuración de esta Alarma, para la central número ' +
        this.formAgregar.get('nroCentralA')?.value,
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
        text: 'No es posible agregar esta Configuración de Alarma',
        icon: 'error',
        position: 'center',
        showConfirmButton: true,
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
      } as SweetAlertOptions);    
    });          
  }

  }) //cierro la busqueda de los servicios para esa central
  } 

}
