import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearNuevaEmpresaDialogComponent } from './crear-nueva-empresa-dialog.component';

describe('CrearNuevaEmpresaDialogComponent', () => {
  let component: CrearNuevaEmpresaDialogComponent;
  let fixture: ComponentFixture<CrearNuevaEmpresaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearNuevaEmpresaDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearNuevaEmpresaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
