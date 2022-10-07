import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosElectronicosComponent } from './documentos-electronicos.component';

describe('DocumentosElectronicosComponent', () => {
  let component: DocumentosElectronicosComponent;
  let fixture: ComponentFixture<DocumentosElectronicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentosElectronicosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosElectronicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
