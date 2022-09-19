import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenComprasComponent } from './resumen-compras.component';

describe('ResumenComprasComponent', () => {
  let component: ResumenComprasComponent;
  let fixture: ComponentFixture<ResumenComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumenComprasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumenComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
