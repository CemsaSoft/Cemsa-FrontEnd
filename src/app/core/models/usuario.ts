export class UsuarioClass {
    id: number;
    usuario: string;
    password: string;
    constructor(
        id: number,
        usuario: string,
        password: string
    ) {
      this.id = id;
      this.usuario = usuario;
      this.password = password;
    }
  }