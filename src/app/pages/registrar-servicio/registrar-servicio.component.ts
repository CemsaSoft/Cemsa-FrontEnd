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
  selector: 'app-registrar-servicio',
  templateUrl: './registrar-servicio.component.html',
  styleUrls: ['./registrar-servicio.component.css']
})
export class RegistrarServicioComponent implements OnInit {

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
  caracteresValidosNombreServicio: string =
    "La primera letra del Nombre del Servicio debe ser Mayúscula, más de 3 caracteres y no se admiten: ! # $ % & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
    caracteresValidosUnidad: string =
    "No se admiten: ! # $ & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
  idSeleccionado: number = 0;
  tipoOrdenamiento: number = 1;

  mostrarBtnAceptarModificacion: boolean = false;
  mostrarBtnEditarModificacion : boolean = true;

  //FORMULARIOS DE AGRUPACION DE DATOS
  formAgregar: FormGroup;

  constructor(
    private fb: FormBuilder,
    private servicioRegistrar: ServicioService,
  ) { 
      this.formAgregar = this.fb.group({
        descripcionA: new FormControl(null, [
          Validators.required,
          Validators.pattern("^[A-Z][A-ZÑa-zñáéíóúÁÉÍÓÚ'° 0-9/]{2,29}$"),
        ]),
        unidadA: new FormControl(null, [
          Validators.required,
          Validators.pattern("^[A-Za-zÑñáéíóúÁÉÍÓÚ'°0-9/%ºª ]{1,12}$"),
        ]),
        tipoGraficoA: new FormControl(null, [
          Validators.required,
        ]),
      }
    );
  }

  ngOnInit(): void {
  }

  set descripcionA(valor: any) {
    this.formAgregar.get('descripcionA')?.setValue(valor);
  }
  set unidadA(valor: any) {
    this.formAgregar.get('unidadA')?.setValue(valor);
  }
  set tipoGraficoA(valor: any) {
    this.formAgregar.get('tipoGraficoA')?.setValue(valor);
  }
  get descripcionA() {
    return this.formAgregar.get('descripcionA');
  }
  get unidadA() {
    return this.formAgregar.get('unidadA');
  }
  get tipoGraficoA() {
    return this.formAgregar.get('tipoGraficoA');
  }

  //Valida que los campos descripcion y uniddad se encuentren correctamente ingresados.
  validarControlesAgregar(): string {
    if (this.formAgregar.valid == false) {
      return (this.validadorCamposAgregar = '2');
    } else {
      return (this.validadorCamposAgregar = '1');
    }
  }

//Agregar un servicio
agregarServicio(): void {
  //Verifica que este completo el formulario y que no tenga errores.
  if (this.formAgregar.valid == false) {      
    Swal.fire({
      title: 'Error',
      text: `Verificar los datos ingresados:              
        ${this.descripcionA?.invalid && this.descripcionA.errors?.['required'] ? '\n* La descripción es requerida.' : ''}          
        ${this.descripcionA?.invalid && this.descripcionA.errors?.['pattern'] ? '\n* La primera letra debe ser mayúscula y no debe contener caracteres especiales. Además, debe tener más de 3 caracteres y menos de 30 caracteres.' : ''}
        ${this.unidadA?.invalid && this.unidadA.errors?.['required'] ? '\n* La unidad es requerida.' : ''}          
        ${this.unidadA?.invalid && this.unidadA.errors?.['pattern'] ? '\n* La unidad no debe contener caracteres especiales ni tener más de 12 caracteres.' : ''}      
        ${this.tipoGraficoA?.invalid && this.tipoGraficoA.errors?.['required'] ? '\n* Seleccione un tipo de grafico.' : ''}`,      

      icon: 'warning',
      confirmButtonColor: '#0f425b',
      confirmButtonText: 'Aceptar',
      footer: 'Por favor, corrija los errores e inténtelo de nuevo.'
    });     
  } else {
    
  let Servicios: ServicioClass = new ServicioClass(
    0,
    this.formAgregar.get('descripcionA')?.value,
    this.formAgregar.get('unidadA')?.value,
    this.formAgregar.get('tipoGraficoA')?.value,
  );
  this.servicioRegistrar.guardarServicio(Servicios).subscribe((data) => {      
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

}
