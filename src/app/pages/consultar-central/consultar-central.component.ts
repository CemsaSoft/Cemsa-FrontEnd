//SISTEMA
import { Component, OnInit, AfterViewInit , ViewChild } from '@angular/core';
import {
  FormBuilder, FormControl, FormGroup,  Validators,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';

import { Map, Marker, icon } from 'leaflet';
import * as L from 'leaflet';

import { MatStepper } from '@angular/material/stepper';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

//COMPONENTES
import { CentralConsultaClass } from 'src/app/core/models/centralConsulta';
// import { CentralClass } from 'src/app/core/models/central';
// import { ServicioEstadoClass } from 'src/app/core/models/servicioEstado';
import { ServicioClass } from 'src/app/core/models/servicio';

//SERVICIOS
import { CentralService } from 'src/app/core/services/central.service';
import { ServicioService } from 'src/app/core/services/servicio.service';
import { ServicioxCentralClass } from 'src/app/core/models/serviciosxCentral';

@Component({
  selector: 'app-consultar-central',
  templateUrl: './consultar-central.component.html',
  styleUrls: ['./consultar-central.component.css']
})

export class ConsultarCentralComponent implements OnInit   {
  
  //TABLA Central
  displayedColumnsCentral: string[] = ['cenNro', 'cliApeNomDen', 'usuario', 'estDescripcion', 'columnaVacia', 'modEstado' , 'verMas'];
  @ViewChild('paginatorCentral', { static: false }) paginatorCentral: MatPaginator | undefined;
  @ViewChild('matSortCentral', { static: false }) sortCentral: MatSort | undefined;
  dataSourceCentral: MatTableDataSource<any>;
  pageSizeCentral = 10; // Número de elementos por página
  currentPageCentral = 1; // Página actual

  //TABLA Servicios
  displayedColumnsServicio: string[] = ['serId', 'serDescripcion', 'agregarServ'];
  @ViewChild('matSortServicio', { static: false }) sortServicio: MatSort | undefined;
  @ViewChild('paginatorServicio', { static: false }) paginatorServicio: MatPaginator | undefined;
  dataSourceServicio: MatTableDataSource<any>;
  pageSizeServicio = 5; // Número de elementos por página
  currentPageServicio = 1; // Página actual

  //TABLA Servicios Activos
  displayedColumnsServicioActivos: string[] = ['serId', 'serDescripcion', 'extraerServ'];
  @ViewChild('matSortServicioActivos', { static: false }) sortServicioActivos: MatSort | undefined;
  @ViewChild('paginatorServicioActivos', { static: false }) paginatorServicioActivos: MatPaginator | undefined;
  dataSourceServicioActivos: MatTableDataSource<any>;
  pageSizeServicioActivos = 5; // Número de elementos por página
  currentPageServicioActivos = 1; // Página actual
  
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
  Servicios: ServicioClass[] = [];
  ServiciosDeCentralActualizado: ServicioClass [] = [];
  ServiciosDeCentralOriginal: ServicioxCentralClass [] = [];
  actualizacionServicio: ServicioxCentralClass[] = [];

  //VARIABLES DE DATOS
  titulo: string = '';

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
  formModificar: FormGroup;

  constructor(
    private fb: FormBuilder,
    private centralModificarEstado: CentralService,
    private centralConsultar: CentralService, 
    private servicioCentral: CentralService,
    private servicioConsultar: ServicioService, 
    )    
  {
    this.dataSourceCentral = new MatTableDataSource<any>();
    this.dataSourceServicio = new MatTableDataSource<any>();
    this.dataSourceServicioActivos = new MatTableDataSource<any>();

    this.formfiltro = new FormGroup({
      idCentral: new FormControl(null, []),
      cliente: new FormControl(null, []),
      usuario: new FormControl(null, []),
    });

    this.formModificar = new FormGroup({
      id: new FormControl(null, []),
      imei: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[0-9]{15}$"),
      ]),
      coordenadaX: new FormControl(null, []),
      coordenadaY: new FormControl(null, []),
      estadoCentralDescripcion: new FormControl(null, []),
      fechaAlta: new FormControl(null, []),
      fechaBaja: new FormControl(null, []),
      cliApeNomDenVM: new FormControl(null, []),
      usuarioVM: new FormControl(null, []),
      estIdSeleccionado: new FormControl(null, []),
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

  handlePageChangeServicio(event: any) {
    this.currentPageServicio = event.pageIndex + 1;
    this.pageSizeServicio = event.pageSize;
  }

  handlePageChangeServicioActivos(event: any) {
    this.currentPageServicioActivos = event.pageIndex + 1;
    this.pageSizeServicioActivos = event.pageSize;
  }

  set cliApeNomDenVM(valor: any) {
    this.formModificar.get('cliApeNomDenVM')?.setValue(valor);
  }
  set usuarioVM(valor: any) {
    this.formModificar.get('usuarioVM')?.setValue(valor);
  }
  set id(valor: any) {
    this.formModificar.get('id')?.setValue(valor);
  }
  set imei(valor: any) {
    this.formModificar.get('imei')?.setValue(valor);
  }
  set estadoCentralDescripcion(valor: any) {
    this.formModificar.get('estadoCentralDescripcion')?.setValue(valor);
  }
  set fechaAlta(valor: any) {
    this.formModificar.get('fechaAlta')?.setValue(valor);
  }
  set fechaBaja(valor: any) {
    this.formModificar.get('fechaBaja')?.setValue(valor);
  }
  set coordenadaX(valor: any) {
    this.formModificar.get('coordenadaX')?.setValue(valor);
  }
  set coordenadaY(valor: any) {
    this.formModificar.get('coordenadaY')?.setValue(valor);
  }

  get imei() {
    return this.formModificar.get('imei');
  }
  get coordenadaX() {
    return this.formModificar.get('coordenadaX');
  }
  get coordenadaY() {
    return this.formModificar.get('coordenadaY');
  }

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([-31.420083, -64.188776], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(this.map);
  }


  //Valida que exista alguna Central que responda al filtro.
  validarFiltrado(): Boolean {
    if (this.CentralConsultaFiltrados.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  //Valida que exista algún servicio que responda al filtro.
  validarFiltradoServicios(): Boolean {
    if (this.Servicios.length == 0) {
      return false;
    } else {
      return true;
    }    
  }

  //Valida que exista algún servicio que responda al filtro.
  validarFiltradoServiciosDeCentral(): Boolean {   
    if (this.ServiciosDeCentralActualizado.length == 0) {
      return false;
    } else {
      return true;
    }
  }
  
  // Agregar servicios a la central selecciona
  agregarServicio(servicios: ServicioClass): void {  
    const index = this.Servicios.indexOf(servicios);
    if (index !== -1) {
      this.Servicios.splice(index, 1);
      this.ServiciosDeCentralActualizado.push(servicios);      
    }
    this.validarFiltradoServicios();  

    this.dataSourceServicio = new MatTableDataSource(this.Servicios);
    if (this.paginatorServicio) {
      this.dataSourceServicio.paginator = this.paginatorServicio;
    }
    if (this.sortServicio) {
      this.dataSourceServicio.sort = this.sortServicio;
    }

    this.dataSourceServicioActivos = new MatTableDataSource(this.ServiciosDeCentralActualizado);
    if (this.paginatorServicioActivos) {
      this.dataSourceServicioActivos.paginator = this.paginatorServicioActivos;
    }
    if (this.sortServicioActivos) {
      this.dataSourceServicioActivos.sort = this.sortServicioActivos;
    }

  }

  // Extraer servicios a la central selecciona
  extraerServicio(servicios: ServicioClass): void {
    const index = this.ServiciosDeCentralActualizado.indexOf(servicios);
    if (index !== -1) {
      this.ServiciosDeCentralActualizado.splice(index, 1);
      this.Servicios.push(servicios);      
    }
    this.validarFiltradoServiciosDeCentral();  

    this.dataSourceServicio = new MatTableDataSource(this.Servicios);
    if (this.paginatorServicio) {
      this.dataSourceServicio.paginator = this.paginatorServicio;
    }
    if (this.sortServicio) {
      this.dataSourceServicio.sort = this.sortServicio;
    }

    this.dataSourceServicioActivos = new MatTableDataSource(this.ServiciosDeCentralActualizado);
    if (this.paginatorServicioActivos) {
      this.dataSourceServicioActivos.paginator = this.paginatorServicioActivos;
    }
    if (this.sortServicioActivos) {
      this.dataSourceServicioActivos.sort = this.sortServicioActivos;
    }
  }

  //Almacena los datos del servicio que fue seleccionado en la tabla de servicio filtrados dentro de variables locales.
  esfilaSeleccionada(centralConsulta: CentralConsultaClass) {
    this.CentralSeleccionada = centralConsulta;
      this.cenNroSeleccionado = centralConsulta.cenNro;
      this.estIdSeleccionado = centralConsulta.cenIdEstadoCentral;

      this.titulo2 = 'Datos de la Central N°' + this.cenNroSeleccionado + ':';
      this.goToNextStep(1)
      
      this.cliApeNomDenVM = centralConsulta.cliApeNomDen;
      this.usuarioVM = centralConsulta.usuario;
      this.id = centralConsulta.cenNro;
      this.imei = centralConsulta.cenImei;
      this.estadoCentralDescripcion = centralConsulta.estDescripcion;
      this.fechaAlta = new Date(centralConsulta.cenFechaAlta).toLocaleDateString("es-AR");
      this.fechaBaja = centralConsulta.cenFechaBaja ? new Date(centralConsulta.cenFechaBaja).toLocaleDateString("es-AR") : '';     
      this.coordenadaX = centralConsulta.cenCoorX;
      this.coordenadaY = centralConsulta.cenCoorY;
  
      if (!this.marker) {
        if (this.map) {
          this.marker = new L.Marker([parseFloat( centralConsulta.cenCoorX ), parseFloat( centralConsulta.cenCoorY )], {
            icon: icon({
              iconUrl:
                'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              shadowUrl:
                'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            }),
            draggable: true, // Agregamos la propiedad draggable al marcador
          }).addTo(this.map);
      
          // Agregar evento de cambio de posición al marcador
          this.marker.on('dragend', (event) => {
            const newPosition = event.target.getLatLng();
            this.coordenadaX = newPosition.lat.toString();
            this.coordenadaY = newPosition.lng.toString();      
          });
        }
      } else {      
        const newLatLng = L.latLng(parseFloat( centralConsulta.cenCoorX ), parseFloat( centralConsulta.cenCoorY ));
        this.marker.setLatLng(newLatLng);
      }
      
      if (this.map) {
        this.map.setView([parseFloat( centralConsulta.cenCoorX ), parseFloat( centralConsulta.cenCoorY )], 10);
      }

      this.servicioConsultar.obtenerServicios().subscribe(data => {
        this.Servicios = data;  
      


      this.centralConsultar.obtenerServicioXCentral(centralConsulta.cenNro).subscribe(data => {
        this.ServiciosDeCentralActualizado = data; 
        this.Servicios = this.Servicios.filter(servicio => {
          return !this.ServiciosDeCentralActualizado.some(servicioCentral => servicioCentral.serId === servicio.serId);

        });
          this.dataSourceServicio = new MatTableDataSource(this.Servicios);
          if (this.paginatorServicio) {
            this.dataSourceServicio.paginator = this.paginatorServicio;
          }
          if (this.sortServicio) {
            this.dataSourceServicio.sort = this.sortServicio;
          }

          this.dataSourceServicioActivos = new MatTableDataSource(this.ServiciosDeCentralActualizado);
          if (this.paginatorServicioActivos) {
            this.dataSourceServicioActivos.paginator = this.paginatorServicioActivos;
          }
          if (this.sortServicioActivos) {
            this.dataSourceServicioActivos.sort = this.sortServicioActivos;
          }
      })
  
      })
  
    this.centralConsultar.serviciosXCentralCompleto(centralConsulta.cenNro).subscribe(data => {
        this.ServiciosDeCentralOriginal = data;  
      })
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


   // Modificar Central
   modificarCentral(): void {

    //Verifica que este completo el formulario y que no tenga errores.
    if (this.imei?.valid == false) {      
      Swal.fire({
        title: 'Error',
        text: `Verificar los datos ingresados:              
          ${this.imei?.invalid && this.imei.errors?.['required'] ? '\n* El IMEI es requerido' : ''}          
          ${this.imei?.invalid && this.imei.errors?.['pattern'] ? '\n*Debe ingresar solamente 15 números para el IMEI' : ''}`,
        icon: 'warning',
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
        footer: 'Por favor, corrija los errores e inténtelo de nuevo.'
      });     
    } else {

    this.controlServicios();
    this.centralConsultar.actualizarServiciosCentral(this.actualizacionServicio).subscribe(() => {
        
        }, (error) => {
          Swal.fire({
            text: 'No es posible modificar datos de esta Central',
            icon: 'error',
            position: 'center',
            showConfirmButton: true,
            confirmButtonColor: '#0f425b',
            confirmButtonText: 'Aceptar',
          } as SweetAlertOptions);    
        });    
      this.centralConsultar.actualizarDatosCentral(
      this.cenNroSeleccionado, 
      this.formModificar.get('imei')?.value,
      this.formModificar.get('coordenadaX')?.value,
      this.formModificar.get('coordenadaY')?.value
     )
    .subscribe(() => {
      Swal.fire({
        text:
          'Se Actualizo con éxito los datos de la Central ' + this.cenNroSeleccionado,
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
      // return location.reload();
    }, (error) => {
      Swal.fire({
        text: 'No es posible modificar datos de esta Central',
        icon: 'error',
        position: 'center',
        showConfirmButton: true,
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
      } as SweetAlertOptions);    
    });   
      } 
  }

  controlServicios(): void {
    this.actualizacionServicio = [];
    for (const servicios of this.ServiciosDeCentralActualizado) {
      const servicioOriginal = this.ServiciosDeCentralOriginal.find(s => s.sxcNroServicio === servicios.serId );
      if (!servicioOriginal) {
        const nuevoServicio = new ServicioxCentralClass(
          this.cenNroSeleccionado, 
          servicios.serId, 
          1, 
          new Date(), 
          null);
        this.actualizacionServicio.push(nuevoServicio);      
      }
      const servicioOriginal2 = this.ServiciosDeCentralOriginal.find(s => s.sxcNroServicio === servicios.serId && s.sxcEstado ===2);
      if (servicioOriginal2) {
        const nuevoServicio = new ServicioxCentralClass(
          this.cenNroSeleccionado, 
          servicios.serId, 
          1, 
          servicioOriginal2.sxcFechaAlta, 
          null);
        this.actualizacionServicio.push(nuevoServicio);      
      }
    }
    for (const servicios of this.ServiciosDeCentralOriginal) {
      const servicioOriginal = this.ServiciosDeCentralActualizado.find(s => s.serId === servicios.sxcNroServicio && servicios.sxcEstado===1);
      if (!servicioOriginal && servicios.sxcEstado===1) {
        const nuevoServicio = new ServicioxCentralClass(
          this.cenNroSeleccionado, 
          servicios.sxcNroServicio, 
          2, 
          servicios.sxcFechaAlta, 
          new Date());
        this.actualizacionServicio.push(nuevoServicio);      
      }    
    }
  }

}
