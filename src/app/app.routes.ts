import { Routes } from '@angular/router';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceFormsComponent } from './invoice-forms/invoice-forms.component'
import { EditInvoiceFormComponent } from './edit-invoice-form/edit-invoice-form.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/invoices', pathMatch: 'full' },
  { path: 'invoices', component: InvoiceListComponent },
  { path: 'invoices/new', component: InvoiceFormsComponent },
  { path: 'invoices/:id', component: InvoiceDetailComponent },
  { path: 'invoices/:id/edit', component: EditInvoiceFormComponent },
  { path: '**', redirectTo: '/invoices' }
];