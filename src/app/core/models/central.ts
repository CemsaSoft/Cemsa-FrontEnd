export class CentralClass {
  cenNro: number;
  cenImei: string;
  cenCoorX: string;
  cenCoorY: string;
  cenFechaAlta: Date;
  cenFechaBaja: Date;
  cenIdEstadoCentral: number;
  cenTipoDoc: number;
  cenNroDoc: string;

  constructor(
    cenNro: number,
    cenImei: string,
    cenCoorX: string,
    cenCoorY: string,
    cenFechaAlta: Date,
    cenFechaBaja: Date,
    cenIdEstadoCentral: number,
    cenTipoDoc: number,
    cenNroDoc: string
  ) {
    this.cenNro = cenNro;
    this.cenImei = cenImei;
    this.cenCoorX = cenCoorX;
    this.cenCoorY = cenCoorY;
    this.cenFechaAlta = cenFechaAlta;
    this.cenFechaBaja = cenFechaBaja;
    this.cenIdEstadoCentral = cenIdEstadoCentral;
    this.cenTipoDoc = cenTipoDoc;
    this.cenNroDoc = cenNroDoc;
  }
}
