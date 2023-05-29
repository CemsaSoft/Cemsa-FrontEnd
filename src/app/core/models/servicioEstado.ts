 export class ServicioEstadoClass  {
    serId : number;
    serDescripcion: string;
    serUnidad: string;
    estDescripcion: string;
    serTipoGrafico: number;

    constructor(
        serId: number,
        serDescripcion: string,
        serUnidad: string,
        estDescripcion: string,
        serTipoGrafico:number,
    ) {
      this.serId = serId;
      this.serDescripcion = serDescripcion;
      this.serUnidad = serUnidad;
      this.estDescripcion = estDescripcion;
      this.serTipoGrafico = serTipoGrafico;
    }
  }