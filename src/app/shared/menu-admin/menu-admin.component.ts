import { Component, OnInit } from '@angular/core';

//SERVICIOS
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.css']
})
export class MenuAdminComponent implements OnInit {

  constructor(
    private servicioUsuario: UsuarioService
  ) { }


  ngOnInit(): void {
    
  }
  cerrarSesion(): void {
    this.servicioUsuario.limpiarToken();
  }

}
