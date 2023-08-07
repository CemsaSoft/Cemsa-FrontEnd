//SISTEMA
import { Component, OnInit, AfterViewInit , ViewChild } from '@angular/core';
import {
  FormBuilder, FormControl, FormGroup,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';

import { MatStepper } from '@angular/material/stepper';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

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
  
  //TABLA Central
  displayedColumnsCentral: string[] = ['cenNro', 'cliApeNomDen', 'usuario', 'estDescripcion', 'columnaVacia', 'modEstado', 'verMas'];
  @ViewChild('paginatorCentral', { static: false }) paginatorCentral: MatPaginator | undefined;
  @ViewChild('matSortCentral', { static: false }) sortCentral: MatSort | undefined;
  dataSourceCentral: MatTableDataSource<any>;
  pageSizeCentral = 10; // Número de elementos por página
  currentPageCentral = 1; // Página actual

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
  pageSize = 10; // Número de elementos por página
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
    this.dataSourceCentral = new MatTableDataSource<any>();

    this.formfiltro = new FormGroup({
      idCentral: new FormControl(null, []),
      cliente: new FormControl(null, []),
      usuario: new FormControl(null, []),
    });
   }
        
  ngOnInit(): void {          
    this.centralConsultar.obtenerCentral().subscribe(data => {
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

  //Filtro de Central por Id, Nombre Cliente o Usuario.
  esFiltrar(event: Event) {
    const filtronIdCentral = (this.formfiltro.get('idCentral') as FormControl).value?.toLowerCase();
    const filtronCliente = (this.formfiltro.get('cliente') as FormControl).value?.toLowerCase();
    const filtroUsuario = (this.formfiltro.get('usuario') as FormControl).value?.toLowerCase();

    this.CentralConsultaFiltrados = this.CentralConsulta.filter((central) => {
      const valorIdCentral = central.cenNro.toString().toLowerCase();
      const valorCliente = central.cliApeNomDen.toString().toLowerCase();
      const valorUsuario = central.usuario.toString().toLowerCase();
      return (
        (!filtronIdCentral || valorIdCentral.includes(filtronIdCentral)) &&
        (!filtronCliente || valorCliente.includes(filtronCliente)) &&
        (!filtroUsuario || valorUsuario.includes(filtroUsuario)) 
      );
    });

    this.dataSourceCentral = new MatTableDataSource(this.CentralConsultaFiltrados);
    if (this.paginatorCentral) {
      this.dataSourceCentral.paginator = this.paginatorCentral;
    }
    if (this.sortCentral) {
      this.dataSourceCentral.sort = this.sortCentral;
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
              position: 'center',
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
              position: 'center',
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
    this.servicioCentral.enviarCentralSeleccionada(this.CentralSeleccionada)  
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

}
