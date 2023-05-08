 export class TipoDocumentoClass  {
    tdId : number;
    tdDescripcion: string;
   
    constructor(
      tdId: number,
      tdDescripcion: string,
    ) {
      this.tdId = tdId;
      this.tdDescripcion = tdDescripcion;
    }
  }