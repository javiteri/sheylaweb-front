import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarProductoCompraDialogComponent } from './buscar-producto-compra-dialog.component';

describe('BuscarProductoCompraDialogComponent', () => {
  let component: BuscarProductoCompraDialogComponent;
  let fixture: ComponentFixture<BuscarProductoCompraDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarProductoCompraDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarProductoCompraDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
