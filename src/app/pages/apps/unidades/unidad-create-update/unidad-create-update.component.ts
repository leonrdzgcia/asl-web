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
import { Unidades } from '../interfaces/unidades.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'vex-unidad-create-update',
  templateUrl: './unidad-create-update.component.html',
  styleUrls: ['./unidad-create-update.component.scss'],
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
    MatInputModule
  ]
})
export class UnidadCreateUpdateComponent implements OnInit {
  form: FormGroup;
  mode: 'create' | 'update' = 'create';

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: Unidades | undefined,
    private dialogRef: MatDialogRef<UnidadCreateUpdateComponent>,
    private fb: FormBuilder,
    private apiConsumo: ConsumoService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      idUnidad: [''],
      tipoUnidad: ['', Validators.required],
      eco: ['', Validators.required],
      placas: ['', Validators.required],
      numeroSerie: ['', Validators.required],
      caratula: [''],
      vigenciaInicio: ['', Validators.required],
      vigenciaFin: ['', Validators.required],
      inciso: [''],
      cobertura: [''],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anio: ['', Validators.required],
      paisOrigen: [''],
      marcaMotor: [''],
      numeroMotor: [''],
      ejes: [''],
      llantas: [''],
      largoFts: [''],
      anchoFts: [''],
      altoFts: [''],
      pesoVehicular: [''],
      pesoMaximo: [''],
      tarjetaCirculacion: [''],
      fisicoMecanica: [''],
      fechaFM: [''],
      categoria: [''],
      emisionContaminantes: [''],
      fechaEC: [''],
      periodo: [''],
      tagChihuahua: [''],
      tagPase: [''],
      autorizacionExpresa: [''],
      permisoCirculacion: [''],
      alias: [''],
      capacidad: [''],
      satelite: ['']
    });
  }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Unidades;
    }
    this.form.patchValue(this.defaults);
  }

  save() {
    if (this.mode === 'create') {
      this.createUnidad();
    } else if (this.mode === 'update') {
      this.updateUnidad();
    }
  }

  createUnidad() {
    if (this.form.valid) {
      this.apiConsumo.guardarUnidad(this.form.value).subscribe({
        next: (response) => {
          this.snackBar.open('Unidad guardada exitosamente.', 'Cerrar', {
            duration: 3000
          });
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error al guardar la unidad:', error);
          this.snackBar.open('Error al guardar la unidad.', 'Cerrar', {
            duration: 3000
          });
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  updateUnidad() {
    const id = this.form.value.idUnidad;
    this.apiConsumo.actualizarUnidad(id, this.form.value).subscribe({
      next: (response) => {
        this.snackBar.open('Unidad actualizada exitosamente.', 'Cerrar', {
          duration: 3000
        });
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Error al actualizar unidad', error);
        this.snackBar.open('Error al actualizar unidad.', 'Cerrar', {
          duration: 3000
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
