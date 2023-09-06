import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() titulo: string = '';
  private isOpen: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }
 // Método para abrir/cerrar el modal
 toggle(): void {
  this.isOpen = !this.isOpen;
  const modalElement = document.getElementById('staticBackdrop'); // Obtén el elemento del modal por su ID

  if (this.isOpen) {
    // Abre el modal utilizando Bootstrap
    if (modalElement) {
      modalElement.classList.add('show');
    }
  } else {
    // Cierra el modal utilizando Bootstrap
    if (modalElement) {
      modalElement.classList.remove('show');
    }
  }
}
}