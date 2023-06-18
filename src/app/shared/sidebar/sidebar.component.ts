import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private servicioUsuario: UsuarioService) { }

  ngOnInit(): void {
  }
  cerrarSesion(): void {
    this.servicioUsuario.limpiarToken();
  }
}
