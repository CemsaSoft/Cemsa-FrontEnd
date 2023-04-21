import { Component, OnInit } from '@angular/core';
import { ServicioClass } from 'src/app/core/models/servicio';
import { ServicioService } from 'src/app/core/services/servicio.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';

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
  serDescripcion: string = '';
  serUnidad: string = '';
  unidadSeleccionada: string = '';
  despcionSeleccionado: string = '';
  caracteresValidos: string =
    "La primera letra del nombre debe ser Mayúscula, y no se admiten: 1-9 ! # $ % & ' ( ) * + , - . / : ; < = > ¿? @ [  ] ^ _` { | } ~";

  idSeleccionado: number = 0;

  //FORMULARIOS DE AGRUPACION DE DATOS
  formModificar: FormGroup;

  constructor(
    private fb: FormBuilder,
    private servicioConsultar: ServicioService) { 
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
    });
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

  esFiltrar(event: Event){
    let txtBuscar = (event.target as HTMLInputElement).value;
    let filtro = txtBuscar
    .replace(/[^\w\s]/g, '')
    .trim()
    .toLowerCase();
    this.ServiciosFiltrados = [];

    this.Servicios.forEach((servicio) => {
      if(
        servicio.serDescripcion.toString().includes(filtro)
      ){
        this.ServiciosFiltrados.push(servicio)
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
    } else {
      if (opcion == 'Desactivar') {
        this.titulo = opcion;
      } else {
        this.titulo = opcion;
      } 
    }
  }

  //Bloquea los campos ante una consulta.
  bloquearEditar(): void {
    this.formModificar.get('id')?.disable();
    this.formModificar.get('descripcion')?.disable();
    this.formModificar.get('unidad')?.disable();
  }

  //Desbloquea los campos para su modificación.
  desbloquearEditar(): void {
    this.formModificar.get('descripcion')?.enable();
    this.formModificar.get('unidad')?.enable();
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
}
