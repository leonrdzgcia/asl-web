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

  // Método GET
    obtenerConsumo(): Observable < any > {
      //return this.http.get(`https://asl-api-production.up.railway.app/api/consumo`);
      return this.http.get(`${this.apiUrl}/api/consumo`);
    }
    guardarConsumo(newData: any): Observable<any> {
      console.log(newData);
      return this.http.post<any>(`${this.apiUrl}/consumo`, newData);
    }
}
