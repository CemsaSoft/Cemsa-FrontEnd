export class FumigacionesClass {
  fumId: number;
  fumNroCentral: number;
  fumFechaAlta: Date;
  fumFechaRealizacion: Date;
  fumObservacion: string;

  constructor(
    fumId: number,
    fumNroCentral: number,
    fumFechaAlta: Date,
    fumFechaRealizacion: Date,
    fumObservacion: string
  ) {
    this.fumId = fumId;
    this.fumNroCentral = fumNroCentral;
    this.fumFechaAlta = fumFechaAlta;
    this.fumFechaRealizacion = fumFechaRealizacion;
    this.fumObservacion = fumObservacion;
  }
}
