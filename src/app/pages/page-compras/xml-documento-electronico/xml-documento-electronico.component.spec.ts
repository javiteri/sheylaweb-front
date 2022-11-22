import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XmlDocumentoElectronicoComponent } from './xml-documento-electronico.component';

describe('XmlDocumentoElectronicoComponent', () => {
  let component: XmlDocumentoElectronicoComponent;
  let fixture: ComponentFixture<XmlDocumentoElectronicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XmlDocumentoElectronicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(XmlDocumentoElectronicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
