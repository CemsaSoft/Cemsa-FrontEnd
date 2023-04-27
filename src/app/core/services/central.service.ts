import { Injectable } from '@angular/core';
import { CentralClass } from '../models/central';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CentralConsultaClass } from '../models/centralConsulta';

@Injectable({
  providedIn: 'root'
})
export class CentralService {
   private url: string ='https://localhost:7155/api/central';
   centralSeleccionada: any;

  constructor(private http: HttpClient) { 
    console.log ("El servicio está corriendo");
  }

  obtenerCentral(): Observable<any> {
    return this.http.get(this.url + '/listaCentrales');
  }
  
  modificarEstado(cenNum: number, idEstado: number): Observable<any> {
    return this.http.post(this.url + '/' + cenNum + '/' + idEstado, null);    
  }
  
  obtenerEstadoCentral(): Observable<any> {
    return this.http.get(this.url + '/listaEstadosCentrales') ;
  }
  enviarCentralSeleccionada(central: CentralConsultaClass):void{
    this.centralSeleccionada=central;
    console.log("Llegó al servicio enviar Central y los datos son:")
    console.log(central)
  }
  recibirPrestamoSeleccionado():Observable<any>{
    console.log("Llegó al servicio enviar Central y los datos son:")
    console.log(this.centralSeleccionada)
    return this.centralSeleccionada;
    
  }
}
