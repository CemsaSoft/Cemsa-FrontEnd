import { Component, OnInit } from '@angular/core';
// import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  token = localStorage.getItem('token') || null;
  rol: any = 0;


  constructor() { }
  //constructor(private servicioUsuario: UsuarioService) {}
  esActivado: boolean = false;

  ngOnInit () : void {
    this.rol = localStorage.getItem('rol');
  }

  redirigir(){
    // if(this.servicioUsuario.obtenerToken() != null){
    //   location.href = "/home"
    // }
  }
}
