//SISTEMA
import { JsonpClientBackend } from '@angular/common/http';
import { Component, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';

//COMPONENTES
import { ClienteClass } from 'src/app/core/models/cliente';
//import { ClienteConsultaClass } from 'src/app/core/models/clienteConsulta';
import { TipoDocumentoClass } from 'src/app/core/models/tipoDocumento';

//SERVICIOS
import { ClienteService } from 'src/app/core/services/cliente.service';

@Component({
  selector: 'app-registrar-cliente',
  templateUrl: './registrar-cliente.component.html',
  styleUrls: ['./registrar-cliente.component.css']
})
export class RegistrarClienteComponent implements OnInit {

  //VARIABLES DE OBJETOS LIST
  TipoDocumento: TipoDocumentoClass[] = [];

  //VARIABLES DE DATOS
  numerosValidos: string = 'Solo se admiten 15 números';  
  caracteresValidosCliente: string =
  "La primera letra del Nombre del Cliente debe ser Mayúscula, más de 3 caracteres y no se admiten caracteres especiales: / ! # $ % & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
  caracteresValidosUsuario: string =
  "El Nombre del Usuario debe tener más de 3 caracteres y no se admiten caracteres especiales: / ! # $ % & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
  caracteresValidosEmail: string =
  "Ingrese un correo electrónico válido. Los caracteres permitidos son letras, números, puntos, guiones y guiones bajos.";
  telefonoValido: string =
  "Ingrese un número de teléfono válido. Los formatos permitidos son: '1234567890', '123-4567890', '1234-567890' o '1234-56-7890'";
  msjErrorDoc: string = "";
  
  //FORMULARIOS DE AGRUPACION DE DATOS
  formRegistar: FormGroup;

  constructor(
    private clienteConsultar: ClienteService,    
  ) { 
    this.formRegistar = new FormGroup({
      tipoDocumento: new FormControl(null, []),
      nroDocumento: new FormControl(null, []),
      cliApeNomDen: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z0-9 ]*$'),
        Validators.pattern('^[A-Z].*$')
      ]),
      usuario: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z0-9 ]*$'),
      ]),    
      email: new FormControl(null, [Validators.email]),
      telefono: new FormControl(null, [Validators.pattern(/^[\d]{2,4}-?[\d]{6,8}$/)]),
    });
  }

  ngOnInit(): void {
    this.clienteConsultar.obtenerTipoDoc().subscribe(data => {
      this.TipoDocumento = data;  
      this.tipoDocumento = this.TipoDocumento.reduce((min, current) => current.tdId < min ? current.tdId : min, this.TipoDocumento[0].tdId);
    })
  }

  set tipoDocumento(valor: any) {
    this.formRegistar.get('tipoDocumento')?.setValue(valor);
  }
  set nroDocumento(valor: any) {
    this.formRegistar.get('nroDocumento')?.setValue(valor);
  }
  set nroDoc(valor: any) {
    this.formRegistar.get('nroDoc')?.setValue(valor);
  }
  set cliApeNomDen(valor: any) {
    this.formRegistar.get('cliApeNomDen')?.setValue(valor);
  }
  set usuario(valor: any) {
    this.formRegistar.get('usuario')?.setValue(valor);
  }
  set email(valor: any) {
    this.formRegistar.get('email')?.setValue(valor);
  }
  set telefono(valor: any) {
    this.formRegistar.get('telefono')?.setValue(valor);
  }
  
  get tipoDocumento() {
    return this.formRegistar.get('tipoDocumento');
  }
  get nroDocumento() {
    return this.formRegistar.get('nroDocumento');
  }
  get nroDoc() {
    return this.formRegistar.get('nroDoc');
  }
  get cliApeNomDen() {
    return this.formRegistar.get('cliApeNomDen');
  }
  get usuario() {
    return this.formRegistar.get('usuario');
  }
  get email() {
    return this.formRegistar.get('email');
  }
  get telefono() {
    return this.formRegistar.get('telefono');
  }

  validarNumeroDocumento(): boolean {
    let tipoDoc: number = this.formRegistar.get('tipoDocumento')?.value;
    let nroDoc: string = this.formRegistar.get('nroDocumento')?.value;
    if (!nroDoc) {       
      return true;
    }    
    else{
      if (tipoDoc == 1) { // DNI    
          const regexDNI = /^[0-9]{7,8}$/;  
          this.msjErrorDoc = "Número de DNI no valido, se espera 7 ó 8 número";       
          return regexDNI.test(nroDoc);                         
      } 
      if (tipoDoc==2){ // Libreta cívica 
        const regexLib = /^[a-zA-Z]{1}[0-9]{6,7}$/;
        this.msjErrorDoc = "Libreta cívica no valido, comenzando con una letra seguida de 6 o 7 números";
        return regexLib.test(nroDoc);         
      }
      if (tipoDoc==3){ // Libreta de enrolamiento
        const regexLib = /^[a-zA-Z]{1}[0-9]{6,7}$/;
        this.msjErrorDoc = "Libreta de enrolamiento no valido, comenzando con una letra seguida de 6 o 7 números";
        return regexLib.test(nroDoc);         
      }
      if (tipoDoc==4) { // CUIT
        const regexCUIT = /^(\d{2}-\d{8}-\d{1})$/;
        this.msjErrorDoc = "CUIT no valido, comenzando con dos dígitos del prefijo y luego un guión, seguido del número de  'persona física' o 'representante legal de la sociedad' (8 dígitos), guión y otro número";
        return regexCUIT.test(nroDoc);   
      }   
      if (tipoDoc==5) { // CUIL
        const regexCUIL = /^(\d{2}-\d{8}-\d{1})$/;
        this.msjErrorDoc = "CUIL no valido, comenzando con dos dígitos del prefijo y luego un guión, seguido del número del DNI (8 dígitos), guión y otro número";
        return regexCUIL.test(nroDoc);   
      }
      return false;
    }
  }
  
  registarCliente(): void {
    if (this.formRegistar.valid == false || !this.validarNumeroDocumento()) {      
      Swal.fire({
        title: 'Error',
        text: 'Verificar los datos ingresados.',              
        icon: 'warning',
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
        footer: 'Por favor, corrija los errores e inténtelo de nuevo.'
      });     
    } else {
      let Cliente: ClienteClass = new ClienteClass(
        this.formRegistar.get('tipoDocumento')?.value,
        this.formRegistar.get('nroDocumento')?.value,
        0,
        new Date(),      
        new Date(),   
        this.formRegistar.get('cliApeNomDen')?.value,
        this.formRegistar.get('email')?.value,
        this.formRegistar.get('telefono')?.value,
      );          
      this.clienteConsultar.registarCliente(Cliente, this.formRegistar.get('usuario')?.value).subscribe(
        result => {
          Swal.fire({
            text: 'Se ha Registrado el Cliente: '+ this.formRegistar.get('cliApeNomDen')?.value,
            icon: 'success',
            position: 'top',
            showConfirmButton: true,
            confirmButtonColor: '#0f425b',
            confirmButtonText: 'Aceptar',
          } as SweetAlertOptions).then((result) => {
            if (result.value == true) {
              return location.reload();
            }
          });
        },
        error => {
          if (error.status === 400) { // si es un error BadRequest
            Swal.fire({
              text: error.error,
              icon: 'error',
              position: 'top',
              showConfirmButton: true,
              confirmButtonColor: '#0f425b',
              confirmButtonText: 'Aceptar',
            } as SweetAlertOptions);  
          } else { // si es cualquier otro tipo de error
            Swal.fire({
              text: 'No es posible Registar el Cliente',
              icon: 'error',
              position: 'top',
              showConfirmButton: true,
              confirmButtonColor: '#0f425b',
              confirmButtonText: 'Aceptar',
            } as SweetAlertOptions);    
          }
        }
      );
    }
  }
  
}
