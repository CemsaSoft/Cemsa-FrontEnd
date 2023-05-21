 export class ServicioEstadoClass  {
    serId : number;
    serDescripcion: string;
    serUnidad: string;
    estDescripcion: string;
  
    constructor(
        serId: number,
        serDescripcion: string,
        serUnidad: string,
        estDescripcion: string,
    ) {
      this.serId = serId;
      this.serDescripcion = serDescripcion;
      this.serUnidad = serUnidad;
      this.estDescripcion = estDescripcion;
    }
  }