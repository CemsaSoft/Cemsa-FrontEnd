import { Injectable } from '@angular/core';
import { ServicioClass } from '../models/servicio';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private baseUrl: string = environment.baseUrl;
   private url: string = `${this.baseUrl}api/servicios`;

  constructor(private http: HttpClient) { 
  }

  obtenerServicios(): Observable<any> {
    return this.http.get(this.url);
  }

  obtenerServiciosPorId(id: number): Observable<any> {
    return this.http.get(this.url + '/' + id);
  }

  eliminarServicio(serId: number): Observable<any> {
    return this.http.delete(this.url + '/' + serId);   
  }
  
  modificarServicio(serId: number, servicio: ServicioClass): Observable<any> {
    return this.http.post(this.url + '/' + serId, servicio);  
  }

  guardarServicio(servicio: ServicioClass): Observable<any> {
    return this.http.post(this.url, servicio);
  }
  
}
