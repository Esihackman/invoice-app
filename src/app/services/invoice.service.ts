import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Invoice } from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private _invoices = new BehaviorSubject<Invoice[]>([]);
  readonly invoices$ = this._invoices.asObservable();

  constructor(private http: HttpClient) { }

  loadInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>('assets/data.json').pipe(
      tap(invoices => this._invoices.next(invoices))
    );
  }

  getInvoices(): Observable<Invoice[]> {
    return this.invoices$;
  }

  getInvoiceById(id: string): Observable<Invoice | undefined> {
    return this.invoices$.pipe(
      map(invoices => invoices.find(invoice => invoice.id === id))
    );
  }

  addInvoice(invoice: Invoice): void {
    const currentInvoices = this._invoices.getValue();
    this._invoices.next([...currentInvoices, invoice]);
    console.log('Invoice added:', invoice);
  }

  updateInvoice(updatedInvoice: Invoice): void {
    const currentInvoices = this._invoices.getValue();
    const updatedInvoices = currentInvoices.map(invoice =>
      invoice.id === updatedInvoice.id ? updatedInvoice : invoice
    );
    this._invoices.next(updatedInvoices);
    console.log('Invoice updated:', updatedInvoice);
  }

  deleteInvoice(id: string): Observable<boolean> {
    const currentInvoices = this._invoices.getValue();
    const filteredInvoices = currentInvoices.filter(invoice => invoice.id !== id);
    this._invoices.next(filteredInvoices);
    console.log(`Invoice with id ${id} deleted.`);
    return of(true);
  }
}
