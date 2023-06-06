//SISTEMA
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
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
import { EstadoCentralConsultaClass } from 'src/app/core/models/estadoCentral';
import { ServicioClass } from 'src/app/core/models/servicio';

//SERVICIOS
import { CentralService } from 'src/app/core/services/central.service';
import { ServicioService } from 'src/app/core/services/servicio.service';
import { ServicioxCentralClass } from 'src/app/core/models/serviciosxCentral';

@Component({
  selector: 'app-modificar-central',
  templateUrl: './modificar-central.component.html',
  styleUrls: ['./modificar-central.component.css'],
})
export class ModificarCentralComponent implements OnInit {
  @Output() CentralConsultaSeleccionada: any;

  //VARIABLES DE OBJETOS LIST
  EstadoCentralConsulta: EstadoCentralConsultaClass[] = [];
  Servicios: ServicioClass[] = [];
  ServiciosDeCentralActualizado: ServicioClass [] = [];
  ServiciosDeCentralOriginal: ServicioxCentralClass [] = [];
  actualizacionServicio: ServicioxCentralClass[] = [];

  //VARIABLES DE DATOS
  titulo: string = '';
  propiedadOrdenamientoServicio: string = 'serId';
  propiedadOrdenamientoServicioCentral: string = 'serId';
  cliApeNomDenSeleccionado: string = '';
  usuarioSeleccionado: string = '';
  estDescripcionSeleccionado: string = '';
  imeiSeleccionado: string = '';
  coordenadaXSeleccionado: string = '';
  coordenadaYSeleccionado: string = '';
  fechaAltaSeleccionado: string = '';
  fechaBajaSeleccionado: string = '';
  numerosValidos: string = 'Solo se admiten 15 números';  
  ruta: string = '';
  
  cenNroSeleccionado: number = 0;
  estIdSeleccionado: number = 0;
  validadorCamposModif: string = '1';
  idSeleccionado: number = 0;
  idListaServiciosSeleccionado: number=0;
  idListaServiciosCentralSeleccionado: number=0;
  tipoOrdenamientoServicio: number = 1;
  tipoOrdenamientoServicioCentral: number = 1;

  modificarExitoso: boolean = false;

  //FORMULARIOS DE AGRUPACION DE DATOS
  formModificar: FormGroup;

  constructor(
    private fb: FormBuilder,
    private centralModificarEstado: CentralService,
    private centralConsultar: CentralService,
    private estadoCentralConsulta: CentralService,
    private servicioCentral: CentralService,
    private servicioConsultar: ServicioService, 
    private router: Router   
  ) {
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

  ngOnInit(): void {
    this.recibirDatosCentral();
    
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      this.inicializarMapa();
    }
    
    this.servicioConsultar.obtenerServicios().subscribe(data => {
      this.Servicios = data;  
    

    this.centralConsultar.obtenerServicioXCentral(this.CentralConsultaSeleccionada.cenNro).subscribe(data => {
      this.ServiciosDeCentralActualizado = data; 
      this.Servicios = this.Servicios.filter(servicio => {
        return !this.ServiciosDeCentralActualizado.some(servicioCentral => servicioCentral.serId === servicio.serId);
      });
    })

    })

  this.centralConsultar.serviciosXCentralCompleto(this.CentralConsultaSeleccionada.cenNro).subscribe(data => {
      this.ServiciosDeCentralOriginal = data;  
    })


  }
  
  recibirDatosCentral() {
    this.CentralConsultaSeleccionada = this.servicioCentral.recibirCentralSeleccionado();

    if (this.CentralConsultaSeleccionada == undefined) {
      location.href = '/consultar-central';      
    }

    this.cliApeNomDenSeleccionado = this.CentralConsultaSeleccionada.cliApeNomDen;
    this.cenNroSeleccionado = this.CentralConsultaSeleccionada.cenNro;
    this.usuarioSeleccionado = this.CentralConsultaSeleccionada.usuario;
    this.imeiSeleccionado = this.CentralConsultaSeleccionada.cenImei;
    this.estDescripcionSeleccionado = this.CentralConsultaSeleccionada.estDescripcion;
    this.fechaAltaSeleccionado = new Date(this.CentralConsultaSeleccionada.cenFechaAlta).toLocaleDateString("es-AR");
    this.fechaBajaSeleccionado = this.CentralConsultaSeleccionada.cenFechaBaja ? new Date(this.CentralConsultaSeleccionada.cenFechaBaja).toLocaleDateString("es-AR") : '';     
    this.coordenadaXSeleccionado = this.CentralConsultaSeleccionada.cenCoorX;
    this.coordenadaYSeleccionado =  this.CentralConsultaSeleccionada.cenCoorY;
    
    this.cliApeNomDenVM = this.cliApeNomDenSeleccionado;
    this.usuarioVM = this.usuarioSeleccionado;
    this.id = this.cenNroSeleccionado;
    this.imei = this.imeiSeleccionado;
    this.estadoCentralDescripcion = this.estDescripcionSeleccionado;
    this.fechaAlta = this.fechaAltaSeleccionado;
    this.fechaBaja = this.fechaBajaSeleccionado;
    this.coordenadaX = this.coordenadaXSeleccionado;
    this.coordenadaY = this.coordenadaYSeleccionado;
  }

  inicializarMapa(): void {
    let self = this;
    //var map = L.map('map').setView([-31.420083, -64.188776], 10);
    var map = L.map('map').setView([parseFloat(this.coordenadaXSeleccionado), parseFloat(this.coordenadaYSeleccionado)], 10);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(
      map
    );
    var marker = L.marker([parseFloat(this.coordenadaXSeleccionado), parseFloat(this.coordenadaYSeleccionado)], {
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
    if (this.ServiciosDeCentralActualizado.length == 0) {
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

  //Metodos para grilla
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

  // Agregar servicios a la central selecciona
  agregarServicio(servicios: ServicioClass): void {  
    const index = this.Servicios.indexOf(servicios);
    if (index !== -1) {
      this.Servicios.splice(index, 1);
      this.ServiciosDeCentralActualizado.push(servicios);      
    }
    this.validarFiltradoServicios();  
  }

  // Extraer servicios a la central selecciona
  extraerServicio(servicios: ServicioClass): void {
    const index = this.ServiciosDeCentralActualizado.indexOf(servicios);
    if (index !== -1) {
      this.ServiciosDeCentralActualizado.splice(index, 1);
      this.Servicios.push(servicios);      
    }
    this.validarFiltradoServiciosDeCentral();  
  }
  
  // abrir ventna Modificar Central
  modificarCentral(): void {

    //Verifica que este completo el formulario y que no tenga errores.
    if (this.imei?.valid == false) {      
      Swal.fire({
        title: 'Error',
        text: `Verificar los datos ingresados:              
          ${this.imei?.invalid && this.imei.errors?.['required'] ? '\n* El IMEI es requerido' : ''}          
          ${this.imei?.invalid && this.imei.errors?.['pattern'] ? '\n*Debe ingresar solamente 15 números' : ''}`,
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
            position: 'top',
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
      this.modificarExitoso = true;
      Swal.fire({
        text:
          'Se Actualizo con éxito los datos de la Central ' + this.cenNroSeleccionado,
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
      this.router.navigate(['/consultar-central']);  
    }, (error) => {
      Swal.fire({
        text: 'No es posible modificar datos de esta Central',
        icon: 'error',
        position: 'top',
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
          this.CentralConsultaSeleccionada.cenNro, 
          servicios.serId, 
          1, 
          new Date(), 
          null);
        this.actualizacionServicio.push(nuevoServicio);      
      }
      const servicioOriginal2 = this.ServiciosDeCentralOriginal.find(s => s.sxcNroServicio === servicios.serId && s.sxcEstado ===2);
      if (servicioOriginal2) {
        const nuevoServicio = new ServicioxCentralClass(
          this.CentralConsultaSeleccionada.cenNro, 
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
          this.CentralConsultaSeleccionada.cenNro, 
          servicios.sxcNroServicio, 
          2, 
          servicios.sxcFechaAlta, 
          new Date());
        this.actualizacionServicio.push(nuevoServicio);      
      }    
    }
    //console.log('Servicios a insertar en la base de datos: ');
    //console.log(this.actualizacionServicio);    
  }
}
