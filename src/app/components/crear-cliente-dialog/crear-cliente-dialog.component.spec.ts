import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearClienteDialogComponent } from './crear-cliente-dialog.component';

describe('CrearClienteDialogComponent', () => {
  let component: CrearClienteDialogComponent;
  let fixture: ComponentFixture<CrearClienteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearClienteDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearClienteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
