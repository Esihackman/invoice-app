import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../services/invoice.service';
import { Invoice } from '../models/invoice.model';
import { Observable } from 'rxjs';
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

  constructor(private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.invoices$ = this.invoiceService.getInvoices();
    this.invoiceService.loadInvoices().subscribe();
  }

  // Onchange() {
  //   alert('changes updated')
  // }

  // TODO: Implement filtering and delete functionality
} 