import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private nombreUsuarioSource = new BehaviorSubject<string>('');
  nombreUsuario$ = this.nombreUsuarioSource.asObservable();
  
  constructor() { 
    
  }
  setNombreUsuario(nombre: string) {
    this.nombreUsuarioSource.next(nombre);
  }
}
