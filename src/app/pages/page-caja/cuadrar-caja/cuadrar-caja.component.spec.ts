import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuadrarCajaComponent } from './cuadrar-caja.component';

describe('CuadrarCajaComponent', () => {
  let component: CuadrarCajaComponent;
  let fixture: ComponentFixture<CuadrarCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuadrarCajaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuadrarCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
