import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlarmaClass } from '../models/alarma';

@Injectable({
  providedIn: 'root'
})
export class AlarmaService {
   private url: string ='https://localhost:7155/api/alarma';
   //centralSeleccionada: any;

  constructor(private http: HttpClient) { 
  }

  obtenerAlarmasClienteModificaEstado(idUsuario: number): Observable<any> {
    return this.http.get(this.url + '/obtenerAlarmasClienteModificaEstado/' + idUsuario);
  }  
    
  obtenerCantAlarmasCliente(idUsuario: number): Observable<any> {
    return this.http.get(this.url + '/obtenerCantAlarmasCliente/' + idUsuario);
  }  
  
}
