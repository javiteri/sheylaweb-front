import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectCheckoutComponent } from './redirect-checkout.component';

describe('RedirectCheckoutComponent', () => {
  let component: RedirectCheckoutComponent;
  let fixture: ComponentFixture<RedirectCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedirectCheckoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedirectCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
