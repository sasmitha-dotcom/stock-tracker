import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Trade, TradePayload } from '../../models/trade.model';

@Component({
  selector: 'app-trade-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
  ],
  templateUrl: './trade-form.component.html',
})
export class TradeFormComponent implements OnInit {
  form!: FormGroup;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TradeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { trade?: Trade }
  ) {
    this.isEdit = !!data?.trade;
  }

  ngOnInit(): void {
    const t = this.data?.trade;
    this.form = this.fb.group({
      symbol: [t?.symbol ?? '', [Validators.required, Validators.maxLength(20)]],
      type: [t?.type ?? 'BUY', Validators.required],
      quantity: [t?.quantity ?? '', [Validators.required, Validators.min(0.0001)]],
      price: [t?.price ?? '', [Validators.required, Validators.min(0.0001)]],
      trade_date: [t?.trade_date ? new Date(t.trade_date) : null, Validators.required],
      notes: [t?.notes ?? ''],
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    const raw = this.form.value;
    const d: Date = raw.trade_date;
    const trade_date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const payload: TradePayload = {
      ...raw,
      symbol: raw.symbol.toUpperCase(),
      trade_date,
    };
    this.dialogRef.close(payload);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
