import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PnlService } from '../../services/pnl.service';
import { PnlResponse } from '../../models/pnl.model';

@Component({
  selector: 'app-pnl-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './pnl-dashboard.component.html',
  styleUrls: ['./pnl-dashboard.component.scss'],
})
export class PnlDashboardComponent implements OnInit {
  pnl?: PnlResponse;
  loading = false;
  priceInput = '';
  displayedColumns = ['symbol', 'openQty', 'avgCost', 'currentPrice', 'unrealizedPnl', 'realizedPnl'];

  constructor(private pnlService: PnlService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    const prices = this.parsePrices(this.priceInput);
    this.loading = true;
    this.pnlService.get(prices).subscribe({
      next: (data) => {
        this.pnl = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private parsePrices(input: string): Record<string, number> {
    const result: Record<string, number> = {};
    input.split(',').forEach((entry) => {
      const [sym, price] = entry.trim().split(':');
      if (sym && price && !isNaN(+price)) result[sym.toUpperCase()] = +price;
    });
    return result;
  }

  pnlClass(value: number | null): string {
    if (value === null) return '';
    return value >= 0 ? 'positive' : 'negative';
  }
}
