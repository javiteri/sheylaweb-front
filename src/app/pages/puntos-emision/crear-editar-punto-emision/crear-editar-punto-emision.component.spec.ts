import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarPuntoEmisionComponent } from './crear-editar-punto-emision.component';

describe('CrearEditarPuntoEmisionComponent', () => {
  let component: CrearEditarPuntoEmisionComponent;
  let fixture: ComponentFixture<CrearEditarPuntoEmisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearEditarPuntoEmisionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearEditarPuntoEmisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
