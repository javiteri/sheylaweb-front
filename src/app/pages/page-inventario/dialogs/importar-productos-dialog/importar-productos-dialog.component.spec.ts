import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportarProductosDialogComponent } from './importar-productos-dialog.component';

describe('ImportarProductosDialogComponent', () => {
  let component: ImportarProductosDialogComponent;
  let fixture: ComponentFixture<ImportarProductosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportarProductosDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportarProductosDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
