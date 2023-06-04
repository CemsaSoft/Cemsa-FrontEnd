import { Component, OnInit } from '@angular/core';

//COMPONENTES

//SERVICIOS
import { AlarmaService } from 'src/app/core/services/alarma.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  token = localStorage.getItem('token') || null;

  rol: any = 0;
  idUsuario: any = 0;

  cantAlarma: number=0;

  constructor(
    private servicioUsuario: UsuarioService,
    private alarmaConsultar: AlarmaService, 
    )
  {}

  esActivado: boolean = false;

  ngOnInit () : void {
    this.rol = localStorage.getItem('rol');
    this.idUsuario = localStorage.getItem('idUsuario');    

    this.alarmaConsultar.obtenerCantAlarmasCliente(this.idUsuario).subscribe(data => {
      this.cantAlarma = data.length;
    });    
    console.log(this.rol );
  }

  redirigir(){
    if(this.servicioUsuario.obtenerToken() != null){
      location.href = "/home"
    }
  }

  openConsultarAlarma() {
    window.location.href = "consultar-alarma";
  }
  
}
