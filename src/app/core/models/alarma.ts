 export class AlarmaClass  {
    almId: number;
    almIdMedicion: number;
    cenNro: number;
    serDescripcion: string;
    almMensaje: string;
    medValor: number;
    almFechaHoraBD: Date;
    almVisto: boolean;

    constructor(
      almId: number,
      almIdMedicion: number,
      cenNro: number,
      serDescripcion: string,
      almMensaje: string,
      medValor: number,
      almFechaHoraBD: Date,
      almVisto: boolean,
    ) {
      this.almId = almId;
      this.almIdMedicion = almIdMedicion;
      this.serDescripcion = serDescripcion;
      this.cenNro = cenNro;
      this.almMensaje = almMensaje;
      this.medValor = medValor;
      this.almFechaHoraBD = almFechaHoraBD;
      this.almVisto = almVisto;
    }
  }