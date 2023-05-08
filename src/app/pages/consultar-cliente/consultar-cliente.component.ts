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

  //VARIABLES DE OBJETOS LIST
  Clientes: ClienteConsultaClass[] = [];
  ClientesFiltrados: ClienteConsultaClass[] = [];
  TipoDocumento: TipoDocumentoClass[] = [];

  //VARIABLES DE DATOS
  propiedadOrdenamientoCliente: string = 'tdDescripcion'; 
  cliNroDocSeleccionado: string = '';
  cliApeNomDenSeleccionado : string = '';
  cliEmailSeleccionado : string = '';
  cliTelefonoSeleccionado : string = '';
  usuarioSeleccionado: string = '';
  tdDescripcionSeleccionado: string = '';  
  cliFechaAltaSeleccionado: string = ''; 
  fechaBajaSeleccionado: string = ''; 
  numerosValidos: string = 'Solo se admiten 15 números';  
  
  cliTipoDocSeleccionado : number = 0;
  cliIdUsuarioSeleccionado : number = 0;
  tipoOrdenamientoCliente: number = 1;
  
  cliFechaAltaDate: Date = new Date(); 

  //FORMULARIOS DE AGRUPACION DE DATOS
  formModificar: FormGroup;

  constructor(
    private clienteConsultar: ClienteService,    
  ) { 
    this.formModificar = new FormGroup({
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
    this.clienteConsultar.listaClientes().subscribe(data => {
      this.Clientes = data;  
      this.ClientesFiltrados = data;
    })
    this.clienteConsultar.obtenerTipoDoc().subscribe(data => {
      this.TipoDocumento = data;  
      this.tipoDocumento = this.TipoDocumento.reduce((min, current) => current.tdId < min ? current.tdId : min, this.TipoDocumento[0].tdId);
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

  //Valida que exista algún cliente que responda al filtro.
  validarFiltradoClientes(): Boolean {   
    if (this.ClientesFiltrados.length == 0) {
      return false;
    } else {
      return true;
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

    this.tipoDocumento = this.cliTipoDocSeleccionado;
    this.nroDoc = this.cliNroDocSeleccionado;
    this.cliApeNomDen = this.cliApeNomDenSeleccionado
    this.usuario = this.usuarioSeleccionado   
    this.fechaAlta = this.cliFechaAltaSeleccionado;  
    this.fechaBaja = this.fechaBajaSeleccionado;  
    this.email = this.cliEmailSeleccionado;
    this.telefono= this.cliTelefonoSeleccionado;        
  }

  //Metodos para grilla
  //Almacena en una variable la propiedad por la cual se quiere ordenar la consulta de Cliente.
  ordenarClientePor(propiedad: string) {
    this.tipoOrdenamientoCliente =
      propiedad === this.propiedadOrdenamientoCliente ? this.tipoOrdenamientoCliente * -1 : 1;
    this.propiedadOrdenamientoCliente = propiedad;
  }

  //En base a la propiedad por la que se quiera ordenar y el tipo de orden muestra un icono.
  ordenarIconoCliente(propiedad: string) {
    if (propiedad === this.propiedadOrdenamientoCliente) {
      return this.tipoOrdenamientoCliente === 1 ? '🠉' : '🠋';
    } else {
      return '🠋🠉';
    }
  }

  //Filtro de Central por Nombre Cliente o Usuario.
  esFiltrar(event: Event, campo: string) {
    let txtBuscar = (event.target as HTMLInputElement).value;
    let filtro = txtBuscar
      .replace(/[^\w\s]/g, '')
      .trim()
      .toLowerCase();
    this.ClientesFiltrados = [];
    this.Clientes.forEach((clienteConsulta) => {
      if (
        (campo === 'tipo' && clienteConsulta.tdDescripcion.toString().toLowerCase().includes(filtro)) ||
        (campo === 'numero' && clienteConsulta.cliNroDoc.toString().toLowerCase().includes(filtro)) ||
        (campo === 'cliente' && clienteConsulta.cliApeNomDen.toString().toLowerCase().includes(filtro)) ||
        (campo === 'usuario' && clienteConsulta.usuario.toString().toLowerCase().includes(filtro))
      ) {
        this.ClientesFiltrados.push(clienteConsulta);
      }
    });
  }

  modificarEstadoCliente(accion: number, estado:string): void {
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
        this.clienteConsultar.modificarEstado(accion, this.cliTipoDocSeleccionado, this.cliNroDocSeleccionado).subscribe(
          result => {
            Swal.fire({
              text: 'Se ha actualizado el estado del cliente: '+ this.cliApeNomDenSeleccionado,
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
            Swal.fire({
              text: 'No es posible modificar el estado del Cliente: ' + this.cliApeNomDenSeleccionado,
              icon: 'error',
              position: 'top',
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
        position: 'top',
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
              Swal.fire({
                text: 'No es posible Blanquear el Password del Usuario: ' + this.usuarioSeleccionado,
                icon: 'error',
                position: 'top',
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
    console.log(Cliente);
    this.clienteConsultar.actualizarCliente(Cliente).subscribe(
      result => {
        Swal.fire({
          text: 'Se ha actualizado el Cliente: '+ this.formModificar.get('cliApeNomDen')?.value,
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
        Swal.fire({
          text: 'No es posible Actualizar el Cliente',
          icon: 'error',
          position: 'top',
          showConfirmButton: true,
          confirmButtonColor: '#0f425b',
          confirmButtonText: 'Aceptar',
        } as SweetAlertOptions);    
      }
    );
  }
}
