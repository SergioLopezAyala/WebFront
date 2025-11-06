import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActividadDto } from '../../dto/actividadDto';


@Injectable({ providedIn: 'root' })
export class ActividadService {
  base : string = "http://localhost:8080/api/activities"
  constructor(
    private httpClient : HttpClient
  ){}

  list(): Observable<ActividadDto[]> {
    return this.httpClient.get<ActividadDto[]>(`${this.base}/list`);
  }

  get(id: number): Observable<ActividadDto> {
    return this.httpClient.get<ActividadDto>(`${this.base}/get/${id}`);
  }

  create(dto: ActividadDto): Observable<ActividadDto> {
    return this.httpClient.post<ActividadDto>(`${this.base}/create`, dto);
  }

  update(id: number, dto: ActividadDto): Observable<ActividadDto> {
    return this.httpClient.put<ActividadDto>(`${this.base}/update/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.base}/delete/${id}`);
  }

  /** Conveniencia: actualizar solo posición, pero enviando TODO el DTO (PUT) */
  updatePosition(dto: ActividadDto): Observable<ActividadDto> {
    if (dto.id == null) throw new Error('Activity id is required');
    return this.update(dto.id, dto);
  }
}
