import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { FumigacionesClass } from '../models/fumigaciones';

@Injectable({
  providedIn: 'root'
})
export class FumigacionesService {
   private url: string ='https://localhost:7155/api/fumigaciones';
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
