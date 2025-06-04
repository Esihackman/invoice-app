import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InvoiceService } from '../services/invoice.service';
import { Invoice } from '../models/invoice.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-forms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './invoice-forms.component.html',
  styleUrls: ['./invoice-forms.component.scss']
})
export class InvoiceFormsComponent implements OnInit {
  invoiceForms!: FormGroup;

  // Add the invoice property for editing existing invoices
  invoice?: Invoice;

  paymentTermOptions = [
    { value: 1, label: 'Net 1 Day' },
    { value: 7, label: 'Net 7 Days' },
    { value: 14, label: 'Net 14 Days' },
    { value: 30, label: 'Net 30 Days' }
  ];

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    public router: Router
  ) { }

  ngOnInit(): void {
   

    this.invoiceForms = this.fb.group({
      clientName: [this.invoice?.clientName || '', Validators.required],
      clientEmail: [this.invoice?.clientEmail || '', [Validators.required, Validators.email]],
      status: [this.invoice?.status || 'draft'],
      senderAddress: this.fb.group({
        street: [this.invoice?.senderAddress.street || '', Validators.required],
        city: [this.invoice?.senderAddress.city || '', Validators.required],
        postCode: [this.invoice?.senderAddress.postCode || '', Validators.required],
        country: [this.invoice?.senderAddress.country || '', Validators.required]
      }),
      clientAddress: this.fb.group({
        street: [this.invoice?.clientAddress.street || '', Validators.required],
        city: [this.invoice?.clientAddress.city || '', Validators.required],
        postCode: [this.invoice?.clientAddress.postCode || '', Validators.required],
        country: [this.invoice?.clientAddress.country || '', Validators.required]
      }),
      items: this.fb.array([]),
      paymentTerms: [this.invoice?.paymentTerms || 1, Validators.required],
      description: [this.invoice?.description || '', Validators.required],
      createdAt: [this.invoice?.createdAt || '', Validators.required],
      paymentDue: [this.invoice?.paymentDue || '', Validators.required],
      total: [{ value: this.invoice?.total || 0, disabled: true }]
    });

    if (this.invoice?.items?.length) {
      this.invoice.items.forEach(item => this.items.push(this.fb.group({
        name: [item.name, Validators.required],
        quantity: [item.quantity, [Validators.required, Validators.min(1)]],
        price: [item.price, [Validators.required, Validators.min(0)]],
        total: [{ value: item.total, disabled: true }]
      })));
    } else {
      this.addItem();
    }

    // Calculate grand total and payment due initially
    this.calculateGrandTotal();
    this.onDateOrTermsChange();

    // Optional: subscribe to changes for dynamic updates
    this.invoiceForms.get('createdAt')?.valueChanges.subscribe(() => this.onDateOrTermsChange());
    this.invoiceForms.get('paymentTerms')?.valueChanges.subscribe(() => this.onDateOrTermsChange());
  }

  get items(): FormArray {
    return this.invoiceForms.get('items') as FormArray;
  }

  get itemFormGroups(): FormGroup[] {
    return this.items.controls as FormGroup[];
  }

  newItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      total: [{ value: 0, disabled: true }]
    });
  }

  addItem(): void {
    this.items.push(this.newItem());
  }

  removeItem(i: number): void {
    this.items.removeAt(i);
    this.calculateGrandTotal();
  }

  onSubmit(): void {
    if (this.invoiceForms.valid) {
      const newInvoice: Invoice = this.invoiceForms.getRawValue(); // getRawValue to include disabled controls

      // Generate ID if none exists (new invoice)
      if (!this.invoice) {
        newInvoice.id = Math.random().toString(36).substring(2, 8).toUpperCase();
      } else {
        newInvoice.id = this.invoice.id; // keep existing id if editing
      }

      if (!newInvoice.createdAt) {
        newInvoice.createdAt = new Date().toISOString().split('T')[0];
      }

      const createdAtDate = new Date(newInvoice.createdAt);
      createdAtDate.setDate(createdAtDate.getDate() + newInvoice.paymentTerms);
      newInvoice.paymentDue = createdAtDate.toISOString().split('T')[0];

      newInvoice.items.forEach(item => {
        item.total = item.quantity * item.price;
      });
      newInvoice.total = newInvoice.items.reduce((sum, item) => sum + item.total, 0);

      if (this.invoice) {
        this.invoiceService.updateInvoice(newInvoice);  // Assuming you have updateInvoice method
      } else {
        this.invoiceService.addInvoice(newInvoice);
      }

      console.log('Form Submitted', newInvoice);
      this.router.navigate(['/invoices']);
    } else {
      console.log('Form is invalid');
    }
  }

  calculateItemTotal(itemFormGroup: FormGroup): void {
    const quantity = itemFormGroup.get('quantity')?.value || 0;
    const price = itemFormGroup.get('price')?.value || 0;
    itemFormGroup.get('total')?.setValue(quantity * price, { emitEvent: false });
    this.calculateGrandTotal();
  }

  calculateGrandTotal(): void {
    const itemsTotal = this.items.controls.reduce((sum, itemControl) => {
      const itemTotal = itemControl.get('total')?.value || 0;
      return sum + itemTotal;
    }, 0);
    this.invoiceForms.get('total')?.setValue(itemsTotal, { emitEvent: false });
  }

  onQuantityChange(itemFormGroup: FormGroup): void {
    this.calculateItemTotal(itemFormGroup);
  }

  onPriceChange(itemFormGroup: FormGroup): void {
    this.calculateItemTotal(itemFormGroup);
  }

  onDateOrTermsChange(): void {
    const createdAt = this.invoiceForms.get('createdAt')?.value;
    const paymentTerms = this.invoiceForms.get('paymentTerms')?.value;

    if (createdAt && paymentTerms) {
      const createdAtDate = new Date(createdAt);
      createdAtDate.setDate(createdAtDate.getDate() + paymentTerms);
      this.invoiceForms.get('paymentDue')?.setValue(createdAtDate.toISOString().split('T')[0], { emitEvent: false });
    }
  }

  // ✅ Helper to check field validity
  isFieldInvalid(fieldPath: string | string[]): boolean {
    const control = Array.isArray(fieldPath)
      ? this.invoiceForms.get(fieldPath)
      : this.invoiceForms.get([fieldPath]);

    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
