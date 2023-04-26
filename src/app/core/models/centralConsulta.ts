 export class CentralConsultaClass  {
    cenNro: number;
    cliApeNomDen: string;
    usuario: string;
    estDescripcion: string;
    estId: number;

    constructor(
        cenNro: number,
        cliApeNomDen: string,
        usuario: string,
        estDescripcion: string,
        estId:number,
    ) {
      this.cenNro = cenNro;
      this.cliApeNomDen = cliApeNomDen;
      this.usuario = usuario;
      this.estDescripcion = estDescripcion;
      this.estId = estId;
    }
  }