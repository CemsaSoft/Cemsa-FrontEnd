 export class ServicioxCentralClass  {
    sxcNroCentral: number;
    sxcNroServicio: number;
    sxcEstado: number;
    sxcFechaAlta: Date;
    sxcFechaBaja: Date;

    constructor(
      sxcNroCentral: number,
      sxcNroServicio: number,
      sxcEstado: number,
      sxcFechaAlta: Date,
      sxcFechaBaja: Date,
    ) {
      this.sxcNroCentral = sxcNroCentral;
      this.sxcNroServicio = sxcNroServicio;
      this.sxcEstado = sxcEstado;
      this.sxcFechaAlta = sxcFechaAlta;
      this.sxcFechaBaja =sxcFechaBaja;
    }
  }