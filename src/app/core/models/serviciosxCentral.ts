 export class ServicioxCentralClass  {
    sxcNroCentral: number;
    sxcNroServicio: number;
    sxcEstado: number;
    sxcFechaAlta: Date;
    sxcFechaBaja: Date | null;

    constructor(
      sxcNroCentral: number,
      sxcNroServicio: number,
      sxcEstado: number,
      sxcFechaAlta: Date,
      sxcFechaBaja: Date | null,
    ) {
      this.sxcNroCentral = sxcNroCentral;
      this.sxcNroServicio = sxcNroServicio;
      this.sxcEstado = sxcEstado;
      this.sxcFechaAlta = sxcFechaAlta;
      this.sxcFechaBaja =sxcFechaBaja || null;
    }
  }