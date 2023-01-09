import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarClientesDialogComponent } from './importar-clientes-dialog.component';

describe('ImportarClientesDialogComponent', () => {
  let component: ImportarClientesDialogComponent;
  let fixture: ComponentFixture<ImportarClientesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportarClientesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportarClientesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
