//SISTEMA
import { JsonpClientBackend } from '@angular/common/http';
import { Component, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl, ValidatorFn, ValidationErrors
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';

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
  //VARIABLES DE OBJETOS LIST
  CentralConsulta: CentralConsultaClass[] = [];
  CentralConsultaFiltrados: CentralConsultaClass [] = [];
  AlarmaConfigConsulta: AlarmaConfigConsultaClass[] = [];
  ServiciosCentral: ServicioClass[] = [];
  ServiciosCentralA: ServicioClass[] = [];

  //VARIABLES DE DATOS
  propiedadOrdenamiento: string = "cenNro";
  propiedadOrdenamientoCA: string = "cfgId";
  titulo: string = '';
  caracteresValidosObservacion: string = "No se admiten: ! # $ & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
  caracteresValidosNombre: string = "No se admiten: ! # $ & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
  caracteresValidosLimites: string = "Solo se admiten números y no se admiten: ! # $ & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
  validadorCamposAgregar: string = '1';
  validadorCamposModif: string = '1';

  tipoOrdenamiento: number = 1;
  tipoOrdenamientoCA: number = 1;
  centralNroSeleccionada: number=0;
  idServicioSeleccionado: number=0;
  alarmaIdSeleccionado: number=0;
  smallestId: number=0;

  idUsuario: any = 0;

  isCollapsed1 = false;
  isCollapsed2 = false;
  mostrarBtnEditarModificacion = true;
  mostrarBtnAceptarModificacion = false;

  //FORMULARIOS DE AGRUPACION DE DATOS
  formModificar: FormGroup;
  formAgregar: FormGroup;

  constructor(
    private centralConsultar: CentralService, 
    private alarmaConfigConsula: AlarmaConfigService,
  ) {
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
      cfgValorSuperiorA: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^-?\d+([.,]\d{1,2})?$/)
      ]),
      cfgValorInferiorA: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^-?\d+([.,]\d{1,2})?$/)
      ]),
      cfgObservacion: new FormControl(null, [
        Validators.pattern("^[A-Za-zÑñáéíóúÁÉÍÓÚ'°0-9/%ºª ]{1,100}$"),
      ]),
    });
    this.formAgregar = new FormGroup({
      nroCentralA: new FormControl(null, []),
      nombreAlarmaA: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[A-Za-zÑñáéíóúÁÉÍÓÚ'°0-9/%ºª ]{1,50}$"),
      ]),
      nombreServicioA: new FormControl(null, []),
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
    });
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

  //Valida que exista alguna Alarma que responda al filtro.
  validarFiltradoAlarma(): Boolean {
    if (this.AlarmaConfigConsulta.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  //Almacena los datos de la central que fue seleccionado en la tabla de central filtrados dentro de variables locales.
  esfilaSeleccionada(centralConsulta: CentralConsultaClass) {
    this.centralNroSeleccionada = centralConsulta.cenNro;    
  }

  //Almacena los datos de la Alarma que fue seleccionado en la tabla de Alarma filtrados dentro de variables locales.
  esfilaSeleccionadaAlarma(alarma: AlarmaConfigConsultaClass) {
    this.alarmaIdSeleccionado = alarma.cfgId

    this.nroCentral = alarma.cfgNro;
    this.cfgId = alarma.cfgId;
    this.nombreAlarma = alarma.cfgNombre;
    this.cfgFechaAlta= alarma.cfgFechaAlta ? new Date(alarma.cfgFechaAlta).toLocaleDateString("es-AR") : '';
    this.cfgFechaBaja= alarma.cfgFechaBaja ? new Date(alarma.cfgFechaBaja).toLocaleDateString("es-AR") : '';
    this.cfgValorSuperiorA = alarma.cfgValorSuperiorA
    this.cfgValorInferiorA = alarma.cfgValorInferiorA
    this.cfgObservacion = alarma.cfgObservacion
    this.nombreServicio = alarma.cfgSer;    
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

  //Permite abrir un Modal u otro en función del titulo pasado como parametro.
  abrirModal(opcion: string) {
    if (opcion == 'Ver Mas') {
      this.titulo = opcion;
      this.bloquearEditar();
      this.centralConsultar.obtenerServicioXCentral(this.centralNroSeleccionada).subscribe(data => {
        this.ServiciosCentral = data.filter((servicio: { serTipoGrafico: number; }) => servicio.serTipoGrafico != 5);
      });
      
    } 
    if (opcion == 'Agregar Alarma') {
        this.titulo = opcion;
        this.nroCentralA = this.centralNroSeleccionada;
        this.centralConsultar.obtenerServicioXCentral(this.centralNroSeleccionada).subscribe(data => {
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
    }
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

  //Almacena en una variable la propiedad por la cual se quiere ordenar la consulta de Configuracion de Alarma.
  ordenarPorCA(propiedad: string) {
    this.tipoOrdenamientoCA =
      propiedad === this.propiedadOrdenamientoCA ? this.tipoOrdenamientoCA * -1 : 1;
    this.propiedadOrdenamientoCA = propiedad;
  }

  //En base a la propiedad por la que se quiera ordenar y el tipo de orden muestra un icono.
  ordenarIconoCA(propiedad: string) {
    if (propiedad === this.propiedadOrdenamientoCA) {
      return this.tipoOrdenamientoCA === 1 ? '🠉' : '🠋';
    } else {
      return '🠋🠉';
    }
  } 

  seleccionarCentral(){
    this.alarmaConfigConsula.obtenerAlarmaConfigDeCentral(this.centralNroSeleccionada).subscribe(data => {
      this.AlarmaConfigConsulta = data; 
    })
    this.isCollapsed1 = !this.isCollapsed1;
  }

   //Bloquea los campos ante una consulta.
   bloquearEditar(): void {
    this.formModificar.get('nombreAlarma')?.disable();
    this.formModificar.get('cfgValorSuperiorA')?.disable();
    this.formModificar.get('cfgValorInferiorA')?.disable();
    this.formModificar.get('cfgObservacion')?.disable();
    this.formModificar.get('nombreServicio')?.disable();
    this.mostrarBtnAceptarModificacion = false;
    this.mostrarBtnEditarModificacion = true;
  }

  //Desbloquea los campos para su modificación.
  desbloquearEditar(): void {
    this.formModificar.get('nombreAlarma')?.enable();
    this.formModificar.get('cfgValorSuperiorA')?.enable();
    this.formModificar.get('cfgValorInferiorA')?.enable();
    this.formModificar.get('cfgObservacion')?.enable();
    this.formModificar.get('nombreServicio')?.enable();
    this.mostrarBtnAceptarModificacion = true;   
    this.mostrarBtnEditarModificacion = false;
  }

  ModificarEstadoAlarma(estIdSeleccionado: number, estado:string): void {
    Swal.fire({
      text: '¿Estás seguro que deseas modificar el estado de esta alarma a "' + estado + '"?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f425b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    } as SweetAlertOptions).then((result) => {
      if (result.isConfirmed) {
        this.alarmaConfigConsula.modificarEstado(estIdSeleccionado, this.alarmaIdSeleccionado, ).subscribe(
          result => {
            Swal.fire({
              text: 'Se ha actualizado el estado a '+ estado,
              icon: 'success',
              position: 'top',
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
              position: 'top',
              showConfirmButton: true,
              confirmButtonColor: '#0f425b',
              confirmButtonText: 'Aceptar',
            } as SweetAlertOptions);    
          }
        );
      }
    });
  }

  //Valida que los campos descripcion y uniddad se encuentren correctamente ingresados.
  validarControlesMod(): string {
    if (this.formModificar.valid == false) {
      return (this.validadorCamposModif = '2');
    } else {
      return (this.validadorCamposModif = '1');
    }
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

    if (!(this.centralNroSeleccionada !=0 )) {
      mostrarError('Debe ingresar una central', 'Por favor, seleccione una Central.');
    } else if (this.nombreAlarma?.invalid && this.nombreAlarma.errors?.['required'] ) {
      mostrarError('Debe ingresar un nombre de alarma', 'Por favor, introduzca un nombre de alarma.');
    } else if (this.nombreAlarma?.invalid && this.nombreAlarma.errors?.['pattern'] ) {
      mostrarError('El nombre no debe contener caracteres especiales ni tener más de 50 carácteres.', 'Por favor, corrija el nombre e inténtelo de nuevo.');
    } else if (this.cfgValorSuperiorA?.invalid && this.cfgValorSuperiorA.errors?.['required'] ) {
      mostrarError('Debe ingresar un límite superior', 'Por favor, introduzca un límite superior.');    
    } else if (this.cfgValorSuperiorA?.invalid && this.cfgValorSuperiorA.errors?.['pattern'] ) {
      mostrarError('El límite superior no es valido', 'Por favor, corrija el límite superior e inténtelo de nuevo.');        
    } else if (this.cfgValorInferiorA?.invalid && this.cfgValorInferiorA.errors?.['required'] ) {
      mostrarError('Debe ingresar un límite inferior', 'Por favor, introduzca un límite límite.');
    } else if (this.cfgValorSuperiorA?.invalid && this.cfgValorSuperiorA.errors?.['pattern'] ) {
      mostrarError('El límite inferior no es valido', 'Por favor, corrija el límite inferior e inténtelo de nuevo.');    
    } else if (cfgValorInferiorA >= cfgValorSuperiorA) {
      mostrarError('El valor del límete inferior debe ser menor que límite superior', 'Por favor, cambie el limite');  
    } else if (this.cfgObservacion?.invalid && this.cfgObservacion.errors?.['pattern'] ) {
      mostrarError('La observación no debe contener caracteres especiales ni tener más de 100 carácteres.', 'Por favor, Por favor, corrija la observación e inténtelo de nuevo.');
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
          text: 'No es posible modificar esta Alarma',
          icon: 'error',
          position: 'top',
          showConfirmButton: true,
          confirmButtonColor: '#0f425b',
          confirmButtonText: 'Aceptar',
        } as SweetAlertOptions);    
      });          
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

    if (this.nombreAlarmaA?.invalid && this.nombreAlarmaA.errors?.['required'] ) {
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
      mostrarError('El valor del límete inferior debe ser menor que límite superior', 'Por favor, cambie el limite');  
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
    console.log(alarmaC);
    this.alarmaConfigConsula
      .registrarAlarmaConfig(alarmaC)  
      .subscribe(() => {
        Swal.fire({
          text:
          'Se ha registrado con éxito la Configuración de esta Alarma, para la central número ' +
          this.formAgregar.get('nroCentralA')?.value,
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
          text: 'No es posible agregar esta Configuración de Alarma',
          icon: 'error',
          position: 'top',
          showConfirmButton: true,
          confirmButtonColor: '#0f425b',
          confirmButtonText: 'Aceptar',
        } as SweetAlertOptions);    
      });          
    }
  }
}
