//SISTEMA
import { Component, OnInit, Output, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';

import { MatStepper } from '@angular/material/stepper';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

//COMPONENTES
import { ClienteClass } from 'src/app/core/models/cliente';
import { ClienteConsultaClass } from 'src/app/core/models/clienteConsulta';
import { TipoDocumentoClass } from 'src/app/core/models/tipoDocumento';

//SERVICIOS
import { ClienteService } from 'src/app/core/services/cliente.service';

@Component({
  selector: 'app-consultar-cliente',
  templateUrl: './consultar-cliente.component.html',
  styleUrls: ['./consultar-cliente.component.css']
})
export class ConsultarClienteComponent implements OnInit {

  //TABLA Cliente
  displayedColumnsCliente: string[] = ['tdDescripcion', 'cliNroDoc', 'cliApeNomDen', 'usuario', 'fechaBaja', 'columnaVacia', 'modEstado', 'seleccionar'];
  @ViewChild('paginatorCliente', { static: false }) paginatorCliente: MatPaginator | undefined;
  @ViewChild('matSortCliente', { static: false }) sortCliente: MatSort | undefined;
  dataSourceCliente: MatTableDataSource<any>;
  pageSizeCliente = 10; // Número de elementos por página
  currentPageCliente = 1; // Página actual
  
  //STEPPER
  titulo1 = 'Consultá información de los clientes:';
  titulo2 = 'Modificar información de un cliente';
  titulo3 = 'Título del tercer paso';
  isStep1Completed = false;
  isStep2Completed = false;
  isStep3Completed = false;
  
  @ViewChild(MatStepper, { static: false }) stepper: MatStepper | undefined;

  //VARIABLES DE OBJETOS LIST
  Clientes: ClienteConsultaClass[] = [];
  ClientesFiltrados: ClienteConsultaClass[] = [];
  tiposDocumento: TipoDocumentoClass[] = [
    new TipoDocumentoClass(0, 'TODOS'),
    new TipoDocumentoClass(1, 'DNI'),
    new TipoDocumentoClass(2, 'LE'),
    new TipoDocumentoClass(3, 'LC'),
    new TipoDocumentoClass(4, 'CUIT'),
    new TipoDocumentoClass(5, 'CUIL')
  ];
  //VARIABLES DE DATOS
  cliNroDocSeleccionado: string = '';
  cliApeNomDenSeleccionado : string = '';
  cliEmailSeleccionado : string = '';
  cliTelefonoSeleccionado : string = '';
  usuarioSeleccionado: string = '';
  tdDescripcionSeleccionado: string = '';  
  cliFechaAltaSeleccionado: string = ''; 
  fechaBajaSeleccionado: string = ''; 
  numerosValidos: string = 'Solo se admiten 15 números';  
  caracteresValidosCliente: string =
  "La primera letra del Nombre del Cliente debe ser Mayúscula, más de 3 caracteres y no se admiten caracteres especiales: / ! # $ % & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
  caracteresValidosUsuario: string =
  "El Nombre del Usuario debe tener más de 3 caracteres y no se admiten caracteres especiales: / ! # $ % & ' ( ) * + , - . : ; < = > ¿? @ [  ] ^ _` { | } ~";
  caracteresValidosEmail: string =
  "Ingrese un correo electrónico válido. Los caracteres permitidos son letras, números, puntos, guiones y guiones bajos.";
  telefonoValido: string =
  "Ingrese un número de teléfono válido. Los formatos permitidos son: '1234567890', '123-4567890', '1234-567890' o '1234-56-7890'";

  cliTipoDocSeleccionado : number = 0;
  cliIdUsuarioSeleccionado : number = 0;
  tipoDocumentoSeleccionado: number = -1;
  
  cliFechaAltaDate: Date = new Date(); 

  isCollapsed1 = false;
  isCollapsed2 = false;  

  //FORMULARIOS DE AGRUPACION DE DATOS
  formModificar: FormGroup;
  formfiltro: FormGroup;
  constructor(
    private clienteConsultar: ClienteService, private formBuilder: FormBuilder 
  ) { 
    this.dataSourceCliente = new MatTableDataSource<any>();

    this.formModificar = new FormGroup({
      tipoDocumento: new FormControl(null, [ 
        Validators.required,
        ]),
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
      fechaAlta: new FormControl(null, []),   
      fechaBaja: new FormControl(null, []),   
      email: new FormControl(null, [
        Validators.email,
        Validators.maxLength(30),
      ]),
      telefono: new FormControl(null, [Validators.pattern(/^[\d]{2,4}-?[\d]{6,8}$/)]),
    });

    this.formfiltro = new FormGroup({
      tipoF: new FormControl(null, []),
      numeroF: new FormControl(null, []),
      clienteF: new FormControl(null, []),
      usuarioF: new FormControl(null, []),
    });   
  }
   
  ngOnInit(): void {      
    this.clienteConsultar.listaClientes().subscribe(data => {
      this.Clientes = data;  
      this.ClientesFiltrados = data;

      this.dataSourceCliente = new MatTableDataSource(data);
      if (this.paginatorCliente) {
        this.dataSourceCliente.paginator = this.paginatorCliente;
      }
      if (this.sortCliente) {
        this.dataSourceCliente.sort = this.sortCliente;
      }

    })
  }
  
  handlePageChangeCliente(event: any) {
    this.currentPageCliente = event.pageIndex + 1;
    this.pageSizeCliente= event.pageSize;
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
  set fechaAlta(valor: any) {
    this.formModificar.get('fechaAlta')?.setValue(valor);
  }
  set fechaBaja(valor: any) {
    this.formModificar.get('fechaBaja')?.setValue(valor);
  }
  set email(valor: any) {
    this.formModificar.get('email')?.setValue(valor);
  }
  set telefono(valor: any) {
    this.formModificar.get('telefono')?.setValue(valor);
  }
  set numeroF(valor: any) {
    this.formfiltro.get('numeroF')?.setValue(valor);
  }
  set clienteF(valor: any) {
    this.formfiltro.get('clienteF')?.setValue(valor);
  }
  set usuarioF(valor: any) {
    this.formfiltro.get('usuarioF')?.setValue(valor);
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
  get fechaAlta() {
    return this.formModificar.get('fechaAlta');
  }
  get fechaBaja() {
    return this.formModificar.get('fechaBaja');
  }
  get email() {
    return this.formModificar.get('email');
  }
  get telefono() {
    return this.formModificar.get('telefono');
  }
  get numeroF() {
    return this.formfiltro.get('numeroF');
  }
  get clienteF() {
    return this.formfiltro.get('clienteF');
  }
  get usuarioF() {
    return this.formfiltro.get('usuarioF');
  }

  //Valida que exista algún cliente que responda al filtro.
  validarFiltradoClientes(): Boolean {   
    if (this.ClientesFiltrados.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  //STEP
  goToNextStep(stepNumber: number): void {
    if (this.stepper) {
      this.stepper.selectedIndex = stepNumber;
    }
  }
  
  goToPreviousStep(): void {
    if (this.stepper) {
      this.stepper.previous();
    }
  }

  // Placeholder de DNI
  formatDocumentNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, ''); // Eliminar cualquier carácter que no sea un dígito

    // Aplicar la máscara con puntos solo cuando se pierde el foco o se presiona Enter
    input.addEventListener('blur', applyMask);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        applyMask();
      }
    });

    const insertDots = (value: string): string => {
      const digit1 = value.slice(0, 2);
      const digit2 = value.slice(2, 5);
      const digit3 = value.slice(5, 8);

      let formattedValue = '';

      if (digit1) {
        formattedValue += digit1;
      }

      if (digit2) {
        formattedValue += `.${digit2}`;
      }

      if (digit3) {
        formattedValue += `.${digit3}`;
      }

      return formattedValue;
    };

    function applyMask() {
      const formattedValue = insertDots(value);
      input.value = formattedValue;

      // Verificar y ajustar el placeholder
      if (value.length === 0) {
        input.placeholder = '12.345.678';
      }
    }
  }
  
  //Almacena los datos del servicio que fue seleccionado en la tabla de servicio filtrados dentro de variables locales.
  esfilaSeleccionadaCliente(cliente: ClienteConsultaClass) {     
    this.cliNroDocSeleccionado = cliente.cliNroDoc;
    this.cliApeNomDenSeleccionado = cliente.cliApeNomDen;
    this.cliEmailSeleccionado = cliente.cliEmail;
    this.cliTelefonoSeleccionado = cliente.cliTelefono;
    this.usuarioSeleccionado = cliente.usuario;
    this.tdDescripcionSeleccionado = cliente.tdDescripcion; 
  
    this.cliTipoDocSeleccionado = cliente.cliTipoDoc;
    this.cliIdUsuarioSeleccionado = cliente.cliIdUsuario;
  
    this.cliFechaAltaSeleccionado = new Date(cliente.cliFechaAlta).toLocaleDateString("es-AR");
    this.cliFechaAltaDate = new Date(cliente.cliFechaAlta);
    this.fechaBajaSeleccionado = cliente.fechaBaja ? new Date(cliente.fechaBaja).toLocaleDateString("es-AR") : '';     

    this.tipoDocumento = this.tdDescripcionSeleccionado;
    this.nroDoc = this.cliNroDocSeleccionado;
    this.cliApeNomDen = this.cliApeNomDenSeleccionado
    this.usuario = this.usuarioSeleccionado   
    this.fechaAlta = this.cliFechaAltaSeleccionado;  
    this.fechaBaja = this.fechaBajaSeleccionado;  
    this.email = this.cliEmailSeleccionado;
    this.telefono= this.cliTelefonoSeleccionado;    
    
    this.isCollapsed1 = !this.isCollapsed1;

    this.goToNextStep(1);
  }
  
  //Filtro de Central por Tipo Doc, Numero, Nombre Cliente o Usuario.
  esFiltrar() {
    const tipoDocumentoControl = this.formfiltro.get('tipoF');
    const numeroFControl = this.formfiltro.get('numeroF');
    const clienteFControl = this.formfiltro.get('clienteF');
    const usuarioFControl = this.formfiltro.get('usuarioF');
  
    const tipoDocumentoSeleccionado = tipoDocumentoControl?.value || "";
    const filtroNumeroF = (numeroFControl?.value || "").toString().toLowerCase();
    const filtroClienteF = (clienteFControl?.value || "").toString().toLowerCase();
    const filtronUsuarioF = (usuarioFControl?.value || "").toString().toLowerCase();
  
    this.ClientesFiltrados = this.Clientes.filter((cliente) => {
      const valorTipoF = cliente.cliTipoDoc.toString().toLowerCase();
      const valorNumeroF = cliente.cliNroDoc.toString().toLowerCase();
      const valorClienteF = cliente.cliApeNomDen.toString().toLowerCase();
      const valorUsuarioF = cliente.usuario.toString().toLowerCase();
  
      if (tipoDocumentoSeleccionado === "0") {
        return (
          (!filtroNumeroF || valorNumeroF.includes(filtroNumeroF)) &&
          (!filtroClienteF || valorClienteF.includes(filtroClienteF)) &&
          (!filtronUsuarioF || valorUsuarioF.includes(filtronUsuarioF))
        );
      } else {
        const filtronTipoF = tipoDocumentoSeleccionado.toString().toLowerCase();
        return (
          (!filtronTipoF || valorTipoF === filtronTipoF) &&
          (!filtroNumeroF || valorNumeroF.includes(filtroNumeroF)) &&
          (!filtroClienteF || valorClienteF.includes(filtroClienteF)) &&
          (!filtronUsuarioF || valorUsuarioF.includes(filtronUsuarioF))
        );
      }
    });
  
    this.dataSourceCliente = new MatTableDataSource(this.ClientesFiltrados);
    if (this.paginatorCliente) {
      this.dataSourceCliente.paginator = this.paginatorCliente;
    }
    if (this.sortCliente) {
      this.dataSourceCliente.sort = this.sortCliente;
    }
  }
    
  modificarEstadoCliente(element: any, accion: number, estado:string): void {
    Swal.fire({
      text: '¿Estás seguro que deseas modificar el estado del Cliente a "' + estado + '"?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0f425b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    } as SweetAlertOptions).then((result) => {
      if (result.isConfirmed) {
        this.clienteConsultar.modificarEstado(accion, element.cliTipoDoc, element.cliNroDoc).subscribe(
          result => {
            Swal.fire({
              text: 'Se ha actualizado el estado del cliente: '+ element.cliApeNomDen,
              icon: 'success',
              position: 'center',
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
            Swal.fire({
              text: 'No es posible modificar el estado del Cliente: ' + element.cliApeNomDen,
              icon: 'error',
              position: 'center',
              showConfirmButton: true,
              confirmButtonColor: '#0f425b',
              confirmButtonText: 'Aceptar',
            } as SweetAlertOptions);    
          }
        );
      }
    });
  }

  blanquearPassword(): void {
    if (!this.usuarioSeleccionado){
      Swal.fire({
        text: 'Debe Seleccionar un Usuario ',
        icon: 'error',
        position: 'center',
        showConfirmButton: true,
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
      } as SweetAlertOptions);
    }
    else {
      Swal.fire({
        text: '¿Estás seguro que deseas Blanquear el Password al Usuario: "' + this.usuarioSeleccionado + '"?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0f425b',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
      } as SweetAlertOptions).then((result) => {
        if (result.isConfirmed) {
          this.clienteConsultar.blanquearPassword(this.cliIdUsuarioSeleccionado).subscribe(
            result => {
              Swal.fire({
                text: 'Se ha Blanqueado el Password al Usuario: '+ this.usuarioSeleccionado + ' el nuevo Password es: 123456',
                icon: 'success',
                position: 'center',
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
              Swal.fire({
                text: 'No es posible Blanquear el Password del Usuario: ' + this.usuarioSeleccionado,
                icon: 'error',
                position: 'center',
                showConfirmButton: true,
                confirmButtonColor: '#0f425b',
                confirmButtonText: 'Aceptar',
              } as SweetAlertOptions);    
            }
          );
        }
      });
    }
  }

  modificarCliente(): void {
    if (!this.usuarioSeleccionado){
      Swal.fire({
        text: 'Debe Seleccionar un Cliente',
        icon: 'error',
        position: 'center',
        showConfirmButton: true,
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
      } as SweetAlertOptions);
    }
    else {
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
        this.clienteConsultar.verificarUsuarioMod(usuario, this.cliIdUsuarioSeleccionado).subscribe(
          result => {
            let Cliente: ClienteClass = new ClienteClass(
              this.cliTipoDocSeleccionado,
              this.cliNroDocSeleccionado,
              this.cliIdUsuarioSeleccionado,
              this.cliFechaAltaDate,
              new Date(this.fechaBajaSeleccionado),      
              this.formModificar.get('cliApeNomDen')?.value,
              this.formModificar.get('email')?.value,
              this.formModificar.get('telefono')?.value,
            );        
            this.clienteConsultar.actualizarCliente(Cliente, usuario).subscribe(
              result => {
                Swal.fire({
                  text: 'Se ha actualizado el Cliente: '+ this.formModificar.get('cliApeNomDen')?.value,
                  icon: 'success',
                  position: 'center',
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
  }

}
