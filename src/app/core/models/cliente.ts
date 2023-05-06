 export class ClienteClass  {

  cliTipoDoc : number;
  cliNroDoc: string;
  cliIdUsuario : number;
  cliFechaAlta : Date;
  fechaBaja : Date;
  cliApeNomDen : string;
  cliEmail : string;
  cliTelefono : string;
  usuario: string;
  tdDescripcion: string ;       

    constructor(
      cliTipoDoc : number,
      cliNroDoc: string,
      cliIdUsuario : number,
      cliFechaAlta : Date,
      fechaBaja : Date,
      cliApeNomDen : string,
      cliEmail : string,
      cliTelefono : string,
      usuario: string,
      tdDescripcion: string,    
    ) {
      this.cliTipoDoc = cliTipoDoc;
      this.cliNroDoc = cliNroDoc;
      this.cliIdUsuario = cliIdUsuario;
      this.cliFechaAlta = cliFechaAlta;
      this.fechaBaja = fechaBaja;
      this.cliApeNomDen = cliApeNomDen;
      this.cliEmail = cliEmail;
      this.cliTelefono = cliTelefono;
      this.usuario = usuario;
      this.tdDescripcion = tdDescripcion;    
    }
  }