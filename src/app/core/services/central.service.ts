import { Injectable } from '@angular/core';
import { CentralClass } from '../models/central';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CentralConsultaClass } from '../models/centralConsulta';
import { ServicioxCentralClass } from 'src/app/core/models/serviciosxCentral';

@Injectable({
  providedIn: 'root'
})
export class CentralService {
   private url: string ='https://localhost:7155/api/central';
   centralSeleccionada: any;

  constructor(private http: HttpClient) { 
     }

  obtenerCentral(): Observable<any> {
    return this.http.get(this.url + '/listaCentrales');
  }

  listaCentralesCliente(idUsuario: number): Observable<any> {
    return this.http.get(this.url + '/obtenerCentralCliente/' + idUsuario);
  }
  
  modificarEstado(cenNum: number, idEstado: number): Observable<any> {
    return this.http.post(this.url + '/' + cenNum + '/' + idEstado, null);    
  }
  
  VerificarImei(cenImei: string, cenNum: number): Observable<any> {
    return this.http.post(this.url + '/verificarImei/' + cenImei + '/' + cenNum , null);    
  }

  obtenerEstadoCentral(): Observable<any> {
    return this.http.get(this.url + '/listaEstadosCentrales') ;
  }

  enviarCentralSeleccionada(central: CentralConsultaClass):void{
    this.centralSeleccionada=central;
    //console.log("Llegó al servicio enviar Central y los datos son:")
    //console.log(central)
  }
  
  recibirCentralSeleccionado():Observable<any>{
    return this.centralSeleccionada;    
  }
  
  obtenerServicioXCentral(cenNum: number): Observable<any> {
    return this.http.get(this.url + '/obtenerServicioXCentral/' + cenNum) ;
  }

  obtenerServicioXCentralEstado(cenNum: number): Observable<any> {
    return this.http.get(this.url + '/obtenerServicioXCentralEstado/' + cenNum) ;
  }
  
  actualizarDatosCentral(cenNum: number, cenImei: string, cenCoorX: string, cenCoorY:string): Observable<any> {
    return this.http.post(this.url + '/actualizarDatosCentral/' + cenNum + '/' + cenImei + '/' + cenCoorX + '/' + cenCoorY, null) ;
  }

  registrarCentral(central: CentralClass): Observable<any> {
    return this.http.post(this.url + '/registrarCentral/', central) ;    
  }

  registrarServiciosCentral(serviciosAgregar: ServicioxCentralClass[]): Observable<any> {    
    return this.http.post(this.url + '/registrarServiciosCentral/', serviciosAgregar) ;    
  }

  listaClientes(): Observable<any> {
    return this.http.get(this.url + '/listaClientes');
  }

  serviciosXCentralCompleto(cenNum: number): Observable<any> {
    return this.http.get(this.url + '/serviciosXCentralCompleto/' + cenNum) ;
  }

  actualizarServiciosCentral(serviciosActualizar: ServicioxCentralClass[]): Observable<any> {    
    return this.http.post(this.url + '/actualizarServiciosCentral/', serviciosActualizar) ;    
  }
}
