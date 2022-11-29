import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SriBuscarDocumentoXmlComponent } from './sri-buscar-documento-xml.component';

describe('SriBuscarDocumentoXmlComponent', () => {
  let component: SriBuscarDocumentoXmlComponent;
  let fixture: ComponentFixture<SriBuscarDocumentoXmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SriBuscarDocumentoXmlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SriBuscarDocumentoXmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
