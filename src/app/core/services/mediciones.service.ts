import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicionesClass } from '../models/mediciones';

@Injectable({
  providedIn: 'root'
})
export class MedicionesService {
   private url: string ='https://localhost:7155/api/mediciones';

  constructor(private http: HttpClient) { 
  }

  obtenerMediciones(medNro: number, desde: Date, hasta: Date): Observable<any> {
    const params = new HttpParams()
      .set('medNro', medNro.toString())
      .set('desde', desde.toISOString())
      .set('hasta', hasta.toISOString());
  
    return this.http.get(this.url + '/obtenerMediciones', { params });
  }
  
  obtenerUltimaMedicionesXCentral(medNro: number): Observable<any> {
    return this.http.get(this.url + '/obtenerUltimaMedicionesXCentral/' + medNro);
  }
}
