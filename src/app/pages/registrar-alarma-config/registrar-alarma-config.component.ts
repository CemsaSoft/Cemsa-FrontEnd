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
import { CentralConsultaClass } from 'src/app/core/models/centralConsulta';
import { AlarmaConfigConsultaClass } from 'src/app/core/models/alarmaConfigConsulta';
import { AlarmaConfigClass } from 'src/app/core/models/alarmaConfig';
import { ServicioClass } from 'src/app/core/models/servicio';

//SERVICIOS
import { CentralService } from 'src/app/core/services/central.service';
import { AlarmaConfigService } from 'src/app/core/services/alarmaConfig.service';

@Component({
  selector: 'app-registrar-alarma-config',
  templateUrl: './registrar-alarma-config.component.html',
  styleUrls: ['./registrar-alarma-config.component.css']
})
export class RegistrarAlarmaConfigComponent implements OnInit {
  //VARIABLES DE OBJETOS LIST
  CentralConsulta: CentralConsultaClass[] = [];
  CentralConsultaFiltrados: CentralConsultaClass [] = [];
  ServiciosCentralA: ServicioClass[] = [];

  //VARIABLES DE DATOS
  propiedadOrdenamiento: string = "cenNro";
  caracteresValidosObservacion: string = "No se admiten: ! # $ & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
  caracteresValidosNombre: string = "No se admiten: ! # $ & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
  caracteresValidosLimites: string = "Solo se admiten números y no se admiten: ! # $ & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
                                        
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
    this.formAgregar = new FormGroup({
      nroCentralA: new FormControl(null, []),
      nombreAlarmaA: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[A-Za-zÑñáéíóúÁÉÍÓÚ'°0-9/%ºª ]{1,}$"),
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
    this.nroCentralA = centralConsulta.cenNro;
        this.centralConsultar.obtenerServicioXCentral(centralConsulta.cenNro).subscribe(data => {
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
            mostrarError('La Central Seleccionada No tiene Servicios asignados', 'Por favor, comunicar con su Administrados, para que le agregue servicios a su central.')
              .then(() => {
                location.reload();
              });
          } else {
            this.nombreServicioA = this.ServiciosCentralA[0].serId;   
          }       
        });        
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
    this.isCollapsed1 = !this.isCollapsed1;
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

  if (!(this.centralNroSeleccionada !=0 )) {
    mostrarError('Debe ingresar una central', 'Por favor, seleccione una Central.');
  } else if (this.nombreAlarmaA?.invalid && this.nombreAlarmaA.errors?.['required'] ) {
    mostrarError('Debe ingresar un nombre de alarma', 'Por favor, introduzca un nombre de alarma.');
  } else if (this.nombreAlarmaA?.invalid && this.nombreAlarmaA.errors?.['pattern'] ) {
    mostrarError('El nombre no debe contener caracteres especiales.', 'Por favor, corrija el nombre e inténtelo de nuevo.');
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
    mostrarError('La observación no debe contener caracteres especiales.', 'Por favor, Por favor, corrija la observación e inténtelo de nuevo.');
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
