//SISTEMA
import { Component, OnInit, Output, ViewChild, AfterViewInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { MatTabGroup } from '@angular/material/tabs';
import {MatGridListModule} from '@angular/material/grid-list';

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
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  //STEPPER
  titulo1 = 'Consultá información de los clientes:';
  titulo2 = 'Modificar información de un cliente';
  titulo3 = 'Título del tercer paso';
  isStep1Completed = false;
  isStep2Completed = false;
  isStep3Completed = false;
  
  
  //VARIABLES DE OBJETOS LIST
  Servicios: ServicioClass[] = [];
  ServiciosNuevos: ServicioClass[] = [];
  ServiciosAgregar: ServicioxCentralClass[] = [];
  Clientes: CentralClienteConsultaClass[] = [];
  ClientesFiltrados: CentralClienteConsultaClass[] = [];
  tiposDocumento: TipoDocumentoClass[] = [
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
  //validadorCamposModif: string = '1';
  numerosValidos: string = 'Solo se admiten 15 números';  
  cenNroDocSeleccionado: string = '';
  propiedadOrdenamientoCliente: string = 'tdDescripcion';
  propiedadOrdenamientoServicio: string = 'serId';
  propiedadOrdenamientoServicioCentral: string = 'serId';

  idListaServiciosSeleccionado: number=0;
  idListaServiciosCentralSeleccionado: number=0;
  cenTipoDocSeleccionado: number=0;
  tipoOrdenamientoCliente: number = 1;
  tipoOrdenamientoServicio: number = 1;
  tipoOrdenamientoServicioCentral: number = 1;
  tipoDocumentoSeleccionado: number = 0;

  isCollapsed1 = false;
  isCollapsed2 = false;
  isCollapsed3 = false;
  isCollapsed4 = false;

  //FORMULARIOS DE AGRUPACION DE DATOS
  formRegistar: FormGroup;
  formfiltro: FormGroup;

  //GRILLA
  tiles: Tile[] = [
    {text: '1', cols: 3, rows: 14, color: 'lightblue'},
    {text: '2', cols: 2, rows: 1, color: 'lightgreen'},
    {text: '3', cols: 2, rows: 13, color: 'lightpink'},
    {text: '4', cols: 5, rows: 1, color: '#DDBDF1'},
  ];

    map: L.Map | undefined;
    marker: L.Marker | undefined;
  constructor(
    private servicioConsultar: ServicioService,
    private centralRegistrar: CentralService,
  ) { 
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
      tipo: new FormControl(null, []),
      numero: new FormControl(null, []),
      cliente: new FormControl(null, []),
      usuario: new FormControl(null, []),
    });   
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

  toggleCollapse4() {
    this.isCollapsed4 = !this.isCollapsed4;
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
  
  ngOnInit(): void {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      this.inicializarMapa();
    }

    this.servicioConsultar.obtenerServicios().subscribe(data => {
      this.Servicios = data;  
    })

    this.centralRegistrar.listaClientes().subscribe(data => {
      this.Clientes = data;  
      this.ClientesFiltrados = data;
    })

    //Coordenadas de Córdoba
    this.coordenadaXSeleccionado = "-31.420083";
    this.coordenadaX = this.coordenadaXSeleccionado;
    this.coordenadaYSeleccionado = "-64.188776";    
    this.coordenadaY = this.coordenadaYSeleccionado;
  }
  // ngAfterViewInit() {
    
  //   this.tabGroup.selectedIndex = 0;
  // }
  ngAfterViewInit(): void {
    this.tabGroup.selectedIndex = 0;
    this.coordenadaXSeleccionado = '-31.420083';
    this.coordenadaYSeleccionado = '-64.188776';

    this.map = L.map('map').setView([-31.420083, -64.188776], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(this.map);
  }

  inicializarMapa(): void {
    let self = this;
    var map = L.map('map').setView([-31.420083, -64.188776], 10);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(
      map
    );
    var marker = L.marker([-31.420083, -64.188776], {
      icon: icon({
        iconUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
      draggable: true, // Agregamos la propiedad draggable al marcador
    }).addTo(map);

    marker.on('dragend', function (e) {
      var newCoords = e.target.getLatLng();
      self.coordenadaXSeleccionado = newCoords.lat;
      self.coordenadaYSeleccionado = newCoords.lng;
      self.coordenadaX = newCoords.lat;
      self.coordenadaY = newCoords.lng;
    });
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
  // Permite controlar la navegación entre las pestañas
  selectTab(tabIndex: number) {
    this.tabGroup.selectedIndex = tabIndex;
  }
  //Almacena los datos del servicio que fue seleccionado en la tabla de servicio filtrados dentro de variables locales.
  esfilaSeleccionadaServicio(servicios: ServicioClass) {
    this.idListaServiciosSeleccionado = servicios.serId;      
  }

  //Almacena los datos del servicio que fue seleccionado en la tabla de servicio filtrados dentro de variables locales.
  esfilaSeleccionadaServicioDeCentral(servicios: ServicioClass) {      
    this.idListaServiciosCentralSeleccionado = servicios.serId;
  }

  //Almacena los datos del servicio que fue seleccionado en la tabla de servicio filtrados dentro de variables locales.
  esfilaSeleccionadaCliente(cliente: CentralClienteConsultaClass) {      
    this.cliApeNomDenSeleccionado = cliente.cliApeNomDen;
    this.usuarioSeleccionado = cliente.usuario;
    this.cenTipoDocSeleccionado = cliente.cliTipoDoc;
    this.cenNroDocSeleccionado = cliente.cliNroDoc;
    this.cliApeNomDenVM = this.cliApeNomDenSeleccionado;
    this.usuarioVM = this.usuarioSeleccionado;
    
    this.isCollapsed1 = !this.isCollapsed1;
  }

  //Metodos para grilla
  //Almacena en una variable la propiedad por la cual se quiere ordenar la consulta de Cliente.
  ordenarClientePor(propiedad: string) {
    this.tipoOrdenamientoCliente =
      propiedad === this.propiedadOrdenamientoCliente ? this.tipoOrdenamientoCliente * -1 : 1;
    this.propiedadOrdenamientoCliente = propiedad;
  }

  //En base a la propiedad por la que se quiera ordenar y el tipo de orden muestra un icono.
  ordenarIconoCliente(propiedad: string) {
    if (propiedad === this.propiedadOrdenamientoCliente) {
      return this.tipoOrdenamientoCliente === 1 ? '🠉' : '🠋';
    } else {
      return '🠋🠉';
    }
  }
  //Filtro de Tipo de DNI
  filtrarClientesPorTipoDocumento() {
    
    this.ClientesFiltrados = this.Clientes.filter(cliente => cliente.cliTipoDoc === this.tipoDocumentoSeleccionado);
  }

  //Almacena en una variable la propiedad por la cual se quiere ordenar la consulta de Servicio.
  ordenarServicioPor(propiedad: string) {
    this.tipoOrdenamientoServicio =
      propiedad === this.propiedadOrdenamientoServicio ? this.tipoOrdenamientoServicio * -1 : 1;
    this.propiedadOrdenamientoServicio = propiedad;
  }

  //En base a la propiedad por la que se quiera ordenar y el tipo de orden muestra un icono.
  ordenarIconoServicio(propiedad: string) {
    if (propiedad === this.propiedadOrdenamientoServicio) {
      return this.tipoOrdenamientoServicio === 1 ? '🠉' : '🠋';
    } else {
      return '🠋🠉';
    }
  }

  //Almacena en una variable la propiedad por la cual se quiere ordenar la consulta de Servicio Central.
  ordenarServicioCentralPor(propiedad: string) {
    this.tipoOrdenamientoServicioCentral =
      propiedad === this.propiedadOrdenamientoServicioCentral ? this.tipoOrdenamientoServicioCentral * -1 : 1;
    this.propiedadOrdenamientoServicioCentral = propiedad;
  }

  //En base a la propiedad por la que se quiera ordenar y el tipo de orden muestra un icono.
  ordenarIconoServicioCentral(propiedad: string) {
    if (propiedad === this.propiedadOrdenamientoServicioCentral) {
      return this.tipoOrdenamientoServicioCentral === 1 ? '🠉' : '🠋';
    } else {
      return '🠋🠉';
    }
  }
  
  //Filtro de Cliente por Tipo, numero, Nombre Cliente o Usuario.
  esFiltrar2(event: Event) {
    const filtronTipo = (this.formfiltro.get('tipo') as FormControl).value?.toLowerCase();
    const filtroNumero = (this.formfiltro.get('numero') as FormControl).value?.toLowerCase();
    const filtroCliente = (this.formfiltro.get('cliente') as FormControl).value?.toLowerCase();
    const filtronUsuario = (this.formfiltro.get('usuario') as FormControl).value?.toLowerCase();

    this.ClientesFiltrados = this.Clientes.filter((cli) => {
      const valorTdDescripcion= cli.tdDescripcion.toString().toLowerCase();
      const valorCliNroDoc = cli.cliNroDoc.toString().toLowerCase();
      const valorCliApeNomDen = cli.cliApeNomDen.toString().toLowerCase();
      const valorUsuario = cli.usuario.toString().toLowerCase();

      return (
        (!filtronTipo || valorTdDescripcion.includes(filtronTipo)) &&
        (!filtroNumero || valorCliNroDoc.includes(filtroNumero)) &&
        (!filtroCliente || valorCliApeNomDen.includes(filtroCliente)) &&
        (!filtronUsuario || valorUsuario.includes(filtronUsuario))
      );
    });
  }
  esFiltrar(event: Event, campo: string) {
    let txtBuscar = (event.target as HTMLInputElement).value;
    let filtro = txtBuscar
      .replace(/[^\w\s]/g, '')
      .trim()
      .toLowerCase();
    this.ClientesFiltrados = [];
    this.Clientes.forEach((clienteConsulta) => {
      if (
        (campo === 'tipo' && clienteConsulta.tdDescripcion.toString().toLowerCase().includes(filtro)) ||
        (campo === 'numero' && clienteConsulta.cliNroDoc.toString().toLowerCase().includes(filtro)) ||
        (campo === 'cliente' && clienteConsulta.cliApeNomDen.toString().toLowerCase().includes(filtro)) ||
        (campo === 'usuario' && clienteConsulta.usuario.toString().toLowerCase().includes(filtro))
      ) {
        this.ClientesFiltrados.push(clienteConsulta);
      }
    });
  }
  // Extraer servicios a la central selecciona
  agregarServicio(servicios: ServicioClass): void {  
    const index = this.Servicios.indexOf(servicios);
    if (index !== -1) {
      this.Servicios.splice(index, 1);
      this.ServiciosNuevos.push(servicios);
    }
    this.validarFiltradoServicios();  
  }

  // Extraer servicios a la central selecciona
  extraerServicio(servicios: ServicioClass): void {
    const index = this.ServiciosNuevos.indexOf(servicios);
    if (index !== -1) {
      this.ServiciosNuevos.splice(index, 1);
      this.Servicios.push(servicios);
    }
    this.validarFiltradoServiciosDeCentral();  
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
        this.coordenadaXSeleccionado,
        this.coordenadaYSeleccionado,
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
            position: 'top',
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
                text: 'No es posible Agregar los Servicios a la Central',
                icon: 'error',
                position: 'top',
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
            position: 'top',
            showConfirmButton: true,
            confirmButtonColor: '#0f425b',
            confirmButtonText: 'Aceptar',
          } as SweetAlertOptions);    
        });   
    }   
  }
  
}
