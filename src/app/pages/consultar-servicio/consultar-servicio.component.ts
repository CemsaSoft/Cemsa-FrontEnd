import { Component, OnInit } from '@angular/core';
import { ServicioService } from 'src/app/core/services/servicio.service';

@Component({
  selector: 'app-consultar-servicio',
  templateUrl: './consultar-servicio.component.html',
  styleUrls: ['./consultar-servicio.component.css']
})
export class ConsultarServicioComponent implements OnInit {

  constructor(private servicioServicio: ServicioService) { }

  ngOnInit(): void {

    this.servicioServicio.obtenerServicios().subscribe(data => {
      console.log(data);
      
    })
  }

}
