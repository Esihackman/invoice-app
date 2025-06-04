import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceFormsComponent } from './invoice-forms.component';

describe('InvoiceFormsComponent', () => {
  let component: InvoiceFormsComponent;
  let fixture: ComponentFixture<InvoiceFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceFormsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
