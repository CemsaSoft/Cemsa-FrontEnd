import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthInterceptorService } from './core/interceptors/auth-interceptor.service';
import { UsuarioService } from './core/services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class NoLoginGuard implements CanActivate {

  constructor(private authService: AuthInterceptorService, private router: Router, private servicioUsuario: UsuarioService) {}

  canActivate(): boolean {
    console.log("Esta saliendo")
    if (this.servicioUsuario.obtenerUsuario() ==null) {
      return true; // El usuario no ha iniciado sesión, permitir el acceso a la página
    } else {
      this.router.navigate(['./pages/ingresar-usuario']); // El usuario ha iniciado sesión, redirigir a otra página
      return false;
    }
  }
}