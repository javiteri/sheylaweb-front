import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesComponentComponent } from './clientes-component.component';

describe('ClientesComponentComponent', () => {
  let component: ClientesComponentComponent;
  let fixture: ComponentFixture<ClientesComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientesComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientesComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
