import { Component, OnInit } from '@angular/core';

//SERVICIOS
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-menu-cliente',
  templateUrl: './menu-cliente.component.html',
  styleUrls: ['./menu-cliente.component.css']
})
export class MenuClienteComponent implements OnInit {

  constructor(
    private servicioUsuario: UsuarioService
  ) { }

  ngOnInit(): void {

  }
  
  cerrarSesion(): void {
    this.servicioUsuario.limpiarToken();

    localStorage.setItem('rol', "0");
    localStorage.setItem('usuario', "");
    localStorage.setItem('idUsuario', "");
    localStorage.setItem('cliente', ""); 
  }
}
