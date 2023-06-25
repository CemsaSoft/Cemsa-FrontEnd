 export class ServicioClass  {
    serId : number;
    serDescripcion: string;
    serUnidad: string;
    serTipoGrafico: number;
  
    constructor(
        serId: number,
        serDescripcion: string,
        serUnidad: string,
        serTipoGrafico:number,
    ) {
      this.serId = serId;
      this.serDescripcion = serDescripcion;
      this.serUnidad = serUnidad;
      this.serTipoGrafico = serTipoGrafico;
    }
  }