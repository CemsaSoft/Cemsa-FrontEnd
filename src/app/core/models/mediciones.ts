export class MedicionesClass  {
  medId: number;
  medNro: number;
  medSer: number;
  medValor: number;
  medFechaHoraSms: Date;
  medFechaHoraBd: Date;
  medObservacion: string;
    
  constructor(
    medId: number,
    medNro: number,
    medSer: number,
    medValor: number,
    medFechaHoraSms: Date,
    medFechaHoraBd: Date,
    medObservacion: string,
  ) {
    this.medId = medId;
    this.medNro = medNro;
    this.medSer = medSer;
    this.medValor = medValor;
    this.medFechaHoraSms = medFechaHoraSms;
    this.medFechaHoraBd = medFechaHoraBd;
    this.medObservacion = medObservacion;
  }
}
