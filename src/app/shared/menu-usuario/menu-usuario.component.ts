import { Component, OnInit } from '@angular/core';

//SERVICIOS
import { UsuarioService } from 'src/app/core/services/usuario.service';

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
  ) { }

  ngOnInit(): void {
    this.usuario = localStorage.getItem('usuario');
    this.cliente = localStorage.getItem('cliente');
    this.idUsuario = localStorage.getItem('idUsuario');      
  }

  cerrarSesion(): void {
    this.servicioUsuario.limpiarToken();
  }
}
