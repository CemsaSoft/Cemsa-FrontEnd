import { Component, OnInit } from '@angular/core';

//SERVICIOS
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ClienteService } from 'src/app/core/services/cliente.service';

@Component({
  selector: 'app-menu-usuario',
  templateUrl: './menu-usuario.component.html',
  styleUrls: ['./menu-usuario.component.css']
})
export class MenuUsuarioComponent implements OnInit {
  usuario: any = 0;
  cliente: any = 0;
  idUsuario: any = 0;

  constructor(
    private servicioUsuario: UsuarioService,
    private servicioCliente: ClienteService,
  ) { }

  ngOnInit(): void {
    this.usuario = localStorage.getItem('usuario');
    this.idUsuario = localStorage.getItem('idUsuario');    
    this.cliente = localStorage.getItem('cliente');    
  }

  cerrarSesion(): void {
    this.servicioUsuario.limpiarToken();

    localStorage.setItem('rol', "0");
    localStorage.setItem('usuario', "");
    localStorage.setItem('idUsuario', "");
    localStorage.setItem('cliente', "");  
  }
}
