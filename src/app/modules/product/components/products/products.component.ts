import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Hotel } from '../../models/hotel.model';
import { StateService } from '../../services/state.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  type: string;
  productImageFile: any;
  recievedProducts: Hotel[];
  productImageId: string;
  productImageConfig: CropConfig;
  searchVal = '';
  data: Hotel[];
  originalProducts: Hotel[];
  products: Hotel[];

  @Input() locationId: string;
  // @Input() products: Hotel[];
  @Input() openedProduct: number;
  @Input() noMoreAllProducts: boolean;
  @Input() noMoreSearchProducts: boolean;
  @Input() locationName: string;
  @Input() productType: string;
  @Input() searchHotelKeyCheck: string;
  @Input() searchPackageKeyCheck: string;

  @Output() browseImage: EventEmitter<any> = new EventEmitter();
  @Output() replaceImage: EventEmitter<any> = new EventEmitter();
  @Output() productAdded: EventEmitter<any> = new EventEmitter();
  @Output() addingProduct: EventEmitter<number> = new EventEmitter();

  constructor(
    private activatedRoute: ActivatedRoute,
    private stateService: StateService
  ) { }

  ngOnInit() {
    /*this.stateService.getProductState().subscribe(products => {
      this.products = this.data = products;
    });*/
    this.activatedRoute.params.subscribe(param => {
      this.type = param.type;
      if (this.type === null) {
        this.type = 'stays';
      }
    });

    this.stateService.getProductState().subscribe(products => {
      let hotelRE = new RegExp(this.searchHotelKeyCheck, 'i');
      let packageRE = new RegExp(this.searchPackageKeyCheck, 'i');
      this.products = [];

      if(this.type == 'stays'){
        products = [...new Map(products.map(item => [item.tboHotelId, item])).values()];
        if(this.searchHotelKeyCheck && this.searchHotelKeyCheck !== ''){
          products.forEach(product => {
            if (product.title.match(hotelRE)) {
              this.products.push(product);
            }
          });
        } else if (this.searchHotelKeyCheck === '') {
          this.products = products;
        }
      }

      if(this.type == 'experiences'){
        products = [...new Map(products.map(item => [item.packageId, item])).values()];
        if(this.searchPackageKeyCheck && this.searchPackageKeyCheck !== ''){
          products.forEach(product => {
            if (product.title.match(packageRE)) {
              this.products.push(product);
            }
          });
        } else if (this.searchPackageKeyCheck === '') {
          this.products = products;
        }
      }
    });
  }

  ngOnChanges() {
    this.searchHotelKeyCheck = this.searchHotelKeyCheck;
    this.searchPackageKeyCheck = this.searchPackageKeyCheck;
  }

  onAddingProduct(listingId: number) {
    this.addingProduct.emit(listingId);
  }

  onBrowseImage($event) {
    this.browseImage.emit($event);
  }

  onBrowseAnotherImage($event) {
    this.replaceImage.emit($event);
  }

  onProductDelete(productListingId) {
    this.products = this.products.map(productItem => {
      if (productItem.productListingId === productListingId) {
        productItem.productListingId = null;
        return productItem;
      } else {
        return productItem;
      }
    });
    this.stateService.setProducts(this.products);
  }

}
