import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarProductoDialogComponent } from './buscar-producto-dialog.component';

describe('BuscarProductoDialogComponent', () => {
  let component: BuscarProductoDialogComponent;
  let fixture: ComponentFixture<BuscarProductoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarProductoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarProductoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
