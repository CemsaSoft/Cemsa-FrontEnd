//SISTEMA
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//COMPONENTES
import { UsuarioClass } from 'src/app/core/models/usuario';

//SERVICIOS
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ClienteService } from 'src/app/core/services/cliente.service';

@Component({
  selector: 'app-ingresar-usuario',
  templateUrl: './ingresar-usuario.component.html',
  styleUrls: ['./ingresar-usuario.component.css'],
})
export class IngresarUsuarioComponent implements OnInit {
  //VARIABLES DE DATOS
  esInicioValido: number = 0;

  //FORMS PARA LA AGRUPACIÓN DE DATOS
  formInicio: FormGroup;

  constructor(
    private fb: FormBuilder,
    private servicioUsuario: UsuarioService,
    private servicioCliente: ClienteService,
  ) {
    this.formInicio = this.fb.group({
      usuario: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  get usuario() {
    return this.formInicio.get('usuario');
  }

  get password() {
    return this.formInicio.get('password');
  }

  ngOnInit(): void {}

  //Consulta la Base de Datos para verificar que el usuario que se esta
  //logeando sea un usuario valido y devuelve un token en tal caso.
  login(): any {
    let usuario: UsuarioClass = {id: 0, usuario: this.formInicio.get('usuario')?.value, password: this.formInicio.get('password')?.value};
    this.servicioUsuario.iniciarSesion(usuario).subscribe((data) => {
      if (data.result != '') {
        this.servicioUsuario.limpiarToken();
        this.servicioUsuario.guardarToken(data.result);
        localStorage.setItem('rol', data.rol);         // 0 es cliente -- 1 es administrador    
        localStorage.setItem('usuario', data.usu);
        localStorage.setItem('idUsuario', data.idUsuario);
        localStorage.setItem('cliente', data.cliente);
            
        this.esInicioValido = 1;
      } else {
        this.esInicioValido = 2;
      }
    });
  }

  //Redirecciona a la landing page en caso de obtener un token.
  redireccionar(): string {
     let localToken = this.servicioUsuario.obtenerToken();
     if (localToken != null && localToken != '') {
       return (location.href = '/home');
     } else {
       return '';
     }
  }

  //Valida que el usuario y la contraseña ingresada sean correctas.
  validarIngresar(usuario: string, contraseña: string): Boolean {
    if (usuario != '' && contraseña != '' && usuario && contraseña != null) {
      return true;
    } else {
      return false;
    }
  }
}
