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
import { ConsumoService } from 'src/app/services/consumo.service';
import { Cargas } from './interfaces/cargas.model';
import { Operadores } from './interfaces/operadores.model';
import { OperadorCreateUpdateComponent } from './operador-create-update/operador-create-update.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'vex-operadores',
  templateUrl: './operadores.component.html',
  styleUrls: ['./operadores.component.scss'],
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
export class OperadoresComponent implements OnInit, AfterViewInit {
  layoutCtrl = new UntypedFormControl('fullwidth');
  //subject$: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);
  //subject$: ReplaySubject<Cargas[]> = new ReplaySubject<Cargas[]>(1);
  //data$: Observable<Cargas[]> = this.subject$.asObservable();
  //cargas: Cargas[] = [];
  subject$: ReplaySubject<Operadores[]> = new ReplaySubject<Operadores[]>(1);
  data$: Observable<Operadores[]> = this.subject$.asObservable();
  operadores: Operadores[] = [];
  //customers: Customer[] = [];

  columns2: TableColumn<Cargas>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'OPERADOR', property: 'operador', type: 'text', visible: true },
    { label: 'economico', property: 'economico', type: 'text', visible: true },
    { label: 'capacidad', property: 'capacidad', type: 'text', visible: true },
    { label: 'destino', property: 'destino', type: 'text', visible: true },
    { label: 'cliente', property: 'cliente', type: 'text', visible: true },
    { label: 'confVehicular', property: 'confVehicular', type: 'text', visible: true },
    { label: 'plataforma', property: 'plataforma', type: 'text', visible: true },
    { label: 'peso', property: 'peso', type: 'text', visible: true },
    { label: 'diesel', property: 'diesel', type: 'text', visible: true },
    { label: 'costo_operativo', property: 'costo_operativo', type: 'text', visible: true },
    { label: 'costo_flete', property: 'costo_flete', type: 'text', visible: true },
    { label: 'fecha_salida', property: 'fecha_salida', type: 'text', visible: true },
    { label: 'fecha_llegada', property: 'fecha_llegada', type: 'text', visible: true },

    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];

  columns: TableColumn<Operadores>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Nombre', property: 'nombre', type: 'text', visible: true },
    { label: 'Apellido', property: 'apellidopaterno', type: 'text', visible: true },
    { label: 'Fechaalta', property: 'fecha_alta', type: 'text', visible: true },
    { label: 'RFC', property: 'curp', type: 'text', visible: true },
    { label: 'licencia', property: 'licencia', type: 'text', visible: true },
    { label: 'fecha vencimiento', property: 'fechavencimientolicencia', type: 'text', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];


  //dataSource2!: MatTableDataSource<Cargas>;
  //dataSource2!: MatTableDataSource<Cargas>;
  dataListaOperadores!: MatTableDataSource<Operadores>;
  listaCargas: Cargas[] = [];
  listaOperadores: Operadores[] = [];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  //dataSource!: MatTableDataSource<Customer>;
  //selection = new SelectionModel<Customer>(true, []);
  selection = new SelectionModel<Operadores>(true, []);
  searchCtrl = new UntypedFormControl();

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(private dialog: MatDialog, private apiConsumo: ConsumoService,private snackBar: MatSnackBar) { }

  get visibleColumns() {
    return this.columns.filter((column) => column.visible).map((column) => column.property);
  }

  obtenerCargaconsumo() {
    //this.apiColnsumo.obtenerConsumo
    this.apiConsumo.obtenerConsumoss().subscribe(
      (data) => {
        /*console.log(' -- obtenerCargaconsumo  data');
        console.log(data);*/
        //this.dataSource.data = data;
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
        console.log(' -- obtenerOperadores data');
        console.log(data);
        this.dataListaOperadores.data = data;
        console.log(' -- obtenerOperadores this.dataSource');
        console.log(this.dataListaOperadores.data);
        //this.listaOperadores = data;
      },
      (error) => {
        console.error('Error fetching data list:', error);
      }
    );
  }

  ngOnInit() {
    //this.apiColnsumo
    //this.obtenerCargaconsumo();
    this.obtenerOperadores();
    this.dataListaOperadores = new MatTableDataSource();
    this.data$.pipe(filter<Operadores[]>(Boolean)).subscribe((operadores) => {
      this.operadores = operadores;
      this.dataListaOperadores.data = operadores;
    });
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));
  }
  ngAfterViewInit() {
    if (this.paginator) {
      this.dataListaOperadores.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataListaOperadores.sort = this.sort;
    }
  }
  updateData() {
    //this.obtenerCargaconsumo();
    this.obtenerOperadores();
  }

  createCustomer() {
    this.dialog
      .open(OperadorCreateUpdateComponent)
      .afterClosed()
      .subscribe((operadores: Operadores) => {
        /* Customer is the updated customer (if the user pressed Save - otherwise it's null)*/
        if (this.operadores) {
          /* Here we are updating our local array. You would probably make an HTTP request here.*/
          this.operadores.unshift(new Operadores(operadores));
          this.subject$.next(this.operadores);
        }
      });
  }
  updateCustomer(operadores: Operadores) {
    this.dialog
      .open(OperadorCreateUpdateComponent, {
        data: operadores
      })
      .afterClosed()
      .subscribe((updatedCustomer) => {
        if (updatedCustomer) {
          this.updateData();
          const index = this.operadores.findIndex(
            (existingCustomer) => existingCustomer.id_operador === updatedCustomer.id_operador
          );
          this.operadores[index] = new Operadores(updatedCustomer);
          this.subject$.next(this.operadores);
        }
      });
  }

  deleteCustomer(operadores: Operadores) {
    this.apiConsumo.elimiarConsumo(operadores.id_operador).subscribe({
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
    this.selection.deselect(operadores);
    this.subject$.next(this.operadores);
  }
  deleteCustomers(operadores: Operadores[]) {
    operadores.forEach((c) => this.deleteCustomer(c));
  }
  onFilterChange(value: string) {
    if (!this.dataListaOperadores) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataListaOperadores.filter = value;
  }
  toggleColumnVisibility(column: TableColumn<Operadores>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataListaOperadores.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataListaOperadores.data.forEach((row) => this.selection.select(row));
  }
  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

}
