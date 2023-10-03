import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClienteClass } from '../models/cliente';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private baseUrl: string = environment.baseUrl;
   private url: string =`${this.baseUrl}api/cliente`;
   centralSeleccionada: any;

  constructor(private http: HttpClient) { 
  }

  listaClientes(): Observable<any> {
    return this.http.get(this.url + '/listaClientes');
  }
  
  obtenerTipoDoc(): Observable<any> {
    return this.http.get(this.url + '/listaTipoDoc');
  }

  modificarEstado(accion: number, tipoDoc: number, nroDoc: string): Observable<any> {    
    const body = { accion, tipoDoc, nroDoc };
    return this.http.post(this.url + '/modificarEstado', body);     
  }

  blanquearPassword(usrID: number): Observable<any> {            
    return this.http.post(this.url + '/blanquearPassword/' + usrID, null);     
  }

  actualizarCliente(cliente: ClienteClass, usuario: string): Observable<any> {
    return this.http.post(this.url + '/actualizarCliente/' + usuario, cliente);    
  }

  registarCliente(cliente: ClienteClass, usuario: string): Observable<any> {
    return this.http.post(this.url + '/registarCliente/' + usuario, cliente);    
  }

  verificarUsuarioMod(usuario: string, idUsuario: number): Observable<any> {    
    return this.http.post(this.url + '/verificarUsuarioMod/' + usuario + "/" + idUsuario, null );   
  }

  // obtenerCliente(idUsuario: number): Observable<string> {    
  //   return this.http.post(this.url + '/obtenerCliente/' + idUsuario , null, { responseType: 'text' });   
  // }
  
  actualizarPassword(idUsuario: number, password: string, newPassword: string): Observable<any> {    
    const body = { idUsuario, password, newPassword };
    return this.http.post(this.url + '/actualizarPassword', body);     
  }

  obtenerCuenta(idUsuario: number): Observable<any> {
    return this.http.get(this.url + '/obtenerCuenta/' + idUsuario);
  }  
}
