//SISTEMA
import { Component, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';

import { Map, Marker, icon } from 'leaflet';
import * as L from 'leaflet';

//COMPONENTES
import { CentralClass } from 'src/app/core/models/central';
import { ServicioClass } from 'src/app/core/models/servicio';
import { ServicioxCentralClass } from 'src/app/core/models/serviciosxCentral';
import { CentralClienteConsultaClass } from 'src/app/core/models/centralClienteConsulta';

//SERVICIOS
import { CentralService } from 'src/app/core/services/central.service';
import { ServicioService } from 'src/app/core/services/servicio.service';

@Component({
  selector: 'app-registrar-central',
  templateUrl: './registrar-central.component.html',
  styleUrls: ['./registrar-central.component.css']
})
export class RegistrarCentralComponent implements OnInit {

  //VARIABLES DE OBJETOS LIST
  Servicios: ServicioClass[] = [];
  ServiciosNuevos: ServicioClass[] = [];
  ServiciosAgregar: ServicioxCentralClass[] = [];
  Clientes: CentralClienteConsultaClass[] = [];
  ClientesFiltrados: CentralClienteConsultaClass[] = [];

  //VARIABLES DE DATOS
  cliApeNomDenSeleccionado: string = '';
  usuarioSeleccionado: string = '';
  imeiSeleccionado: string = '';
  coordenadaXSeleccionado: string = '';
  coordenadaYSeleccionado: string = '';
  validadorCamposModif: string = '1';
  numerosValidos: string = 'Solo se admiten números';  
  cenNroDocSeleccionado: string = '';
  propiedadOrdenamientoCliente: string = 'cliTipoDoc';
  propiedadOrdenamientoServicio: string = 'serId';
  propiedadOrdenamientoServicioCentral: string = 'serId';

  idListaServiciosSeleccionado: number=0;
  idListaServiciosCentralSeleccionado: number=0;
  cenTipoDocSeleccionado: number=0;
  tipoOrdenamientoCliente: number = 1;
  tipoOrdenamientoServicio: number = 1;
  tipoOrdenamientoServicioCentral: number = 1;

  //FORMULARIOS DE AGRUPACION DE DATOS
  formRegistar: UntypedFormGroup;

  constructor(
    private servicioConsultar: ServicioService,
    private centralRegistrar: CentralService,
  ) { 
    this.formRegistar = new UntypedFormGroup({
      id: new UntypedFormControl(null, []),
      imei: new UntypedFormControl(null, [
        Validators.required,
        Validators.pattern("^[A-Z][A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$"),
      ]),
      coordenadaX: new UntypedFormControl(null, []),
      coordenadaY: new UntypedFormControl(null, []),
      cliApeNomDenVM: new UntypedFormControl(null, []),
      usuarioVM: new UntypedFormControl(null, []),      
    });
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
    this.coordenadaYSeleccionado = "-64.188776";    
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
  
  //Valida que los campos descripcion y uniddad se encuentren correctamente ingresados.
  validarControlers(): string {
    if (this.formRegistar.valid == false) {
      return (this.validadorCamposModif = '2');
    } else {
      return (this.validadorCamposModif = '1');
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
    let nroCentralNew: number = 0;
    let Central: CentralClass = new CentralClass(
      0,
      this.imeiSeleccionado,
      this.coordenadaXSeleccionado,
      this.coordenadaYSeleccionado,
      new Date(),
      null,      
      1,
      this.cenTipoDocSeleccionado,
      this.cenNroDocSeleccionado      
    );
    console.log(Central);
      this.centralRegistrar.registrarCentral(Central).subscribe((data) => {
        nroCentralNew = data.cenNro;
        console.log(data);
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
        console.log(this.ServiciosAgregar);
        if (this.ServiciosAgregar.length > 0) {
          this.centralRegistrar.registrarServiciosCentral(this.ServiciosAgregar ).subscribe((data) => {
            console.log(data);
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

  seleccionarCliente(cliente: CentralClienteConsultaClass): void {
  }
}
