import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPaymentFormComponent } from './dialog-payment-form.component';

describe('DialogPaymentFormComponent', () => {
  let component: DialogPaymentFormComponent;
  let fixture: ComponentFixture<DialogPaymentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPaymentFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
