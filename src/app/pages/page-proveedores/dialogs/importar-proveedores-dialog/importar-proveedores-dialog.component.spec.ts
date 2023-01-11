import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarProveedoresDialogComponent } from './importar-proveedores-dialog.component';

describe('ImportarProveedoresDialogComponent', () => {
  let component: ImportarProveedoresDialogComponent;
  let fixture: ComponentFixture<ImportarProveedoresDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportarProveedoresDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportarProveedoresDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
