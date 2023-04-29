//SISTEMA
import { Component, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';

import { Map, Marker, icon } from 'leaflet';
import * as L from 'leaflet';

//COMPONENTES
import { CentralConsultaClass } from 'src/app/core/models/centralConsulta';
import { EstadoCentralConsultaClass } from 'src/app/core/models/estadoCentral';
import { ServicioClass } from 'src/app/core/models/servicio';

//SERVICIOS
import { CentralService } from 'src/app/core/services/central.service';
import { ServicioService } from 'src/app/core/services/servicio.service';

@Component({
  selector: 'app-modificar-central',
  templateUrl: './modificar-central.component.html',
  styleUrls: ['./modificar-central.component.css'],
})
export class ModificarCentralComponent implements OnInit {
  @Output() CentralConsultaSeleccionada: any;

  //VARIABLES DE OBJETOS LIST
  //CentralConsulta: CentralConsultaClass[] = [];
  //CentralConsultaFiltrados: CentralConsultaClass[] = [];
  EstadoCentralConsulta: EstadoCentralConsultaClass[] = [];
  Servicios: ServicioClass[] = [];
  //ServiciosFiltrados: ServicioClass [] = [];
  ServiciosDeCentral: ServicioClass [] = [];

  //VARIABLES DE DATOS
  titulo: string = '';
  propiedadOrdenamiento: string = 'cenNro';
  cliApeNomDenSeleccionado: string = '';
  usuarioSeleccionado: string = '';
  estDescripcionSeleccionado: string = '';

  imeiSeleccionado: string = '';
  coordenadaXSeleccionado: string = '';
  coordenadaYSeleccionado: string = '';
  fechaAltaSeleccionado: string = '';
  fechaBajaSeleccionado: string = '';

  caracteresValidos: string =
    "La primera letra del nombre debe ser Mayúscula, y no se admiten: 1-9 ! # $ % & ' ( ) * + , - . / : ; < = > ¿? @ [  ] ^ _` { | } ~";
  numerosValidos: string = 'Solo se admiten números';

  tipoOrdenamiento: number = 1;
  cenNroSeleccionado: number = 0;
  estIdSeleccionado: number = 0;
  validadorCamposModif: string = '1';
  idSeleccionado: number = 0;
  idListaServiciosSeleccionado: number=0;
  idListaServiciosCentralSeleccionado: number=0;
  //tablaActualizadaServicio : boolean = false;

  mostrarBtnAceptarModificacion: boolean = false;
  mostrarBtnEditarModificacion: boolean = true;

  //FORMULARIOS DE AGRUPACION DE DATOS
  formModificar: FormGroup;

  constructor(
    private fb: FormBuilder,
    private centralModificarEstado: CentralService,
    private centralConsultar: CentralService,
    private estadoCentralConsulta: CentralService,
    private servicioCentral: CentralService,
    private servicioConsultar: ServicioService,
  ) {
    this.formModificar = new FormGroup({
      id: new FormControl(null, []),
      imei: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[A-Z][A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$"),
      ]),
      coordenadaX: new FormControl(null, []),
      coordenadaY: new FormControl(null, []),
      estadoCentralDescripcion: new FormControl(null, []),
      fechaAlta: new FormControl(null, []),
      fechaBaja: new FormControl(null, []),
      cliApeNomDenVM: new FormControl(null, []),
      usuarioVM: new FormControl(null, []),
      estIdSeleccionado: new FormControl(),
    });
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
  get coordenddadaX() {
    return this.formModificar.get('coordenadaX');
  }
  get estadoCentralDescripcion(){
    return this.formModificar.get('estadoCentralDescripcion');
  }
  get fechaAlta() {
    return this.formModificar.get('fechaAlta');
  }
  get fechaBaja() {
    return this.formModificar.get('fechaBaja');
  }

  ngOnInit(): void {
    this.recibirDatosCentral();
    
    this.servicioConsultar.obtenerServicios().subscribe(data => {
      this.Servicios = data;  
    })

    ////////////////////////////////
    //////
    ////////
    //Cambiar el 1 por el id de la central seleccionada
    //this.centralConsultar.obtenerServiciosXCentral(1).subscribe(data => {
    this.centralConsultar.obtenerServiciosXCentral(this.CentralConsultaSeleccionada.cenNro).subscribe(data => {
      this.ServiciosDeCentral = data; 
      
      // filtra los registros que están en ServiciosDeCentral
      this.Servicios = this.Servicios.filter(servicio => {
        return !this.ServiciosDeCentral.some(servicioCentral => servicioCentral.serId === servicio.serId);
      });
    })

    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      this.inicializarMapa();
    }
  }
  
  recibirDatosCentral() {
    this.CentralConsultaSeleccionada =
    this.servicioCentral.recibirCentralSeleccionado();
    console.log("Llegó a modificar Central  y los datos son")
    console.log(this.CentralConsultaSeleccionada);
    
    this.cliApeNomDenSeleccionado = this.CentralConsultaSeleccionada.cliApeNomDen;
    this.cenNroSeleccionado = this.CentralConsultaSeleccionada.cenNro;
    this.usuarioSeleccionado = this.CentralConsultaSeleccionada.usuario;
    this.imeiSeleccionado = this.CentralConsultaSeleccionada.cenImei;
    this.estDescripcionSeleccionado = this.estDescripcionSeleccionado;
    this.fechaAltaSeleccionado = new Date(this.CentralConsultaSeleccionada.cenFechaAlta).toLocaleDateString("es-AR");
    this.fechaBajaSeleccionado = this.CentralConsultaSeleccionada.cenFechaBaja ? new Date(this.CentralConsultaSeleccionada.cenFechaBaja).toLocaleDateString("es-AR") : '';     

    this.coordenadaXSeleccionado = this.CentralConsultaSeleccionada.cenCoorX;
    this.coordenadaYSeleccionado =  this.CentralConsultaSeleccionada.cenCoorY;
  }

  inicializarMapa(): void {
    let self = this;
    //var map = L.map('map').setView([-31.420083, -64.188776], 10);
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
    if (this.ServiciosDeCentral.length == 0) {
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
  esfilaSeleccionada(centralConsulta: CentralConsultaClass) {
    this.cenNroSeleccionado = centralConsulta.cenNro;
    this.cliApeNomDenSeleccionado = centralConsulta.cliApeNomDen;
    this.usuarioSeleccionado = centralConsulta.usuario;
    this.estDescripcionSeleccionado = centralConsulta.estDescripcion;
    this.estIdSeleccionado = centralConsulta.cenIdEstadoCentral;
    this.imeiSeleccionado = centralConsulta.cenImei;
    this.coordenadaXSeleccionado = centralConsulta.cenCoorX;
    this.coordenadaYSeleccionado = centralConsulta.cenCoorY;
    this.fechaAltaSeleccionado = new Date(
      centralConsulta.cenFechaAlta
    ).toLocaleDateString('es-AR');
    this.fechaBajaSeleccionado = centralConsulta.cenFechaBaja
      ? new Date(centralConsulta.cenFechaBaja).toLocaleDateString('es-AR')
      : '';
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

  //Bloquea los campos ante una consulta.
  bloquearEditar(): void {
    this.formModificar.get('id')?.disable();
    this.formModificar.get('imei')?.disable();
    this.formModificar.get('coordenadaX')?.disable();
    this.formModificar.get('coordenadaY')?.disable();
    this.formModificar.get('fechaAlta')?.disable();
    this.formModificar.get('fechaBaja')?.disable();
    this.formModificar.get('estadoCentralDescripcion')?.disable();
    this.formModificar.get('cliApeNomDenVM')?.disable();
    this.formModificar.get('usuarioVM')?.disable();
    this.mostrarBtnAceptarModificacion = false;
    this.mostrarBtnEditarModificacion = true;
  }

  //Desbloquea los campos para su modificación.
  desbloquearEditar(): void {
    this.formModificar.get('imei')?.enable();
    this.formModificar.get('coordenadaX')?.enable();
    this.formModificar.get('coordenadaY')?.enable();

    this.formModificar.get('estadoCentralDescripcion')?.enable();

    this.mostrarBtnAceptarModificacion = true;
    this.mostrarBtnEditarModificacion = false;
  }

  //Valida que los campos descripcion y uniddad se encuentren correctamente ingresados.
  validarControlesMod(): string {
    if (this.formModificar.valid == false) {
      return (this.validadorCamposModif = '2');
    } else {
      return (this.validadorCamposModif = '1');
    }
  }

  ListarEstadosCentral() {
    this.EstadoCentralConsulta = [];
    this.estadoCentralConsulta.obtenerEstadoCentral().subscribe((data) => {
      this.EstadoCentralConsulta = data;
    });
  }

  onSelectEstado(id: number) {
    this.estIdSeleccionado = id;
  }

  ModificarEstadoCentral(estIdSeleccionado: number, estado: string): void {
    Swal.fire({
      text:
        '¿Estás seguro que deseas modificar el estado de esta central a "' +
        estado +
        '"?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f425b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    } as SweetAlertOptions).then((result) => {
      if (result.isConfirmed) {
        this.centralModificarEstado
          .modificarEstado(this.cenNroSeleccionado, estIdSeleccionado)
          .subscribe(
            (result) => {
              Swal.fire({
                text: 'Se ha actualizado el estado a ' + estado,
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
            (error) => {
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

// Extraer servicios a la central selecciona
agregarServicio(servicios: ServicioClass): void {  
  const index = this.Servicios.indexOf(servicios);
  if (index !== -1) {
    this.Servicios.splice(index, 1);
    this.ServiciosDeCentral.push(servicios);
  }
  this.validarFiltradoServicios();  
}

// Extraer servicios a la central selecciona
extraerServicio(servicios: ServicioClass): void {
  const index = this.ServiciosDeCentral.indexOf(servicios);
  if (index !== -1) {
    this.ServiciosDeCentral.splice(index, 1);
    this.Servicios.push(servicios);
  }
  this.validarFiltradoServiciosDeCentral();  
}

  // abrir ventna Modificar Central
  modificarCentral(): void {}

}
