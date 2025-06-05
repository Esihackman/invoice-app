import { Routes } from '@angular/router';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceFormsComponent } from './invoice-forms/invoice-forms.component'
import { EditInvoiceFormComponent } from './edit-invoice-form/edit-invoice-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/invoices', pathMatch: 'full' }, 
  { path: 'invoices', component: InvoiceListComponent },   
  { path: 'invoice/new', component: InvoiceFormsComponent }, 
  { path: 'invoice/edit/:id', component: EditInvoiceFormComponent},
  { path: '**', redirectTo: '/invoices' } 
];