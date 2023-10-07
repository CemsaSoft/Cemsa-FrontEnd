//SISTEMA
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl, FormGroup,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';

import { MatStepper } from '@angular/material/stepper';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

//libreria para los graficos
import * as echarts from 'echarts';

//Libreria para generer los reportes
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

//COMPONENTES
import { CentralConsultaClass } from 'src/app/core/models/centralConsulta';
import { MedicionesClass } from 'src/app/core/models/mediciones';
import { ServicioClass } from 'src/app/core/models/servicio';

//SERVICIOS
import { CentralService } from 'src/app/core/services/central.service';
import { MedicionesService } from 'src/app/core/services/mediciones.service';
import { ServicioService } from 'src/app/core/services/servicio.service';

@Component({
  selector: 'app-consultar-reportes',
  templateUrl: './consultar-reportes.component.html',
  styleUrls: ['./consultar-reportes.component.css']
})
export class ConsultarReportesComponent implements OnInit {
  
  //TABLA Central
  displayedColumnsCentral: string[] = ['cenNro', 'cenImei', 'cenCoorX', 'cenCoorY', 'columnaVacia', 'seleccionar'];
  @ViewChild('paginatorCentral', { static: false }) paginatorCentral: MatPaginator | undefined;
  @ViewChild('matSortCentral', { static: false }) sortCentral: MatSort | undefined;
  dataSourceCentral: MatTableDataSource<any>;
  pageSizeCentral = 5; // Número de elementos por página
  currentPageCentral = 1; // Página actual

  //TABLA Servicios Disponibles
  displayedColumnsServicioDisponible: string[] = ['serId', 'serDescripcion', 'AgregarServ'];
  @ViewChild('matSortServicioDisponible', { static: false }) sortServicioDisponible: MatSort | undefined;
  @ViewChild('paginatorServicioDisponible', { static: false }) paginatorServicioDisponible: MatPaginator | undefined;
  dataSourceServicioDisponible: MatTableDataSource<any>;
  pageSizeServicioDisponible = 5; // Número de elementos por página
  currentPageServicioDisponible = 1; // Página actual

  //TABLA Servicios Graficar
  displayedColumnsServicioGraficar: string[] = ['serId', 'serDescripcion', 'ExtraerServ'];
  @ViewChild('matSortServicioGraficar', { static: false }) sortServicioGraficar: MatSort | undefined;
  @ViewChild('paginatorServicioGraficar', { static: false }) paginatorServicioGraficar: MatPaginator | undefined;
  dataSourceServicioGraficar: MatTableDataSource<any>;
  pageSizeServicioGraficar = 5; // Número de elementos por página
  currentPageServicioGraficar = 1; // Página actual

  //TABLA Mediciones
  displayedColumnsMediciones: string[] = ['medId', 'serDescripcion', 'medValor', 'medFechaHoraSms'];
  @ViewChild('matSortMediciones', { static: false }) sortMediciones: MatSort | undefined;
  @ViewChild('paginatorMediciones', { static: false }) paginatorMediciones: MatPaginator | undefined;
  dataSourceMediciones: MatTableDataSource<any>;
  pageSizeMediciones = 50; // Número de elementos por página
  currentPageMediciones = 1; // Página actual

  //VARIABLES DE OBJETOS LIST
  CentralConsulta: CentralConsultaClass[] = [];
  CentralConsultaFiltrados: CentralConsultaClass [] = [];
  Mediciones: MedicionesClass[] = []; 
  MedMin: MedicionesClass[] = []; 
  MedMax: MedicionesClass[] = [];
  ServiciosCentral: ServicioClass[] = [];
  ServiciosGraficar: ServicioClass[] = [];
  MedicionesTabla: MedicionesClass[] = []; 
  MedicionesTablaFiltrados: MedicionesClass[] = []; 

  //VARIABLES DE DATOS
  propiedadOrdenamiento: string = 'cenNro';
  propiedadOrdenamientoServicio: string = 'serId';
  propiedadOrdenamientoServicioGraficar: string = 'serId';
  propiedadOrdenamientoMedicion: string = 'medId';
  coorXSeleccionada: string = '';
  coorYSeleccionada: string = '';
  filtroCentral: string = '';

  tipoOrdenamiento: number = 1;
  centralNroSeleccionada: number=0;
  tipoOrdenamientoServicio: number = 1;
  tipoOrdenamientoServicioGraficar: number = 1;
  tipoOrdenamientoMedicion: number = 1;
  idUsuario: any = 0;
  idListaServiciosSeleccionado: number=0;
  idListaServiciosGraficarSeleccionado: number=0;

  //STEPPER
  titulo1 = 'Seleccionar Central para Consultar Reportes';
  titulo2 = 'General Reporte para la Central N°:';
  titulo3 = ':';
  isStep1Completed = false;
  isStep2Completed = false;
  isStep3Completed = false;

  @ViewChild(MatStepper, { static: false }) stepper: MatStepper | undefined;

  op1 = true; op2 = false; op3 = false; op4 = false; op5 = false; op6 = false; op7 = false;
  op1T = true;
  public habilitarBoton: boolean = false;
  public habilitarBotonPDF: boolean = false;

  isCollapsed1 = false;
  isCollapsed2 = false;

  //FORMS PARA LA AGRUPACIÓN DE DATOS
  formReporte: FormGroup;
  formfiltro: FormGroup;

  constructor(
    private centralConsultar: CentralService, 
    private medicionesConsultar: MedicionesService, 
  ) { 
    this.dataSourceCentral = new MatTableDataSource<any>();
    this.dataSourceServicioDisponible = new MatTableDataSource<any>();
    this.dataSourceServicioGraficar = new MatTableDataSource<any>();
    this.dataSourceMediciones = new MatTableDataSource<any>();

    this.formReporte = new FormGroup({
      fecha_desde: new FormControl(null, []),
      fecha_hasta: new FormControl(null, []),
      promedio: new FormControl(null, []),
      cantMed: new FormControl(null, []),
      comentario: new FormControl(null, []),
    });
    this.formfiltro = new FormGroup({
      medId: new FormControl(null, []),
      serDescripcion: new FormControl(null, []),
      medValor: new FormControl(null, []),
      fecha_desde: new FormControl(null, []),
      fecha_hasta: new FormControl(null, []),
    });
  }

  ngOnInit(): void {
    this.idUsuario = localStorage.getItem('idUsuario');    
    this.centralConsultar.listaCentralesCliente(this.idUsuario).subscribe(data => {
      this.CentralConsulta = data;  
      this.CentralConsultaFiltrados = data;

      this.dataSourceCentral = new MatTableDataSource(data);
      if (this.paginatorCentral) {
        this.dataSourceCentral.paginator = this.paginatorCentral;
      }
      if (this.sortCentral) {
        this.dataSourceCentral.sort = this.sortCentral;
      }
    });
    
    this.formfiltro.get('fecha_desde')?.disable();
    this.formfiltro.get('fecha_hasta')?.disable();

    this.formReporte.get('fecha_desde')?.disable();
    this.formReporte.get('fecha_hasta')?.disable();

  }

  handlePageChangeCentral(event: any) {
    this.currentPageCentral = event.pageIndex + 1;
    this.pageSizeCentral = event.pageSize;
  }

  handlePageChangeServicioDisponible(event: any) {
    this.currentPageServicioDisponible = event.pageIndex + 1;
    this.pageSizeServicioDisponible = event.pageSize;
  }

  handlePageChangeServicioGraficar(event: any) {
    this.currentPageServicioGraficar = event.pageIndex + 1;
    this.pageSizeServicioGraficar = event.pageSize;
  }

  handlePageChangeMediciones(event: any) {
    this.currentPageMediciones = event.pageIndex + 1;
    this.pageSizeMediciones = event.pageSize;
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

  reportePDF():void {

      var desde = new Date();
      var hasta = new Date();
      if (this.op1) { desde.setDate(desde.getDate() - 7); }
      if (this.op2) { desde.setDate(desde.getDate() - 15); }
      if (this.op3) { desde.setMonth(desde.getMonth() - 1); }
      if (this.op4) { desde.setMonth(desde.getMonth() - 3); }
      if (this.op5) { desde.setMonth(desde.getMonth() - 6); }
      if (this.op6) { desde.setMonth(desde.getMonth() - 12); }
      if (this.op7) {
        var fechaDesde = this.formReporte.value.fecha_desde ?? null;
        var fechaSeleccionada = new Date(fechaDesde);
        fechaSeleccionada.setDate(fechaSeleccionada.getDate() ); // Sumar un día
        fechaSeleccionada.setHours(0, 0, 0, 0);
        desde = fechaSeleccionada;
    
        var fechaHasta = this.formReporte.value.fecha_hasta ?? null;
        fechaSeleccionada = new Date(fechaHasta);
        fechaSeleccionada.setDate(fechaSeleccionada.getDate() ); // Sumar un día
        fechaSeleccionada.setHours(0, 0, 0, 0);
        hasta = fechaSeleccionada;        
      }
      let nroPag = 0;
      // Crear el documento PDF
      const doc = new jsPDF();//('p', 'mm', 'A4'); // Tipo de hoja A4

      // Obtener la ruta de la imagen
      //const imagePath = 'assets/logo_sinfondo55.png';
      const imagePath = 'assets/logoCEMSA_reporte.png';
      // Cargar la imagen utilizando la biblioteca FileSaver.js
      const imagePromise = this.loadImage(imagePath);
      let yPos =0;
      imagePromise.then((imageData) => {
        // Agregar la imagen al documento PDF
        doc.addImage(imageData, 'PNG', 125, 2, 65, 17);  

      // Obtener la fecha actual
      const currentDate = new Date().toLocaleDateString().replace(/\//g, '-');

      // Definir el título del reporte
      const title = 'Reporte de Central Meteorológica';

      // Definir la posición inicial para dibujar el contenido
      yPos = 15;

      // Agregar el título al documento
      doc.setFontSize(18);
      //doc.setFont('Arial');
      doc.text(title, 20, yPos);
      yPos += 5;
      doc.line(20, yPos, doc.internal.pageSize.getWidth()-20, yPos);
      yPos += 15;
      
      // Agregar la fecha al documento
      doc.setFontSize(12);
      doc.text('Fecha de creación del reporte: ' + currentDate, 20, yPos);
      yPos += 10;
      doc.text('Cliente: ' + localStorage.getItem('cliente'), 20, yPos);
      yPos += 10;
      doc.text('Usuario: ' + localStorage.getItem('usuario'), 20, yPos);
      yPos += 10;
      doc.text('Central N°: ' + this.centralNroSeleccionada, 20, yPos);
      yPos += 10;
      doc.text('Coordenada X: ' + this.coorXSeleccionada, 20, yPos);
      yPos += 10;
      doc.text('Coordenada Y: ' + this.coorYSeleccionada, 20, yPos);
      yPos += 10;

      doc.line(20, yPos, doc.internal.pageSize.getWidth()-20, yPos);

      yPos += 10;
      doc.setFontSize(16);
      doc.text('Servicio: ' + this.ServiciosGraficar[0].serDescripcion, 20, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.text('Datos Estadísticos: ', 20, yPos);
      yPos += 10;
      doc.text('Fecha desde: ' + desde.toLocaleDateString() + '   -   Fecha hasta: ' + hasta.toLocaleDateString(), 20, yPos);
      yPos += 10;
      
      doc.text('Promedio: ' + this.formReporte.get('promedio')?.value, 20, yPos);
      yPos += 10;
      doc.text('Cantidad de Mediciones: ' + this.formReporte.get('cantMed')?.value, 20, yPos);


      doc.line(20, 280, doc.internal.pageSize.getWidth()-20, 280);
      nroPag++;
      doc.text('Página ' + nroPag, 98, 285);

      yPos += 10;      
      doc.text('Máximo Valor: ', 20, yPos);
      doc.text('Mínimo Valor: ', 110, yPos);
      yPos += 10;
      
      const maxDataLength = Math.max(this.MedMax.length, this.MedMin.length);      
      console.log(maxDataLength);

      let itemMaxMin = 1;
      for (let i = 0; i < maxDataLength; i++) {
          if (i < this.MedMax.length) {
              const fechaHoraMax = new Date(this.MedMax[i].medFechaHoraSms);
              const fechaFormateadaMax = `${fechaHoraMax.getFullYear()}/${(fechaHoraMax.getMonth() + 1).toString().padStart(2, '0')}/${fechaHoraMax.getDate().toString().padStart(2, '0')} ${fechaHoraMax.getHours().toString().padStart(2, '0')}:${fechaHoraMax.getMinutes().toString().padStart(2, '0')}`;            
              doc.circle(25, yPos - 1, 1, 'FD');
              doc.text('Fecha: ' + fechaFormateadaMax + ' - Valor: ' + this.MedMax[i].medValor.toString(), 30, yPos);
          }
      
          if (i < this.MedMin.length) {
              const fechaHoraMin = new Date(this.MedMin[i].medFechaHoraSms);
              const fechaFormateadaMin = `${fechaHoraMin.getFullYear()}/${(fechaHoraMin.getMonth() + 1).toString().padStart(2, '0')}/${fechaHoraMin.getDate().toString().padStart(2, '0')} ${fechaHoraMin.getHours().toString().padStart(2, '0')}:${fechaHoraMin.getMinutes().toString().padStart(2, '0')}`;            
              doc.circle(115, yPos - 1, 1, 'FD');
              doc.text('Fecha: ' + fechaFormateadaMin + ' - Valor: ' + this.MedMin[i].medValor.toString(), 120, yPos);
          }

          if ((i === 11 || itemMaxMin === 24) && i != maxDataLength-1)
          {
            console.log(i);
            itemMaxMin = 0;
            //Agrego Nueva Pagina
            doc.addPage();

            // Agregar la imagen al documento PDF
            doc.addImage(imageData, 'PNG', 125, 2, 65, 17);  
            
            doc.line(20, 280, doc.internal.pageSize.getWidth()-20, 280);
            nroPag++;
            doc.text('Página ' + nroPag, 98, 285);

            // Definir la posición inicial para dibujar el contenido
            yPos = 15;
                  
            // Agregar el título al documento
            doc.setFontSize(18);
            doc.text(title, 20, yPos);
            yPos += 5;
            doc.line(20, yPos, doc.internal.pageSize.getWidth()-20, yPos);
            yPos += 10;
            doc.setFontSize(12);
          }
          else { 
            yPos += 10;
            itemMaxMin++;
          }
      }
      
      

      //Agrego Nueva Pagina
      doc.addPage();

      // Agregar la imagen al documento PDF
      doc.addImage(imageData, 'PNG', 125, 2, 65, 17);  
      
      doc.line(20, 280, doc.internal.pageSize.getWidth()-20, 280);
      nroPag++;
      doc.text('Página ' + nroPag, 98, 285);

      // Definir la posición inicial para dibujar el contenido
      yPos = 15;

      // Definir el título del reporte
      //const title = 'Reporte de Central Meteorológica';
      // Agregar el título al documento
      doc.setFontSize(18);
      doc.text(title, 20, yPos);
      yPos += 5;
      doc.line(20, yPos, doc.internal.pageSize.getWidth()-20, yPos);
      yPos += 10;
      doc.setFontSize(16);
      doc.text('Servicio: ' + this.ServiciosGraficar[0].serDescripcion, 20, yPos);
      yPos += 15;

      doc.setFontSize(16);
      doc.text('Gráfico: ',20, yPos);
      yPos += 5;

      // Obtener el elemento del reporte
      const reportElement = document.getElementById('grafico1');
      if (reportElement) {   
      //Convertir el elemento a imagen utilizando html2canvas
      html2canvas(reportElement).then((canvas) => {
        // Obtener la URL de la imagen generada
        const imgData = canvas.toDataURL('image/png');
        // Agregar la imagen al documento PDF
        doc.addImage(imgData, 'PNG', 5, yPos, 190, 0);    
        yPos += 105 ;
        if (this.formReporte.get('comentario')?.value != null) {
          doc.setFontSize(12);
          doc.text('Comentario: ', 20, yPos);
          yPos += 10;
          doc.text(this.formReporte.get('comentario')?.value, 20, yPos);
        }
          //Generar reporte de las mediciones

          let count = 0;
          if (this.op1T) {

            // Agregar nueva página
            doc.addPage();
            // Agregar la imagen al documento PDF
            doc.addImage(imageData, 'PNG', 125, 2, 65, 17);  
            doc.setFontSize(12);
            doc.line(20, 280, doc.internal.pageSize.getWidth() - 20, 280);
            nroPag++;
            doc.text('Página ' + nroPag, 98, 285);

            // Definir la posición inicial para dibujar el contenido en la nueva página
            yPos = 15;

            // Definir el título del reporte en la nueva página
            doc.setFontSize(18);
            doc.text(title, 20, yPos);
            yPos += 5;
            doc.line(20, yPos, doc.internal.pageSize.getWidth() - 20, yPos);
            yPos += 10;

            doc.setFontSize(16);
            doc.text('Mediciones: ', 20, yPos);
            yPos += 10;

            doc.setFontSize(10);
            doc.text('item', 27, yPos);
            doc.text('Num. Med.', 48, yPos);
            doc.text('Servicio', 90, yPos);
            doc.text('Valor', 128, yPos);
            doc.text('Fecha Medición', 152, yPos);
            yPos += 10;

            for (let a = 0; a < this.MedicionesTablaFiltrados.length; a++) {
              const item = a + 1;
              doc.text(item.toString(), 30, yPos);
              doc.text((this.MedicionesTablaFiltrados[a].medId.toString()).toString(), 50, yPos);
              doc.text((this.MedicionesTablaFiltrados[a].serDescripcion).toString().substring(0, 25), 75, yPos);
              doc.text(this.MedicionesTablaFiltrados[a].medValor.toString(), 130, yPos);

              const fechaHora = new Date(this.MedicionesTablaFiltrados[a].medFechaHoraSms);
              const fechaFormateada = `${fechaHora.getFullYear()}/${(fechaHora.getMonth() + 1).toString().padStart(2, '0')}/${fechaHora.getDate().toString().padStart(2, '0')} ${fechaHora.getHours().toString().padStart(2, '0')}:${fechaHora.getMinutes().toString().padStart(2, '0')}`;
              doc.text(fechaFormateada, 150, yPos);
              yPos += 10;

              count++;

              if (count === 23) {
                // Agregar nueva página
                doc.addPage();
                nroPag++;
                // Agregar la imagen al documento PDF
                doc.addImage(imageData, 'PNG', 125, 2, 65, 17);  
                doc.setFontSize(12);
                doc.line(20, 280, doc.internal.pageSize.getWidth() - 20, 280);
                doc.text('Página ' + nroPag, 98, 285);

                // Definir la posición inicial para dibujar el contenido en la nueva página
                yPos = 15;

                // Definir el título del reporte en la nueva página
                doc.setFontSize(18);
                doc.text(title, 20, yPos);
                yPos += 5;
                doc.line(20, yPos, doc.internal.pageSize.getWidth() - 20, yPos);
                yPos += 10;

                doc.setFontSize(16);
                doc.text('Mediciones: ', 20, yPos);
                yPos += 10;

                doc.setFontSize(10);
                doc.text('item', 27, yPos);
                doc.text('Num. Med.', 48, yPos);
                doc.text('Servicio', 90, yPos);
                doc.text('Valor', 128, yPos);
                doc.text('Fecha Medición', 152, yPos);
                yPos += 10;

                count = 0; // Reiniciar el contador
              }
            }
          }        

          // Guardar el documento PDF
          doc.save('Reporte Servicio ' + this.ServiciosGraficar[0].serDescripcion + ' - Fecha ' + currentDate +'.pdf');
        });
        }  
      });  
  }	

  // Función para cargar la imagen y devolver los datos de la imagen como base64
  loadImage(imagePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');

        if (context) {
          context.drawImage(image, 0, 0);
          const imageData = canvas.toDataURL('image/png');
          resolve(imageData);
        } else {
          reject(new Error('No se pudo obtener el contexto de dibujo 2D.'));
        }
      };
      image.onerror = (error) => {
        reject(error);
      };
      image.src = imagePath;
    });
  }

  set promedio(valor: any) {
    this.formReporte.get('promedio')?.setValue(valor);
  }  
  set cantMed(valor: any) {
    this.formReporte.get('cantMed')?.setValue(valor);
  }  
  set comentario(valor: any) {
    this.formReporte.get('comentario')?.setValue(valor);
  }
  
  get promedio() {
    return this.formReporte.get('promedio');
  }
  get cantMed() {
    return this.formReporte.get('cantMed');
  }
  get comentario() {
    return this.formReporte.get('comentario');
  }

  // valida para que un solo selector de frecuencia este seleccionado a la vez
  selOp(option: string, event: any) {
    this.op1 = this.op2 = this.op3 = this.op4 = this.op5 = this.op6 = this.op7 = false;
    this.formReporte.get('fecha_desde')?.disable();
    this.formReporte.get('fecha_hasta')?.disable();

    if (option === 'op1') { this.op1 = event.checked; } 
    if (option === 'op2') { this.op2 = event.checked; }
    if (option === 'op3') { this.op3 = event.checked; } 
    if (option === 'op4') { this.op4 = event.checked; } 
    if (option === 'op5') { this.op5 = event.checked; }
    if (option === 'op6') { this.op6 = event.checked; } 
    if (option === 'op7') { 
      this.op7 = event.checked; 
      this.formReporte.get('fecha_desde')?.enable();
      this.formReporte.get('fecha_hasta')?.enable();
    } 
  }
  
  // valida para mastrar tabla con mediciones en reporte
  selOpT() {
    this.op1T = !this.op1T; 
  }

  //Valida que exista alguna Central que responda al filtro.
  validarFiltrado(): Boolean {
    if (this.CentralConsultaFiltrados.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  //Valida que exista algún servicio que responda al filtro.
  validarFiltradoServicios(): Boolean {
    if (this.ServiciosCentral.length == 0) {
      return false;
    } else {
      return true;
    }    
  }

  //Valida que exista algún servicio que responda al filtro.
  validarFiltradoServiciosGraficar(): Boolean {   
    if (this.ServiciosGraficar.length == 0) {
      return false;
    } else {
      return true;
    }
  }
  
  //Valida que exista alguna medicion Minima que responda al filtro.
  validarMedMin(): Boolean {   
    if (this.MedMin.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  //Valida que exista alguna medicion Maxima que responda al filtro.
  validarMedMax(): Boolean {   
    if (this.MedMax.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  //Valida que exista alguna Medicion que responda al filtro.
  validarFiltradoMedicion(): Boolean {
    if (this.MedicionesTablaFiltrados.length == 0) {
      return false;
    } else {
      return true;
    }
  }

     //Almacena los datos del servicio que fue seleccionado en la tabla de servicio filtrados dentro de variables locales.
  esfilaSeleccionadaServicio(servicios: ServicioClass) {
    this.idListaServiciosSeleccionado = servicios.serId;      
  }

  //Almacena los datos del servicio que fue seleccionado en la tabla de servicio filtrados dentro de variables locales.
  esfilaSeleccionadaServicioGraficar(servicios: ServicioClass) {      
    this.idListaServiciosGraficarSeleccionado = servicios.serId;
  }

  //Filtro de Central por código de central.
  esFiltrar(event: Event, campo: string) {
    let txtBuscar = (event.target as HTMLInputElement).value;
    this.filtroCentral = txtBuscar
      .replace(/[^\w\s]/g, '')
      .trim()
      .toLowerCase();
    this.CentralConsultaFiltrados = [];
    this.CentralConsulta.forEach((centralConsulta) => {
      if (
        (campo === 'codigo' && centralConsulta.cenNro.toString().toLowerCase().includes(this.filtroCentral)) 
      ) {
        this.CentralConsultaFiltrados.push(centralConsulta);
      }    
    });

    this.dataSourceCentral = new MatTableDataSource(this.CentralConsultaFiltrados);
    if (this.paginatorCentral) {
      this.dataSourceCentral.paginator = this.paginatorCentral;
    }
    if (this.sortCentral) {
      this.dataSourceCentral.sort = this.sortCentral;
    }
  } 

  //Filtro de Mediciones
  esFiltrarMedicion(event: Event) {
    const filtroMedId = (this.formfiltro.get('medId') as FormControl).value?.toLowerCase();
    const filtroSerDescripcion = (this.formfiltro.get('serDescripcion') as FormControl).value?.toLowerCase();
    const filtroMedValor = (this.formfiltro.get('medValor') as FormControl).value?.toLowerCase();
  
    this.MedicionesTablaFiltrados = this.MedicionesTabla.filter((medicion) => {
      const valorMedId = medicion.medId.toString().toLowerCase();
      const valorSerDescripcion = medicion.serDescripcion.toString().toLowerCase();
      const valorMedValor = medicion.medValor.toString().toLowerCase();
  
      return (
        (!filtroMedId || valorMedId.includes(filtroMedId)) &&
        (!filtroSerDescripcion || valorSerDescripcion.includes(filtroSerDescripcion)) &&
        (!filtroMedValor || valorMedValor.includes(filtroMedValor))
      );
    });

    this.dataSourceMediciones = new MatTableDataSource(this.MedicionesTablaFiltrados);
    if (this.paginatorMediciones) {
      this.dataSourceMediciones.paginator = this.paginatorMediciones;
      this.paginatorMediciones.firstPage();
    }
    if (this.sortMediciones) {
      this.dataSourceMediciones.sort = this.sortMediciones;
    }  
  }
  
  // valida para que un solo selector de frecuencia este seleccionado a la vez
  filtroFecha(event: any) {
    if (event.checked === true) {
      this.formfiltro.get('medId')?.disable();
      this.formfiltro.get('serDescripcion')?.disable();
      this.formfiltro.get('medValor')?.disable();
      this.formfiltro.get('fecha_desde')?.enable();
      this.formfiltro.get('fecha_hasta')?.enable();
      this.habilitarBoton = true;
    }
    else {
      this.formfiltro.get('medId')?.enable();      
      this.formfiltro.get('serDescripcion')?.enable();
      this.formfiltro.get('medValor')?.enable();
      this.formfiltro.get('fecha_desde')?.disable();
      this.formfiltro.get('fecha_hasta')?.disable();
      this.habilitarBoton = false;
    }
  }

  //filtro de Alarma por Fecha
  filtarXFechas(){
    var hoy = new Date();
    var desde = new Date();
    var hasta = new Date();

    var fechaDesde = this.formfiltro.value.fecha_desde ?? null;
    var fechaSeleccionada = new Date(fechaDesde);
    fechaSeleccionada.setDate(fechaSeleccionada.getDate() ); // Sumar un día
    fechaSeleccionada.setHours(0, 0, 0, 0);
    desde = fechaSeleccionada;

    var fechaHasta = this.formfiltro.value.fecha_hasta ?? null;
    fechaSeleccionada = new Date(fechaHasta);
    fechaSeleccionada.setDate(fechaSeleccionada.getDate() ); // Sumar un día
    fechaSeleccionada.setHours(0, 0, 0, 0);
    hasta = fechaSeleccionada;        

    function mostrarError(mensaje: string, footer: string) {
      Swal.fire({
        title: 'Error',
        text: mensaje,
        icon: 'warning',
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
        footer: footer
      });
    }

    if (fechaDesde === null || isNaN(desde.getTime())) {
      mostrarError('Ingrese una fecha de desde válida.', 'Por favor, ingrese una fecha de hasta válida para generar el filtro.');
    } else if (fechaHasta === null || isNaN(hasta.getTime())) {
      mostrarError('Ingrese una fecha de hasta válida.', 'Por favor, ingrese una fecha de hasta válida para generar el filtro.');
    } else if (desde > hasta) {
      mostrarError('La fecha "desde" es posterior a la fecha "hasta".', 'Por favor, cambie el rango de fechas seleccionado para generar el filtro.');
    } else if (hasta > hoy) {
      mostrarError('La fecha "desde" no puede ser posterior a la fecha actual.', 'Por favor, cambie el rango de fechas seleccionado para generar el filtro.');
    } else {
      
      hasta.setDate(hasta.getDate() + 1); // Sumar un día al valor de 'hasta'

      const filtroMedId = (this.formfiltro.get('medId') as FormControl).value?.toLowerCase();
      const filtroSerDescripcion = (this.formfiltro.get('serDescripcion') as FormControl).value?.toLowerCase();
      const filtroMedValor = (this.formfiltro.get('medValor') as FormControl).value?.toLowerCase();
  
      this.MedicionesTablaFiltrados = this.MedicionesTabla.filter((medicion) => {
      const valorMedId = medicion.medId.toString().toLowerCase();
      const valorSerDescripcion = medicion.serDescripcion.toString().toLowerCase();
      const valorMedValor = medicion.medValor.toString().toLowerCase();
      const fechaAlarma = new Date(medicion.medFechaHoraSms);

      return (
          (!filtroMedId || valorMedId.includes(filtroMedId)) &&
          (!filtroSerDescripcion || valorSerDescripcion.includes(filtroSerDescripcion)) &&
          (!filtroMedValor || valorMedValor.includes(filtroMedValor)) &&
          (fechaAlarma >= desde && fechaAlarma <= hasta)
        );
      });

      this.dataSourceMediciones = new MatTableDataSource(this.MedicionesTablaFiltrados);
      if (this.paginatorMediciones) {
        this.dataSourceMediciones.paginator = this.paginatorMediciones;
        this.paginatorMediciones.firstPage();
      }
      if (this.sortMediciones) {
        this.dataSourceMediciones.sort = this.sortMediciones;
      }  
    }
  }

  // Extraer servicios a la central selecciona
  agregarServicio(servicios: ServicioClass): void { 
    if (this.ServiciosGraficar.length <1){
      const index = this.ServiciosCentral.indexOf(servicios);
      if (index !== -1) {
        this.ServiciosCentral.splice(index, 1);
        this.ServiciosGraficar.push(servicios);
      }
      this.validarFiltradoServicios();   

      this.dataSourceServicioDisponible = new MatTableDataSource(this.ServiciosCentral);
      if (this.paginatorServicioDisponible) {
        this.dataSourceServicioDisponible.paginator = this.paginatorServicioDisponible;
        this.paginatorServicioDisponible.firstPage();
      }
      if (this.sortServicioDisponible) {
        this.dataSourceServicioDisponible.sort = this.sortServicioDisponible;
      }     
  
      this.dataSourceServicioGraficar = new MatTableDataSource(this.ServiciosGraficar);
      if (this.paginatorServicioGraficar) {
        this.dataSourceServicioGraficar.paginator = this.paginatorServicioGraficar;
        this.paginatorServicioGraficar.firstPage();
      }
      if (this.sortServicioGraficar) {
        this.dataSourceServicioGraficar.sort = this.sortServicioGraficar;
      }  
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Solo se permite ingresar un solo Servicio.',
        icon: 'warning',
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
        footer: 'Por favor, extrae el Servicio actual antes de ingresar uno nuevo.'
      });
    }     
  }

  // Extraer servicios a la central selecciona
  extraerServicio(servicios: ServicioClass): void {
    const index = this.ServiciosGraficar.indexOf(servicios);
    if (index !== -1) {
      this.ServiciosGraficar.splice(index, 1);
      this.ServiciosCentral.push(servicios);
    }
    this.validarFiltradoServiciosGraficar();  

    this.dataSourceServicioDisponible = new MatTableDataSource(this.ServiciosCentral);
    if (this.paginatorServicioDisponible) {
      this.dataSourceServicioDisponible.paginator = this.paginatorServicioDisponible;
      this.paginatorServicioDisponible.firstPage();
    }
    if (this.sortServicioDisponible) {
      this.dataSourceServicioDisponible.sort = this.sortServicioDisponible;
    }     
    
    this.dataSourceServicioGraficar = new MatTableDataSource(this.ServiciosGraficar);
    if (this.paginatorServicioGraficar) {
      this.dataSourceServicioGraficar.paginator = this.paginatorServicioGraficar;
      this.paginatorServicioGraficar.firstPage();
    }
    if (this.sortServicioGraficar) {
      this.dataSourceServicioGraficar.sort = this.sortServicioGraficar;
    }  
  } 

  seleccionarCentral(element: any) {

    this.isCollapsed1 = !this.isCollapsed1;
    this.centralNroSeleccionada = element.cenNro;
    this.titulo2 = 'General Reporte para la Central N°' + element.cenNro + ':';

    this.centralNroSeleccionada = element.cenNro;
    this.coorXSeleccionada = element.cenCoorX;
    this.coorYSeleccionada= element.cenCoorY;

    this.isCollapsed1 = !this.isCollapsed1;
    this.ServiciosGraficar = [];
    this.centralConsultar.obtenerServicioXCentralEstado(this.centralNroSeleccionada).subscribe(data => {
      this.ServiciosCentral = data.filter((servicio: { serTipoGrafico: number; }) => servicio.serTipoGrafico != 5);

      this.dataSourceServicioDisponible = new MatTableDataSource(this.ServiciosCentral);
      if (this.paginatorServicioDisponible) {
        this.dataSourceServicioDisponible.paginator = this.paginatorServicioDisponible;
        this.paginatorServicioDisponible.firstPage();
      }
      if (this.sortServicioDisponible) {
        this.dataSourceServicioDisponible.sort = this.sortServicioDisponible;
      }

    });
    
    this.goToNextStep(1)

  }

  GenerarReporte(): void {
    var hoy = new Date();
    var desde = new Date();
    var hasta = new Date();
    if (this.op1) { desde.setDate(desde.getDate() - 7); }
    if (this.op2) { desde.setDate(desde.getDate() - 15); }
    if (this.op3) { desde.setMonth(desde.getMonth() - 1); }
    if (this.op4) { desde.setMonth(desde.getMonth() - 3); }
    if (this.op5) { desde.setMonth(desde.getMonth() - 6); }
    if (this.op6) { desde.setMonth(desde.getMonth() - 12); }
    if (this.op7) {      
      var fechaDesde = this.formReporte.value.fecha_desde ?? null;
      var fechaSeleccionada = new Date(fechaDesde);
      fechaSeleccionada.setDate(fechaSeleccionada.getDate() ); // Sumar un día
      fechaSeleccionada.setHours(0, 0, 0, 0);
      desde = fechaSeleccionada;
  
      var fechaHasta = this.formReporte.value.fecha_hasta ?? null;
      fechaSeleccionada = new Date(fechaHasta);
      fechaSeleccionada.setDate(fechaSeleccionada.getDate() ); // Sumar un día
      fechaSeleccionada.setHours(0, 0, 0, 0);
      hasta = fechaSeleccionada;    
    }

    function mostrarError(mensaje: string, footer: string) {
      Swal.fire({
        title: 'Error',
        text: mensaje,
        icon: 'warning',
        confirmButtonColor: '#0f425b',
        confirmButtonText: 'Aceptar',
        footer: footer
      });
    }

    if (this.ServiciosGraficar.length === 0) {
      mostrarError('Debe seleccionar al menos un servicio para graficar.', 'Ingrese un Servicio para Graficar.');
    } else if (!this.op1 && !this.op2 && !this.op3 && !this.op4 && !this.op5 && !this.op6 && !this.op7 ) {
      mostrarError('Por favor, ingrese un periodo a monitorear.', 'Por favor, introduzca un periodo a monitorear.');
    }else if (fechaDesde === null || isNaN(desde.getTime())) {
      mostrarError('Ingrese una fecha de desde válida.', 'Por favor, ingrese una fecha de hasta válida para generar el gráfico.');
    } else if (fechaHasta === null || isNaN(hasta.getTime())) {
      mostrarError('Ingrese una fecha de hasta válida.', 'Por favor, ingrese una fecha de hasta válida para generar el gráfico.');
    } else if (desde > hasta) {
      mostrarError('La fecha "desde" es posterior a la fecha "hasta".', 'Por favor, cambie el rango de fechas seleccionado para generar el gráfico.');
    } else if (hasta > hoy) {
      mostrarError('La fecha "desde" no puede ser posterior a la fecha actual.', 'Por favor, cambie el rango de fechas seleccionado para generar el gráfico.');
    } else {

    this.habilitarBotonPDF = true;

    // Obtén el contenedor de los gráficos
    const contenedor = document.getElementById('contenedor-graficos');

    // Remueve todos los hijos del contenedor
    while (contenedor?.firstChild) {
      contenedor.removeChild(contenedor.firstChild);
    }   

    // Agregar un día a la fecha 'hasta'    
    hasta.setDate(hasta.getDate() + 1);    

    var mostrarValores: boolean = true;
    this.medicionesConsultar.obtenerMediciones(this.centralNroSeleccionada, desde, hasta)      
      .subscribe(data => { this.Mediciones = data.filter((medicion: { medSer: number; }) => medicion.medSer === this.ServiciosGraficar[0].serId); 

      // saco los valores maximo de las mediciones
      const valoresMax = this.Mediciones.map(medicion => medicion.medValor);
      const valorMaximo = Math.max(...valoresMax);
      this.MedMax = this.Mediciones.filter(medicion => medicion.medValor === valorMaximo);      
            
      // saco los valores minimo de las mediciones
      const valoresMin = this.Mediciones.map(medicion => medicion.medValor);
      const valorMinimo = Math.min(...valoresMin);
      this.MedMin = this.Mediciones.filter(medicion => medicion.medValor === valorMinimo);
    
      // saco el promedio de las mediciones
      const valoresPorm = this.Mediciones.map(medicion => medicion.medValor);
      const p = valoresPorm.reduce((sum, val) => sum + val, 0);
      
      if (this.Mediciones.length > 0) {
        this.promedio = (p / valoresPorm.length).toFixed(2).toString();
      } else {
        this.promedio = '0.00'; // Mostrar 0 cuando no hay valores
      }

      // saco la cantidad de mediciones
      this.cantMed = this.Mediciones.length;

      this.MedicionesTabla =this.Mediciones; 
      this.MedicionesTablaFiltrados = this.Mediciones;

      const contenedor = document.getElementById('contenedor-graficos')!;
      this.Mediciones = data.filter((medicion: { medSer: number; }) => medicion.medSer === this.ServiciosGraficar[0].serId); 

      createAndRenderChart(contenedor, this.Mediciones, 1, [this.ServiciosGraficar[0]], 1);
      
      this.dataSourceMediciones = new MatTableDataSource(this.MedicionesTablaFiltrados);
      if (this.paginatorMediciones) {
        this.dataSourceMediciones.paginator = this.paginatorMediciones;
        this.paginatorMediciones.firstPage();
      }
      if (this.sortMediciones) {
        this.dataSourceMediciones.sort = this.sortMediciones;
      }  
      
    });    

    function createAndRenderChart(container: HTMLElement, mediciones: any[], i: number, servicios: any[], nroIf: number): void {
      const graficoId = `grafico${i}`;

      const graficoDiv = document.createElement('div');
      graficoDiv.id = graficoId;
      graficoDiv.style.width = '1050px';
      graficoDiv.style.height = '500px';
    
      const contenedorDiv = document.createElement('div');
      contenedorDiv.style.float = 'left';
      contenedorDiv.appendChild(graficoDiv);
      container.appendChild(contenedorDiv);
    
      const chartDom = document.getElementById(graficoId)!;
      const myChart = echarts.init(chartDom);
    
      const xAxisData = mediciones.map(medicion => {
        const fecha = new Date(medicion.medFechaHoraSms);
        const year = fecha.getFullYear();
        const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const day = fecha.getDate().toString().padStart(2, '0');
        const hours = fecha.getHours().toString().padStart(2, '0');
        const minutes = fecha.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      });
    
      interface SeriesOption {
        name: string;
        type: string;
        areaStyle: any;
        lineStyle: { width: number };
        emphasis: { focus: string };
        markArea: { silent: boolean; itemStyle: { opacity: number } };
        data: number[];
        markPoint?: { data: any[] };
        markLine?: { data: any[] };
      }
      
      function filterServicios(servicios: any[], mediciones: any[], nroIf: number): { dataLegend: string[]; series: SeriesOption[] } {
        let dataLegend: string[] = [];
        let series: SeriesOption[] = [];
      
        switch (nroIf) {
          case 1:
            dataLegend = servicios
              .filter(servicio => servicio.serTipoGrafico !== 5)
              .map(servicio => servicio.serDescripcion);
            series = filterSeries(servicios, mediciones, servicio => servicio.serTipoGrafico !== 5);
            break;         
        }      
        return { dataLegend, series };
      }
      
      function filterSeries( servicios: any[], mediciones: any[], filterFn: (servicio: any) => boolean): SeriesOption[] {
        return servicios
          .filter(filterFn)
          .map(servicio => {
            const seriesData = mediciones
              .filter(medicion => medicion.medSer === servicio.serId)
              .map(medicion => medicion.medValor);      
            return {
              name: servicio.serDescripcion,
              type: 'line',
              areaStyle: {},
              lineStyle: { width: 1 },
              emphasis: { focus: 'series' },
              markArea: { silent: true, itemStyle: { opacity: 0.3 } },
              data: seriesData,
              markPoint: { data: mostrarValores ? [{ type: 'max', name: 'Maximo' }, { type: 'min', name: 'Minimo' }] : [] },
              markLine: {
                data: mostrarValores ? [
                  { type: 'average', name: 'Promedio' },
                  { type: 'max', name: 'Maximo' },
                  { type: 'min', name: 'Minimo' },
                  [{ symbol: 'none', x: '80%', yAxis: 'max' },
                  {  label: { position: 'start', formatter: 'Maximo' },
                    type: 'max', name: 'Maximo' }
                  ],
                  [{ symbol: 'none', x: '80%', yAxis: 'min' },
                  { label: { position: 'start', formatter: 'Minimo' },
                    type: 'min', name: 'Minimo' }
                  ],
                  [{ symbol: 'none', x: '80%', yAxis: 'average' },
                  { label: { position: 'start', formatter: 'Promedio' },
                    type: 'average', name: 'Promedio' }
                  ]
                ] : []              
              }  
            };
          });
      }
      
      const { dataLegend, series } = filterServicios(servicios, mediciones, nroIf);
      
      const option = {
        grid: { bottom: 80 },
        toolbox: { feature: { dataZoom: { yAxisIndex: 'none' },
        //dataView: { readOnly: false },
        dataView: {
          readOnly: false,
          optionToContent: function (opt: any) {
            const xAxisData = opt.xAxis[0].data;
            const seriesData = opt.series.map((serie: any) => serie.data);
            const seriesNames = opt.series.map((serie: any) => serie.name);
            let content = '<table style="width:100%;text-align:center"><tbody><tr>';
            content += '<td style="padding: 0 10px;"></td>'; // Celda vacía para alinear la primera columna
            for (let i = 0; i < seriesNames.length; i++) {
              content += `<td style="padding: 0 10px;"><strong>${seriesNames[i]}</strong></td>`; // Agregar el nombre de la serie
            }    
            content += '</tr>';    
            for (let j = 0; j < xAxisData.length; j++) {
              content += '<tr>';
              content += `<td style="padding: 0 10px;">${xAxisData[j]}</td>`; // Agregar el valor del eje X
              for (let k = 0; k < seriesData.length; k++) {
                const value = seriesData[k][j] || 'NaN'; // Obtener el valor de la serie o 'NaN' si es nulo
                content += `<td style="padding: 0 10px;">${value}</td>`; // Agregar el valor de la serie
              }    
              content += '</tr>';
            }    
            content += '</tbody></table>';    
            return content;
          },
          title: 'Vista de datos',
          lang: ['Vista de datos', 'Cerrar', 'Actualizar']
        },
        magicType: { type: ['line', 'bar'] },
        restore: {}, saveAsImage: {},
        myTool2: {
          show: true,
          title: 'Mostrar Máximos y Mínimos',
          icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
          onclick: ()=> {
            mostrarValores = !mostrarValores;
            if (option.series instanceof Array && option.series[0]) {
              option.series[0].markPoint = {
                data: mostrarValores ? [{ type: 'max', name: 'Maximo' }, { type: 'min', name: 'Minimo' }] : []
              };
              option.series[0].markLine = {
                data: mostrarValores ? [
                  { type: 'average', name: 'Promedio' },
                  { yAxis: 'max', name: 'Maximo' },
                  { yAxis: 'min', name: 'Minimo' },

                  [{ symbol: 'none', x: '80%', yAxis: 'max' },
                    {  label: { position: 'start', formatter: 'Maximo' },
                      type: 'max', name: 'Maximo' }
                  ],
                  [{ symbol: 'none', x: '80%', yAxis: 'min' },
                  { label: { position: 'start', formatter: 'Minimo' },
                    type: 'min', name: 'Minimo' }
                  ],
                  [{ symbol: 'none', x: '80%', yAxis: 'average' },
                  { label: { position: 'start', formatter: 'Promedio' },
                    type: 'average', name: 'Promedio' }
                  ]
                ] : []
              };
            }
            myChart.setOption(option);
          }
        }
        
      } },
        tooltip: { trigger: 'axis', axisPointer: { type: 'cross', animation: false, label: { backgroundColor: '#505765' } } },
        legend: { data: dataLegend, left: 10 },
        dataZoom: [{ show: true, realtime: true, start: 0, end: 100 }, { type: 'inside', realtime: true, start: 0, end: 100 }],
        xAxis: [{ type: 'category', boundaryGap: false, axisLine: { onZero: false }, data: xAxisData.map(str => str.replace(' ', '\n')) }],
        yAxis: [{ type: 'value' }, { nameLocation: 'start', alignTicks: true, type: 'value', inverse: true }],
        series: series                         
      };    
      myChart.setOption(option);
    }
    }
  }
}
