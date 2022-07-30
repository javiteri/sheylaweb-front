import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageInventarioComponent } from './page-inventario.component';

describe('PageInventarioComponent', () => {
  let component: PageInventarioComponent;
  let fixture: ComponentFixture<PageInventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageInventarioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
