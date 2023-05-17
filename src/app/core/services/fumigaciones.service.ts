import { Injectable } from '@angular/core';
import { CentralClass } from '../models/central';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
// import { CentralConsultaClass } from '../models/centralConsulta';
// import { ServicioxCentralClass } from 'src/app/core/models/serviciosxCentral';

@Injectable({
  providedIn: 'root'
})
export class FumigacionesService {
   private url: string ='https://localhost:7155/api/fumigaciones';
   fumigacionesSeleccionada: any;

  constructor(private http: HttpClient) { 
    console.log ("El servicio está corriendo");
  }

  obtenerFumigacionesDeCentral(cenNum: number): Observable<any> {
    return this.http.get(this.url + '/obtenerFumigacionesDeCentral/' + cenNum);
  }
  
}
