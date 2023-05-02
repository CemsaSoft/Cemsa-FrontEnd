//SISTEMA
import { Component, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  UntypedFormControl,
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
import { ServicioxCentralClass } from 'src/app/core/models/serviciosxCentral';

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
  ServiciosDeCentralActualizado: ServicioClass [] = [];
  ServiciosDeCentralOriginal: ServicioxCentralClass [] = [];

  actualizacionServicio: ServicioxCentralClass[] = [];

  //VARIABLES DE DATOS
  titulo: string = '';
  //propiedadOrdenamiento: string = 'cenNro';
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

  caracteresValidos: string =
    "La primera letra del nombre debe ser Mayúscula, y no se admiten: 1-9 ! # $ % & ' ( ) * + , - . / : ; < = > ¿? @ [  ] ^ _` { | } ~";
  numerosValidos: string = 'Solo se admiten números';

  //tipoOrdenamiento: number = 1;
  cenNroSeleccionado: number = 0;
  estIdSeleccionado: number = 0;
  validadorCamposModif: string = '1';
  idSeleccionado: number = 0;
  idListaServiciosSeleccionado: number=0;
  idListaServiciosCentralSeleccionado: number=0;
  //tablaActualizadaServicio : boolean = false;
  tipoOrdenamientoServicio: number = 1;
  tipoOrdenamientoServicioCentral: number = 1;

  mostrarBtnAceptarModificacion: boolean = false;
  mostrarBtnEditarModificacion: boolean = true;

  //FORMULARIOS DE AGRUPACION DE DATOS
  formModificar: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private centralModificarEstado: CentralService,
    private centralConsultar: CentralService,
    private estadoCentralConsulta: CentralService,
    private servicioCentral: CentralService,
    private servicioConsultar: ServicioService,
  ) {
    this.formModificar = new UntypedFormGroup({
      id: new UntypedFormControl(null, []),
      imei: new UntypedFormControl(null, [
        Validators.required,
        Validators.pattern("^[A-Z][A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]+$"),
      ]),
      coordenadaX: new UntypedFormControl(null, []),
      coordenadaY: new UntypedFormControl(null, []),
      estadoCentralDescripcion: new UntypedFormControl(null, []),
      fechaAlta: new UntypedFormControl(null, []),
      fechaBaja: new UntypedFormControl(null, []),
      cliApeNomDenVM: new UntypedFormControl(null, []),
      usuarioVM: new UntypedFormControl(null, []),
      estIdSeleccionado: new UntypedFormControl(),
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

  ngOnInit(): void {
    this.recibirDatosCentral();
    
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      this.inicializarMapa();
    }
    
    this.servicioConsultar.obtenerServicios().subscribe(data => {
      this.Servicios = data;  
    })

    //Cambiar el 1 por el id de la central seleccionada
    //this.centralConsultar.obtenerServiciosXCentral(1).subscribe(data => {
    this.centralConsultar.obtenerServiciosXCentral(this.CentralConsultaSeleccionada.cenNro).subscribe(data => {
      this.ServiciosDeCentralActualizado = data; 
      // filtra los registros que están en ServiciosDeCentral
      this.Servicios = this.Servicios.filter(servicio => {
        return !this.ServiciosDeCentralActualizado.some(servicioCentral => servicioCentral.serId === servicio.serId);
      });
    })

    this.centralConsultar.serviciosXCentralCompleto(this.CentralConsultaSeleccionada.cenNro).subscribe(data => {
      this.ServiciosDeCentralOriginal = data;  
      this.actualizacionServicio=data; 
    })

  }
  
  recibirDatosCentral() {
    this.CentralConsultaSeleccionada = this.servicioCentral.recibirCentralSeleccionado();

    this.cliApeNomDenSeleccionado = this.CentralConsultaSeleccionada.cliApeNomDen;
    this.cenNroSeleccionado = this.CentralConsultaSeleccionada.cenNro;
    this.usuarioSeleccionado = this.CentralConsultaSeleccionada.usuario;
    this.imeiSeleccionado = this.CentralConsultaSeleccionada.cenImei;
    this.estDescripcionSeleccionado = this.CentralConsultaSeleccionada.estDescripcion;
    this.fechaAltaSeleccionado = new Date(this.CentralConsultaSeleccionada.cenFechaAlta).toLocaleDateString("es-AR");
    this.fechaBajaSeleccionado = this.CentralConsultaSeleccionada.cenFechaBaja ? new Date(this.CentralConsultaSeleccionada.cenFechaBaja).toLocaleDateString("es-AR") : '';     

    this.coordenadaXSeleccionado = this.CentralConsultaSeleccionada.cenCoorX;
    this.coordenadaYSeleccionado =  this.CentralConsultaSeleccionada.cenCoorY;
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

  //Valida que los campos descripcion y uniddad se encuentren correctamente ingresados.
  validarControlesMod(): string {
    if (this.formModificar.valid == false) {
      return (this.validadorCamposModif = '2');
    } else {
      return (this.validadorCamposModif = '1');
    }
  }

  // Agregar servicios a la central selecciona
  agregarServicio(servicios: ServicioClass): void {  
    const index = this.Servicios.indexOf(servicios);
    if (index !== -1) {
      this.Servicios.splice(index, 1);
      this.ServiciosDeCentralActualizado.push(servicios);

      const servicioOriginal = this.actualizacionServicio.find(s => s.sxcNroServicio === servicios.serId);
      if (servicioOriginal) {
        servicioOriginal.sxcEstado = 1;
        servicioOriginal.sxcFechaBaja = null;
      } 
      else {
        const nuevoServicio = new ServicioxCentralClass(
          this.CentralConsultaSeleccionada.cenNro, 
          servicios.serId, 
          1, 
          new Date(), 
          null);
        this.actualizacionServicio.push(nuevoServicio);
      }
    }
    console.log(this.actualizacionServicio);
    this.validarFiltradoServicios();  
  }

  // Extraer servicios a la central selecciona
  extraerServicio(servicios: ServicioClass): void {
    const index = this.ServiciosDeCentralActualizado.indexOf(servicios);
    if (index !== -1) {
      this.ServiciosDeCentralActualizado.splice(index, 1);
      this.Servicios.push(servicios);

      const servicioOriginal = this.ServiciosDeCentralOriginal.find(s => s.sxcNroServicio === servicios.serId);
      if (servicioOriginal) {
        servicioOriginal.sxcEstado = 2;
        servicioOriginal.sxcFechaBaja = new Date();
        
      }
      else{
        this.actualizacionServicio.splice(index, 1);
      }      
      console.log('Lista actualizada');
      console.log(this.actualizacionServicio);
      console.log('Lista de servicios original');
      console.log(this.ServiciosDeCentralOriginal);
    }
    this.validarFiltradoServiciosDeCentral();  
  }

  // abrir ventna Modificar Central
  modificarCentral(): void {
    this.controlServicios();

    // this.centralConsultar.actualizarDatosCentral(
    //   this.cenNroSeleccionado, 
    //   this.formModificar.get('imei')?.value,
    //   this.formModificar.get('coordenadaX')?.value,
    //   this.formModificar.get('coordenadaY')?.value
    //  )
    // .subscribe(() => {
    //   Swal.fire({
    //     text:
    //       'Se Actualizo con éxito los datos de la Central ' + this.cenNroSeleccionado,
    //     icon: 'success',
    //     position: 'top',
    //     showConfirmButton: true,
    //     confirmButtonColor: '#0f425b',
    //     confirmButtonText: 'Aceptar',
    //   } as SweetAlertOptions).then((result) => {
    //     if (result.value == true) {
    //       return location.reload();
    //     }
    //   });
    // }, (error) => {
    //   Swal.fire({
    //     text: 'No es posible modificar datos de esta Central',
    //     icon: 'error',
    //     position: 'top',
    //     showConfirmButton: true,
    //     confirmButtonColor: '#0f425b',
    //     confirmButtonText: 'Aceptar',
    //   } as SweetAlertOptions);    
    // });    
  }

  controlServicios(): void {
          
    console.log('Servicios Actualizados: ');
    console.log(this.ServiciosDeCentralActualizado);

    //ServiciosDeCentralActualizado
    //ServiciosDeCentralOriginal
    console.log('Central nro: ');
    console.log(this.CentralConsultaSeleccionada.cenNro);

    console.log('Servicios Original de la Central: ');
    console.log(this.ServiciosDeCentralOriginal);    

   // let actualizacionServicio: ServicioxCentralClass[] = [];

    // // verificar si el servicio original está en el array de servicios actualizados
    // this.ServiciosDeCentralOriginal.forEach((servicioOriginal) => {
    //   const servicioActualizado = this.ServiciosDeCentralActualizado.some((servicioActualizado) => {
    //     return servicioOriginal.sxcNroServicio === servicioActualizado.serId;
    //   });            
    //   if (!servicioActualizado) {
    //     const nuevoServicio = new ServicioxCentralClass(
    //       this.CentralConsultaSeleccionada.cenNro, 
    //       servicioOriginal.sxcNroServicio,
    //       2, 
    //       servicioOriginal.sxcFechaAlta,
    //       new Date(),        
    //     );        
    //     actualizacionServicio.push(nuevoServicio);
    //   }
    // });
    
    // for (const servicio of this.ServiciosDeCentralOriginal) {
    //   if (!this.ServiciosDeCentralActualizado.find(s => s.serId === servicio.sxcNroServicio)) {        
    //     actualizacionServicio.push(new ServicioxCentralClass(
    //       servicio.sxcNroCentral,
    //       servicio.sxcNroServicio,
    //       1,
    //       new Date(),
    //       null
    //     ));
    //   }
    // }
    
    for (const servicioOriginal of this.ServiciosDeCentralActualizado) {
      const servicioActualizado = this.ServiciosDeCentralOriginal.find(s => s.sxcNroServicio === servicioOriginal.serId);
      if (!servicioActualizado) {
        const nuevaActualizacionServicio = new ServicioxCentralClass(
          this.CentralConsultaSeleccionada.cenNro, 
          servicioOriginal.serId,
          1,
          new Date(),
          null
        );
        this.actualizacionServicio.push(nuevaActualizacionServicio);
       } 
    }    



    this.ServiciosDeCentralOriginal.forEach((servicioOriginal) => {
      const servicioActualizado = this.ServiciosDeCentralActualizado.some((servicioActualizado) => {
        return servicioOriginal.sxcNroServicio === servicioActualizado.serId;
      });            
      if (!servicioActualizado) {
        const nuevoServicio = new ServicioxCentralClass(
          this.CentralConsultaSeleccionada.cenNro, 
          servicioOriginal.sxcNroServicio,
          2, 
          servicioOriginal.sxcFechaAlta,
          new Date(),        
        );        
        this.actualizacionServicio.push(nuevoServicio);
      }
    });
    

    console.log('servicios para actualizados: ');
    console.log(this.actualizacionServicio);
  
    // if (this.ServiciosDeCentralOriginal.length === this.ServiciosDeCentralActualizado.length) {
    //   // No se actualizó nada      
    // } else if (this.ServiciosDeCentralOriginal.length > this.ServiciosDeCentralActualizado.length) {
    //   // Se dio de baja algún servicio
    //   for (const servicio of this.ServiciosDeCentralOriginal) {
    //     const servicioActualizado = this.ServiciosDeCentralActualizado.find(s => s.serId === servicio.serId);
    //     if (!servicioActualizado) {
    //       // Servicio dado de baja
    //       actualizacionServicio.push({
    //         sxcNroCentral: 1,
    //         sxcNroServicio: servicio.serId,
    //         sxcEstado: 2,
    //         sxcFechaAlta: new Date(new Date().toISOString().substr(0, 10)),
    //         sxcFechaBaja: new Date(new Date().toISOString().substr(0, 10)),           
    //       });
    //     }
    //   }
    // } else {
    //   // Se dio de alta un nuevo servicio
    //   for (const servicio of this.ServiciosDeCentralActualizado) {
    //     const servicioAnterior = this.ServiciosDeCentralOriginal.find(s => s.serId === servicio.serId);
    //     if (!servicioAnterior) {
    //       // Nuevo servicio dado de alta
    //       actualizacionServicio.push({
    //         sxcNroCentral: 1,
    //         sxcNroServicio: servicio.serId,
    //         sxcEstado: 1,
    //         sxcFechaAlta: new Date(new Date().toISOString().substr(0, 10)),
    //         sxcFechaBaja: new Date(new Date().toISOString().substr(0, 10)),   
    //       });
    //     }
    //   }
    // }
    // console.log('datos de servicios');
    // console.log(actualizacionServicio);

  }
}
