//SISTEMA
import { JsonpClientBackend } from '@angular/common/http';
import { Component, OnInit, Output, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { MatStepper } from '@angular/material/stepper';

//COMPONENTES
import { ClienteClass } from 'src/app/core/models/cliente';
import { ClienteConsultaClass } from 'src/app/core/models/clienteConsulta';
import { StepComponent } from 'src/app/shared/step/step.component';
import { TipoDocumentoClass } from 'src/app/core/models/tipoDocumento';


//SERVICIOS
import { ClienteService } from 'src/app/core/services/cliente.service';

@Component({
  selector: 'app-consultar-cliente',
  templateUrl: './consultar-cliente.component.html',
  styleUrls: ['./consultar-cliente.component.css']
})
export class ConsultarClienteComponent implements OnInit {
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
    new TipoDocumentoClass(1, 'DNI'),
    new TipoDocumentoClass(2, 'LE'),
    new TipoDocumentoClass(3, 'CUIT')
  ];
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
  tipoOrdenamientoCliente: number = 1;
  tipoDocumentoSeleccionado: number = 0;
  
  cliFechaAltaDate: Date = new Date(); 

  isCollapsed1 = false;
  isCollapsed2 = false;  

  //PAGINADO
  pageSize = 5; // Número de elementos por página
  currentPage = 1; // Página actual
  totalItems = 0; // Total de elementos en la tabla


  //FORMULARIOS DE AGRUPACION DE DATOS
  formModificar: FormGroup;
  formfiltro: FormGroup;
  constructor(
    private clienteConsultar: ClienteService, private formBuilder: FormBuilder 
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
      fechaAlta: new FormControl(null, []),   
      fechaBaja: new FormControl(null, []),   
      email: new FormControl(null, [
        Validators.email,
        Validators.maxLength(30),
      ]),
      telefono: new FormControl(null, [Validators.pattern(/^[\d]{2,4}-?[\d]{6,8}$/)]),
    });

    this.formfiltro = new FormGroup({
      tipo: new FormControl(null, []),
      numero: new FormControl(null, []),
      cliente: new FormControl(null, []),
      usuario: new FormControl(null, []),
    });   
  }
 

  toggleCollapse1() {
    this.isCollapsed1 = !this.isCollapsed1;
  }

  toggleCollapse2() {
    this.isCollapsed2 = !this.isCollapsed2;
  }
  
  ngOnInit(): void {      
    this.clienteConsultar.listaClientes().subscribe(data => {
      this.Clientes = data;  
      this.ClientesFiltrados = data;
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
  //STEP
  goToNextStep(stepNumber: number): void {
    console.log(`Pasando al siguiente paso: ${stepNumber}`);
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
  //Filtro de Tipo de DNI
  filtrarClientesPorTipoDocumento() {
    
    this.ClientesFiltrados = this.Clientes.filter(cliente => cliente.cliTipoDoc === this.tipoDocumentoSeleccionado);
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
  // esFiltrar(event: Event) {
  //   const filtronTipo = (this.formfiltro.get('tipo') as FormControl).value?.toLowerCase();
  //   const filtroNumero = (this.formfiltro.get('numero') as FormControl).value?.toLowerCase();
  //   const filtroCliente = (this.formfiltro.get('cliente') as FormControl).value?.toLowerCase();
  //   const filtronUsuario = (this.formfiltro.get('usuario') as FormControl).value?.toLowerCase();

  //   this.ClientesFiltrados = this.Clientes.filter((cli) => {
  //     const valorTdDescripcion= cli.tdDescripcion.toString().toLowerCase();
  //     const valorCliNroDoc = cli.cliNroDoc.toString().toLowerCase();
  //     const valorCliApeNomDen = cli.cliApeNomDen.toString().toLowerCase();
  //     const valorUsuario = cli.usuario.toString().toLowerCase();

  //     return (
  //       (!filtronTipo || valorTdDescripcion.includes(filtronTipo)) &&
  //       (!filtroNumero || valorCliNroDoc.includes(filtroNumero)) &&
  //       (!filtroCliente || valorCliApeNomDen.includes(filtroCliente)) &&
  //       (!filtronUsuario || valorUsuario.includes(filtronUsuario))
  //     );
  //   });
  // }
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
    if (!this.usuarioSeleccionado){
      Swal.fire({
        text: 'Debe Seleccionar un Cliente',
        icon: 'error',
        position: 'top',
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
  paginaCambiada(event: any) {
    this.currentPage = event;
    const cantidadPaginas = Math.ceil(
      this.ClientesFiltrados.length / this.pageSize
    );
    const paginas = [];

    for (let i = 1; i <= cantidadPaginas; i++) {
      paginas.push(i);
    }
    return paginas;
  } 

}
