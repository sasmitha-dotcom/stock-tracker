import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trade, TradePayload } from '../models/trade.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TradeService {
  private readonly base = `${environment.apiUrl}/api/trades`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Trade[]> {
    return this.http.get<Trade[]>(this.base);
  }

  create(payload: TradePayload): Observable<Trade> {
    return this.http.post<Trade>(this.base, payload);
  }

  update(id: number, payload: TradePayload): Observable<Trade> {
    return this.http.put<Trade>(`${this.base}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
