 export class CentralConsultaClass  {
    cenNro: number;
    cliApeNomDen: string;
    usuario: string;
    estDescripcion: string;
    cenIdEstadoCentral: number;
    cenImei: string;
    cenCoorX: string;
    cenCoorY: string;
    cenFechaAlta: Date;
    cenFechaBaja: Date;

    constructor(
        cenNro: number,
        cliApeNomDen: string,
        usuario: string,
        estDescripcion: string,
        cenIdEstadoCentral:number,
        cenImei: string,
        cenCoorX: string,
        cenCoorY: string,
        cenFechaAlta: Date,
        cenFechaBaja: Date,
    ) {
      this.cenNro = cenNro;
      this.cliApeNomDen = cliApeNomDen;
      this.usuario = usuario;
      this.estDescripcion = estDescripcion;
      this.cenIdEstadoCentral = cenIdEstadoCentral;
      this.cenImei = cenImei;
      this.cenCoorX = cenCoorX;
      this.cenCoorY = cenCoorY;
      this.cenFechaAlta = cenFechaAlta;
      this.cenFechaBaja = cenFechaBaja;
    }
  }