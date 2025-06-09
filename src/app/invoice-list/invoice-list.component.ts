import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../services/invoice.service';
import { Invoice } from '../models/invoice.model';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  invoices$!: Observable<Invoice[]>;
  private _selectedStatuses = new BehaviorSubject<string[]>([]);
  selectedStatuses$ = this._selectedStatuses.asObservable();
  isDropdownOpen: boolean = false;

  constructor(private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.invoices$ = combineLatest([
      this.invoiceService.getInvoices(),
      this.selectedStatuses$
    ]).pipe(
      map(([invoices, selectedStatuses]) => {
        if (selectedStatuses.length === 0) {
          return invoices; 
        }
        return invoices.filter(invoice => selectedStatuses.includes(invoice.status.toLowerCase()));
      })
    );
  }

  onFilterChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const status = checkbox.value;
    const currentStatuses = this._selectedStatuses.getValue();

    if (checkbox.checked) {
      this._selectedStatuses.next([...currentStatuses, status]);
    } else {
      this._selectedStatuses.next(currentStatuses.filter(s => s !== status));
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
} 