import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-sidebar-cliente',
  templateUrl: './sidebar-cliente.component.html',
  styleUrls: ['./sidebar-cliente.component.css']
})
export class SidebarClienteComponent implements OnInit {

  constructor(private servicioUsuario:UsuarioService) { }

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
