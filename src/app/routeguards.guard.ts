import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from './core/services/usuario.service';


@Injectable({
  providedIn: 'root',
})
export class RouteguardsGuard implements CanActivate {
  constructor(
    private router: Router,
    private servicioUsuario: UsuarioService
  ) {}

  redirect(flag: boolean): any {
    if (!flag) {
      this.router.navigate(['/']);
    }
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let tokenboolean = this.servicioUsuario.obtenerUsuario();
    this.redirect(tokenboolean);
    return tokenboolean;
  }
}
