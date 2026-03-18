import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ConsumoService } from 'src/app/services/consumo.service';
import { LiquidacionesService } from 'src/app/services/liquidaciones.service';
import { Router } from '@angular/router';
import { Liquidacion } from '../interfaces/liquidacion.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Operadores } from '../../operadores/interfaces/operadores.model';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'vex-liquidacion-create-update',
  templateUrl: './liquidacion-create-update.component.html',
  styleUrls: ['./liquidacion-create-update.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatOptionModule,
    MatSelectModule
  ],
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({
        height: '0',
        opacity: '0',
        overflow: 'hidden'
      })),
      state('expanded', style({
        height: '*',
        opacity: '1',
        overflow: 'visible'
      })),
      transition('collapsed <=> expanded', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class LiquidacionCreateUpdateComponent implements OnInit {
  static id = 100;
  form: FormGroup;
  mode: 'create' | 'update' = 'create';
  operadores: Operadores[] = [];

  // Control de visibilidad de secciones
  showGastosViaje: boolean = true;
  showImporteViaje: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: Liquidacion | undefined,
    private dialogRef: MatDialogRef<LiquidacionCreateUpdateComponent>,
    private fb: FormBuilder,
    private apiConsumo: ConsumoService,
    private liquidacionesService: LiquidacionesService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      id_liquidacion: [''],
      fecha: ['', Validators.required],
      operador: ['', Validators.required],
      dia: ['', Validators.required],
      viaje: ['', Validators.required],
      ruta: ['', Validators.required],
      fecha_salida: ['', Validators.required],
      fecha_llegada: ['', Validators.required],
      comidas: [0],
      rampa: [0],
      pension: [0],
      sanitaria: [0],
      federal: [0],
      transito: [0],
      aguas: [0],
      otros: [0],
      subtotal: [{ value: 0, disabled: true }],
      gastos_depositados: [0],
      adelanto: [0],
      ahorro: [0],
      abono_prestamo: [0],
      retenciones: [0],
      total: [{ value: 0, disabled: true }],
      observaciones: ['']
    });

    // Suscribirse a cambios en los campos numéricos para calcular el subtotal
    this.setupSubtotalCalculation();
    // Suscribirse a cambios en los campos numéricos para calcular el total
    this.setupTotalCalculation();
  }

  setupSubtotalCalculation() {
    const numericFields = ['comidas', 'rampa', 'pension', 'sanitaria', 'federal', 'transito', 'aguas', 'otros'];

    numericFields.forEach(field => {
      this.form.get(field)?.valueChanges
        .pipe(debounceTime(100))
        .subscribe(() => {
          this.calculateSubtotal();
        });
    });
  }

  calculateSubtotal() {
    const comidas = this.parseNumber(this.form.get('comidas')?.value);
    const rampa = this.parseNumber(this.form.get('rampa')?.value);
    const pension = this.parseNumber(this.form.get('pension')?.value);
    const sanitaria = this.parseNumber(this.form.get('sanitaria')?.value);
    const federal = this.parseNumber(this.form.get('federal')?.value);
    const transito = this.parseNumber(this.form.get('transito')?.value);
    const aguas = this.parseNumber(this.form.get('aguas')?.value);
    const otros = this.parseNumber(this.form.get('otros')?.value);

    const subtotal = comidas + rampa + pension + sanitaria + federal + transito + aguas + otros;

    this.form.patchValue({ subtotal: subtotal }, { emitEvent: false });
  }

  setupTotalCalculation() {
    const numericFields = ['gastos_depositados', 'adelanto', 'ahorro', 'abono_prestamo', 'retenciones'];

    numericFields.forEach(field => {
      this.form.get(field)?.valueChanges
        .pipe(debounceTime(100))
        .subscribe(() => {
          this.calculateTotal();
        });
    });
  }

  calculateTotal() {
    const gastos_depositados = this.parseNumber(this.form.get('gastos_depositados')?.value);
    const adelanto = this.parseNumber(this.form.get('adelanto')?.value);
    const ahorro = this.parseNumber(this.form.get('ahorro')?.value);
    const abono_prestamo = this.parseNumber(this.form.get('abono_prestamo')?.value);
    const retenciones = this.parseNumber(this.form.get('retenciones')?.value);

    const total = gastos_depositados + adelanto + ahorro + abono_prestamo + retenciones;

    this.form.patchValue({ total: total }, { emitEvent: false });
  }

  parseNumber(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  ngOnInit() {
    // Obtener lista de operadores
    this.apiConsumo.obtenerOperadores().subscribe(
      (data) => {
        console.log(' -- obtenerOperadores ');
        this.operadores = data;
      },
      (error) => {
        console.error('Error fetching operadores list:', error);
      }
    );

    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Liquidacion;
    }
    this.form.patchValue(this.defaults);
    // Calcular subtotal inicial si hay valores
    this.calculateSubtotal();
    // Calcular total inicial si hay valores
    this.calculateTotal();
  }

  save() {
    console.log('.. SAVE El formulario liquidaciones');
    if (this.mode === 'create') {
      this.createLiquidacion();
    } else if (this.mode === 'update') {
      this.updateLiquidacion();
    }
  }

  createLiquidacion() {
    console.log('.. SAVE El formulario liquidaciones');
    if (this.form.valid) {
      // Calcular subtotal y total antes de guardar
      this.calculateSubtotal();
      this.calculateTotal();
      // Usar getRawValue() para incluir campos deshabilitados
      const formData = this.form.getRawValue();
      console.log('.. SAVE El formulario liquidaciones FORMDATA ');
      console.log(formData);
      this.liquidacionesService.guardarLiquidacion(formData).subscribe({
        next: (response) => {
          console.log('Liquidación guardada con éxito:', response);
          this.snackBar.open('Liquidación guardada exitosamente.', 'Cerrar', {
            duration: 3000,
          });
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error al guardar la liquidación:', error);
          this.snackBar.open('Error al guardar la liquidación.', 'Cerrar', {
            duration: 3000,
          });
        }
      });
    } else {
      console.error('El formulario no es válido');
      this.form.markAllAsTouched();
    }
  }

  updateLiquidacion() {
    console.log('-- updateLiquidacion');
    // Calcular subtotal y total antes de actualizar
    this.calculateSubtotal();
    this.calculateTotal();
    // Usar getRawValue() para incluir campos deshabilitados
    const formData = this.form.getRawValue();
    console.log(formData);
    console.log(this.defaults);
    console.log(this.defaults?.id_liquidacion);
    this.liquidacionesService.actualizarLiquidacion(formData.id_liquidacion, formData).subscribe({
      next: (response) => {
        console.log('Liquidación actualizada', response);
        this.snackBar.open('Liquidación actualizada exitosamente.', 'Cerrar', {
          duration: 3000,
        });
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Error al actualizar liquidación', error);
        this.snackBar.open('Error al actualizar liquidación.', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  toggleGastosViaje() {
    this.showGastosViaje = !this.showGastosViaje;
  }

  toggleImporteViaje() {
    this.showImporteViaje = !this.showImporteViaje;
  }
}

