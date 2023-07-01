//SISTEMA
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
} from '@angular/forms';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { MatStepper } from '@angular/material/stepper';

//COMPONENTES
import { CentralConsultaClass } from 'src/app/core/models/centralConsulta';
import { MedicionesConsultaClass } from 'src/app/core/models/medicionesConsulta';

//SERVICIOS
import { CentralService } from 'src/app/core/services/central.service';
import { MedicionesService } from 'src/app/core/services/mediciones.service'


import * as echarts from 'echarts';
//import * as echarts from 'echarts/core';
import { GaugeChart, GaugeSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { EChartsOption, PictorialBarSeriesOption } from 'echarts/types/dist/shared';

import { TreeChart } from 'echarts/charts';
import { SVGRenderer } from 'echarts/renderers';
import { IfStmt } from '@angular/compiler';

//echarts.use([SVGRenderer, GaugeChart, CanvasRenderer]);
//echarts.use([GaugeChart, CanvasRenderer]);

@Component({
  selector: 'app-consultar-mediciones-actuales',
  templateUrl: './consultar-mediciones-actuales.component.html',
  styleUrls: ['./consultar-mediciones-actuales.component.css']
})

export class ConsultarMedicionesActualesComponent implements OnInit {
  //STEPPER
  titulo1 = 'Seleccionar Central para Ver sus Mediciones Actuales';
  titulo2 = 'Mediciones Actuales de la Central N°:';
  titulo3 = ':';
  isStep1Completed = false;
  isStep2Completed = false;
  isStep3Completed = false;

  @ViewChild(MatStepper, { static: false }) stepper: MatStepper | undefined;

  //VARIABLES DE OBJETOS LIST
  CentralConsulta: CentralConsultaClass[] = [];
  CentralConsultaFiltrados: CentralConsultaClass [] = [];
  MedicionesConsulta: MedicionesConsultaClass[] = [];

  //VARIABLES DE DATOS
  propiedadOrdenamiento: string = 'cenNro';

  tipoOrdenamiento: number = 1;
  centralNroSeleccionada: number=0;
  idUsuario: any = 0;

  //PAGINADO
  pageSizeCentral = 5; // Número de elementos por página
  currentPageCentral = 1; // Página actual
  totalItemsCentral = 0; // Total de elementos en la tabla

  isCollapsed1 = false;
  isCollapsed2 = false;
  sinMedicones = true;

  constructor(
    private centralConsultar: CentralService, 
    private MedicionesService: MedicionesService,
  ) 
  { 
  }
  
  ngOnInit(): void {
    this.idUsuario = localStorage.getItem('idUsuario');
    this.centralConsultar.listaCentralesCliente(this.idUsuario).subscribe(data => {
      this.CentralConsulta = data;
      this.CentralConsultaFiltrados = data;
    });
  }

  graf5(medicion: number): void {
    var chartDom = document.getElementById('grafico5')!;
    var myChart = echarts.init(chartDom);
    var option;
  
    const symbols = [
      'path://M305.949,424.6c0-1.9,0-1.9,0-3.799V133.9c0-11.5-7.6-19.1-19.099-19.1c-11.5,0-19.1,9.6-19.1,19.1v286.901 c0,1.898,0,1.898,0,3.799c-23,7.701-38.2,28.701-38.2,53.5c0,32.5,24.9,57.4,57.4,57.4c32.499,0,57.399-24.9,57.399-57.4 C344.25,453.301,328.949,432.301,305.949,424.6z'
    ];
    const bodyMax = 80;
    const labelSetting = {
      show: true,
      position: 'top',
      offset: [0, -20], // Ajusta el desplazamiento vertical en píxeles
      formatter: function (param: { value: number; }) {
        return (param.value -20 ).toFixed(1) + '°C';
      },
      fontSize: 20,
      fontFamily: 'Arial'
    };
    const lineaP60 = {
      symbol: 'none',
      lineStyle: { opacity: 0.5 },
      data: [{type: 'min',label: {formatter: '60', fontSize: 20 }}]
    };;
    const lineaP40 = {
      symbol: 'none',
      lineStyle: { opacity: 0.5 },
      data: [{type: 'min',label: {formatter: '40', fontSize: 20}}]
    };
    const lineaP20 = {
      symbol: 'none',
      lineStyle: { opacity: 0.5 },
      data: [{type: 'min',label: {formatter: '20', fontSize: 20}}]
    };
    const lineaCero = {
      symbol: 'none',
      lineStyle: { opacity: 0.5 },
      data: [{type: 'min',label: {formatter: ' 0', fontSize: 20}}]
    };
    const lineaM20 = {
      symbol: 'none',
      lineStyle: { opacity: 0.5 },
      data: [{type: 'min',label: {formatter: '-20', fontSize: 20}}]
    };
    option = {
      xAxis: {
        data: ['a'],
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: { show: false },        
      },
      yAxis: {
        min: 0, 
        max: bodyMax,
        offset: -140, 
        splitLine: { show: true },
        axisLabel: { show: false }
      },
      grid: { left: '45%', top: 'center', height: 230 },
      markLine: {
        z: -100
      },
      series: [
        {
          name: 'typeA',
          type: 'pictorialBar',
          symbolClip: true,
          symbolBoundingData: [0, bodyMax],
          itemStyle: { color: '#fd666d' },
          label: labelSetting,
          data: [{ value: (medicion+20), symbol: symbols[0], symbolOffset: [0, '0%'] }],
          z: 10,
          barWidth: '30%',
        },
        {
          name: 'background',
          type: 'pictorialBar',
          symbolBoundingData: [0, bodyMax],
          animationDuration: 0,
          itemStyle: { color: '#ccc' },
          data: [{ value: bodyMax, symbol: symbols[0], symbolOffset: [0, '0%'] }],
          barWidth: '30%',
          markLine: lineaP60,
        },
        {
          name: 'p40',
          type: 'pictorialBar',
          symbolBoundingData: [0, bodyMax],
          animationDuration: 0,
          itemStyle: { color: '#ccc' },
          data: [{ value: 60, symbol: symbols[0]  }],
          barWidth: '30%',
          markLine: lineaP40,
        },
        {
          name: 'p20',
          type: 'pictorialBar',
          symbolBoundingData: [0, bodyMax],
          animationDuration: 0,
          itemStyle: { color: '#ccc' },
          data: [{ value: 40, symbol: symbols[0]  }],
          barWidth: '30%',
          markLine: lineaP20,
        },
        {
          name: 'cero',
          type: 'pictorialBar',
          symbolBoundingData: [0, bodyMax],
          animationDuration: 0,
          itemStyle: { color: '#ccc' },
          data: [{ value: 20, symbol: symbols[0]  }],
          barWidth: '30%',
          markLine: lineaCero,
        },
        {
          name: 'M20',
          type: 'pictorialBar',
          symbolBoundingData: [0, bodyMax],
          animationDuration: 0,
          itemStyle: { color: '#ccc' },
          data: [{ value: 0, symbol: symbols[0]  }],
          barWidth: '30%',
          markLine: lineaM20,
        }
      ]
    };
    option && myChart.setOption(option);
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
  
  toggleCollapse1() {
    this.isCollapsed1 = !this.isCollapsed1;
  }
  toggleCollapse2() {
    this.isCollapsed2 = !this.isCollapsed2;
  }

  //Valida que exista alguna Central que responda al filtro.
  validarFiltrado(): Boolean {
    if (this.CentralConsultaFiltrados.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  //Almacena los datos del servicio que fue seleccionado en la tabla de servicio filtrados dentro de variables locales.
  esfilaSeleccionada(centralConsulta: CentralConsultaClass) {
    this.centralNroSeleccionada = centralConsulta.cenNro;
  }

  //Filtro de Central por código de central.
  esFiltrar(event: Event, campo: string) {
    let txtBuscar = (event.target as HTMLInputElement).value;
    let filtro = txtBuscar
      .replace(/[^\w\s]/g, '')
      .trim()
      .toLowerCase();
    this.CentralConsultaFiltrados = [];
    this.CentralConsulta.forEach((centralConsulta) => {
      if (
        (campo === 'codigo' && centralConsulta.cenNro.toString().toLowerCase().includes(filtro)) 
      ) {
        this.CentralConsultaFiltrados.push(centralConsulta);
      }
    });
  }                                 

  //Metodos para grilla
  //Almacena en una variable la propiedad por la cual se quiere ordenar la consulta de Central.
  ordenarPor(propiedad: string) {
    this.tipoOrdenamiento =
      propiedad === this.propiedadOrdenamiento ? this.tipoOrdenamiento * -1 : 1;
    this.propiedadOrdenamiento = propiedad;
  }

  //En base a la propiedad por la que se quiera ordenar y el tipo de orden muestra un icono.
  ordenarIcono(propiedad: string) {
    if (propiedad === this.propiedadOrdenamiento) {
      return this.tipoOrdenamiento === 1 ? '🠉' : '🠋';
    } else {
      return '🠋🠉';
    }
  }  

  seleccionarCentral(){
    this.isCollapsed1 = !this.isCollapsed1;
    this.titulo2 = 'Mediciones Actuales de la Central N°:' + this.centralNroSeleccionada;

    this.MedicionesConsulta = [];
    // Obtén el contenedor de los gráficos
    const contenedor = document.getElementById('contenedor-graficos');

    // Remueve todos los hijos del contenedor
    while (contenedor?.firstChild) {
      contenedor.removeChild(contenedor.firstChild);
    }   

    this.MedicionesService.obtenerUltimaMedicionesXCentral(this.centralNroSeleccionada).subscribe(data => {
      this.MedicionesConsulta = data;
  
      if (this.MedicionesConsulta.length == 0) {
        this.sinMedicones = false;
      } else {
        this.sinMedicones = true;
      }

      const contenedor = document.getElementById('contenedor-graficos')!;
      let medicion: number = 0;
  
      for (let i = 0; i < this.MedicionesConsulta.length; i++) {
        const graficoId = `grafico${i}`;
        const graficoDiv = document.createElement('div');
        graficoDiv.id = graficoId;
        graficoDiv.style.width = '300px';
        graficoDiv.style.height = '300px';
      
        const cartelTitulo = document.createElement('div');    
        if (this.MedicionesConsulta[i].serTipoGrafico === 1) { cartelTitulo.textContent = 'HUMEDAD DE SUELO '; }
        if (this.MedicionesConsulta[i].serTipoGrafico === 2) { cartelTitulo.textContent = 'HUMEDAD AMBIENTE'; }
        if (this.MedicionesConsulta[i].serTipoGrafico === 3) { cartelTitulo.textContent = 'TEMPERATURA'; }
        if (this.MedicionesConsulta[i].serTipoGrafico === 4) { cartelTitulo.textContent = 'DIRECCION DEL VIENTO'; }
        if (this.MedicionesConsulta[i].serTipoGrafico === 5) { cartelTitulo.textContent = 'VELOCIDAD DEL VIENTO'; }
        cartelTitulo.style.textAlign = 'center';
        cartelTitulo.style.fontWeight = 'bold';
      
        const cartelFecha = document.createElement('div');

        const fechaHora = new Date(this.MedicionesConsulta[i].medFechaHoraSms);
        const fechaFormateada = `${fechaHora.getFullYear()}-${(fechaHora.getMonth() + 1).toString().padStart(2, '0')}-${fechaHora.getDate().toString().padStart(2, '0')}`;
        const horaFormateada = `${fechaHora.getHours().toString().padStart(2, '0')}:${fechaHora.getMinutes().toString().padStart(2, '0')}:${fechaHora.getSeconds().toString().padStart(2, '0')}`;
        cartelFecha.textContent = `Fecha: ${fechaFormateada} - Hora: ${horaFormateada}`;
        
        cartelFecha.style.textAlign = 'center';
        
        const espacio1 = document.createElement('br');
        const espacio2 = document.createElement('br');

        const contenedorDiv = document.createElement('div');
        contenedorDiv.style.float = 'left';

        if (i+1 % 3 === 1) {        
          contenedorDiv.style.clear = 'both';
        }
      
        contenedorDiv.appendChild(cartelTitulo);
        contenedorDiv.appendChild(graficoDiv);
        contenedorDiv.appendChild(cartelFecha);
        contenedorDiv.appendChild(espacio1);
        contenedorDiv.appendChild(espacio2);
      
        contenedor.appendChild(contenedorDiv);
      
      
        const chartDom = document.getElementById(graficoId)!;
        const myChart = echarts.init(chartDom);
  
        let option: EChartsOption = {};
        if (this.MedicionesConsulta[i].serTipoGrafico === 1) { option = crearGraficoOpcion1(); medicion = this.MedicionesConsulta[i].medValor; }
        if (this.MedicionesConsulta[i].serTipoGrafico === 2) { option = crearGraficoOpcion2(); medicion = this.MedicionesConsulta[i].medValor; }
        if (this.MedicionesConsulta[i].serTipoGrafico === 3) { option = crearGraficoOpcion3(this.MedicionesConsulta[i].medValor); }
        if (this.MedicionesConsulta[i].serTipoGrafico === 4) { option = crearGraficoOpcion4(); medicion = this.MedicionesConsulta[i].medValor; }
        if (this.MedicionesConsulta[i].serTipoGrafico === 5) { option = crearGraficoOpcion5(); medicion = this.MedicionesConsulta[i].medValor; }

        if (this.MedicionesConsulta[i].serTipoGrafico != 3){
          setInterval(function (valorMedicion) {
            return function () {
              myChart.setOption<EChartsOption>({
                series: [{ data: [{ value: valorMedicion }] }]
              });
            };
          }(medicion), 2000);
        }

        myChart.setOption(option); 
      }

      function crearGraficoOpcion3(medicion:number):EChartsOption  {
        const symbols = ['path://M305.949,424.6c0-1.9,0-1.9,0-3.799V133.9c0-11.5-7.6-19.1-19.099-19.1c-11.5,0-19.1,9.6-19.1,19.1v286.901 c0,1.898,0,1.898,0,3.799c-23,7.701-38.2,28.701-38.2,53.5c0,32.5,24.9,57.4,57.4,57.4c32.499,0,57.399-24.9,57.399-57.4 C344.25,453.301,328.949,432.301,305.949,424.6z'];
        const bodyMax = 80;      
        const option: EChartsOption = {       
        xAxis: { data: ['a'], axisTick: { show: false }, axisLine: { show: false }, axisLabel: { show: false }},
        yAxis: { min: 0, max: bodyMax, offset: -140, splitLine: { show: true }, axisLabel: { show: false }},
        grid: { left: '5%', top: 'center', height: 230 },
        markLine: { z: -100 },
        series: [
          {
            name: 'typeA',
            type: 'pictorialBar',
            symbolClip: true,
            symbolBoundingData: [0, bodyMax],
            itemStyle: { color: '#fd666d' },
            data: [{
              value: (medicion + 20),
              symbol: symbols[0],
              symbolOffset: [0, '0%'],
              label: {
                show: true,
                position: 'top',
                formatter: (param: { value: number }) => `${param.value -20} ºC`,
                fontSize: 20
              }
            }],
            z: 10,
            barWidth: '30%',
          } as PictorialBarSeriesOption         
          ,
          {
            name: 'background',
            type: 'pictorialBar',
            symbolBoundingData: [0, bodyMax],
            animationDuration: 0,
            itemStyle: { color: '#ccc' },
            data: [{ value: 80, symbol: symbols[0], symbolOffset: [0, '0%'], label: { offset: [70, -124], show: true, position: 'right', formatter: '60', fontSize: 20 } }],
            barWidth: '30%',
          },
          {
            name: 'p40',
            type: 'pictorialBar',
            symbolBoundingData: [0, bodyMax],
            animationDuration: 0,
            itemStyle: { color: '#ccc' },
            data: [{ value: 60, symbol: symbols[0], label: { offset: [70, -64], show: true, position: 'right', formatter: '40', fontSize: 20 } }],
            barWidth: '30%',
          },
          {
            name: 'p20',
            type: 'pictorialBar',
            symbolBoundingData: [0, bodyMax],
            animationDuration: 0,
            itemStyle: { color: '#ccc' },
            data: [{ value: 40, symbol: symbols[0], label: { offset: [70, -8], show: true, position: 'right', formatter: '20', fontSize: 20 } }],
            barWidth: '30%',
          },
          {
            name: 'cero',
            type: 'pictorialBar',
            symbolBoundingData: [0, bodyMax],
            animationDuration: 0,
            itemStyle: { color: '#ccc' },
            data: [{ value: 20, symbol: symbols[0], label: { offset: [75, 50], show: true, position: 'right', formatter: '0', fontSize: 20 } }],
            barWidth: '30%',
          },
          {
            name: 'M20',
            type: 'pictorialBar',
            symbolBoundingData: [0, bodyMax],
            animationDuration: 0,
            itemStyle: { color: '#ccc' },
            data: [{ value: 0, symbol: symbols[0], label: { offset: [60, 110], show: true, position: 'right', formatter: '-20', fontSize: 20 } }],
            barWidth: '30%',
          }
        ]
      };
        return option;
      }
        
      function crearGraficoOpcion5():EChartsOption  {
        const option: EChartsOption = {
          series: [
            { type: 'gauge',        
              axisLine: { lineStyle: { width: 20, color: [ [0.3, '#67e0e3'], [0.7, '#37a2da'], [1, '#fd666d'] ] }},
              pointer: { itemStyle: { color: 'inherit' } },
              axisTick: { distance: -30, length: 15, lineStyle: { color: '#fff', width: 2 } },
              splitLine: { distance: -30, length: 30, lineStyle: { color: '#fff', width: 4 } },
              axisLabel: { color: 'inherit', distance: 28, fontSize: 15 },
              detail: { valueAnimation: true, fontSize: 25 , formatter: '{value} km/h', color: 'inherit',offsetCenter: [0, '75%'] },
              data: [ { value: 100 } ]
            }
          ]
        };
        return option;
      }

      function crearGraficoOpcion2():EChartsOption  {
        const option: EChartsOption = {
          series: [
              {
                type: 'gauge',    
                itemStyle: { color: '#5470c6 ' },  
                progress: { show: true, width: 18 },
                axisLine: { lineStyle: { width: 18 } },
                axisTick: { show: false },
                //splitLine: { length: 15, lineStyle: { width: 2, color: '#999' } },
                splitLine: { distance: -30, length: 30, lineStyle: { color: '#fff', width: 4 } },
                axisLabel: { distance: 30, color: '#999', fontSize: 15 },
                anchor: { show: true, showAbove: true, size: 30, itemStyle: { color: '#5470c6' } },        
                title: { show: false },
                detail: { valueAnimation: true, formatter: '{value} %', fontSize: 25, offsetCenter: [0, '70%'] },      
                data: [ { value: 50 } ]
              }
            ]
          };
        return option;
      }

      function crearGraficoOpcion1():EChartsOption  {
        const option: EChartsOption = {
          series: [
            {
              type: 'gauge',
              itemStyle: { color: '#2E8B57' },
              progress: { show: true, width: 18 },
              axisLine: { lineStyle: { width: 18 } },
              axisTick: { show: false },
              splitLine: { distance: -30, length: 30, lineStyle: { color: '#fff', width: 4 } },
              axisLabel: { distance: 30, color: '#999', fontSize: 15 },
              anchor: { show: true, showAbove: true, size: 30, itemStyle: { color: '#2E8B57' } },        
              title: { show: false },
              detail: { valueAnimation: true, formatter: '{value} %', fontSize: 25, offsetCenter: [0, '70%'] },      
              data: [ { value: 75 } ]
            }
          ]
        };        
        return option;
      }

      function crearGraficoOpcion4():EChartsOption  {
        const option: EChartsOption = {
          series: [
            {
              type: 'gauge',
              itemStyle: { color: '#fd666d' },
              startAngle: 90,
              endAngle: -270,
              min: 0,
              max: 360,
              splitNumber: 8,
              progress: { show: false, width: 20 },
              axisLine: { lineStyle: { width: 15 } },
              axisTick: { show: false },
              splitLine: { length: -30, lineStyle: { width: 4, color: '#999' } },
              axisLabel: { show: true, distance: -10, color: '#999', fontSize: 15,
                formatter: function (value: number) {
                  switch (value) {
                    case 0:   return 'N';
                    case 45:  return 'NE';
                    case 90:  return 'E';
                    case 135: return 'SE';
                    case 180: return 'S';
                    case 225: return 'SO';
                    case 270: return 'O';
                    case 315: return 'NO';
                    default:  return '';
                  }
                }
              },
              anchor: { show: true, showAbove: true, size: 0, itemStyle: { color: '#5470c6' } },
              title: { show: false },
              detail: { show: false},
              data: [{ value: 360 }]
            }
          ]
        };
        return option;
      }

    });
  
  }

  paginaCambiadaCentral(event: any) {
    this.currentPageCentral = event;
    const cantidadPaginasCentral = Math.ceil(
      this.CentralConsultaFiltrados.length / this.pageSizeCentral
    );
    const paginasCentral = [];

    for (let i = 1; i <= cantidadPaginasCentral; i++) {
      paginasCentral.push(i);
    }
    return paginasCentral;
  } 
}

