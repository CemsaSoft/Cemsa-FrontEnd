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
import { CentralClass } from 'src/app/core/models/central';
import { EstadoCentralConsultaClass } from 'src/app/core/models/estadoCentral';
import { ServicioClass } from 'src/app/core/models/servicio';
import { ServicioxCentralClass } from 'src/app/core/models/serviciosxCentral';

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

  //VARIABLES DE DATOS
  cliApeNomDenSeleccionado: string = '';
  usuarioSeleccionado: string = '';
  imeiSeleccionado: string = '';
  coordenadaXSeleccionado: string = '';
  coordenadaYSeleccionado: string = '';
  validadorCamposModif: string = '1';
  numerosValidos: string = 'Solo se admiten números';  
  cenNroDocSeleccionado: string = '';

  idListaServiciosSeleccionado: number=0;
  idListaServiciosCentralSeleccionado: number=0;
  cenTipoDocSeleccionado: number=0;

    //FORMULARIOS DE AGRUPACION DE DATOS
    formRegistar: FormGroup;

  constructor(
    private servicioConsultar: ServicioService,
    private centralRegistrar: CentralService,
  ) { 
    this.formRegistar = new FormGroup({
      id: new FormControl(null, []),
      imei: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[A-Z][A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$"),
      ]),
      coordenadaX: new FormControl(null, []),
      coordenadaY: new FormControl(null, []),
      cliApeNomDenVM: new FormControl(null, []),
      usuarioVM: new FormControl(null, []),      
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

  //Almacena los datos del servicio que fue seleccionado en la tabla de servicio filtrados dentro de variables locales.
  esfilaSeleccionadaServicio(servicios: ServicioClass) {
    this.idListaServiciosSeleccionado = servicios.serId;      
  }

  //Almacena los datos del servicio que fue seleccionado en la tabla de servicio filtrados dentro de variables locales.
  esfilaSeleccionadaServicioDeCentral(servicios: ServicioClass) {      
    this.idListaServiciosCentralSeleccionado = servicios.serId;
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

  // agregarServicio(servicios: ServicioClass): void {  
  //   const index = this.Servicios.findIndex(s => s.serId === servicios.serId);
  //   if (index !== -1) {
  //     const servicioCentral = new ServicioxCentralClass(
  //       1,
  //       servicios.serId,
  //       1,
  //       new Date(),
  //       null
  //     );
  //     this.Servicios.splice(index, 1);
  //     this.ServiciosNuevos.push(servicioCentral);
  //   }
  //   this.validarFiltradoServicios();  
  // }

  // extraerServicio(servicios: ServicioClass): void {
  //   const sxcServicio = new ServicioxCentralClass(
  //     this.numeroCentralSeleccionada,
  //     servicios.serId,
  //     1,
  //     new Date(),
  //     null
  //   );
  //   const index = this.ServiciosNuevos.indexOf(servicios);
  //   if (index !== -1) {
  //     this.ServiciosNuevos.splice(index, 1);
  //     this.Servicios.push(sxcServicio);
  //   }
  //   this.validarFiltradoServiciosDeCentral();
  // }

  // Registar Central
  registrarCentral(): void {
    let Central: CentralClass = new CentralClass(
      0,
      this.formRegistar.get('imei')?.value,
      this.formRegistar.get('coordenadaX')?.value,
      this.formRegistar.get('coordenadaY')?.value,
      new Date(),
      null,
      1,
      //this.cenTipoDocSeleccionado,
      //this.cenNroDocSeleccionado
      1,  
      "1"
    );
    this.centralRegistrar.registrarCentral(Central).subscribe((data) => {
      console.log(data);
      Swal.fire({
        text:
          'La Central del Cliente: ' + 
          this.formRegistar.get('cliApeNomDenSeleccionado')?.value +           
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
