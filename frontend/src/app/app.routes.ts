import { Routes } from '@angular/router';
import { TradeListComponent } from './trades/trade-list/trade-list.component';
import { PnlDashboardComponent } from './pnl/pnl-dashboard/pnl-dashboard.component';

export const routes: Routes = [
  { path: 'trades', component: TradeListComponent },
  { path: 'pnl', component: PnlDashboardComponent },
  { path: '', redirectTo: '/trades', pathMatch: 'full' },
];
