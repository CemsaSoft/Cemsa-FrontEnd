 export class AlarmaConfigConsultaClass  {
    cfgId: number;
    cfgNro: number;
    cfgSer: number;
    cfgNombre: string;
    cfgFechaAlta: Date;
    cfgFechaBaja: Date;
    cfgValorSuperiorA: number;
    cfgValorInferiorA: number;
    cfgObservacion: string;
    serDescripcion: string;

    constructor(
      cfgId: number,
      cfgNro: number,
      cfgSer: number,
      cfgNombre: string,
      cfgFechaAlta: Date,
      cfgFechaBaja: Date,
      cfgValorSuperiorA: number,
      cfgValorInferiorA: number,
      cfgObservacion: string,
      serDescripcion: string,
    ) {
      this.cfgId = cfgId;
      this.cfgNro = cfgNro;
      this.cfgSer = cfgSer;
      this.cfgNombre = cfgNombre;
      this.cfgFechaAlta = cfgFechaAlta;
      this.cfgFechaBaja = cfgFechaBaja;
      this.cfgValorSuperiorA = cfgValorSuperiorA;
      this.cfgValorInferiorA = cfgValorInferiorA;
      this.cfgObservacion = cfgObservacion;
      this.serDescripcion = serDescripcion;
    }
  }