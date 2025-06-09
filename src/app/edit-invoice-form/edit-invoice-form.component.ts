import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../services/invoice.service';
import { Invoice } from '../models/invoice.model';
import { Observable, switchMap } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';

@Component({
  selector: 'app-edit-invoice-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './edit-invoice-form.component.html',
  styleUrls: ['./edit-invoice-form.component.scss']
})
export class EditInvoiceFormComponent implements OnInit {
  invoice$!: Observable<Invoice | undefined>;
  invoiceForm!: FormGroup;
  invoiceId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.invoiceForm = this.fb.group({
      description: ['', Validators.required],
      clientName: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      senderAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        postCode: ['', Validators.required],
        country: ['', Validators.required]
      }),
      clientAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        postCode: ['', Validators.required],
        country: ['', Validators.required]
      }),
      items: this.fb.array([]),
      paymentTerms: [1, Validators.required]
    });

    this.invoice$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.invoiceId = params.get('id');
        return this.invoiceService.getInvoiceById(this.invoiceId!);
      })
    );

    this.invoice$.subscribe(invoice => {
      if (invoice) {
        this.populateForm(invoice);
      }
    });
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  createItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      total: [{ value: 0, disabled: true }]
    });
  }

  populateForm(invoice: Invoice): void {
    this.invoiceForm.patchValue({
      description: invoice.description,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      senderAddress: invoice.senderAddress,
      clientAddress: invoice.clientAddress,
      paymentTerms: invoice.paymentTerms,
      createdAt: invoice.createdAt
    });

    this.items.clear();
    invoice.items.forEach(item => {
      const itemGroup = this.createItem();
      itemGroup.patchValue(item);
      this.items.push(itemGroup);
    });
  }

  onSubmit(): void {
    if (this.invoiceForm.valid && this.invoiceId) {
      const updatedInvoice: Invoice = {
        ...this.invoiceForm.getRawValue(),
        id: this.invoiceId,
        status: 'pending', 
        createdAt: new Date().toISOString().slice(0, 10),
        paymentDue: new Date(Date.now() + this.invoiceForm.value.paymentTerms * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
      };
      this.invoiceService.updateInvoice(updatedInvoice);
      this.router.navigate([`/invoices/${this.invoiceId}`]);
    } else {
      console.log('Form is invalid or invoice ID is missing');
    }
  }

  goBack(): void {
    this.router.navigate([`/invoices/${this.invoiceId}`]);
  }
}
