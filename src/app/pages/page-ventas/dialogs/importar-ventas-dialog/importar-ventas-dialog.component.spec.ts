import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarVentasDialogComponent } from './importar-ventas-dialog.component';

describe('ImportarVentasDialogComponent', () => {
  let component: ImportarVentasDialogComponent;
  let fixture: ComponentFixture<ImportarVentasDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportarVentasDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportarVentasDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
