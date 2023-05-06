//SISTEMA
import { JsonpClientBackend } from '@angular/common/http';
import { Component, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

//COMPONENTES
import { ClienteClass } from 'src/app/core/models/cliente';

//SERVICIOS
import { ClienteService } from 'src/app/core/services/cliente.service';

@Component({
  selector: 'app-consultar-cliente',
  templateUrl: './consultar-cliente.component.html',
  styleUrls: ['./consultar-cliente.component.css']
})
export class ConsultarClienteComponent implements OnInit {

   //VARIABLES DE OBJETOS LIST
   Clientes: ClienteClass[] = [];
   ClientesFiltrados: ClienteClass[] = [];

  //VARIABLES DE DATOS
  propiedadOrdenamientoCliente: string = 'tdDescripcion'; 
  cliNroDocSeleccionado: string = '';
  cliApeNomDenSeleccionado : string = '';
  cliEmailSeleccionado : string = '';
  cliTelefonoSeleccionado : string = '';
  usuarioSeleccionado: string = '';
  tdDescripcionSeleccionado: string = '';  

  cliTipoDocSeleccionado : number = 0;
  cliIdUsuarioSeleccionado : number = 0;
  tipoOrdenamientoCliente: number = 1;
  
  cliFechaAltaSeleccionado? : Date;
  fechaBajaSeleccionado? : Date;

  constructor(
    private clienteConsultar: ClienteService,
  ) { }

  ngOnInit(): void {
  
    
    this.clienteConsultar.listaClientes().subscribe(data => {
      this.Clientes = data;  
      this.ClientesFiltrados = data;
    })

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
  esfilaSeleccionadaCliente(cliente: ClienteClass) {      

    this.cliNroDocSeleccionado = cliente.cliNroDoc;
    this.cliApeNomDenSeleccionado = cliente.cliApeNomDen;
    this.cliEmailSeleccionado = cliente.cliEmail;
    this.cliTelefonoSeleccionado = cliente.cliTelefono;
    this.usuarioSeleccionado = cliente.usuario;
    this.tdDescripcionSeleccionado = cliente.tdDescripcion; 
  
    this.cliTipoDocSeleccionado = cliente.cliTipoDoc;
    this.cliIdUsuarioSeleccionado = cliente.cliIdUsuario;
  
    this.cliFechaAltaSeleccionado = cliente.cliFechaAlta;
    this.fechaBajaSeleccionado = cliente.fechaBaja;
  
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
}
