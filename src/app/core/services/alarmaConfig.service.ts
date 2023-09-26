import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlarmaConfigClass } from '../models/alarmaConfig';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlarmaConfigService {
  private baseUrl: string = environment.baseUrl;
   private url: string =`${this.baseUrl}api/alarmaConfig`;
   //centralSeleccionada: any;

  constructor(private http: HttpClient) { 
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

  registrarAlarmaConfig(alarma: AlarmaConfigClass): Observable<any> {
    return this.http.post(this.url + '/registrarAlarmaConfig/', alarma );  
  }
  
}
