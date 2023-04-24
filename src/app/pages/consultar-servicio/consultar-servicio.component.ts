//SISTEMA
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';

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

  //VARIABLES DE OBJETOS LIST
  Servicios: ServicioClass[] = [];
  ServiciosFiltrados: ServicioClass [] = [];

  //VARIABLES DE DATOS
  titulo: string = '';
  validadorCamposModif: string = '1';
  validadorCamposAgregar: string = '1';
  serDescripcion: string = '';
  serUnidad: string = '';
  unidadSeleccionada: string = '';
  despcionSeleccionado: string = '';
  propiedadOrdenamiento: string = 'serId';
  caracteresValidos: string =
    "La primera letra del nombre debe ser Mayúscula, y no se admiten: 1-9 ! # $ % & ' ( ) * + , - . / : ; < = > ¿? @ [  ] ^ _` { | } ~";

  idSeleccionado: number = 0;
  tipoOrdenamiento: number = 1;

  mostrarBtnAceptarModificacion: boolean = false;
  mostrarBtnEditarModificacion : boolean = true;

  //FORMULARIOS DE AGRUPACION DE DATOS
  formModificar: FormGroup;
  formAgregar: FormGroup;

  constructor(
    private fb: FormBuilder,
    private servicioRegistrar: ServicioService,
    private servicioConsultar: ServicioService) 
    { 
      this.formModificar = this.fb.group({
        id: new FormControl(null, []),
        descripcion: new FormControl(null, [
          Validators.required,
          Validators.pattern("^[A-Z][A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$"),
        ]),
        unidad: new FormControl(null, [
          Validators.required,
          Validators.pattern("^[A-Z][A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$"),
        ]),
      }),
      this.formAgregar = this.fb.group({
        descripcionA: new FormControl(null, [
          Validators.required,
          Validators.pattern("^[A-Z][A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$"),
        ]),
        unidadA: new FormControl(null, [
          Validators.required,
          Validators.pattern("^[A-Z][A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$"),
        ]),
      }
    );
  }

  ngOnInit(): void {
    this.servicioConsultar.obtenerServicios().subscribe(data => {
      this.Servicios = data;  
      this.ServiciosFiltrados = data;
    })
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

  get descripcionA() {
    return this.formAgregar.get('descripcionA');
  }

  get unidadA() {
    return this.formAgregar.get('unidadA');
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

  //Valida que los campos descripcion y uniddad se encuentren correctamente ingresados.
  validarControlesAgregar(): string {
    if (this.formAgregar.valid == false) {
      return (this.validadorCamposAgregar = '2');
    } else {
      return (this.validadorCamposAgregar = '1');
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
    this.mostrarBtnAceptarModificacion = false;
    this.mostrarBtnEditarModificacion = true;
  }

  //Desbloquea los campos para su modificación.
  desbloquearEditar(): void {
    this.formModificar.get('descripcion')?.enable();   
    this.formModificar.get('unidad')?.enable();   
    this.mostrarBtnAceptarModificacion = true;   
    this.mostrarBtnEditarModificacion = false;
  }

  //Consulta los Servicio que se encuentran registrados y los guarda en una lista de Servicio.
  obtenerServicio() {
    this.servicioConsultar.obtenerServicios().subscribe((data) => {
      this.Servicios = data;
      this.Servicios.forEach((servicio) => {
        servicio.serDescripcion = this.serDescripcion;
        servicio.serUnidad = this.serUnidad;
      });
    });
  }

  //Modificación del servicio seleccionado.
  modificarServicio() {
    let Servicios: ServicioClass = new ServicioClass(
      this.idSeleccionado,
      this.formModificar.get('descripcion')?.value,
      this.formModificar.get('unidad')?.value,
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

  //Baja fisica del servicio seleccionado.
  desactivarServicio() {
    this.servicioConsultar    
    .eliminarServicio(this.idSeleccionado)
    .subscribe(() => {
      Swal.fire({
        text:
          'El servicio ' +
          this.despcionSeleccionado +
          ' con Cod.: ' +
          this.idSeleccionado +
          ' ha sido eleminado con éxito.',
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

  //Agregar un servicio
  agregarServicio(): void {
    let Servicios: ServicioClass = new ServicioClass(
      0,
      this.formAgregar.get('descripcionA')?.value,
      this.formAgregar.get('unidadA')?.value,
    );
    this.servicioRegistrar.guardarServicio(Servicios).subscribe((data) => {
      console.log(data);
      Swal.fire({
        text:
          'El Servicio ' + 
          data.serDescripcion +
          ' con la unidad: ' +
          data.serUnidad +
          ' ha sido registrado con éxito con el número de Cod.: ' +
          data.serId,
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
        text: 'No es posible Agregar este servicio',
        icon: 'error',
        position: 'top',
        showConfirmButton: true,
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
      } as SweetAlertOptions);    
    });
  }

}
