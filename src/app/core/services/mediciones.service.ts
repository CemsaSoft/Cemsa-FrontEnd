import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicionesClass } from '../models/mediciones';

@Injectable({
  providedIn: 'root'
})
export class MedicionesService {
   private url: string ='https://localhost:7155/api/mediciones';

  constructor(private http: HttpClient) { 
    console.log ("El servicio está corriendo");
  }

  obtenerMediciones(medNro: number): Observable<any> {
    return this.http.get(this.url + '/obtenerMediciones/' + medNro);
  }
  
  obtenerUltimaMedicionesXCentral(medNro: number): Observable<any> {
    return this.http.get(this.url + '/obtenerUltimaMedicionesXCentral/' + medNro);
  }
}
