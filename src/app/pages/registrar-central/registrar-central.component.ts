//SISTEMA
import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import Swal, { SweetAlertOptions } from 'sweetalert2';
import { MatStepper } from '@angular/material/stepper';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';


import { Map, Marker, icon } from 'leaflet';
import * as L from 'leaflet';

//COMPONENTES
import { CentralClass } from 'src/app/core/models/central';
import { ServicioClass } from 'src/app/core/models/servicio';
import { ServicioxCentralClass } from 'src/app/core/models/serviciosxCentral';
import { CentralClienteConsultaClass } from 'src/app/core/models/centralClienteConsulta';
import { TipoDocumentoClass } from 'src/app/core/models/tipoDocumento';

//SERVICIOS
import { CentralService } from 'src/app/core/services/central.service';
import { ServicioService } from 'src/app/core/services/servicio.service';
export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-registrar-central',
  templateUrl: './registrar-central.component.html',
  styleUrls: ['./registrar-central.component.css']
})
export class RegistrarCentralComponent implements OnInit, AfterViewInit  {

  //TABLA Cliente
  displayedColumnsCliente: string[] = ['tdDescripcion', 'cliNroDoc', 'cliApeNomDen', 'usuario', 'columnaVacia', 'seleccionar'];
  @ViewChild('paginatorCliente', { static: false }) paginatorCliente: MatPaginator | undefined;
  @ViewChild('matSortCliente', { static: false }) sortCliente: MatSort | undefined;
  dataSourceCliente: MatTableDataSource<any>;
  pageSizeCliente = 10; // Número de elementos por página
  currentPageCliente = 1; // Página actual

  //TABLA Servicios
  displayedColumnsServicio: string[] = ['serId', 'serDescripcion', 'agregarServ'];
  @ViewChild('matSortServicio', { static: false }) sortServicio: MatSort | undefined;
  @ViewChild('paginatorServicio', { static: false }) paginatorServicio: MatPaginator | undefined;
  dataSourceServicio: MatTableDataSource<any>;
  pageSizeServicio = 5; // Número de elementos por página
  currentPageServicio = 1; // Página actual

  //TABLA Servicios Agregados
  displayedColumnsServicioAgregados: string[] = ['serId', 'serDescripcion', 'extraerServ'];
  @ViewChild('matSortServicioAgregados', { static: false }) sortServicioAgregados: MatSort | undefined;
  @ViewChild('paginatorServicioAgregados', { static: false }) paginatorServicioAgregados: MatPaginator | undefined;
  dataSourceServicioAgregados: MatTableDataSource<any>;
  pageSizeServicioAgregados = 5; // Número de elementos por página
  currentPageServicioAgregados = 1; // Página actual

  //STEPPER
  titulo1 = 'Consultá información de los clientes:';
  titulo2 = 'Ingresar Datos de Central Meteorológica';
  titulo3 = 'Título del tercer paso';
  isStep1Completed = false;
  isStep2Completed = false;
  isStep3Completed = false;  
  @ViewChild(MatStepper, { static: false }) stepper: MatStepper | undefined;

  //VARIABLES DE OBJETOS LIST
  Servicios: ServicioClass[] = [];
  ServiciosNuevos: ServicioClass[] = [];
  ServiciosAgregar: ServicioxCentralClass[] = [];
  Clientes: CentralClienteConsultaClass[] = [];
  ClientesFiltrados: CentralClienteConsultaClass[] = [];
  tiposDocumento: TipoDocumentoClass[] = [
    new TipoDocumentoClass(0, 'TODOS'),
    new TipoDocumentoClass(1, 'DNI'),
    new TipoDocumentoClass(2, 'LE'),
    new TipoDocumentoClass(3, 'LC'),
    new TipoDocumentoClass(4, 'CUIT'),
    new TipoDocumentoClass(5, 'CUIL')
  ];

  //VARIABLES DE DATOS
  cliApeNomDenSeleccionado: string = '';
  usuarioSeleccionado: string = '';
  imeiSeleccionado: string = '';
  coordenadaXSeleccionado: string = '';
  coordenadaYSeleccionado: string = '';
  numerosValidos: string = 'Solo se admiten 15 números';  
  cenNroDocSeleccionado: string = '';
  propiedadOrdenamientoCliente: string = 'tdDescripcion';
  propiedadOrdenamientoServicio: string = 'serId';
  propiedadOrdenamientoServicioCentral: string = 'serId';

  cenTipoDocSeleccionado: number=0;

  isCollapsed1 = false;
  isCollapsed2 = false;
  isCollapsed3 = false;
  isCollapsed4 = false;

  //FORMULARIOS DE AGRUPACION DE DATOS
  formRegistar: FormGroup;
  formfiltro: FormGroup;

  map: L.Map | undefined;
  marker: L.Marker | undefined;
  
  constructor(
    private servicioConsultar: ServicioService,
    private centralRegistrar: CentralService,
  ) { 
    this.dataSourceCliente = new MatTableDataSource<any>();
    this.dataSourceServicio = new MatTableDataSource<any>();
    this.dataSourceServicioAgregados = new MatTableDataSource<any>();

    this.formRegistar = new FormGroup({
      id: new FormControl(null, []),
      imei: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[0-9]{15}$"),
      ]),
      coordenadaX: new FormControl(null, []),
      coordenadaY: new FormControl(null, []),
      cliApeNomDenVM: new FormControl(null, [
        Validators.required,
      ]),
      usuarioVM: new FormControl(null, [
        Validators.required,
      ]),      
    });

    this.formfiltro = new FormGroup({
      tipoF: new FormControl(null, []),
      numeroF: new FormControl(null, []),
      clienteF: new FormControl(null, []),
      usuarioF: new FormControl(null, []),
    });   
  }

  set cliApeNomDenVM(valor: any) {
    this.formRegistar.get('cliApeNomDenVM')?.setValue(valor);
  }
  set usuarioVM(valor: any) {
    this.formRegistar.get('usuarioVM')?.setValue(valor);
  }
  set imei(valor: any) {
    this.formRegistar.get('imei')?.setValue(valor);
  }
  set coordenadaX(valor: any) {
    this.formRegistar.get('coordenadaX')?.setValue(valor);
  }
  set coordenadaY(valor: any) {
    this.formRegistar.get('coordenadaY')?.setValue(valor);
  }
  set numeroF(valor: any) {
    this.formfiltro.get('numeroF')?.setValue(valor);
  }
  set clienteF(valor: any) {
    this.formfiltro.get('clienteF')?.setValue(valor);
  }
  set usuarioF(valor: any) {
    this.formfiltro.get('usuarioF')?.setValue(valor);
  }

  get cliApeNomDenVM() {
    return this.formRegistar.get('cliApeNomDenVM');
  }
  get usuarioVM() {
    return this.formRegistar.get('usuarioVM');
  }
  get imei() {
    return this.formRegistar.get('imei');
  }
  get coordenadaX() {
    return this.formRegistar.get('coordenadaX');
  }
  get coordenadaY() {
    return this.formRegistar.get('coordenadaY');
  }
  get numeroF() {
    return this.formfiltro.get('numeroF');
  }
  get clienteF() {
    return this.formfiltro.get('clienteF');
  }
  get usuarioF() {
    return this.formfiltro.get('usuarioF');
  }

  
  ngOnInit(): void {

    this.servicioConsultar.obtenerServicios().subscribe(data => {
      this.Servicios = data;  

      this.dataSourceServicio = new MatTableDataSource(this.Servicios);
      if (this.paginatorServicio) {
        this.dataSourceServicio.paginator = this.paginatorServicio;
      }
      if (this.sortServicio) {
        this.dataSourceServicio.sort = this.sortServicio;
      }

    })

    this.centralRegistrar.listaClientes().subscribe(data => {
      this.Clientes = data;  
      this.ClientesFiltrados = data;

      this.dataSourceCliente = new MatTableDataSource(data);
      if (this.paginatorCliente) {
        this.dataSourceCliente.paginator = this.paginatorCliente;
      }
      if (this.sortCliente) {
        this.dataSourceCliente.sort = this.sortCliente;
      }
    })

    //Coordenadas de Córdoba
    this.coordenadaXSeleccionado = "-31.420083";
    this.coordenadaX = this.coordenadaXSeleccionado;
    this.coordenadaYSeleccionado = "-64.188776";    
    this.coordenadaY = this.coordenadaYSeleccionado;
  }

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([-31.420083, -64.188776], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(this.map);
  }

  handlePageChangeCliente(event: any) {
    this.currentPageCliente = event.pageIndex + 1;
    this.pageSizeCliente= event.pageSize;
  }

  handlePageChangeServicio(event: any) {
    this.currentPageServicio = event.pageIndex + 1;
    this.pageSizeServicio = event.pageSize;
  }

  handlePageChangeServicioAgregados(event: any) {
    this.currentPageServicioAgregados = event.pageIndex + 1;
    this.pageSizeServicioAgregados = event.pageSize;
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
    if (this.ServiciosNuevos.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  //Valida que exista algún cliente que responda al filtro.
  validarFiltradoClientes(): Boolean {   
    if (this.ClientesFiltrados.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  // Placeholder de DNI
  formatDocumentNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, ''); // Eliminar cualquier carácter que no sea un dígito

    // Aplicar la máscara con puntos solo cuando se pierde el foco o se presiona Enter
    input.addEventListener('blur', applyMask);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        applyMask();
      }
    });

    const insertDots = (value: string): string => {
      const digit1 = value.slice(0, 2);
      const digit2 = value.slice(2, 5);
      const digit3 = value.slice(5, 8);

      let formattedValue = '';

      if (digit1) {
        formattedValue += digit1;
      }

      if (digit2) {
        formattedValue += `.${digit2}`;
      }

      if (digit3) {
        formattedValue += `.${digit3}`;
      }

      return formattedValue;
    };

    function applyMask() {
      const formattedValue = insertDots(value);
      input.value = formattedValue;

      // Verificar y ajustar el placeholder
      if (value.length === 0) {
        input.placeholder = '12.345.678';
      }
    }
  }

  //Almacena los datos del servicio que fue seleccionado en la tabla de servicio filtrados dentro de variables locales.
  esfilaSeleccionadaCliente(cliente: CentralClienteConsultaClass) {      
    this.cliApeNomDenSeleccionado = cliente.cliApeNomDen;
    this.usuarioSeleccionado = cliente.usuario;
    this.cenTipoDocSeleccionado = cliente.cliTipoDoc;
    this.cenNroDocSeleccionado = cliente.cliNroDoc;
    this.cliApeNomDenVM = this.cliApeNomDenSeleccionado;
    this.usuarioVM = this.usuarioSeleccionado;
    this.coordenadaX = this.coordenadaXSeleccionado;
    this.coordenadaY = this.coordenadaYSeleccionado ;

    this.isCollapsed1 = !this.isCollapsed1;
    this.goToNextStep(1)

    if (!this.marker) {
      if (this.map) {
        this.marker = new L.Marker([parseFloat( this.coordenadaXSeleccionado ), parseFloat( this.coordenadaYSeleccionado  )], {
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
      const newLatLng = L.latLng(parseFloat( this.coordenadaXSeleccionado), parseFloat( this.coordenadaYSeleccionado  ));
      this.marker.setLatLng(newLatLng);
    }
    
    if (this.map) {
      this.map.setView([parseFloat( this.coordenadaXSeleccionado ), parseFloat( this.coordenadaYSeleccionado )], 10);
    }

  }

  //Filtro de Central por Tipo Doc, Numero, Nombre Cliente o Usuario.
  esFiltrar() {
    const tipoDocumentoControl = this.formfiltro.get('tipoF');
    const numeroFControl = this.formfiltro.get('numeroF');
    const clienteFControl = this.formfiltro.get('clienteF');
    const usuarioFControl = this.formfiltro.get('usuarioF');
  
    const tipoDocumentoSeleccionado = tipoDocumentoControl?.value || "";
    const filtroNumeroF = (numeroFControl?.value || "").toString().toLowerCase();
    const filtroClienteF = (clienteFControl?.value || "").toString().toLowerCase();
    const filtronUsuarioF = (usuarioFControl?.value || "").toString().toLowerCase();
  
    this.ClientesFiltrados = this.Clientes.filter((cliente) => {
      const valorTipoF = cliente.cliTipoDoc.toString().toLowerCase();
      const valorNumeroF = cliente.cliNroDoc.toString().toLowerCase();
      const valorClienteF = cliente.cliApeNomDen.toString().toLowerCase();
      const valorUsuarioF = cliente.usuario.toString().toLowerCase();
  
      if (tipoDocumentoSeleccionado === "0") {
        return (
          (!filtroNumeroF || valorNumeroF.includes(filtroNumeroF)) &&
          (!filtroClienteF || valorClienteF.includes(filtroClienteF)) &&
          (!filtronUsuarioF || valorUsuarioF.includes(filtronUsuarioF))
        );
      } else {
        const filtronTipoF = tipoDocumentoSeleccionado.toString().toLowerCase();
        return (
          (!filtronTipoF || valorTipoF === filtronTipoF) &&
          (!filtroNumeroF || valorNumeroF.includes(filtroNumeroF)) &&
          (!filtroClienteF || valorClienteF.includes(filtroClienteF)) &&
          (!filtronUsuarioF || valorUsuarioF.includes(filtronUsuarioF))
        );
      }
    });
  
    this.dataSourceCliente = new MatTableDataSource(this.ClientesFiltrados);
    if (this.paginatorCliente) {
      this.dataSourceCliente.paginator = this.paginatorCliente;
    }
    if (this.sortCliente) {
      this.dataSourceCliente.sort = this.sortCliente;
    }
  }

  // Extraer servicios a la central selecciona
  agregarServicio(servicios: ServicioClass): void {  
    const index = this.Servicios.indexOf(servicios);
    if (index !== -1) {
      this.Servicios.splice(index, 1);
      this.ServiciosNuevos.push(servicios);
    }
    this.validarFiltradoServicios();  

    this.dataSourceServicio = new MatTableDataSource(this.Servicios);
    if (this.paginatorServicio) {
      this.dataSourceServicio.paginator = this.paginatorServicio;
    }
    if (this.sortServicio) {
      this.dataSourceServicio.sort = this.sortServicio;
    }

    this.dataSourceServicioAgregados = new MatTableDataSource(this.ServiciosNuevos);
    if (this.paginatorServicioAgregados) {
      this.dataSourceServicioAgregados.paginator = this.paginatorServicioAgregados;
    }
    if (this.sortServicioAgregados) {
      this.dataSourceServicioAgregados.sort = this.sortServicioAgregados;
    }
  }

  // Extraer servicios a la central selecciona
  extraerServicio(servicios: ServicioClass): void {
    const index = this.ServiciosNuevos.indexOf(servicios);
    if (index !== -1) {
      this.ServiciosNuevos.splice(index, 1);
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

    this.dataSourceServicioAgregados = new MatTableDataSource(this.ServiciosNuevos);
    if (this.paginatorServicioAgregados) {
      this.dataSourceServicioAgregados.paginator = this.paginatorServicioAgregados;
    }
    if (this.sortServicioAgregados) {
      this.dataSourceServicioAgregados.sort = this.sortServicioAgregados;
    }
  } 
  
  // Registar Central
  registrarCentral(): void {

    //Verifica que este completo el formulario y que no tenga errores.
    if (this.formRegistar.valid == false) {
      Swal.fire({
        title: 'Error',
        text: `Verificar los datos ingresados:
    
          ${(this.cliApeNomDenVM?.invalid && this.cliApeNomDenVM.errors?.['required']) || (this.usuarioVM?.invalid && this.usuarioVM.errors?.['required']) ? '*El Cliente / Usuario es requerido - Seleccione un Clilente/Usuario de la lista' : ''}
          
          ${this.imei?.invalid && this.imei.errors?.['required'] ? '\n* El IMEI es requerido' : ''}
          
          ${this.imei?.invalid && this.imei.errors?.['pattern'] ? '\n*Debe ingresar solamente 15 números para el IMEI' : ''}`,
        icon: 'warning',
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
        footer: 'Por favor, corrija los errores e inténtelo de nuevo.'
      }); 
    
    } else {

      let nroCentralNew: number = 0;
      let Central: CentralClass = new CentralClass(
        0,
        this.formRegistar.get('imei')?.value,
        this.formRegistar.get('coordenadaX')?.value,
        this.formRegistar.get('coordenadaY')?.value,
        new Date(),
        null,      
        1,
        this.cenTipoDocSeleccionado,
        this.cenNroDocSeleccionado      
      );      
        this.centralRegistrar.registrarCentral(Central).subscribe((data) => {
          nroCentralNew = data.cenNro;          
          Swal.fire({
            text:
              'La Central del Cliente: ' + 
              this.cliApeNomDenSeleccionado +           
              ' se ha registrado con éxito con el número de Central: ' +
              data.cenNro,
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

          // Agregar los servicios para insertar en la base de datos
          this.ServiciosAgregar = [];
          for (const servicios of this.ServiciosNuevos) {
            const sxc = new ServicioxCentralClass(
              nroCentralNew, // Coloca aquí el número de central
              servicios.serId,
              1, // Aquí coloco 1 como estado por defecto disponible
              new Date(), // Aquí coloco la fecha actual
              null,
            );
            this.ServiciosAgregar.push(sxc);
          }            
          if (this.ServiciosAgregar.length > 0) {
            this.centralRegistrar.registrarServiciosCentral(this.ServiciosAgregar ).subscribe((data) => {
              
              Swal.fire({
                text:
                'La Central del Cliente: ' + 
                this.cliApeNomDenSeleccionado +           
                ' se ha registrado con éxito con el número de Central: ' +
                nroCentralNew,
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
            }, (error) => {
              Swal.fire({
                text: 'No es posible Agregar los Servicios a la Central',
                icon: 'error',
                position: 'center',
                showConfirmButton: true,
                confirmButtonColor: '#0f425b',
                confirmButtonText: 'Aceptar',
              } as SweetAlertOptions);    
            });
          }
        }, (error) => {
          Swal.fire({
            text: 'No es posible Agregar esta Central',
            icon: 'error',
            position: 'center',
            showConfirmButton: true,
            confirmButtonColor: '#0f425b',
            confirmButtonText: 'Aceptar',
          } as SweetAlertOptions);    
        });   
    }   
  }
  
}
