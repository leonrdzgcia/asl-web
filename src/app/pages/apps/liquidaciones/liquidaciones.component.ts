import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';
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
import { Liquidacion } from './interfaces/liquidacion.model';
import { LiquidacionesService } from 'src/app/services/liquidaciones.service';
import { LiquidacionCreateUpdateComponent } from './liquidacion-create-update/liquidacion-create-update.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'vex-liquidaciones',
  templateUrl: './liquidaciones.component.html',
  styleUrls: ['./liquidaciones.component.scss'],
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
export class LiquidacionesComponent implements OnInit, AfterViewInit {
  layoutCtrl = new UntypedFormControl('fullwidth');
  subject$: ReplaySubject<Liquidacion[]> = new ReplaySubject<Liquidacion[]>(1);
  data$: Observable<Liquidacion[]> = this.subject$.asObservable();
  liquidaciones: Liquidacion[] = [];

  columns: TableColumn<Liquidacion>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Fecha', property: 'fecha', type: 'text', visible: true },
    { label: 'Operador', property: 'operador', type: 'text', visible: true },
    { label: 'Día', property: 'dia', type: 'text', visible: true },
    { label: 'Viaje', property: 'viaje', type: 'text', visible: true },
    { label: 'Ruta', property: 'ruta', type: 'text', visible: true },
    { label: 'Fecha Salida', property: 'fecha_salida', type: 'text', visible: true },
    { label: 'Fecha Llegada', property: 'fecha_llegada', type: 'text', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];

  dataSource!: MatTableDataSource<Liquidacion>;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  selection = new SelectionModel<Liquidacion>(true, []);
  searchCtrl = new UntypedFormControl();

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private dialog: MatDialog,
    private liquidacionesService: LiquidacionesService,
    private snackBar: MatSnackBar
  ) {}

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  obtenerLiquidaciones() {
    this.liquidacionesService.obtenerLiquidaciones().subscribe(
      (data) => {
        console.log(' -- obtenerLiquidaciones ');
        console.log(data);
        this.dataSource.data = data;
        this.liquidaciones = data;
        this.subject$.next(data);
      },
      (error) => {
        console.error('Error fetching data list:', error);
        this.snackBar.open('Error al obtener las liquidaciones.', 'Cerrar', {
          duration: 3000,
        });
      }
    );
  }

  ngOnInit() {
    this.obtenerLiquidaciones();
    this.dataSource = new MatTableDataSource();
    this.data$.pipe(filter<Liquidacion[]>(Boolean)).subscribe((liquidaciones) => {
      this.liquidaciones = liquidaciones;
      this.dataSource.data = liquidaciones;
    });
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

  updateData() {
    this.obtenerLiquidaciones();
  }

  createCustomer() {
    this.dialog
      .open(LiquidacionCreateUpdateComponent)
      .afterClosed()
      .subscribe((liquidacion: Liquidacion) => {
        if (liquidacion) {
          this.updateData();
          this.liquidaciones.unshift(new Liquidacion(liquidacion));
          this.subject$.next(this.liquidaciones);
        }
      });
  }

  updateCustomer(liquidacion: Liquidacion) {
    this.dialog
      .open(LiquidacionCreateUpdateComponent, {
        data: liquidacion
      })
      .afterClosed()
      .subscribe((updatedLiquidacion) => {
        if (updatedLiquidacion) {
          this.updateData();
          const index = this.liquidaciones.findIndex(
            (existingLiquidacion) => existingLiquidacion.id_liquidacion === updatedLiquidacion.id_liquidacion
          );
          this.liquidaciones[index] = new Liquidacion(updatedLiquidacion);
          this.subject$.next(this.liquidaciones);
        }
      });
  }

  deleteCustomer(liquidacion: Liquidacion) {
    if (!liquidacion.id_liquidacion) {
      this.snackBar.open('No se puede eliminar: ID de liquidación no válido.', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    this.liquidacionesService.eliminarLiquidacion(liquidacion.id_liquidacion).subscribe({
      next: () => {
        this.snackBar.open('Liquidación eliminada exitosamente.', 'Cerrar', {
          duration: 3000,
        });
        this.updateData();
        this.selection.deselect(liquidacion);
      },
      error: (error) => {
        console.error('Error al eliminar la liquidación', error);
        this.snackBar.open('Error al eliminar la liquidación.', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }

  deleteCustomers(liquidaciones: Liquidacion[]) {
    liquidaciones.forEach((l) => this.deleteCustomer(l));
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  toggleColumnVisibility(column: TableColumn<Liquidacion>, event: Event) {
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

