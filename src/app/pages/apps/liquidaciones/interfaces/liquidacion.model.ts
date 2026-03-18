export class Liquidacion {
  id_liquidacion?: number;
  fecha: string;
  operador: string;
  dia: string;
  viaje: string;
  ruta: string;
  fecha_salida: string;
  fecha_llegada: string;
  comidas?: number;
  rampa?: number;
  pension?: number;
  sanitaria?: number;
  federal?: number;
  transito?: number;
  aguas?: number;
  otros?: number;
  subtotal?: number;
  gastos_depositados?: number;
  adelanto?: number;
  ahorro?: number;
  abono_prestamo?: number;
  retenciones?: number;
  total?: number;
  observaciones?: string;

  constructor(liquidacion: any) {
    this.id_liquidacion = liquidacion.id_liquidacion;
    this.fecha = liquidacion.fecha;
    this.operador = liquidacion.operador;
    this.dia = liquidacion.dia;
    this.viaje = liquidacion.viaje;
    this.ruta = liquidacion.ruta;
    this.fecha_salida = liquidacion.fecha_salida;
    this.fecha_llegada = liquidacion.fecha_llegada;
    this.comidas = liquidacion.comidas || 0;
    this.rampa = liquidacion.rampa || 0;
    this.pension = liquidacion.pension || 0;
    this.sanitaria = liquidacion.sanitaria || 0;
    this.federal = liquidacion.federal || 0;
    this.transito = liquidacion.transito || 0;
    this.aguas = liquidacion.aguas || 0;
    this.otros = liquidacion.otros || 0;
    this.subtotal = liquidacion.subtotal || 0;
    this.gastos_depositados = liquidacion.gastos_depositados || 0;
    this.adelanto = liquidacion.adelanto || 0;
    this.ahorro = liquidacion.ahorro || 0;
    this.abono_prestamo = liquidacion.abono_prestamo || 0;
    this.retenciones = liquidacion.retenciones || 0;
    this.total = liquidacion.total || 0;
    this.observaciones = liquidacion.observaciones || '';
  }
}

