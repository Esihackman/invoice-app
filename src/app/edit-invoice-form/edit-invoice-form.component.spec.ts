import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInvoiceFormComponent } from './edit-invoice-form.component';

describe('EditInvoiceFormComponent', () => {
  let component: EditInvoiceFormComponent;
  let fixture: ComponentFixture<EditInvoiceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditInvoiceFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInvoiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
