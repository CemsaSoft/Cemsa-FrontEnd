import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioClass } from '../models/usuario';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode'; // npm i jwt-decode
import * as moment from 'moment'; // npm i moment

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  token: string = '';
  url: string = 'https://localhost:7155/usuario';

  constructor(private http: HttpClient) {}

  iniciarSesion(usuario: UsuarioClass): Observable<any> {
    return this.http.post(this.url + '/login', usuario);
  }

  guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  obtenerToken(): any {
    return localStorage.getItem('token');
  }

  limpiarToken(): void {
    localStorage.removeItem('token');
  }

  obtenerUsuario(): boolean {
    const token = this.obtenerToken();
    let tokenboolean = token != null ? true : false;
    let usuario: any;

    if (tokenboolean) {
      const info = jwt_decode(token) as any;
      usuario = {
        usuario: info.usuario,
        expires: moment(new Date(0).setUTCSeconds(info.exp)).toDate() as Date,
      };

      const expiracion = moment(usuario.expires);
      const diff = expiracion.diff(moment(), 'seconds');

      if (diff <= 0) {
        tokenboolean = false;
        this.limpiarToken();
      }
    }
    return tokenboolean;
  }

  recuperarPassword(usuario: string , email: string): Observable<any> {
    return this.http.get(this.url + '/recuperarPassword/'+ usuario + "/" + email);
  }
}
