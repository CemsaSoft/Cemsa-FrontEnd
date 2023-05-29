import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlarmaConfigClass } from '../models/alarmaConfig';

@Injectable({
  providedIn: 'root'
})
export class AlarmaConfigService {
   private url: string ='https://localhost:7155/api/alarmaConfig';
   //centralSeleccionada: any;

  constructor(private http: HttpClient) { 
    console.log ("El servicio está corriendo");
  }

  obtenerAlarmaConfigDeCentral(cfgNro: number): Observable<any> {
    return this.http.get(this.url + '/obtenerAlarmaConfigDeCentral/' + cfgNro);
  }  
  
  modificarEstado(accion: number, cfgId: number ): Observable<any> {    
    return this.http.post(this.url + '/modificarEstado/' + accion + "/" +  cfgId, null);     
  }
  
  modificarAlarmaConfig(alarma: AlarmaConfigClass): Observable<any> {
    return this.http.post(this.url + '/modificarAlarmaConfig/', alarma );  
  }

}
