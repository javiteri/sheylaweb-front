import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoIngresoCajaDialogComponent } from './nuevo-ingreso-caja-dialog.component';

describe('NuevoIngresoCajaDialogComponent', () => {
  let component: NuevoIngresoCajaDialogComponent;
  let fixture: ComponentFixture<NuevoIngresoCajaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoIngresoCajaDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoIngresoCajaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
