 export class CentralClienteConsultaClass  {

  cliTipoDoc : number;
  cliNroDoc: string;
  cliApeNomDen : string;
  usuario : string;
  tdDescripcion: string;

    constructor(
      cliTipoDoc : number,
      cliNroDoc: string,
      cliApeNomDen : string,
      usuario : string,
      tdDescripcion: string,
    ) {
      this.cliTipoDoc = cliTipoDoc;
      this.cliNroDoc = cliNroDoc;
      this.cliApeNomDen = cliApeNomDen;
      this.usuario = usuario;
      this.tdDescripcion = tdDescripcion;
    }
  }