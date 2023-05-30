import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
//import { AlarmaConfigClass } from '../models/alarmaConfig';

@Injectable({
  providedIn: 'root'
})
export class AlarmaService {
   private url: string ='https://localhost:7155/api/alarma';
   //centralSeleccionada: any;

  constructor(private http: HttpClient) { 
    console.log ("El servicio está corriendo");
  }

  obtenerAlarmasCliente(idUsuario: number): Observable<any> {
    return this.http.get(this.url + '/obtenerAlarmasCliente/' + idUsuario);
  }  
  
  
}
