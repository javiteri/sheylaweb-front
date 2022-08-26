import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreteEditProveedorComponent } from './create-edit-proveedor.component';

describe('CreteEditProveedorComponent', () => {
  let component: CreteEditProveedorComponent;
  let fixture: ComponentFixture<CreteEditProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreteEditProveedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreteEditProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
