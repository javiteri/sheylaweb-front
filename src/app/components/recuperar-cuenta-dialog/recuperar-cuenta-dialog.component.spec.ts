import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarCuentaDialogComponent } from './recuperar-cuenta-dialog.component';

describe('RecuperarCuentaDialogComponent', () => {
  let component: RecuperarCuentaDialogComponent;
  let fixture: ComponentFixture<RecuperarCuentaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecuperarCuentaDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecuperarCuentaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
