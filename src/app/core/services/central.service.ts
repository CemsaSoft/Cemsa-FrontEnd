import { Injectable } from '@angular/core';
import { CentralClass } from '../models/central';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CentralService {
   private url: string ='https://localhost:7155/api/central';

  constructor(private http: HttpClient) { 
    console.log ("El servicio está corriendo");
  }

  obtenerCentral(): Observable<any> {
    return this.http.get(this.url);
  }
  
}
