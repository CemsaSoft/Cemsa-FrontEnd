import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClienteClass } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
   private url: string ='https://localhost:7155/api/cliente';
   centralSeleccionada: any;

  constructor(private http: HttpClient) { 
    console.log ("El servicio está corriendo");
  }

  listaClientes(): Observable<any> {
    return this.http.get(this.url + '/listaClientes');
  }

}
