import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CantidadProductoDialogComponent } from './cantidad-producto-dialog.component';

describe('CantidadProductoDialogComponent', () => {
  let component: CantidadProductoDialogComponent;
  let fixture: ComponentFixture<CantidadProductoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CantidadProductoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CantidadProductoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
