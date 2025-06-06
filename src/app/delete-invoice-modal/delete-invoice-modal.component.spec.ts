import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteInvoiceModalComponent } from './delete-invoice-modal.component';

describe('DeleteInvoiceModalComponent', () => {
  let component: DeleteInvoiceModalComponent;
  let fixture: ComponentFixture<DeleteInvoiceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteInvoiceModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteInvoiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
