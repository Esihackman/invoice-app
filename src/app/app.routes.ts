import { Routes } from '@angular/router';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';

export const routes: Routes = [
  {
    path: '',
    title: "Home",
    component: InvoiceListComponent
  }
];
