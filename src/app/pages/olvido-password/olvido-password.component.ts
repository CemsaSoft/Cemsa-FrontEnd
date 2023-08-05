//SISTEMA
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';

//COMPONENTES
import { UsuarioClass } from 'src/app/core/models/usuario';

//SERVICIOS
import { UsuarioService } from 'src/app/core/services/usuario.service';


@Component({
  selector: 'app-olvido-password',
  templateUrl: './olvido-password.component.html',
  styleUrls: ['./olvido-password.component.css']
})
export class OlvidoPasswordComponent implements OnInit {
  //VARIABLES DE DATOS
  caracteresValidosUsuario: string =
  "El Nombre del Usuario debe tener más de 3 caracteres y no se admiten caracteres especiales: / ! # $ % & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
  caracteresValidosEmail: string =
  "Ingrese un correo electrónico válido. Los caracteres permitidos son letras, números, puntos, guiones y guiones bajos.";
 
  //FORMS PARA LA AGRUPACIÓN DE DATOS
  formOlividoPassword: FormGroup;

  constructor(
    private servicioUsuario: UsuarioService,
  ) { 
    this.formOlividoPassword = new FormGroup({
      usuario: new FormControl (null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      email: new FormControl(null, [
        Validators.email,
        Validators.maxLength(30),
      ]),
    });
  }

  ngOnInit(): void {
  }

  get usuario() {
    return this.formOlividoPassword.get('usuario');
  }  
  get email() {
    return this.formOlividoPassword.get('email');
  }

  //Redirecciona home
  redireccionar(): string {
    return (location.href = '/home');
  }

  enviarMail() {
    const usuario = this.formOlividoPassword.get('usuario')?.value;
    const email = this.formOlividoPassword.get('email')?.value;
  
    if (this.formOlividoPassword.valid == false) {
      Swal.fire({
        title: 'Error',
        text: `Verificar los datos ingresados`,              
        icon: 'warning',
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
        footer: 'Por favor, corrija los errores e inténtelo de nuevo.'
      });     
    } else {
      this.servicioUsuario.recuperarPassword(usuario, email)
        .subscribe(
          (response) => {
            if (response === 'Se envio Email y se blanqueo la Contraseña') {
              Swal.fire('Éxito', 'Se ha cambiado la contraseña. Por favor, revise su correo electrónico para obtener la nueva contraseña. Asegúrese de verificar también la carpeta de spam o correo no deseado.', 'success').then(() => {
                location.href = '/home';
              });
            } else if (response === 'Usuario y Mail no encontrado') {
              Swal.fire('Error', 'Usuario o correo electrónico no encontrados.', 'error');
            } else {
              Swal.fire('Error', 'No se pudo enviar el correo electrónico.', 'error');
            }
          },
          (error) => {
            Swal.fire('Error', 'Usuario o correo electrónico no encontrados.', 'error');
          }
        );
    }
  }
  
  //Valida que el usuario y la email ingresada sean correctas.
  validarIngresar(usuario: string, email: string): Boolean {
    if (usuario != '' && email != '' && usuario && email != null) {
      return true;
    } else {
      return false;
    }
  }
}
