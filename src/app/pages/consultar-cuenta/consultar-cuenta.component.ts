//SISTEMA
import { JsonpClientBackend } from '@angular/common/http';
import { Component, OnInit, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';

//COMPONENTES
import { ClienteClass } from 'src/app/core/models/cliente';
import { ClienteConsultaClass } from 'src/app/core/models/clienteConsulta';

//SERVICIOS
import { ClienteService } from 'src/app/core/services/cliente.service';

@Component({
  selector: 'app-consultar-cuenta',
  templateUrl: './consultar-cuenta.component.html',
  styleUrls: ['./consultar-cuenta.component.css']
})
export class ConsultarCuentaComponent implements OnInit {

  //VARIABLES DE OBJETOS LIST
  Cuenta: ClienteConsultaClass[] = [];
  // ClientesFiltrados: ClienteConsultaClass[] = [];

  //VARIABLES DE DATOS
  caracteresValidosCliente: string =
  "La primera letra del Nombre del Cliente debe ser Mayúscula, más de 3 caracteres y no se admiten caracteres especiales: / ! # $ % & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
  caracteresValidosUsuario: string =
  "El Nombre del Usuario debe tener más de 3 caracteres y no se admiten caracteres especiales: / ! # $ % & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
  caracteresValidosEmail: string =
  "Ingrese un correo electrónico válido. Los caracteres permitidos son letras, números, puntos, guiones y guiones bajos.";
  telefonoValido: string =
  "Ingrese un número de teléfono válido. Los formatos permitidos son: '1234567890', '123-4567890', '1234-567890' o '1234-56-7890'";

  idUsuario: any = 0;

  habilitarModCuenta = false;

  //FORMULARIOS DE AGRUPACION DE DATOS
  formModificar: FormGroup;

  constructor(
    private clienteConsultar: ClienteService,    
  ) { 
    this.formModificar = new FormGroup({
      tipoDocumento: new FormControl(null, []),
      nroDoc: new FormControl(null, []),
      cliApeNomDen: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9 ]*$'),
        Validators.pattern('^[A-Z].*$')
      ]),
      usuario: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9 ]*$'),        
      ]),     
      email: new FormControl(null, [
        Validators.email,
        Validators.maxLength(30),
      ]),
      telefono: new FormControl(null, [Validators.pattern(/^[\d]{2,4}-?[\d]{6,8}$/)]),
    });
  }

  ngOnInit(): void {

    this.idUsuario = localStorage.getItem('idUsuario');
    this.clienteConsultar.obtenerCuenta(this.idUsuario).subscribe(data => {
      this.Cuenta = data;
      this.tipoDocumento = this.Cuenta[0].tdDescripcion;
      this.nroDoc = this.Cuenta[0].cliNroDoc;
      this.cliApeNomDen = this.Cuenta[0].cliApeNomDen;
      this.usuario = this.Cuenta[0].usuario;
      this.email = this.Cuenta[0].cliEmail;
      this.telefono = this.Cuenta[0].cliTelefono;
    })
  }

  set tipoDocumento(valor: any) {
    this.formModificar.get('tipoDocumento')?.setValue(valor);
  }
  set nroDoc(valor: any) {
    this.formModificar.get('nroDoc')?.setValue(valor);
  }
  set cliApeNomDen(valor: any) {
    this.formModificar.get('cliApeNomDen')?.setValue(valor);
  }
  set usuario(valor: any) {
    this.formModificar.get('usuario')?.setValue(valor);
  }
  set email(valor: any) {
    this.formModificar.get('email')?.setValue(valor);
  }
  set telefono(valor: any) {
    this.formModificar.get('telefono')?.setValue(valor);
  }
  
  get tipoDocumentoç() {
    return this.formModificar.get('tipoDocumento');
  }
  get nroDoc() {
    return this.formModificar.get('nroDoc');
  }
  get cliApeNomDen() {
    return this.formModificar.get('cliApeNomDen');
  }
  get usuario() {
    return this.formModificar.get('usuario');
  }
  get email() {
    return this.formModificar.get('email');
  }
  get telefono() {
    return this.formModificar.get('telefono');
  }

  modificarCuenta(): void { 
    //Verifica que este completo el formulario y que no tenga errores.
    if (this.formModificar.valid == false) {      
      Swal.fire({
        title: 'Error',
        text: 'Verificar los datos ingresados.',              
            
        icon: 'warning',
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
        footer: 'Por favor, corrija los errores e inténtelo de nuevo.'
      });     
    } else {
      const usuario = this.formModificar.get('usuario')?.value;        
      this.clienteConsultar.verificarUsuarioMod(usuario, this.idUsuario).subscribe(
        result => {
          let Cliente: ClienteClass = new ClienteClass(
            this.Cuenta[0].cliTipoDoc,
            this.Cuenta[0].cliNroDoc,
            this.Cuenta[0].cliIdUsuario,
            this.Cuenta[0].cliFechaAlta,
            this.Cuenta[0].fechaBaja,
            this.formModificar.get('cliApeNomDen')?.value,
            this.formModificar.get('email')?.value,
            this.formModificar.get('telefono')?.value,
          );        
          this.clienteConsultar.actualizarCliente(Cliente, usuario).subscribe(
            result => {
              Swal.fire({
                text: 'Se ha actualizado el Usuario: '+ this.formModificar.get('usuario')?.value,
                icon: 'success',
                position: 'center',
                showConfirmButton: true,
                confirmButtonColor: '#0f425b',
                confirmButtonText: 'Aceptar',
              } as SweetAlertOptions).then((result) => {
                if (result.value == true) {
                  localStorage.setItem('usuario', usuario);
                  localStorage.setItem('cliente', this.formModificar.get('cliApeNomDen')?.value);   
                  return location.reload();
                }
              });
            },
            error => {
              Swal.fire({
                text: 'No es posible Actualizar el Cliente',
                icon: 'error',
                position: 'center',
                showConfirmButton: true,
                confirmButtonColor: '#0f425b',
                confirmButtonText: 'Aceptar',
              } as SweetAlertOptions);    
            }
          );
        },
        error => {
          Swal.fire({
            text: error.error,
            icon: 'error',
            position: 'center',
            showConfirmButton: true,
            confirmButtonColor: '#0f425b',
            confirmButtonText: 'Aceptar',
          } as SweetAlertOptions);    
        }
      );
    }
  }

  habilitarModificarCuenta(): void { 
    this.habilitarModCuenta = !this.habilitarModCuenta;
    this.clienteConsultar.obtenerCuenta(this.idUsuario).subscribe(data => {
      this.Cuenta = data;
      this.tipoDocumento = this.Cuenta[0].tdDescripcion;
      this.nroDoc = this.Cuenta[0].cliNroDoc;
      this.cliApeNomDen = this.Cuenta[0].cliApeNomDen;
      this.usuario = this.Cuenta[0].usuario;
      this.email = this.Cuenta[0].cliEmail;
      this.telefono = this.Cuenta[0].cliTelefono;
    })
  }
}
