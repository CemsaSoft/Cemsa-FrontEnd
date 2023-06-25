 export class AlarmaClass  {
    almId: number;
    almIdMedicion: number;
    almMensaje: string;
    almFechaHoraBD: Date;
    almVisto: boolean;

    constructor(
      almId: number,
      almIdMedicion: number,
      almMensaje: string,
      almFechaHoraBD: Date,
      almVisto: boolean,
    ) {
      this.almId = almId;
      this.almIdMedicion = almIdMedicion;
      this.almMensaje = almMensaje;
      this.almFechaHoraBD = almFechaHoraBD;
      this.almVisto = almVisto;
    }
  }