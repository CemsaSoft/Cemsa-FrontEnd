import { Component } from '@angular/core';
import { UsuarioService } from './core/services/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { 
  title = 'Cemsa-FrontEnd';
  constructor(private servicioUsuario : UsuarioService){

  }
  validarIngreso():boolean{
    if(this.servicioUsuario.obtenerUsuario() == true){
      return true;
    }
    else{
      return false;
    }
  }
}
