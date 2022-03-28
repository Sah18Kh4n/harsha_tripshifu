import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { faPlusSquare, IconDefinition, faTrashAlt, faTimesCircle, faImage, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Hotel } from '../../models/hotel.model';
import { HotelImage } from '../../models/hotelimage.model';
import { ProductService } from '../../services/product.service';
import { environment } from '../../../../../environments/environment';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { ProductAdapter } from '../../adapters/product.adapter';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({
        opacity: 1,
        visibility: 'visible',
        maxHeight: '760px',
        overflow: 'hidden'
      })),
      state('close', style({
        opacity: 0,
        visibility: 'hidden',
        maxHeight: 0,
        overflow: 'hidden'
      })),
      transition('close => open', [
        animate('800ms ease-in-out')
      ]),
      transition('open => close', [
        animate('1000ms ease-in-out')
      ])
    ])
  ]
})
export class ProductComponent implements OnInit, DoCheck {

  state: string;
  adding: boolean;
  message: string;
  productLink: string;
  submitted: boolean;
  statusCheck: string;
  descCharCount: number;
  descMaxCharCount: number;
  productImageId: string;
  productImageFile: File;
  listingForm: FormGroup;
  readOnlyRating: boolean;
  noImage: IconDefinition;
  closeIcon: IconDefinition;
  trashIcon: IconDefinition;
  addNewIcon: IconDefinition;
  externalLink: IconDefinition;
  showLoader: boolean;
  subscription: Subscription;
  defaultImage: string;

  @Input() product: Hotel;
  @Input() locationId: string;
  @Input() openedProduct: number;
  @Input() locationName: string;
  @Output() replaceImage: EventEmitter<any> = new EventEmitter();
  @Output() browseImage: EventEmitter<any> = new EventEmitter();
  @Output() productDeleted: EventEmitter<string> = new EventEmitter();
  @Output() addingProduct: EventEmitter<number> = new EventEmitter();

  constructor(
    private loaderService: LoaderService,
    private productAdapter: ProductAdapter,
    private hotelAdapter: ProductAdapter,
    private productService: ProductService,
    private authenticationService: AuthenticationService
  ) {
    this.descMaxCharCount = 1000;
    this.adding = false;
    this.readOnlyRating = true;
    this.submitted = false;
    this.addNewIcon = faPlusSquare;
    this.trashIcon = faTrashAlt;
    this.closeIcon = faTimesCircle;
    this.externalLink = faExternalLinkAlt;
    this.noImage = faImage;
    this.listingForm = new FormGroup({
      description: new FormControl(null, [
        Validators.required,
        Validators.maxLength(1000)
      ]),
      saveListing: new FormControl('Confirm'),
      subBtn: new FormControl('Read More & Add')
    });
  }

  ngOnInit() {
    this.state = 'close';
    this.defaultImage = "https://funstay010121.s3.ap-south-1.amazonaws.com/common/assets/images/tripshifu-logo-black.svg";
    if (this.product) {
      if (this.product && this.product.description.length > 1000) {
        this.product.description = this.product.description.substring(0, 997) + '...';
      }
      this.descCharCount = this.descMaxCharCount - this.product.description.length;
      let desc = this.product.description.replace(/<[^>]*>/g, '')
      this.listingFormControl.description.reset(desc);
    }
    if(Array.isArray(this.product.images)){
      if(this.product.images.length > 0){
        this.product.images.sort((a,b) => (a.order-b.order));
      }
    }
  }

  ngDoCheck() {
    if (this.product) {
      this.statusCheck = (this.product.status === 1) ? 'checked' : '';
      this.message = '';
      if (this.product.productListingId) {
        this.setProductFormProperties();
      } else {
        this.setListingFormProperties();
      }
      if (this.product.packageId !== null) {
        this.productLink = environment.funstayWebBase + 'experiential-travel-package/' + this.product.slug;
      } else if (this.product.tboHotelId) {
        /*if(this.product.hotelId){
          this.productLink = environment.funstayWebBase + 'unique-hotels/' + this.product.hotelId;
        } else {
          this.productLink = environment.funstayWebBase + 'unique-hotels/' + this.product.tboHotelId;
        }*/
        this.productLink = environment.funstayWebBase + 'unique-hotels/' + this.product.tboHotelId;
      } else if (this.product.listingId) {
        this.productLink = environment.funstayWebBase + 'unique-stays/' + this.product.listingId;
      }
    }
    if (this.openedProduct !== this.product.hotelId) {
      this.skip();
    }
  }

  updateDescCharCount() {
    this.descCharCount = this.descMaxCharCount - this.listingFormControl.description.value.length;
  }

  addListing() {
    this.message = '';
    this.adding = true;
    this.state = 'open';
    this.listingFormControl.saveListing.setValue('Add');
    if (this.product.productListingId) {
      this.readOnlyRating = false;
    }
    this.addingProduct.emit(this.product.hotelId);
  }

  skip() {
    this.message = '';
    this.adding = false;
    this.state = 'close';
    if (this.product.productListingId) {
      this.readOnlyRating = true;
    }
  }

  submitListingForm() {
    this.message = '';
    this.submitted = true;
    if (this.listingForm.valid) {
      this.message = 'Saving...';
      if (this.product.productListingId) {
        this.updateProductListing();
      } else {
        this.saveProductListing();
      }
    }
  }

  updateProductListing(): void {
    const data = {
      productlisting_id: this.product.productListingId,
      description: this.listingFormControl.description.value
    };
    const userId = this.authenticationService.getUserId();
    this.loaderService.show();
    this.productService
      .updateProductListing(userId, data)
      .subscribe(
        result => {
          if (result.success === true) {
            let desc = this.product.description.replace(/<[^>]*>/g, '')
            desc = this.listingFormControl.description.value;
            this.message = 'Product updated successfully';
          } else {
            this.message = result.message;
          }
        },
        error => {
          this.message = error;
        },
        () => {
          this.loaderService.hide();
        });
  }

  saveProductListing(): void {
    if (this.product.packageId !== null) {
      this.savePackage();
    } else {
      this.saveListing();
    }
  }
  
  saveListing() {
    let id = null;
    let type = null;
    let data = null;
    if(this.product.listingId == null){
      id = this.product.tboHotelId;
      type = 'hotel';
    } else {
      id = this.product.listingId;
      type = 'stay'; 
    }
    if(type == 'hotel'){
      data = {
        location_id: this.locationId,
        hotel_id: id,
        description: this.listingFormControl.description.value,
        location: this.locationName,
        lType: type
      };
    }
    if(type == 'stay'){
      data = {
        location_id: this.locationId,
        listing_id: id,
        description: this.listingFormControl.description.value,
        location: this.locationName,
        lType: type
      };
    }
    const userId = this.authenticationService.getUserId();
    this.loaderService.show();
    this.productService
      .addProductListing(userId, data)
      .subscribe(
        result => {
          if (result.success === true) {
            this.message = 'Product added successfully';
            this.product.productListingId = result.data.productlisting_id;
            this.product.images = this.hotelAdapter.adaptProductImages(result.data.images);
            this.listingFormControl.saveListing.setValue('Update');
          } else {
            this.message = result.message;
          }
        },
        error => {
          this.message = error;
        },
        () => {
          this.loaderService.hide();
        }
      );
  }

  savePackage() {
    const data = {
      location_id: this.locationId,
      package_id: this.product.packageId,
      description: this.listingFormControl.description.value
    };
    const userId = this.authenticationService.getUserId();
    this.loaderService.show();
    this.productService
      .addProductPackage(userId, data)
      .subscribe(
        result => {
          if (result.success === true) {
            this.message = 'Product added successfully';
            this.product.productListingId = result.data.productlisting_id;
            this.product.images = this.productAdapter.adaptProductImages(result.data.images);
            this.listingFormControl.saveListing.setValue('Update');
          } else {
            this.message = result.message;
            alert(this.message);
          }
        },
        error => {
          this.message = error;
        },
        () => {
          this.loaderService.hide();
        }
      );
  }

  toggleListingStatus(): void {
    this.message = '';
    let data;
    if (this.product.status === 1) {
      this.statusCheck = '';
      this.product.status = 0;
      data = {
        productlisting_id: this.product.productListingId,
        status: 0
      };
    } else {
      this.statusCheck = 'checked';
      this.product.status = 1;
      data = {
        productlisting_id: this.product.productListingId,
        status: 1
      };
    }
    const userId = this.authenticationService.getUserId();
    this.loaderService.show();
    this.productService
      .updateProductListing(userId, data)
      .subscribe(
        result => {
          if (result.success === true) {
            this.product.status = data.status;
          } else {
            console.log('status toggle failed', result.message);
          }
        },
        error => { },
        () => {
          this.loaderService.hide();
        });
  }

  deleteListing(): void {
    this.message = '';
    const data = {
      productlisting_id: this.product.productListingId
    };
    if (confirm('Are you sure, you want to delete this product?')) {
      const userId = this.authenticationService.getUserId();
      this.loaderService.show();
      this.productService
        .deleteProduct(userId, data)
        .subscribe(
          result => {
            if (result.success === true) {
              this.productDeleted.emit(this.product.productListingId);
            } else {
              console.log('delete product', result.message);
            }
          },
          error => { },
          () => {
            this.loaderService.hide();
          });
    }
  }

  setListingFormProperties() {
    this.listingFormControl.subBtn.setValue('Read More & Add');
    this.listingFormControl.saveListing.setValue('Add');
    this.listingFormControl.description.disable();
    this.readOnlyRating = true;
  }

  setProductFormProperties() {
    this.listingFormControl.subBtn.setValue('Edit');
    this.listingFormControl.saveListing.setValue('Update');
    this.listingFormControl.description.enable();
    this.readOnlyRating = false;
  }

  browseProductImage() {
    this.browseImage.emit(this.product.productListingId);
  }

  saveImage(image) {
    this.productImageFile = image.file;
    if (image.type === 'product') {
      this.uploadImage(image.file);
    } else {
      this.replaceProductImage(image.file);
    }
  }

  uploadImage(imageFile) {
    this.loaderService.show();
    const data = new FormData();
    let order = this.product.images.length + 1;
    data.append('productlisting_id', this.product.productListingId);
    data.append('image', imageFile);
    data.append('order', order.toString());
    this.message = '';
    const userId = this.authenticationService.getUserId();
    this.productService
      .addProductImage(userId, data)
      .subscribe(
        result => {
          if (result.success === true) {
            this.message = 'Image added successfully';
            this.pushProductImage(result.data);
          } else {
            this.message = result.message;
          }
        },
        error => {
          this.message = error;
        },
        () => {
          this.loaderService.hide();
        }
      );
  }

  pushProductImage(image) {
    const data = {
      imageId: image.image_id,
      url: image.url,
      order: image.order
    };
    this.product.images.push(data);
  }

  deleteImage(imageId) {
    const data = {
      productimage_id: imageId
    };
    const userId = this.authenticationService.getUserId();
    this.loaderService.show();
    this.productService
      .deleteProductImage(userId, data)
      .subscribe(
        result => {
          if (result.success === true) {
            this.product.images = this.product.images.filter(image => {
              if (image.imageId !== imageId) {
                return image;
              }
            });
          }
        },
        error => { },
        () => {
          this.loaderService.hide();
        });
  }

  browseAnotherImage(imageId) {
    if (this.product.productListingId) {
      this.replaceImage.emit(imageId);
    }
  }

  replaceProductImage(imageFile) {
    this.loaderService.show();
    const data = new FormData();
    data.append('productimage_id', this.productImageId);
    data.append('image', imageFile);
    this.message = '';
    const userId = this.authenticationService.getUserId();
    this.productService
      .replaceProductImage(userId, data)
      .subscribe(
        result => {
          if (result.success === true) {
            this.message = 'Image added successfully';
            this.product.images = this.product.images.map(image => {
              if (image.imageId === this.productImageId) {
                image.url = result.data.image;
                return image;
              } else {
                return image;
              }
            });
          } else {
            this.message = result.message;
          }
        },
        error => {
          this.message = error;
        },
        () => {
          this.loaderService.hide();
        });
  }

  onRate($event, attr) {
    if ($event.newValue === $event.oldValue) {
      return;
    }
    const data = {
      attribute: attr,
      rating: $event.newValue,
      productlisting_id: this.product.productListingId
    };
    const userId = this.authenticationService.getUserId();
    this.productService
      .rateProduct(userId, data)
      .subscribe(result => {
        if (result.success === true) {
          this.message = 'Rated successfully';
        } else {
          console.log('rating error', result.message);
        }
      });
  }

  get listingFormControl() {
    return this.listingForm.controls;
  }

  drop(event: CdkDragDrop<any>) {
    this.product.images[event.previousContainer.data.index]=event.container.data.item;
    this.product.images[event.container.data.index]=event.previousContainer.data.item;
    const userId = this.authenticationService.getUserId();
    this.product.images.forEach((item, index) => {
      item.order = index;
      const data = new FormData();
      data.append('productimage_id', item.imageId);
      data.append('order', item.order);
      
      this.productService
      .saveImageOrder(userId, data)
      .subscribe(result => {
        if (result.success === true) {
          this.message = 'Image Order Updated successfully';
        } else {
          console.log('image order update error', result.message);
        }
      });
    });
  }

  onImageError(event){
    event.target.src = this.defaultImage;
   }
}
