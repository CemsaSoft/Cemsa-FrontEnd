//SISTEMA
import { JsonpClientBackend } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { MatStepper } from '@angular/material/stepper';

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

  //STEPPER
  titulo1 = 'Consultá información de los servicios:';
  titulo2 = 'Agregar servicio:';
  titulo3 = '';
  isStep1Completed = false;
  isStep2Completed = false;
  isStep3Completed = false;

  @ViewChild(MatStepper, { static: false }) stepper: MatStepper | undefined;

  //VARIABLES DE OBJETOS LIST
  Servicios: ServicioClass[] = [];
  ServiciosFiltrados: ServicioClass [] = [];

  isCollapsed1 = false;
  isCollapsed2 = false;  

  //PAGINADO
  pageSize = 5; // Número de elementos por página
  currentPage = 1; // Página actual
  totalItems = 0; // Total de elementos en la tabla

  //myTable = 'myTable';

  //VARIABLES DE DATOS
  titulo: string = '';
  validadorCamposModif: string = '1';
  validadorCamposAgregar: string = '1';
  serDescripcion: string = '';
  serUnidad: string = '';
  unidadSeleccionada: string = '';
  despcionSeleccionado: string = '';
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
    private servicioRegistrar: ServicioService,
    private servicioConsultar: ServicioService) 
    { 
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
    this.servicioConsultar.obtenerServicios().subscribe(data => {
      this.Servicios = data;  
      this.ServiciosFiltrados = data;
    })
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
    console.log(`Pasando al siguiente paso: ${stepNumber}`);
    if (this.stepper) {
      this.stepper.selectedIndex = stepNumber;
    }
  }
  
  goToPreviousStep(): void {
    if (this.stepper) {
      this.stepper.previous();
    }
  }

  getTipoGraficoTexto(serTipoGrafico: number): string {
    switch (serTipoGrafico) {
      case 1:
        return 'Humedad de Suelo';
      case 2:
        return 'Humedad del Ambiente';
      case 3:
        return 'Temperatura';
      case 4:
        return 'Velocidad del Viento';
      case 5:
        return 'Dirección del Viento';
      default:
        return '';
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
  }

  //Valida que exista algún servicio que responda al filtro.
  validarFiltrado(): Boolean {
    if (this.ServiciosFiltrados.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  //Almacena los datos del servicio que fue seleccionado en la tabla de servicio filtrados dentro de variables locales.
  esfilaSeleccionada(servicios: ServicioClass) {
    this.idSeleccionado = servicios.serId;
    this.despcionSeleccionado = servicios.serDescripcion;
    this.unidadSeleccionada = servicios.serUnidad;
    this.id = servicios.serId;
    this.descripcion = servicios.serDescripcion;
    this.unidad = servicios.serUnidad;
    this.tipoGrafico = servicios.serTipoGrafico;
  }

  //Permite abrir un Modal u otro en función del titulo pasado como parametro.
  abrirModal(opcion: string) {
    if (opcion == 'Ver Mas') {
      this.titulo = opcion;
      this.bloquearEditar();
    } 
    if (opcion == 'Eliminar Servicio') {
        this.titulo = opcion;
    }
    if (opcion == 'Agregar Servicio') {
          this.titulo = opcion;
    }
  }

  //Valida que los campos descripcion y uniddad se encuentren correctamente ingresados.
  validarControlesMod(): string {
    if (this.formModificar.valid == false) {
      return (this.validadorCamposModif = '2');
    } else {
      return (this.validadorCamposModif = '1');
    }
  }

  //Metodos para grilla
  //Almacena en una variable la propiedad por la cual se quiere ordenar la consulta de Servicios.
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

  //Bloquea los campos ante una consulta.
  bloquearEditar(): void {
    this.formModificar.get('id')?.disable();
    this.formModificar.get('descripcion')?.disable();
    this.formModificar.get('unidad')?.disable(); 
    this.formModificar.get('tipoGrafico')?.disable();      
    this.mostrarBtnAceptarModificacion = false;
    this.mostrarBtnEditarModificacion = true;
  }

  //Desbloquea los campos para su modificación.
  desbloquearEditar(): void {
    this.formModificar.get('descripcion')?.enable();   
    this.formModificar.get('unidad')?.enable();   
    this.formModificar.get('tipoGrafico')?.enable();       
    this.mostrarBtnAceptarModificacion = true;   
    this.mostrarBtnEditarModificacion = false;
    
  }

  //Consulta los Servicio que se encuentran registrados y los guarda en una lista de Servicio.
  obtenerServicio() {
    this.servicioConsultar.obtenerServicios().subscribe((data) => {
      this.Servicios = data;
      this.totalItems = this.Servicios.length;
      this.Servicios.forEach((servicio) => {
        servicio.serDescripcion = this.serDescripcion;
        servicio.serUnidad = this.serUnidad;
        
      });
    });
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
          position: 'top',
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
  desactivarServicio() {
    this.servicioConsultar    
    .eliminarServicio(this.idSeleccionado)
    .subscribe(() => {
      Swal.fire({
        text:
          'Se ha eliminado con éxito el servicio  ' +
          this.despcionSeleccionado +
          ' identificado con el código ' +
          this.idSeleccionado,
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
    }, (error) => {
      Swal.fire({
        text: 'No es posible eliminar este servicio',
        icon: 'error',
        position: 'top',
        showConfirmButton: true,
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
      } as SweetAlertOptions);    
    });
  }

  
  paginaCambiada(event: any) {
    this.currentPage = event;
    const cantidadPaginas = Math.ceil(
      this.ServiciosFiltrados.length / this.pageSize
    );
    const paginas = [];

    for (let i = 1; i <= cantidadPaginas; i++) {
      paginas.push(i);
    }
    return paginas;
  }
  
}
