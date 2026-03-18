import { Injectable } from '@angular/core';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { NavigationItem } from './navigation-item.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationLoaderService {
  private readonly _items: BehaviorSubject<NavigationItem[]> =
    new BehaviorSubject<NavigationItem[]>([]);

  get items$(): Observable<NavigationItem[]> {
    return this._items.asObservable();
  }

  constructor(private readonly layoutService: VexLayoutService) {
    this.loadNavigation();
  }

  loadNavigation(): void {
    this._items.next([

      {
        type: 'subheading',
        label: 'ver. 17 Marzo 2026',
        children: [
          {
            type: 'link',
            label: 'Operadores',
            route: '/apps/operadores',
            icon: 'mat:assignment'
          },
          /*{
            type: 'link',
            label: 'Historial de Cargas',
            route: '/apps/aio-table',
            icon: 'mat:assignment'
          },*/
          {
            type: 'link',
            label: 'Historial de Cargas D',
            route: '/apps/carga-diesel',
            icon: 'mat:assignment'
          },
          {
            type: 'link',
            label: 'Dasboard',
            route: '/apps/scrumboard/1',
            icon: 'mat:assignment'
          },
          {
            type: 'link',
            label: 'Liquidaciones',
            route: '/apps/liquidaciones',
            icon: 'mat:assignment'
          }/*,
          {
            type: 'link',
            label: 'table contacts',
            route: '/apps/contacts/table',
            icon: 'mat:assignment'
          }*/
        ]
      }
    ]);
  }
}
