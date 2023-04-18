 export class ServicioClass  {
    serId : number;
    serDescripcion: string;
    serUnidad: number;
  
    constructor(
        serId: number,
        serDescripcion: string,
        serUnidad: number,
    ) {
      this.serId = serId;
      this.serDescripcion = serDescripcion;
      this.serUnidad = serUnidad;
    }
  }