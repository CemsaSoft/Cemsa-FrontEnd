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
//import { ClienteClass } from 'src/app/core/models/cliente';
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

  //FORMULARIOS DE AGRUPACION DE DATOS
  formRegistar: FormGroup;


  constructor(
    private clienteConsultar: ClienteService,    
  ) { 
    this.formRegistar = new FormGroup({
      tipoDocumento: new FormControl(null, []),
      nroDoc: new FormControl(null, []),
      cliApeNomDen: new FormControl(null, []),
      usuario: new FormControl(null, []),   
      fechaAlta: new FormControl(null, []),   
      fechaBaja: new FormControl(null, []),   
      email: new FormControl(null, []),
      telefono: new FormControl(null, []),
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
  
  get tipoDocumentoç() {
    return this.formRegistar.get('tipoDocumento');
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

}
