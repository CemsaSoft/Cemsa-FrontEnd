 export class ServicioClass  {
    serId : number;
    serDescripcion: string;
    serUnidad: string;
  
    constructor(
        serId: number,
        serDescripcion: string,
        serUnidad: string,
    ) {
      this.serId = serId;
      this.serDescripcion = serDescripcion;
      this.serUnidad = serUnidad;
    }
  }