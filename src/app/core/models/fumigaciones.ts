export class FumigacionesClass {
  fumId: number;
  fumFechaAlta: Date;
  fumFechaRealizacion: Date;
  fumObservacion: string;

  constructor(
    fumId: number,
    fumFechaAlta: Date,
    fumFechaRealizacion: Date,
    fumObservacion: string
  ) {
    this.fumId = fumId;
    this.fumFechaAlta = fumFechaAlta;
    this.fumFechaRealizacion = fumFechaRealizacion;
    this.fumObservacion = fumObservacion;
  }
}
