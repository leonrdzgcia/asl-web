import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionesService {
  private apiUrl = `${environment.serverApiUrl}`;

  constructor(private http: HttpClient) { }

  // Método GET - Obtener todas las liquidaciones
  obtenerLiquidaciones(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/liquidaciones`);
  }

  // Método GET - Obtener una liquidación por ID
  obtenerLiquidacion(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/liquidaciones/${id}`);
  }

  // Método POST - Crear una nueva liquidación
  guardarLiquidacion(formData: any): Observable<any> {
    console.log('Guardando liquidación:', formData);
    return this.http.post<any>(`${this.apiUrl}/api/liquidaciones`, formData);
  }

  // Método PUT - Actualizar una liquidación existente
  actualizarLiquidacion(id: number, formData: any): Observable<any> {
    console.log('Actualizando liquidación:', id, formData);
    return this.http.put<any>(`${this.apiUrl}/api/liquidaciones/${id}`, formData);
  }

  // Método DELETE - Eliminar una liquidación
  eliminarLiquidacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/liquidaciones/${id}`);
  }
}

