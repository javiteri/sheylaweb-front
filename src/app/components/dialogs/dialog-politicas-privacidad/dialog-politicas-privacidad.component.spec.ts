import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPoliticasPrivacidadComponent } from './dialog-politicas-privacidad.component';

describe('DialogPoliticasPrivacidadComponent', () => {
  let component: DialogPoliticasPrivacidadComponent;
  let fixture: ComponentFixture<DialogPoliticasPrivacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogPoliticasPrivacidadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogPoliticasPrivacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
