import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoEgresoCajaDialogComponent } from './nuevo-egreso-caja-dialog.component';

describe('NuevoEgresoCajaDialogComponent', () => {
  let component: NuevoEgresoCajaDialogComponent;
  let fixture: ComponentFixture<NuevoEgresoCajaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoEgresoCajaDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoEgresoCajaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
