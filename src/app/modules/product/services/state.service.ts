import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable, BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable()
export class StateService {

  products: BehaviorSubject<Product[]>;
  productsState: Product[];

  constructor() {
    this.products = new BehaviorSubject([]);
    this.getProductState().subscribe(products => {
      this.productsState = products;
    });
  }

  getProductState(): Observable<any> {
    return this.products.asObservable();
  }

  setProducts(state) {
    this.products.next(state);
  }

  pushToProducts(state: Product) {
    this.productsState.push(state);
    this.products.next(this.productsState);
  }

  addToProducts(state: Product[]) {
    const products = this.productsState.concat(state);
    this.products.next(products);
  }

  removeProduct(productListingId: string) {
    const productsArr = this.productsState.filter(product => {
      if (product.productListingId !== productListingId) {
        return product;
      }
    });
    this.setProducts(productsArr);
  }
}
