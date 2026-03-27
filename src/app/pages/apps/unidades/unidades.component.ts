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
import { ConsumoService } from 'src/app/services/consumo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Unidades } from './interfaces/unidades.model';
import { UnidadCreateUpdateComponent } from './unidad-create-update.component';

@Component({
  selector: 'vex-unidades',
  templateUrl: './unidades.component.html',
  styleUrls: ['./unidades.component.scss'],
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
export class UnidadesComponent implements OnInit, AfterViewInit {
  layoutCtrl = new UntypedFormControl('fullwidth');
  subject$: ReplaySubject<Unidades[]> = new ReplaySubject<Unidades[]>(1);
  data$: Observable<Unidades[]> = this.subject$.asObservable();
  unidades: Unidades[] = [];

  columns: TableColumn<Unidades>[] = [
    { label: 'Checkbox', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Tipo de unidad', property: 'tipoUnidad', type: 'text', visible: true },
    { label: 'Eco', property: 'eco', type: 'text', visible: true },
    { label: 'Placas', property: 'placas', type: 'text', visible: true },
    { label: 'Marca', property: 'marca', type: 'text', visible: true },
    { label: 'Modelo', property: 'modelo', type: 'text', visible: true },
    { label: 'Año', property: 'anio', type: 'text', visible: true },
    { label: 'Alias', property: 'alias', type: 'text', visible: true },
    { label: 'Capacidad', property: 'capacidad', type: 'text', visible: true },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];

  dataListaUnidades!: MatTableDataSource<Unidades>;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];

  selection = new SelectionModel<Unidades>(true, []);
  searchCtrl = new UntypedFormControl();

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private dialog: MatDialog,
    private apiConsumo: ConsumoService,
    private snackBar: MatSnackBar
  ) {}

  get visibleColumns() {
    return this.columns.filter((column) => column.visible).map((column) => column.property);
  }

  obtenerUnidades() {
    this.apiConsumo.obtenerUnidades().subscribe(
      (data) => {
        this.dataListaUnidades.data = data;
      },
      (error) => {
        console.error('Error fetching unidades:', error);
      }
    );
  }

  ngOnInit() {
    this.obtenerUnidades();
    this.dataListaUnidades = new MatTableDataSource();
    this.data$.pipe(filter<Unidades[]>(Boolean)).subscribe((unidades) => {
      this.unidades = unidades;
      this.dataListaUnidades.data = unidades;
    });
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataListaUnidades.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataListaUnidades.sort = this.sort;
    }
  }

  updateData() {
    this.obtenerUnidades();
  }

  createUnidad() {
    this.dialog
      .open(UnidadCreateUpdateComponent)
      .afterClosed()
      .subscribe((unidad: Unidades) => {
        if (unidad && this.unidades) {
          this.unidades.unshift(new Unidades(unidad));
          this.subject$.next(this.unidades);
        }
      });
  }

  updateUnidad(unidad: Unidades) {
    this.dialog
      .open(UnidadCreateUpdateComponent, {
        data: unidad
      })
      .afterClosed()
      .subscribe((updatedUnidad) => {
        if (updatedUnidad) {
          this.updateData();
          const index = this.unidades.findIndex(
            (existingUnidad) => existingUnidad.eco === updatedUnidad.eco
          );
          if (index >= 0) {
            this.unidades[index] = new Unidades(updatedUnidad);
            this.subject$.next(this.unidades);
          }
        }
      });
  }

  deleteUnidad(unidad: Unidades) {
    this.apiConsumo.eliminarUnidad(unidad.idUnidad ?? unidad.eco).subscribe({
      next: () => {
        this.snackBar.open('Unidad eliminada exitosamente.', 'Cerrar', {
          duration: 3000
        });
        this.updateData();
      },
      error: (error) => {
        console.error('Error al eliminar la unidad', error);
        this.snackBar.open('Error al eliminar la unidad.', 'Cerrar', {
          duration: 3000
        });
      }
    });
    this.selection.deselect(unidad);
    this.subject$.next(this.unidades);
  }

  deleteUnidades(unidades: Unidades[]) {
    unidades.forEach((u) => this.deleteUnidad(u));
  }

  onFilterChange(value: string) {
    if (!this.dataListaUnidades) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataListaUnidades.filter = value;
  }

  toggleColumnVisibility(column: TableColumn<Unidades>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataListaUnidades.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataListaUnidades.data.forEach((row) => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }
}
