import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicionesClass } from '../models/mediciones';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicionesService {
  private baseUrl: string = environment.baseUrl;
   private url: string =`${this.baseUrl}api/mediciones`;

  constructor(private http: HttpClient) { 
  }

  obtenerMediciones(medNro: number, desde: Date, hasta: Date): Observable<any> {
    const params = new HttpParams()
      .set('medNro', medNro.toString())
      .set('desde', desde.toISOString().split('T')[0])
      .set('hasta', hasta.toISOString().split('T')[0]);
  
    return this.http.get(this.url + '/obtenerMediciones', { params });
  }
  
  obtenerUltimaMedicionesXCentral(medNro: number): Observable<any> {
    return this.http.get(this.url + '/obtenerUltimaMedicionesXCentral/' + medNro);
  }
}
