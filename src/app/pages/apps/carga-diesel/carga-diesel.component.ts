import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Customer } from './interfaces/customer.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import {
  aioTableData,
  aioTableDataCarga,
  aioTableLabels
} from '../../../../static-data/aio-table-data';

import { SelectionModel } from '@angular/cdk/collections';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { Cargas } from './interfaces/cargas.model';
import { ConsumoService } from 'src/app/services/consumo.service';
import { Operadores } from './interfaces/operadores.model';
import { CargaCreateUpdateComponent } from './carga-create-update/carga-create-update.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'vex-carga-diesel',
  templateUrl: './carga-diesel.component.html',
  styleUrls: ['./carga-diesel.component.scss'],
  animations: [fadeInUp400ms, stagger40ms],
  standalone: true,
  imports: [
    VexPageLayoutComponent,
    VexPageLayoutHeaderDirective,
    VexBreadcrumbsComponent,
    MatButtonToggleModule,
    ReactiveFormsModule,
    VexPageLayoutContentDirective,
    NgIf,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    NgFor,
    NgClass,
    MatPaginatorModule,
    FormsModule,
    MatDialogModule,
    MatInputModule
  ]
})
export class CargaDieselComponent implements OnInit, AfterViewInit {
  layoutCtrl = new UntypedFormControl('fullwidth');
    /**Simulating a service with HTTP that returns Observables . You probably want to remove this and do all requests in a service with HTTP*/
    //subject$: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);
    subject$: ReplaySubject<Cargas[]> = new ReplaySubject<Cargas[]>(1);
    cargas: Cargas[] = [];

    columns: TableColumn<Cargas>[] = [
      { label: 'Checkbox',      property: 'checkbox',type: 'checkbox',visible: true },
      { label: 'Operador',      property: 'operador',type: 'text',visible: true },
      { label: 'Economico',     property: 'economico',type: 'text',visible: true },
      { label: 'Capacidad',     property: 'capacidad',type: 'text',visible: true},
      { label: 'Destino',       property: 'destino',type: 'text',visible: true },
      { label: 'Cliente',       property: 'cliente',type: 'text',visible: true },
      { label: 'Configuracion', property: 'confVehicular',type: 'text',visible: true },
      { label: 'Plataforma',    property: 'plataforma',type: 'text',visible: true },
      { label: 'Peso',          property: 'peso',type: 'text',visible: true },
      { label: 'Diesel',        property: 'diesel',type: 'text',visible: true },
      { label: 'Cargas',        property: 'carga',type: 'text',visible: true },
      { label: 'Gasolinera(as)',property: 'gasolinera',type: 'text',visible: true },
      { label: 'Costo flete',   property: 'costo_flete',type: 'text',visible: true },
      { label:'Costo operativo',property: 'costo_operativo',type: 'text',visible: true },
      { label: 'Fecha salida',  property: 'fecha_salida',type: 'text',visible: true },
      { label: 'Fecha llegada', property: 'fecha_llegada',type: 'text',visible: true },
      { label: 'Actions',       property: 'actions', type: 'button', visible: true }
    ];

      //dataSource2!: MatTableDataSource<Cargas>;
    dataSource!: MatTableDataSource<Cargas>;
    listaOperadores: Operadores[] = [];
    pageSize = 10;
    pageSizeOptions: number[] = [5, 10, 20, 50];
    //dataSource!: MatTableDataSource<Customer>;
    selection = new SelectionModel<Cargas>(true, []);
    searchCtrl = new UntypedFormControl();
    labels = aioTableLabels;
    @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort?: MatSort;
    private readonly destroyRef: DestroyRef = inject(DestroyRef);

    constructor(private dialog: MatDialog, private apiConsumo: ConsumoService,private snackBar: MatSnackBar) { }

    get visibleColumns() {
      return this.columns
        .filter((column) => column.visible)
        .map((column) => column.property);
    }

    obtenerCargaconsumo() {
      this.apiConsumo.obtenerConsumoss().subscribe(
        (data) => {
          console.log(' -- obtenerCargaconsumo ');
          console.log(data);
          this.dataSource.data = data;
        },
        (error) => {
          console.error('Error fetching data list:', error);
        }
      );
    }
    obtenerOperadores() {
      //this.apiColnsumo.obtenerConsumo
      this.apiConsumo.obtenerOperadores().subscribe(
        (data) => {
          console.log(' -- obtenerOperadores ');
          console.log(data);
          this.listaOperadores = data;
        },
        (error) => {
          console.error('Error fetching data list:', error);
        }
      );
    }

    ngOnInit() {
      this.obtenerCargaconsumo();
      this.obtenerOperadores();
      this.dataSource = new MatTableDataSource();
      this.searchCtrl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => this.onFilterChange(value));
    }

    ngAfterViewInit() {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }
    updateData(){
      this.obtenerCargaconsumo();
    }
    createCustomer() {
      this.dialog
        .open(CargaCreateUpdateComponent)
        .afterClosed()
        .subscribe((cargas: Cargas) => {
          if (cargas) {
            this.updateData();
            this.cargas.unshift(new Cargas(cargas));
            this.subject$.next(this.cargas);
          }
        });
    }

    updateCustomer(cargas: Cargas) {
      this.dialog
        .open(CargaCreateUpdateComponent, {
          data: cargas
        })
        .afterClosed()
        .subscribe((updatedCustomer) => {
          if (updatedCustomer) {
            this.updateData();
            const index = this.cargas.findIndex(
              (existingCustomer) => existingCustomer.idconsumo_diesel === updatedCustomer.idconsumo_diesel
            );
            this.cargas[index] = new Cargas(updatedCustomer);
            this.subject$.next(this.cargas);
          }
        });
    }

    deleteCustomer(cargas: Cargas) {
      this.apiConsumo.elimiarConsumo(cargas.idconsumo_diesel).subscribe({
            next: () => {
              this.snackBar.open('Carga eliminada exitosamente.', 'Cerrar', {
                duration: 3000,
              });
              this.updateData();
            },
            error: (error) => {
              console.error('Error al eliminar el consumo', error);
              this.snackBar.open('Error al eliminar el consumo.', 'Cerrar', {
                duration: 3000,
              });
            }
          });
      /*this.cargas.splice(
        this.cargas.findIndex(
          (existingCustomer) => existingCustomer.idconsumo_diesel === cargas.idconsumo_diesel
        ),
        1
      );*/
      this.selection.deselect(cargas);
      this.subject$.next(this.cargas);
    }
    deleteCustomers(cargas: Cargas[]) {
      cargas.forEach((c) => this.deleteCustomer(c));
    }

    onFilterChange(value: string) {
      if (!this.dataSource) {
        return;
      }
      value = value.trim();
      value = value.toLowerCase();
      this.dataSource.filter = value;
    }
    toggleColumnVisibility(column: TableColumn<Cargas>, event: Event) {
      event.stopPropagation();
      event.stopImmediatePropagation();
      column.visible = !column.visible;
    }
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
    masterToggle() {
      this.isAllSelected()
        ? this.selection.clear()
        : this.dataSource.data.forEach((row) => this.selection.select(row));
    }
    trackByProperty<T>(index: number, column: TableColumn<T>) {
      return column.property;
    }
  }
