 export class CentralConsultaClass  {
    cenNro: number;
    cliApeNomDen: string;
    usuario: string;
    estDescripcion: string;

    constructor(
        cenNro: number,
        cliApeNomDen: string,
        usuario: string,
        estDescripcion: string,
    ) {
      this.cenNro = cenNro;
      this.cliApeNomDen = cliApeNomDen;
      this.usuario = usuario;
      this.estDescripcion = estDescripcion;
    }
  }