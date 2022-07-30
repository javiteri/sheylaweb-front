import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageVentasComponent } from './page-ventas.component';

describe('PageVentasComponent', () => {
  let component: PageVentasComponent;
  let fixture: ComponentFixture<PageVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageVentasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
