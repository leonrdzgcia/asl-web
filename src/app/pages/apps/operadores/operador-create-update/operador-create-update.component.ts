import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { ConsumoService } from 'src/app/services/consumo.service';
import { Router } from '@angular/router';
import { Operadores } from '../interfaces/operadores.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'vex-operador-create-update',
  templateUrl: './operador-create-update.component.html',
  styleUrls: ['./operador-create-update.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    NgIf,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule, MatDatepickerModule
  ]
})
export class OperadorCreateUpdateComponent implements OnInit {
  static id = 100;
  form: FormGroup;
  /*form = this.fb.group({
    id: [OperadorCreateUpdateComponent.id++],
    fecha_alta: [this.defaults?.fecha_alta || ''],
    nombre: [this.defaults?.nombre || ''],
    apellidopaterno: [this.defaults?.apellidopaterno || ''],
    curp: [this.defaults?.curp || ''],
    telefono: [this.defaults?.telefono || ''],
    licencia: this.defaults?.licencia || '',
    fechavencimientolicencia: this.defaults?.fechavencimientolicencia || '',
  });*/
  mode: 'create' | 'update' = 'create';

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: Operadores | undefined,
    private dialogRef: MatDialogRef<OperadorCreateUpdateComponent>,
    private fb: FormBuilder,
    private apiConsumo: ConsumoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      idOperador: [''],
      nombre: ['', Validators.required],
      alias: ['', Validators.required],
      rfc: ['', Validators.required],
      nss: ['', Validators.required],
      curp: ['', Validators.required],
      fechaIngreso: ['', Validators.required],
      licenciaFederal: ['', Validators.required],
      categoria: ['', Validators.required],
      vigenciaInicioLicenciaFederal: ['', Validators.required],
      vigenciaFinLicenciaFederal: ['', Validators.required],
      expedienteMedico: ['', Validators.required],
      licenciaLocal: ['', Validators.required],
      vigInicioLicenciaLocal: ['', Validators.required],
      vigFinLicenciaLocal: ['', Validators.required],
      primaVacacional: ['', Validators.required],
      accesoTernium: ['', Validators.required],
      vigExamenMedico: ['', Validators.required],
      rControl: ['', Validators.required],
      vigenciaRControl: ['', Validators.required],
      foto: [1]
    });
  }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Operadores;
    }
    this.form.patchValue(this.defaults);
  }

  save() {
    console.log('.. SAVE El formulario operadores save');
    if (this.mode === 'create') {
      this.createCustomer();
    } else if (this.mode === 'update') {
      this.updateCustomer();
    }
  }
  createCustomer() {
    console.log('.. SAVE El formulario operadores create');
    console.log(this.form.value);
    if (this.form.valid) {
      const formData = this.form.value;
      this.apiConsumo.guardarOperador(formData).subscribe({
        next: (response) => {
          console.log('Carga guardada con éxito:', response);
          this.snackBar.open('Operador guardado exitosamente.', 'Cerrar', {
            duration: 3000,
          });
          window.location.reload();
        },
        error: (error) => {
          console.error('Error al guardar la carga:', error);
        }
      });
    } else {
      console.error('El formulario no es válido');
      this.form.markAllAsTouched();
    }
  }
  updateCustomer() {
    console.log('-- updateCustomer');
    this.apiConsumo.actualizarOperador(this.form.value.id_operador, this.form.value).subscribe({
      next: (response) => {
        console.log('Operador actualizado', response);
        this.snackBar.open('Operador actualizado exitosamente.', 'Cerrar', {
          duration: 3000,
        });
        this.form.reset();
        const cargas = this.form.value;
        this.dialogRef.close(cargas);
      },
      error: (error) => {
        console.error('Error al actualizar consumo', error);
        this.snackBar.open('Error al actualizar operador.', 'Cerrar', {
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
}
