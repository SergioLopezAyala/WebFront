import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProcesoDto } from '../dto/procesoDto';

export interface ProcessHistory {
  id: number;
  procesoId: number;
  accion: string;
  fecha: string;
  actor: string;
  detalles?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {
  private baseUrl = '/api/processes';

  constructor(private http: HttpClient) {}

  listar(orgId?: number, estado?: string): Observable<ProcesoDto[]> {
    const params: any = {};
    if (orgId) params.orgId = orgId;
    if (estado) params.status = estado;
    
    return this.http.get<ProcesoDto[]>(`${this.baseUrl}/list`, { params });
  }

  obtener(id: number): Observable<ProcesoDto> {
    return this.http.get<ProcesoDto>(`${this.baseUrl}/get/${id}`);
  }

  crear(proceso: ProcesoDto): Observable<ProcesoDto> {
    return this.http.post<ProcesoDto>(`${this.baseUrl}/create`, proceso);
  }

  actualizar(id: number, proceso: ProcesoDto): Observable<ProcesoDto> {
    return this.http.put<ProcesoDto>(`${this.baseUrl}/update/${id}`, proceso);
  }

  eliminar(id: number, hardDelete = false): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`, { 
      params: { hardDelete: hardDelete } });
  }

  historial(id: number): Observable<ProcessHistory[]> {
    return this.http.get<ProcessHistory[]>(`${this.baseUrl}/${id}/history`);
  }
}