import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarClienteDialogComponent } from './buscar-cliente-dialog.component';

describe('BuscarClienteDialogComponent', () => {
  let component: BuscarClienteDialogComponent;
  let fixture: ComponentFixture<BuscarClienteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarClienteDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarClienteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
