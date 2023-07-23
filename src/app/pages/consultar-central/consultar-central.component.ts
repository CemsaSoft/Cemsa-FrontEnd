//SISTEMA
import { Component, OnInit, AfterViewInit , ViewChild } from '@angular/core';
import {
  FormBuilder, FormControl, FormGroup,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { MatStepper } from '@angular/material/stepper';

//COMPONENTES
import { CentralConsultaClass } from 'src/app/core/models/centralConsulta';
import { CentralClass } from 'src/app/core/models/central';
import { ServicioEstadoClass } from 'src/app/core/models/servicioEstado';

//SERVICIOS
import { CentralService } from 'src/app/core/services/central.service';

@Component({
  selector: 'app-consultar-central',
  templateUrl: './consultar-central.component.html',
  styleUrls: ['./consultar-central.component.css']
})

export class ConsultarCentralComponent implements OnInit   {
//STEPPER
titulo1 = 'Seleccione una Central Meteorológica para ver sus datos';
titulo2 = 'Datos de la Central N°:';
titulo3 = ':';
isStep1Completed = false;
isStep2Completed = false;
isStep3Completed = false;

@ViewChild(MatStepper, { static: false }) stepper: MatStepper | undefined;

//VARIABLES DE OBJETOS LIST
CentralConsulta: CentralConsultaClass[] = [];
CentralConsultaFiltrados: CentralConsultaClass [] = [];
pageSize = 5; // Número de elementos por página
currentPage = 1; // Página actual
totalItems = 0; // Total de elementos en la tabla
myTable = 'myTable';

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

  isCollapsed1 = false;
  isCollapsed2 = false;
  isCollapsed3 = false;

  //PAGINADO
  pageSizeCentral = 5; // Número de elementos por página
  currentPageCentral = 1; // Página actual
  totalItemsCentral = 0; // Total de elementos en la tabla

  pageSizeServicio = 2; // Número de elementos por página
  currentPageServicio = 1; // Página actual
  totalItemsServicio = 0; // Total de elementos en la tabla

  map: L.Map | undefined;
  marker: L.Marker | undefined;
  //FORMULARIOS DE AGRUPACION DE DATOS
  formfiltro: FormGroup;

  constructor(
    private fb: FormBuilder,
    private centralModificarEstado: CentralService,
    private centralConsultar: CentralService, 
    private servicioCentral: CentralService,
    )    
  {
    this.formfiltro = new FormGroup({
      cliente: new FormControl(null, []),
      usuario: new FormControl(null, []),
    });
   }
        
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
  esFiltrar(event: Event) {
    const filtronCliente = (this.formfiltro.get('cliente') as FormControl).value?.toLowerCase();
    const filtroUsuario = (this.formfiltro.get('usuario') as FormControl).value?.toLowerCase();

    this.CentralConsultaFiltrados = this.CentralConsulta.filter((central) => {
      const valorCliente = central.cliApeNomDen.toString().toLowerCase();
      const valorUsuario = central.usuario.toString().toLowerCase();
      return (
        (!filtronCliente || valorCliente.includes(filtronCliente)) &&
        (!filtroUsuario || valorUsuario.includes(filtroUsuario)) 
      );
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

  enviarDatos(){
    //console.log(this.CentralSeleccionada)
    //console.log("paso por consultar central y los datos son");
    this.servicioCentral.enviarCentralSeleccionada(this.CentralSeleccionada)  
  }
  paginaCambiada(event: any) {
    this.currentPage = event;
    const cantidadPaginas = Math.ceil(
      this.CentralConsultaFiltrados.length / this.pageSize
    );
    const paginas = [];

    for (let i = 1; i <= cantidadPaginas; i++) {
      paginas.push(i);
    }
    return paginas;
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
  toggleCollapse1() {
    this.isCollapsed1 = !this.isCollapsed1;
  }

  toggleCollapse2() {
    this.isCollapsed2 = !this.isCollapsed2;
  }

  toggleCollapse3() {
    this.isCollapsed3 = !this.isCollapsed3;
  }

}
