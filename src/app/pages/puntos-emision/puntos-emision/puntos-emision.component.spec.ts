import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuntosEmisionComponent } from './puntos-emision.component';

describe('PuntosEmisionComponent', () => {
  let component: PuntosEmisionComponent;
  let fixture: ComponentFixture<PuntosEmisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuntosEmisionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuntosEmisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
