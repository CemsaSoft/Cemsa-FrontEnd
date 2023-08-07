//SISTEMA
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import Swal, { SweetAlertOptions } from 'sweetalert2';

//SERVICIOS
import { ClienteService } from 'src/app/core/services/cliente.service';

@Component({
  selector: 'app-modificar-password',
  templateUrl: './modificar-password.component.html',
  styleUrls: ['./modificar-password.component.css']
})
export class ModificarPasswordComponent implements OnInit {
  
  //VARIABLES DE DATOS
  usu: any = 0;
  cliente: any = 0;
  idUsuario: any = 0;
  modPassword: any = 0;

  //FORMS PARA LA AGRUPACIÓN DE DATOS
  formPassword: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clienteConsultar: ClienteService,
  ) {
    this.formPassword = this.fb.group({
      usuario: new FormControl(null, []),
      password: [null, [Validators.required]],
      newPassword: [null, [
        Validators.required, 
        Validators.pattern(/^(?!.*123456).*$/)
      ]],
      confPassword: [null, [Validators.required]],
    });
  }

  matchPasswords(): boolean {
    const newPassword = this.formPassword.get('newPassword')?.value;
    const confPassword = this.formPassword.get('confPassword')?.value;

    if (newPassword && confPassword && newPassword.trim().length > 0 && confPassword.trim().length > 0 && newPassword !== confPassword) {
      return true;
    }
    return false;
  }

  ngOnInit(): void {
    this.usu = localStorage.getItem('usuario');
    this.cliente = localStorage.getItem('cliente');
    this.idUsuario = localStorage.getItem('idUsuario');    

    this.usuario = this.usu;

    this.modPassword = localStorage.getItem('cambiarPassword');
    if (this.modPassword==="1")
    {
      Swal.fire({
        title: 'Advertencia',
        text: 'Es necesario cambiar la contraseña.',
        icon: 'warning',
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
        footer: 'Por favor, cambie su contraseña.'
      });
    }

  }

  set usuario(valor: any) {
    this.formPassword.get('usuario')?.setValue(valor);
  }
  set password(valor: any) {
    this.formPassword.get('password')?.setValue(valor);
  }
  set newPassword(valor: any) {
    this.formPassword.get('newPassword')?.setValue(valor);
  }
  set confPassword(valor: any) {
    this.formPassword.get('confPassword')?.setValue(valor);
  }
  
  get usuario() {
    return this.formPassword.get('usuario');
  }
  get password() {
    return this.formPassword.get('password');
  }
  get newPassword() {
    return this.formPassword.get('newPassword');
  }
  get confPassword() {
    return this.formPassword.get('confPassword');
  }

  validarCambPass(password: string, newPassword: string, confPassword: string): Boolean {
    if (password != '' && newPassword != '' && confPassword != '' && password && newPassword && confPassword != null) {    
      return true;
    } else {
      return false;
    }
  }

  cambiarPassword(): void {
    //Verifica que este completo el formulario y que no tenga errores.
    if (!this.formPassword?.valid || this.matchPasswords()) {      
      Swal.fire({
        title: 'Error',
        text: `Verificar los datos ingresados`,              
        icon: 'warning',
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
        footer: 'Por favor, corrija los errores e inténtelo de nuevo.'
      });     
    } else {

      this.clienteConsultar.actualizarPassword(this.idUsuario,this.formPassword.get('password')?.value, this.formPassword.get('newPassword')?.value).subscribe(
        result => {
          Swal.fire({
            text: 'Se ha actualizado el Password del Usuario: '+ this.usu,
            icon: 'success',
            position: 'center',
            showConfirmButton: true,
            confirmButtonColor: '#0f425b',
            confirmButtonText: 'Aceptar',
          } as SweetAlertOptions).then((result) => {
            if (result.value == true) {
              localStorage.setItem('cambiarPassword', "0");
              location.href = '/home'; // Redireccionar al usuario a la página de inicio
            }
          });
        },
        error => {
          if (error.status === 400 && error.error === "La contraseña no son válidos") {
            Swal.fire({
              text: 'La contraseña no es válida',
              icon: 'error',
              position: 'center',
              showConfirmButton: true,
              confirmButtonColor: '#0f425b',
              confirmButtonText: 'Aceptar',
            } as SweetAlertOptions);
          } else {
            Swal.fire({
              text: 'No es posible Actualizar el Password',
              icon: 'error',
              position: 'center',
              showConfirmButton: true,
              confirmButtonColor: '#0f425b',
              confirmButtonText: 'Aceptar',
            } as SweetAlertOptions);    
          }
        }
      )  

    }
  }
}
