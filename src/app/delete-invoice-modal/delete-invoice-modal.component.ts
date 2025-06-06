import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-invoice-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-invoice-modal.component.html',
  styleUrls: ['./delete-invoice-modal.component.scss']
})
export class DeleteInvoiceModalComponent {
  @Input() invoiceId: string | null = null;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();

  constructor() { }

  cancel(): void {
    this.onCancel.emit();
  }

  confirm(): void {
    this.onConfirm.emit();
  }
}
