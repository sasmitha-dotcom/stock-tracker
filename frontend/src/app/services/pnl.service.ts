import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PnlResponse } from '../models/pnl.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PnlService {
  private readonly base = `${environment.apiUrl}/api/pnl`;

  constructor(private http: HttpClient) {}

  get(prices: Record<string, number> = {}): Observable<PnlResponse> {
    let params = new HttpParams();
    const priceStr = Object.entries(prices)
      .map(([sym, p]) => `${sym}:${p}`)
      .join(',');
    if (priceStr) params = params.set('prices', priceStr);
    return this.http.get<PnlResponse>(this.base, { params });
  }
}
