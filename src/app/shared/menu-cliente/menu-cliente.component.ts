import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// SERVICIOS
import { UsuarioService } from 'src/app/core/services/usuario.service';

@Component({
  selector: 'app-menu-cliente',
  templateUrl: './menu-cliente.component.html',
  styleUrls: ['./menu-cliente.component.css']
})
export class MenuClienteComponent implements OnInit {

  constructor(
    private router: Router,
    private servicioUsuario: UsuarioService
  ) { }

  ngOnInit(): void {

  }
  
  cerrarSesion(): void {
    this.servicioUsuario.limpiarToken();
    this.router.navigate(['/src/app/pages/consultar-alarma-config']);
  }
}