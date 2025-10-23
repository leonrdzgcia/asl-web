import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ConsumoService {
  private apiUrl = `${environment.serverApiUrl}`;
  constructor(private http: HttpClient) { }

  // Métodos operadores
  obtenerOperadores(): Observable < any > {
    console.log(this.apiUrl);
    return this.http.get(`${this.apiUrl}/api/operadores`);
  }
  guardarOperador(formData: any): Observable<any> {
    console.log(formData);
    return this.http.post<any>(`${this.apiUrl}/api/operadores`, formData);
  }
  actualizarOperador(id: number,formData: any): Observable<any> {
    console.log(formData);
    return this.http.put<any>(`${this.apiUrl}/api/operadores/${id}`, formData);
  }
  elimiarOperador(id: number): Observable<any> {
    //console.log(formData);
    return this.http.delete(`${this.apiUrl}/api/consumo/${id}`);
  }


  // Métodos consumo
    obtenerConsumoss(): Observable < any > {
      return this.http.get(`${this.apiUrl}/api/consumo`);
    }
    guardarConsumo(formData: any): Observable<any> {
      console.log(formData);
      return this.http.post<any>(`${this.apiUrl}/api/consumo`, formData);
    }
    actualizarConsumo(id: number, formData: any): Observable<any> {
      console.log(formData);
      return this.http.put<any>(`${this.apiUrl}/api/consumo/${id}`, formData);
    }
    elimiarConsumo(id: number): Observable<any> {
      //console.log(formData);
      return this.http.delete(`${this.apiUrl}/api/consumo/${id}`);
    }
}
