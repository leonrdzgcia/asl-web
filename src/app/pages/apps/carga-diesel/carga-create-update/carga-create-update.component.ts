import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { Customer } from '../interfaces/customer.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgIf } from '@angular/common';
import { Cargas } from '../interfaces/cargas.model';
import { ConsumoService } from 'src/app/services/consumo.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Operadores } from '../interfaces/operadores.model';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'vex-customer-create-update',
  templateUrl: './carga-create-update.component.html',
  styleUrls: ['./carga-create-update.component.scss'],
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
    MatInputModule,
    MatOptionModule,
    MatSelectModule ,

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule
  ]
})
export class CargaCreateUpdateComponent implements OnInit {
  static id = 100;
  form: FormGroup;
  //form2: FormGroup;

  /*form = this.fb.group({
    id:       [CustomerCreateUpdateComponent.id++],
    operador: [this.defaults?.operador || ''],
    economico:      [this.defaults?.economico || ''],
    capacidad:[this.defaults?.capacidad || ''],
    destino:  [this.defaults?.destino || ''],
    cliente:  [this.defaults?.cliente || ''],
    confVehicular: this.defaults?.confVehicular || '',
    plataforma: this.defaults?.plataforma || '',
    peso: this.defaults?.peso || '',
    diesel: this.defaults?.diesel || '',
    costo_operativo :this.defaults?.costo_operativo|| '',
    costo_flete: this.defaults?.costo_flete|| '',
    fecha_salida:  this.defaults?.fecha_salida|| '',
    fecha_llegada:  this.defaults?.fecha_llegada|| '',
    cargas: this.fb.array([]),
    carga_1: this.defaults?.carga_1 || '',
    gasolinera_1: this.defaults?.gasolinera_1 || ''});*/

  mode: 'create' | 'update' = 'create';

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: Cargas | undefined,
    private dialogRef: MatDialogRef<CargaCreateUpdateComponent>,
    private fb: FormBuilder,
    private apiConsumo: ConsumoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      idconsumo_diesel: [''],
      operador: ['', Validators.required],
      economico: ['', Validators.required],
      destino: ['', Validators.required],
      cliente: ['', Validators.required],
      plataforma: ['', Validators.required],
      capacidad: ['', Validators.required],
      confVehicular: ['', Validators.required],
      peso: ['', Validators.required],
      costo_operativo: ['', Validators.required],
      costo_flete: ['', Validators.required],
      fecha_salida: ['', Validators.required],
      fecha_llegada: ['', Validators.required],
      diesel: ['', Validators.required],
      carga: this.defaults?.carga || '',
      gasolinera: this.defaults?.gasolinera || '',
      cargas: this.fb.array([]), // Usamos un FormArray para las cargas dinámicas
    });
    /*this.form2 = this.fb.group({
    cargas: this.fb.array([]), // Usamos un FormArray para las cargas dinámicas
    });*/
    // Iniciamos con un grupo de carga y gasolinera
    this.agregarCarga();
  }

  operadores: Operadores[] = [];
  //operadores: string[] = [];



  ngOnInit() {
    console.log(' -- CargaCreateUpdateComponent ngOnInit');
    //this.obtenerOperadores();
    this.apiConsumo.obtenerOperadores().subscribe(
      (data) => {
        console.log(' -- obtenerOperadores ');
        this.operadores = data;
      },
      (error) => {
        console.error('Error fetching data list:', error);
      }
    );
    console.log(this.operadores);
    console.log(this.defaults);
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as Cargas;
    }
    this.form.patchValue(this.defaults);
  }

  obtenerOperadores() {
    //this.apiColnsumo.obtenerConsumo
    this.apiConsumo.obtenerOperadores().subscribe(
      (data) => {
        console.log(' -- obtenerOperadores ');
        console.log(data);
        this.operadores = data;
      },
      (error) => {
        console.error('Error fetching data list:', error);
      }
    );
  }
  get cargas(): FormArray {
    return this.form.get('cargas') as FormArray;
  }
  agregarCarga(): void {
    const cargaFormGroup = this.fb.group({
      carga: ['', ],
      gasolinera: ['', ],
    });
    this.cargas.push(cargaFormGroup);
  }
  eliminarCarga(index: number): void {
    this.cargas.removeAt(index);
  }
  createCustomer() {
    //const cargas = this.form.value;
    //this.dialogRef.close(cargas);
    let cadenaCarga = '';
    let cadenaGas = '';
    for (let index = 0; index < this.cargas.length; index++) {
      cadenaCarga = cadenaCarga + this.cargas.value[index].carga+',';
      cadenaGas = cadenaGas + this.cargas.value[index].gasolinera+',';
    }
    this.form.value.carga = cadenaCarga ;
    this.form.value.gasolinera = cadenaGas ;
    if (this.form.valid) {
      const formData = this.form.value;
      console.log(' -- valor form validado')
      console.log(formData);
      this.apiConsumo.guardarConsumo(formData).subscribe({
        next: (response) => {
          console.log('Carga guardada con éxito:', response);
          this.snackBar.open('Carga guardada exitosamente.', 'Cerrar', {
            duration: 3000,
          });
          this.cargas.clear(); // Reiniciar las cargas dinámicas
          this.agregarCarga(); // agregar grupo inicial
          this.form.reset();
          const cargas = this.form.value;
          this.dialogRef.close(cargas);
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
    console.log(' -- Carga updateCustomer: updateCustomer');
    console.log(this.form.value);
    console.log(this.defaults?.carga);
    this.form.value.carga     = this.defaults?.carga      +this.form.value.cargas[0].carga+',';
    this.form.value.gasolinera = this.defaults?.gasolinera+this.form.value.cargas[0].gasolinera+',';

    console.log(this.form.value);
    this.apiConsumo.actualizarConsumo(this.form.value.idconsumo_diesel, this.form.value).subscribe({
      next: (response) => {
        console.log('Consumo actualizado', response);
        this.snackBar.open('Consumo actualizado exitosamente.', 'Cerrar', {
          duration: 3000,
        });
        this.cargas.clear(); // Reiniciar las cargas dinámicas
          this.agregarCarga(); // agregar grupo inicial
          this.form.reset();
          const cargas = this.form.value;
          this.dialogRef.close(cargas);
      },
      error: (error) => {
        console.error('Error al actualizar consumo', error);
        this.snackBar.open('Error al actualizar consumo.', 'Cerrar', {
          duration: 3000,
        });
      }
    });
    /*const cargas = this.form.value;
    if (!this.defaults) {throw new Error('Customer ID does not exist, this customer cannot be updated');}*/
    //cargas.id = this.defaults.id;
    //this.dialogRef.close(cargas);
  }

  save() {
    console.log('-- sAVE CARGA' );
    console.log(this.mode);
    if (this.mode === 'create') {
      this.createCustomer();
    } else if (this.mode === 'update') {
      this.updateCustomer();
    }
    /*let cadenaCarga = '';
    let cadenaGas = '';
    for (let index = 0; index < this.cargas.length; index++) {
      cadenaCarga = cadenaCarga + this.cargas.value[index].carga+',';
      cadenaGas = cadenaGas + this.cargas.value[index].gasolinera+',';
    }
    this.form.value.carga = cadenaCarga ;
    this.form.value.gasolinera = cadenaGas ;
    if (this.form.valid) {
      const formData = this.form.value;
      console.log(' -- valor form validado')
      console.log(formData);
      this.apiConsumo.guardarConsumo(formData).subscribe({
        next: (response) => {
          console.log('Carga guardada con éxito:', response);
          this.snackBar.open('Carga guardada exitosamente.', 'Cerrar', {
            duration: 3000,
          });
          this.form.reset();
          this.cargas.clear(); // Reiniciar las cargas dinámicas
          this.agregarCarga(); // agregar grupo inicial
        },
        error: (error) => {
          console.error('Error al guardar la carga:', error);
        }
      });
    } else {
      console.error('El formulario no es válido');
      this.form.markAllAsTouched();
    }*/
  }
  isCreateMode() {
    return this.mode === 'create';
  }
  isUpdateMode() {
    return this.mode === 'update';
  }
}
