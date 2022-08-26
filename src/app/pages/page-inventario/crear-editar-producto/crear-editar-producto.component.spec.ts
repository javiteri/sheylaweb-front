import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarProductoComponent } from './crear-editar-producto.component';

describe('CrearEditarProductoComponent', () => {
  let component: CrearEditarProductoComponent;
  let fixture: ComponentFixture<CrearEditarProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearEditarProductoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearEditarProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
