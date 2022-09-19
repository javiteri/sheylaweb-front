import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenVentasComponent } from './resumen-ventas.component';

describe('ResumenVentasComponent', () => {
  let component: ResumenVentasComponent;
  let fixture: ComponentFixture<ResumenVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumenVentasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
