import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/core/services/usuario.service';

import * as bootstrap from 'bootstrap';

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


  toggleCollapse(targetId: string): void {
    const collapses = document.querySelectorAll('.collapse');
    
    collapses.forEach(collapse => {
      const bsCollapse = new bootstrap.Collapse(collapse, { toggle: false });
      if (collapse.id === targetId) {
        bsCollapse.show(); // Mostrar el elemento seleccionado
      } else {
        bsCollapse.hide(); // Ocultar los demás elementos
      }
    });
  }
  
  
  
}
