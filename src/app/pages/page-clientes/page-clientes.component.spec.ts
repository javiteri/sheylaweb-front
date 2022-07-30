import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageClientesComponent } from './page-clientes.component';

describe('PageClientesComponent', () => {
  let component: PageClientesComponent;
  let fixture: ComponentFixture<PageClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageClientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
