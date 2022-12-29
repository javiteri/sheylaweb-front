import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptProformaComponent } from './receipt-proforma.component';

describe('ReceiptProformaComponent', () => {
  let component: ReceiptProformaComponent;
  let fixture: ComponentFixture<ReceiptProformaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptProformaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptProformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
