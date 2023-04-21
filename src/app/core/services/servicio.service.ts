import { Injectable } from '@angular/core';
import { ServicioClass } from '../models/servicio';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
   private url: string ='https://localhost:7155/api/servicios';

  constructor(private http: HttpClient) { 
    console.log ("El servicio está corriendo");
  }

  obtenerServicios(): Observable<any>{
    return this.http.get(this.url);
  }
  obtenerServiciosPorId(id: number): Observable<any>{
    return this.http.get(this.url + '/' + id);
  }
  
}
