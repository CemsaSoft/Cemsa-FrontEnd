export class MedicionesConsultaClass  {
    medValor: number;
    medFechaHoraSms: Date;
    serTipoGrafico: number;
      
    constructor(      
      medValor: number,
      medFechaHoraSms: Date,
      serTipoGrafico: number,
    ) {
      this.medValor = medValor;
      this.medFechaHoraSms = medFechaHoraSms;
      this.serTipoGrafico = serTipoGrafico;
    }
  }
  