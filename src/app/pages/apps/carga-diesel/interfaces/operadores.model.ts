export class Operadores {
  toLowerCase() {
    throw new Error('Method not implemented.');
  }
  id_operador: number;
  fecha_alta: string;
  nombre: string;
  apellidopaterno: string;
  curp: string;
  licencia: string;
  fechavencimientolicencia: string;

  constructor(operadores: any) {
    this.id_operador = operadores.id_operador;
    this.fecha_alta = operadores.fecha_alta;
    this.nombre = operadores.nombre;
    this.apellidopaterno = operadores.apellidopaterno;
    this.curp = operadores.curp;
    this.licencia = operadores.licencia;
    this.fechavencimientolicencia = operadores.fechavencimientolicencia;
  }
}
