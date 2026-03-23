export class Operadores {
  idOperador: number;
  nombre: string;
  alias: string;
  rfc: string;
  nss: string;
  curp: string;
  fechaIngreso: string;
  licenciaFederal: string;
  categoria: string;
  vigenciaInicioLicenciaFederal: string;
  vigenciaFinLicenciaFederal: string;
  expedienteMedico: string;
  licenciaLocal: string;
  vigInicioLicenciaLocal: string;
  vigFinLicenciaLocal: string;
  primaVacacional: string;
  accesoTernium: string;
  vigExamenMedico: string;
  rControl: string;
  vigenciaRControl: string;
  foto: number;


  constructor(operadores: any) {
    this.idOperador = operadores.idOperador;
    this.nombre          = operadores.nombre;
    this.alias           = operadores.alias;
    this.rfc          = operadores.rfc;
    this.nss            = operadores.nss;
    this.curp            = operadores.curp;
    this.fechaIngreso            = operadores.fechaIngreso;
    this.licenciaFederal            = operadores.licenciaFederal;
    this.categoria            = operadores.categoria;
    this.curp = operadores.curp;
    this.vigenciaInicioLicenciaFederal = operadores.vigenciaInicioLicenciaFederal;
    this.vigenciaFinLicenciaFederal = operadores.vigenciaFinLicenciaFederal;
    this.expedienteMedico = operadores.expedienteMedico;
    this.licenciaLocal = operadores.licenciaLocal;
    this.vigInicioLicenciaLocal = operadores.vigInicioLicenciaLocal;
    this.vigFinLicenciaLocal = operadores.vigFinLicenciaLocal;
    this.primaVacacional = operadores.primaVacacional;
    this.accesoTernium = operadores.accesoTernium;
    this.vigExamenMedico = operadores.vigExamenMedico;
    this.rControl = operadores.rControl;
    this.vigenciaRControl = operadores.vigenciaRControl;
    this.foto = operadores.foto;
  }
}
