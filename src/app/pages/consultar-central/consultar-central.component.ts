//SISTEMA
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';

//COMPONENTES
import { CentralConsultaClass } from 'src/app/core/models/centralConsulta';
import { CentralClass } from 'src/app/core/models/central';

//SERVICIOS
import { CentralService } from 'src/app/core/services/central.service';

@Component({
  selector: 'app-consultar-central',
  templateUrl: './consultar-central.component.html',
  styleUrls: ['./consultar-central.component.css']
})

export class ConsultarCentralComponent implements OnInit   {

//VARIABLES DE OBJETOS LIST
CentralConsulta: CentralConsultaClass[] = [];
CentralConsultaFiltrados: CentralConsultaClass [] = [];

//VARIABLES DE DATOS
titulo: string = '';
propiedadOrdenamiento: string = 'cenNro';
cliApeNomDenSeleccionado: string ='';
usuarioSeleccionado: string = '';
estDescripcionSeleccionado: string = '';

imeiSeleccionado: string = '';
coordenadaXSeleccionado: string = '';
coordenadaYSeleccionado: string = '';
fechaAltaSeleccionado: string = '';
fechaBajaSeleccionado: string = '';

tipoOrdenamiento: number = 1;
cenNroSeleccionado: number=0;
estIdSeleccionado: number = 0;
CentralSeleccionada: any;

//FORMULARIOS DE AGRUPACION DE DATOS

  constructor(
    private fb: FormBuilder,
    private centralModificarEstado: CentralService,
    private centralConsultar: CentralService, 
    private servicioCentral: CentralService,
    )    
  { }
        
    ngOnInit(): void {          
      this.centralConsultar.obtenerCentral().subscribe(data => {
        this.CentralConsulta = data;  
        this.CentralConsultaFiltrados = data;     
      });    
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
    this.CentralSeleccionada = centralConsulta;
      this.cenNroSeleccionado = centralConsulta.cenNro;
      this.cliApeNomDenSeleccionado = centralConsulta.cliApeNomDen;
      this.usuarioSeleccionado = centralConsulta.usuario;
      this.estDescripcionSeleccionado = centralConsulta.estDescripcion;
      this.estIdSeleccionado = centralConsulta.cenIdEstadoCentral;
      this.imeiSeleccionado = centralConsulta.cenImei;
      this.coordenadaXSeleccionado = centralConsulta.cenCoorX;
      this.coordenadaYSeleccionado = centralConsulta.cenCoorY;
      this.fechaAltaSeleccionado = new Date(centralConsulta.cenFechaAlta).toLocaleDateString("es-AR");
      this.fechaBajaSeleccionado = centralConsulta.cenFechaBaja ? new Date(centralConsulta.cenFechaBaja).toLocaleDateString("es-AR") : '';     
  }

  //Filtro de Central por Nombre Cliente o Usuario.
  esFiltrar(event: Event, campo: string) {
    let txtBuscar = (event.target as HTMLInputElement).value;
    let filtro = txtBuscar
      .replace(/[^\w\s]/g, '')
      .trim()
      .toLowerCase();
    this.CentralConsultaFiltrados = [];
    this.CentralConsulta.forEach((centralConsulta) => {
      if (
        (campo === 'cliente' && centralConsulta.cliApeNomDen.toString().toLowerCase().includes(filtro)) ||
        (campo === 'usuario' && centralConsulta.usuario.toString().toLowerCase().includes(filtro))
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

  ModificarEstadoCentral(estIdSeleccionado: number, estado:string): void {
    Swal.fire({
      text: '¿Estás seguro que deseas modificar el estado de esta central a "' + estado + '"?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f425b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    } as SweetAlertOptions).then((result) => {
      if (result.isConfirmed) {
        this.centralModificarEstado.modificarEstado(this.cenNroSeleccionado, estIdSeleccionado).subscribe(
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
              text: 'No es posible modificar el estado de esta central',
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

  // abrir ventna Modificar Central
  modificarCentral(): void {
          
  }
  enviarDatos(){
    console.log(this.CentralSeleccionada)
    console.log("paso por consultar central y los datos son");
    this.servicioCentral.enviarCentralSeleccionada(this.CentralSeleccionada)
   
   
  }
}
