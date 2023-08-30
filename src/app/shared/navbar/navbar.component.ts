import { Component, OnInit } from '@angular/core';

//COMPONENTES

//SERVICIOS
import { AlarmaService } from 'src/app/core/services/alarma.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { SharedDataService } from 'src/app/core/services/shared-data.service';

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
  nombreUsuarioIngresado: string='';

  constructor(
    private servicioUsuario: UsuarioService,
    private alarmaConsultar: AlarmaService, 
    private sharedDataService: SharedDataService,
    )
  {}

  esActivado: boolean = false;

  ngOnInit () : void {
    this.rol = localStorage.getItem('rol');
    this.idUsuario = localStorage.getItem('idUsuario');  
    const storedNombreUsuario= localStorage.getItem('usuario'); 
    this.nombreUsuarioIngresado = storedNombreUsuario !== null ? storedNombreUsuario : ''; 

    if (this.idUsuario !=0) {
      this.alarmaConsultar.obtenerCantAlarmasCliente(this.idUsuario).subscribe(data => {
        this.cantAlarma = data.length;
      });    
    }
    // this.sharedDataService.nombreUsuario$.subscribe(nombre => {
    //   this.nombreUsuarioIngresado = nombre;
    // });


  }

  redirigir(){
    if(this.servicioUsuario.obtenerToken() != null){
      location.href = "/home"
    }
  }

  openConsultarAlarma() {
    window.location.href = "consultar-alarma";
  }

  cerrarSesion(): void {
    this.servicioUsuario.limpiarToken(); 
    window.location.href = "/home";
  }

  home(): void {
    window.location.href = "/home";
  }
}
