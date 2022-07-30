import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageComprasComponent } from './page-compras.component';

describe('PageComprasComponent', () => {
  let component: PageComprasComponent;
  let fixture: ComponentFixture<PageComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageComprasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
