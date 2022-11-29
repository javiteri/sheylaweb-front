import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable()
export class ListCompraItemsService {

  private product$ = new BehaviorSubject<any>({});
  selectedProduct$ = this.product$.asObservable();

  private productListBus$ = new BehaviorSubject<any>([]);
  productList$ = this.productListBus$.asObservable();

  private datosProveedorBus$ = new BehaviorSubject<any>([]);
  datosProveedor$ = this.datosProveedorBus$.asObservable();

  constructor(){
  }

  setProveedor(proveedor: any){
    this.datosProveedorBus$.next(proveedor);
  }

  setProduct(product: any) {
    this.product$.next(product);
  }
  
  setProductList(products: any) {
    this.productListBus$.next(products);
  }

}
