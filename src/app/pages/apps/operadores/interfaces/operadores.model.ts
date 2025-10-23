export class Operadores {
  id_operador: number;
  nombre: string;
  fecha_alta: string;
  apellidopaterno: string;
  curp: string;
  telefono: string;
  licencia: string;
  fechavencimientolicencia: string;

  constructor(operadores: any) {
    this.id_operador = operadores.id_operador;
    this.nombre          = operadores.nombre;
    this.fecha_alta      = operadores.fecha_alta;
    this.apellidopaterno = operadores.apellidopaterno;
    this.curp            = operadores.curp;
    this.telefono            = operadores.telefono;
    this.licencia        = operadores.licencia;
    this.fechavencimientolicencia = operadores.fechavencimientolicencia;
  }
}
