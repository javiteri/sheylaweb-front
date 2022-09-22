import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarProveedorDialogComponent } from './buscar-proveedor-dialog.component';

describe('BuscarProveedorDialogComponent', () => {
  let component: BuscarProveedorDialogComponent;
  let fixture: ComponentFixture<BuscarProveedorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarProveedorDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarProveedorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
