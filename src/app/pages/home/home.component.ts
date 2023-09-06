import { Component, OnInit, ViewChild, ElementRef   } from '@angular/core';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  fecha: number = Date.now();
  hora: any;
  rol: any = 0;
  cambPassword: any = 0;
  @ViewChild('miModal', { static: false }) miModal: ModalComponent | null = null;
  habilitarDatoPerfil = false;
  habilitarModContrasena = false;

  constructor(
  ) {}

  ngOnInit(): void {
    this.mostrarHora();
    this.rol = localStorage.getItem('rol');

    this.cambPassword = localStorage.getItem('cambiarPassword');
    if (this.cambPassword == 0) {
      this.habilitarDatoPerfil = false;
      this.habilitarModContrasena = true;
     } else { 
      this.habilitarDatoPerfil = true;
      this.habilitarModContrasena = false;    
     }   
  }

  mostrarHora() {
    this.hora = new Date().toLocaleString("en-US");
    setInterval(() => {
      this.hora = new Date();
    }, 1000);
  }


  datoPerfil(){
    this.habilitarDatoPerfil = !this.habilitarDatoPerfil;
    this.habilitarModContrasena = !this.habilitarModContrasena;
  }
  modContr(){
    this.habilitarDatoPerfil = !this.habilitarDatoPerfil;
    this.habilitarModContrasena = !this.habilitarModContrasena;
  }
  redirigirPanel(){
    return location.href = '/consultar-paneles-monitoreo';
  }
  openModal(): void {
    if (this.miModal) {
      console.log("Entró a abrir el modal");
      this.miModal.toggle();
    }
  }

}
