import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearproformaComponent } from './crearproforma.component';

describe('CrearproformaComponent', () => {
  let component: CrearproformaComponent;
  let fixture: ComponentFixture<CrearproformaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearproformaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearproformaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
