import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  fecha: number = Date.now();
  hora: any;

  constructor() {}

  ngOnInit(): void {
    this.mostrarHora();
  }
  mostrarHora() {
    this.hora = new Date().toLocaleString("en-US");
    setInterval(() => {
      this.hora = new Date();
    }, 1000);
  }
}
