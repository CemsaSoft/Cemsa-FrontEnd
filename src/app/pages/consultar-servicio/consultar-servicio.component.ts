import { Component, OnInit } from '@angular/core';
import { ServicioClass } from 'src/app/core/models/servicio';
import { ServicioService } from 'src/app/core/services/servicio.service';

@Component({
  selector: 'app-consultar-servicio',
  templateUrl: './consultar-servicio.component.html',
  styleUrls: ['./consultar-servicio.component.css']
})
export class ConsultarServicioComponent implements OnInit {

  //VARIABLES DE OBJETOS LIST
  Servicios: ServicioClass[] = [];
  ServiciosFiltrados: ServicioClass [] = [];
  //VARIABLES DE DATOS

  //FORMULARIOS DE AGRUPACION DE DATOS

  constructor(private servicioServicio: ServicioService) { }

  ngOnInit(): void {

    this.servicioServicio.obtenerServicios().subscribe(data => {
      this.Servicios = data;  
      this.ServiciosFiltrados = data;
    })
  }


  esFiltrar(event: Event){
    let txtBuscar = (event.target as HTMLInputElement).value;
    let filtro = txtBuscar
    .replace(/[^\w\s]/g, '')
    .trim()
    .toLowerCase();
    this.ServiciosFiltrados = [];

    this.Servicios.forEach((servicio) => {
      if(
        servicio.serDescripcion.toString().includes(filtro)
      ){
        this.ServiciosFiltrados.push(servicio)
      }
    }
    );
  }


}
