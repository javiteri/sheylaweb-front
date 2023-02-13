import { TestBed } from '@angular/core/testing';

import { ListVentaItemsService } from './list-venta-items.service';

describe('ListVentaItemsService', () => {
  let service: ListVentaItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListVentaItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
