export class Cargas {

  operador: string;
  economico: string;
  capacidad: string;
  destino: string;
  cliente: string;
  confVehicular: string;
  plataforma: string;
  peso: string;
  diesel: string;
  carga: string;
  gasolinera: string;
  costo_operativo: string;
  costo_flete: string;
  fecha_salida: string;
  fecha_llegada: string;

  constructor(cargas: any) {
    this.operador = cargas.operador;//
    this.economico = cargas.economico;//
    this.capacidad = cargas.capacidad;    //
    this.destino = cargas.destino;      //
    this.cliente = cargas.cliente;      //
    this.confVehicular = cargas.confVehicular;
    this.plataforma = cargas.plataforma;  //
    this.peso = cargas.peso;
    this.diesel = cargas.diesel;
    this.carga = cargas.carga;
    this.gasolinera = cargas.gasolinera;
    this.costo_operativo = cargas.costo_operativo;
    this.costo_flete = cargas.costo_flete;
    this.fecha_salida = cargas.fecha_salida;
    this.fecha_llegada = cargas.fecha_llegada;
  }
}
