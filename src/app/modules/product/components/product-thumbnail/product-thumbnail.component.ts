import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { Product } from '../../models/product.model';
import { faTimesCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../../services/product.service';
import { StateService } from '../../services/state.service';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';

@Component({
  selector: 'app-product-thumbnail',
  templateUrl: './product-thumbnail.component.html',
  styleUrls: ['./product-thumbnail.component.css']
})
export class ProductThumbnailComponent implements OnInit, DoCheck {

  products: Product[];
  allProducts: Product[];
  closeIcon: IconDefinition;
  defaultImage: string;
  @Output() productDeleted: EventEmitter<any> = new EventEmitter();

  constructor(
    private stateService: StateService,
    private loaderService: LoaderService,
    private productService: ProductService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.products = [];
    this.closeIcon = faTimesCircle;
    this.stateService.getProductState().subscribe(products => {
      this.allProducts = products;
    });
    this.defaultImage = "https://funstay010121.s3.ap-south-1.amazonaws.com/common/assets/images/tripshifu-logo-black.svg";
  }

  ngDoCheck() {
    this.filterOutListings();
  }

  deleteProduct(productListingId) {
    const data = {
      productlisting_id: productListingId
    };
    if (confirm('Are you sure, you want to delete this product?')) {
      const userId = this.authenticationService.getUserId();
      this.loaderService.show();
      this.productService
        .deleteProduct(userId, data)
        .subscribe(
          result => {
            if (result.success === true) {
              this.allProducts = this.allProducts.map(product => {
                if (product.productListingId === productListingId) {
                  product.productListingId = null;
                }
                return product;
              });
              this.stateService.setProducts(this.allProducts);
            } else {
              console.log('delete product', result.message);
            }
          },
          error => {},
          () => {
            this.loaderService.hide();
          });
    }
  }

  filterOutListings() {
    if (this.allProducts) {
      this.products = this.allProducts.filter(product => {
        if (product.productListingId && product.productListingId !== null) {
          return product;
        }
      });
    }
  }

  onImageError(event){
    event.target.src = this.defaultImage;
  }
}
