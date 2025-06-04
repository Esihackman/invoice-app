import { Routes } from '@angular/router';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceFormsComponent } from './invoice-forms/invoice-forms.component'
export const routes: Routes = [
  { path: '', redirectTo: '/invoices', pathMatch: 'full' }, 
  { path: 'invoices', component: InvoiceListComponent },   
  { path: 'invoice/new', component: InvoiceFormsComponent }, 
  { path: '**', redirectTo: '/invoices' } 
];