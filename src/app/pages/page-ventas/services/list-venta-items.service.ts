import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ListVentaItemService {

  private product$ = new BehaviorSubject<any>({});
  selectedProduct$ = this.product$.asObservable();
  
  private productListBus$ = new BehaviorSubject<any>([]);
  productList$ = this.productListBus$.asObservable();
  
  constructor() { }


  setProduct(product: any) {
    this.product$.next(product);
  }
  
  setProductList(products: any) {
    this.productListBus$.next(products);
  }
}
