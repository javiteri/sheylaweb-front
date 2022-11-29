import { TestBed } from '@angular/core/testing';

import { ListCompraItemsService } from './list-compra-items.service';

describe('ListCompraItemsService', () => {
  let service: ListCompraItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListCompraItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
