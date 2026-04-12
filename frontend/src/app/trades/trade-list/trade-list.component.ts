import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Trade } from '../../models/trade.model';
import { TradeService } from '../../services/trade.service';
import { TradeFormComponent } from '../trade-form/trade-form.component';

@Component({
  selector: 'app-trade-list',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './trade-list.component.html',
  styleUrls: ['./trade-list.component.scss'],
})
export class TradeListComponent implements OnInit {
  trades: Trade[] = [];
  displayedColumns = ['symbol', 'type', 'quantity', 'price', 'trade_date', 'notes', 'actions'];
  loading = false;

  constructor(
    private tradeService: TradeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.tradeService.getAll().subscribe({
      next: (data) => {
        this.trades = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  openAddDialog(): void {
    const ref = this.dialog.open(TradeFormComponent, { width: '420px', data: {} });
    ref.afterClosed().subscribe((payload) => {
      if (!payload) return;
      this.tradeService.create(payload).subscribe(() => {
        this.snackBar.open('Trade added', 'OK', { duration: 2000 });
        this.load();
      });
    });
  }

  openEditDialog(trade: Trade): void {
    const ref = this.dialog.open(TradeFormComponent, { width: '420px', data: { trade } });
    ref.afterClosed().subscribe((payload) => {
      if (!payload) return;
      this.tradeService.update(trade.id, payload).subscribe(() => {
        this.snackBar.open('Trade updated', 'OK', { duration: 2000 });
        this.load();
      });
    });
  }

  delete(trade: Trade): void {
    if (!confirm(`Delete ${trade.symbol} trade on ${trade.trade_date}?`)) return;
    this.tradeService.delete(trade.id).subscribe(() => {
      this.snackBar.open('Trade deleted', 'OK', { duration: 2000 });
      this.load();
    });
  }
}
