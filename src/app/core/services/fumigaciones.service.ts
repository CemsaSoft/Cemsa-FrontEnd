import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { FumigacionesClass } from '../models/fumigaciones';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FumigacionesService {
  private baseUrl: string = environment.baseUrl;
   private url: string =`${this.baseUrl}api/fumigaciones`;
   fumigacionesSeleccionada: any;

  constructor(private http: HttpClient) { 
  }

  obtenerFumigacionesDeCentral(cenNum: number): Observable<any> {
    return this.http.get(this.url + '/obtenerFumigacionesDeCentral/' + cenNum);
  }
  
  eliminarFumigacion(fumId: number): Observable<any> {
    return this.http.delete(this.url + '/eliminarFumigacion/' + fumId);   
  }

  modificarFumigacion(fumigacion: FumigacionesClass): Observable<any> {
    return this.http.post(this.url + '/modificarFumigacion/', fumigacion );  
  }

  registrarFumigacion(fumigacion: FumigacionesClass): Observable<any> {
    return this.http.post(this.url + '/registrarFumigacion/', fumigacion);
  }
}
