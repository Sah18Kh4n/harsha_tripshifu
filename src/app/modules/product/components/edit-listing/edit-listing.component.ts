import { Component, OnInit, ViewChild, ElementRef, Input, DoCheck, HostListener, Renderer2 } from '@angular/core';
import { faPlusSquare, IconDefinition, faMapMarkerAlt, faCamera, faPlusCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { LocationService } from '../../services/location.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductAdapter } from '../../adapters/product.adapter';
import { HotelAdapter } from '../../adapters/hotel.adapter';
import { Hotel } from '../../models/hotel.model';
import { ProductService } from '../../services/product.service';
import { CropComponent } from 'projects/dashboard/src/app/common/modules/image-cropper/components/crop/crop.component';
import { Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ProductThumbnailComponent } from '../product-thumbnail/product-thumbnail.component';
import { StateService } from '../../services/state.service';
import { CommonService } from 'projects/dashboard/src/app/common/services/common.service';
import { LoaderService } from 'projects/dashboard/src/app/common/modules/loader/services/loader.service';
import { MiniLoaderService } from 'projects/dashboard/src/app/common/modules/mini-loader/services/mini-loader.service';
import { AuthenticationService } from 'projects/dashboard/src/app/common/modules/authentication/services/authentication.service';
import { FeedbackserviceService } from '../../../feedback/service/feedbackservice.service';
import { Product } from '../../models/product.model';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-edit-listing',
  templateUrl: './edit-listing.component.html',
  styleUrls: ['./edit-listing.component.css'],
  animations: [
    trigger('togglePanel', [
      state('open', style({
        top: '55px',
      })),
      state('close', style({
        top: '100vh',
      }), { params: { viewportHeight: '700px' } }),
      transition('close => open', [
        animate('300ms ease-in-out')
      ]),
      transition('open => close', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})

export class EditListingComponent implements OnInit, DoCheck {

  filters: any;
  pFilters: any;
  location: any;
  locations: any;
  doneLink: string;
  backLink: string;
  stayLink: string;
  editMode: boolean;
  submitted: boolean;
  panelState: string;
  visibility: string;
  viewportHeight: string;
  locationsAdded: string[];
  miniLoaderState: boolean;
  products: Hotel[];
  allProducts: Hotel[];
  descCharCount: number;
  openedProduct: number;
  suggestionConfig: any;
  productImageId: string;
  productListingId: string;
  locationListingId: string;
  tempForm: FormGroup;
  tempLocationImage: any;
  locationImageFile: File;
  optionalTempLocationImage: any;
  optionalLocationImageFile: File;
  tempOptionalForm: FormGroup;
  locationForm: FormGroup;
  locationMessage: string;
  selectedLocation: string;
  descMaxCharCount: number;
  productConfig: CropConfig;
  locationConfig: CropConfig;
  optionalLocationConfig: CropConfig;
  optionalLocationReplaceImage: CropConfig;
  uploadIcon: IconDefinition;
  responseMessageClass: string;
  closeIcon: IconDefinition;
  addNewIcon: IconDefinition;
  addProducts: IconDefinition;
  locationMarker: IconDefinition;
  doneBtnStyle: any;
  displayPackage: boolean;
  subscription: Subscription;
  packageCount: number;
  productCount: number;
  showBorder: boolean;
  hotelCount: number;
  refreshPage: string;
  loaderCount: number;
  suggestionForm: FormGroup;
  formdata: any;
  Errormsg: string;
  successmsg: string;
  loading: boolean;
  feedbackCategory: any;
  locationReference: any;
  controlAllProductScroll: boolean;
  noMoreAllProducts: boolean;
  controlSearchProductScroll: boolean;
  searchKey: string;
  timeRemains: number = 10;
  noMoreSearchProducts: boolean;
  interval: any;
  data: Hotel[];
  emptyProducts: any;
  sFilters: any;
  message: string;
  pushData: any;
  filteredProducts: any;
  locationName: string;
  productType: string;
  locationRef: string;
  hotelKey: string;
  packageKey: string;
  searchHotelKeyCheck: string;
  searchPackageKeyCheck: string;
  locOptImg: any;
  imageCode: number;
  replaceImageIndex: any;
  reOrderedImages: any;

  @Input() onboarding: string;
  @ViewChild('crop', { static: false }) crop: CropComponent;
  @ViewChild('replacement', { static: false }) replacement: ElementRef;
  @ViewChild('productImage', { static: false }) productImage: ElementRef;
  @ViewChild('locationImage', { static: false }) locationImage: ElementRef;
  @ViewChild('optionalLocationImage', { static: false }) optionalLocationImage: ElementRef;
  @ViewChild('replacementLocationImage', { static: false }) replacementLocationImage: ElementRef;
  @ViewChild('productThumbnail', { static: false }) productThumbnail: ProductThumbnailComponent;
  msgstyle: { display: string; };

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private stateService: StateService,
    private commonService: CommonService,
    private loaderService: LoaderService,
    private productAdapter: ProductAdapter,
    private hotelAdapter: HotelAdapter,
    private productService: ProductService,
    private locationService: LocationService,
    private mloaderService: MiniLoaderService,
    private authenticationService: AuthenticationService,
    private feedbackService: FeedbackserviceService
  ) {
    this.stateService.getProductState().subscribe(products => {
      this.allProducts = products;
    });
    this.mloaderService.getLoaderState().subscribe(loaderState => {
      this.miniLoaderState = loaderState;
    }
    );
  }

  ngOnInit() {
    this.loaderCount = 0;
    this.products = [];
    this.displayPackage = false;
    this.editMode = false;
    this.descMaxCharCount = this.descCharCount = 1000;
    this.locationForm = new FormGroup({
      locationId: new FormControl(null),
      locationImage: new FormControl(null),
      optionalLocationImage: new FormControl(null),
      description: new FormControl(null, [
        Validators.required,
        Validators.maxLength(this.descMaxCharCount)
      ]),
      location_name: new FormControl(null),
      saveLocation: new FormControl('Submit')
    });

    this.tempOptionalForm = new FormGroup({
      optLocImgCtrl: new FormControl(null),
      repLocImgCtrl: new FormControl(null)
    });

    this.tempForm = new FormGroup({
      prodImgCtrl: new FormControl(null),
      repImgCtrl: new FormControl(null)
    });

    this.filters = {
      locationId: null,
      type: 'stays',
      tagIds: [],
      tags: [],
      city: null,
      state: null,
      country: null,
      offset: 0,
      limit: 5
    };
    this.pFilters = {
      locationId: null,
      type: 'packages',
      tagIds: [],
      tags: [],
      city: null,
      state: null,
      country: null,
      offset: 0,
      limit: 5
    };

    this.sFilters = {
      locationId: null,
      type: 'stays',
      city: null,
      state: null,
      country: null,
      offset: 0,
      limit: 5
    };

    this.locationMarker = faMapMarkerAlt;
    this.addProducts = faPlusCircle;
    this.uploadIcon = faCamera;
    this.closeIcon = faTimes;
    this.addNewIcon = faPlusSquare;
    this.submitted = false;
    this.route.params.subscribe(param => {
      this.initState(param);
      this.productType = param.type
    });
    this.route.queryParams.subscribe(param => {
      this.refreshPage = param.refresh;
    });
    this.locationConfig = {
      width: 285,
      aspectRatio: 19 / 26,
      round: false,
      type: 'location'
    };
    this.optionalLocationConfig = {
      width: 750,
      aspectRatio: 3 / 2,
      round: false,
      type: 'optionalLocation'
    };
    this.optionalLocationReplaceImage = {
      width: 750,
      aspectRatio: 3 / 2,
      round: false,
      type: 'optionalLocationReplaceImage'
    };
    this.productConfig = {
      width: 750,
      aspectRatio: 3 / 2,
      round: false,
      type: 'product'
    };
    this.panelState = 'close';
    this.visibility = 'visible';
    this.viewportHeight = window.innerHeight + 'px';
    this.responseMessageClass = '';

    this.feedbackCategory = 3;
    this.suggestionForm = new FormGroup({
      destination: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(200)
        ]
      }),
      message: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(700)
        ]
      }),
    });
    this.controlAllProductScroll = false;
    this.controlSearchProductScroll = true;
    this.searchHotelKeyCheck = '';
    this.searchPackageKeyCheck = '';
  }

  ngDoCheck() {
    if (this.onboarding === 'true') {
      this.doneLink = '/profile';
      this.backLink = '/product/listings/onboard';
      this.stayLink = '/product/edit/onboard/';
    } else {
      this.doneLink = '/product/listings';
      this.backLink = '/product/listings';
      this.stayLink = '/product/edit/';
    }
    this.refreshDoneBtn();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.viewportHeight = event.target.innerHeight + 'px';
  }

  initState(routeParam) {
    this.showBorder = false;
    if (routeParam.locationId !== undefined) {
      this.editMode = true;
      this.locationListingId = routeParam.locationId;
      this.filters.locationId = routeParam.locationId;
      this.pFilters.locationId = routeParam.locationId;
      this.sFilters.locationId = routeParam.locationId;
      this.loadLocationData(routeParam.locationId, (locationRef) => {
        this.resetTagFilters().resetOffset();
        this.locationRef = locationRef;
        if (routeParam.type && routeParam.type === 'stays') {
          this.displayPackage = false;
          this.setLocationFilters(locationRef).setHotels(true);
        } else if (routeParam.type && routeParam.type === 'experiences') {
          this.displayPackage = true;
          this.setLocationFilters(locationRef).setPackages(true);
        } else {
          this.displayPackage = true;
          this.setLocationFilters(locationRef).setPackages(true);
        }
        this.locationFormControl.saveLocation.enable();
        this.locationFormControl.saveLocation.reset('Update');
        setTimeout(()=>{
          this.panelState = 'open';
          this.visibility = 'hidden';
        }, 3000);
      });
    } else {
      this.locationListingId = null;
      this.loaderService.hide();
      this.mloaderService.hide();
      this.editMode = false;
      this.suggestionConfig = {
        placeholder: 'Enter location',
        initOnClick: true
      };
      this.getLocationsAlreadyAdded();
      this.allProducts = [];
    }
    this.locOptImg = [];
    this.replaceImageIndex = null;
    this.reOrderedImages = [];
  }

  loadLocationData(locationId, callback) {
    this.loaderService.show();
    this.locationService
      .getLocationData(locationId)
      .subscribe(
        result => {
          if (result.success === true) {
            this.loadSavedData(result.data);
            if (result.data.fki_city_id) {
              this.locationReference = {
                type: 'city',
                value: result.data.location
              };
            } else if (result.data.fki_state_id) {
              this.locationReference = {
                type: 'state',
                value: result.data.location
              };
            } else if (result.data.fki_country_id) {
              this.locationReference = {
                type: 'country',
                value: result.data.location
              };
            }
            this.locationName = this.locationReference.value;
            this.setProducts(locationId, () => {
              callback(this.locationReference);
            });
          }
        },
        error => {
          this.loaderService.hide();
        },
        () => {
        });
  }

  loadSavedData(data) {
    this.locationFormControl.description.reset('');
    this.descCharCount = this.descMaxCharCount;
    if (data.description) {
      this.locationFormControl.description.reset(data.description);
      this.descCharCount = this.descMaxCharCount - data.description.length;
    }
    this.selectedLocation = data.location;
    this.suggestionConfig = {
      location: data.location,
      disabled: true,
      placeholder: 'Enter location'
    };
    if (data.image) {
      this.tempLocationImage = data.image;
    }
    if(data.optional_images) {
      data.optional_images.forEach((img, index) => {
        let imgObj = {};
        imgObj = {
          img: img,
          order: index
        }
        this.locOptImg.push(imgObj);
      });
    }
  }

  setProducts(locationId, callback) {
    this.productService
      .getProductsByLocation(locationId)
      .subscribe(
        result => {
          if (result.success === true) {
            this.products = result.data.map(product => {
              return this.productAdapter.adaptProductListings(product);
            });
            this.stateService.setProducts(this.products);
          } else {
            // ignore
          }
          callback();
        },
        error => {
          this.loaderService.hide();
        },
        () => { }
      );
  }

  setHotels(refresh = true) {
    this.loaderService.show();
    this.controlAllProductScroll = false;
    this.controlSearchProductScroll = true;
    this.filters.offset = 0;
    const userId = this.authenticationService.getUserId();
    this.productService
      .getHotelsByLocation(userId, this.filters)
      .subscribe(
        result => {
          if (result.success === true && result.data != null) {
            if (refresh && result.data.products.length === 0 && this.refreshPage !== 'false') {
              if (this.onboarding === 'true') {
                this.router.navigateByUrl('product/edit/onboard/' + this.filters.locationId + '/experiences');
              } else {
                this.router.navigateByUrl('product/edit/' + this.filters.locationId + '/experiences');
              }
            }
            const hotels = result.data.products.map(hotel => {
              if(hotel._id && hotel._id != null){
                return this.productAdapter.adaptProductListings(hotel);
              } else if(hotel.listing_id != null){
                return this.productAdapter.adaptListings(hotel);
              } else if(!hotel.isDynamic){
                return this.hotelAdapter.adaptHotels(hotel);
              } else if(hotel.isDynamic) {
                return this.hotelAdapter.adaptDynamicHotels(hotel);
              }
            });
            this.stateService.addToProducts(hotels);
            if (refresh && this.allProducts.length > 0) {
              if(result.data.filters){
                this.filters.tags = this.hotelAdapter.adaptFilters(result.data.filters);
              }
            }
            this.showBorder = false;
            if (this.displayPackage === false && this.filters.tags.length > 0) {
              this.showBorder = true;
            }
            this.refreshDoneBtn();
          } else {
            this.mloaderService.hide();
          }
        },
        error => {
          this.mloaderService.hide();
        },
        () => {
          this.loaderService.hide();
        }
      );
  }

  loadMoreListings() {
    const userId = this.authenticationService.getUserId();
    this.productService
      .getListingsByLocation(userId, this.filters)
      .subscribe(
        result => {
          if (result.success === true) {
            if (result.data.products.length > 0) {
              const listings = result.data.products.map(listing => {
                return this.productAdapter.adaptListings(listing);
              });
              this.stateService.addToProducts(listings);
              this.filters.offset = this.filters.offset + result.data.products.length;
              this.loadMoreListings();
            } else {
              this.mloaderService.hide();
            }
          } else {
            this.mloaderService.hide();
          }
        },
        error => {
          this.mloaderService.hide();
        },
        () => {
          this.mloaderService.hide();
        }
      );
  }

  loadMoreHotels(refresh=false) {
    const userId = this.authenticationService.getUserId();
    this.productService
      .getHotelsByLocation(userId, this.filters)
      .subscribe(
        result => {
          if (result.success === true && result.data != null) {
            if (refresh && result.data.products.length === 0 && this.refreshPage !== 'false') {
              if (this.onboarding === 'true') {
                this.router.navigateByUrl('product/edit/onboard/' + this.filters.locationId + '/experiences');
              } else {
                this.router.navigateByUrl('product/edit/' + this.filters.locationId + '/experiences');
              }
            }
            const hotels = result.data.products.map(hotel => {
              if(hotel.listing_id != null){
                return this.productAdapter.adaptListings(hotel);
              } else if(!hotel.isDynamic){
                return this.hotelAdapter.adaptHotels(hotel);
              } else if(hotel.isDynamic) {
                return this.hotelAdapter.adaptDynamicHotels(hotel);
              }
            });
            this.stateService.addToProducts(hotels);
            if (refresh && this.allProducts.length > 0) {
              if(result.data.filters){
                this.filters.tags = this.hotelAdapter.adaptFilters(result.data.filters);
              }
            }
            this.showBorder = false;
            if (this.displayPackage === false && this.filters.tags.length > 0) {
              this.showBorder = true;
            }
            this.refreshDoneBtn();
          } else {
            this.mloaderService.hide();
          }
        },
        error => {
          this.mloaderService.hide();
        },
        () => {
          this.mloaderService.hide();
        }
      );
  }

  loadPackages() {
    this.searchHotelKeyCheck = '';
    this.searchPackageKeyCheck = '';
    this.router.navigateByUrl(this.stayLink + this.filters.locationId + '/experiences?refresh=false');
  }

  setPackages(refresh = true) {
    this.loaderService.show();
    this.controlAllProductScroll = true;
    this.controlSearchProductScroll = true;
    this.pFilters.offset = 0;
    const userId = this.authenticationService.getUserId();
    this.productService.getPackagesByLocation(userId, this.pFilters)
      .subscribe(
        result => {
          if (result.success === true) {
            const productItems = result.data.packages.map(packageItem => {
              return this.productAdapter.adaptListings(packageItem);
            });
            this.stateService.addToProducts(productItems);
            if (refresh && productItems.length > 0) {
              this.pFilters.tags = this.productAdapter.adaptFilters(result.data.filters);
            }
            this.showBorder = false;
            if (this.displayPackage === true && this.pFilters.tags.length > 0) {
              this.showBorder = true;
            }
            if (result.data.packages.length > 0 && result.data.packages.length <= this.pFilters.limit) {
              this.pFilters.offset = this.pFilters.offset + result.data.packages.length;
              this.mloaderService.show();
              this.loadMorePackages();
            } else {
              this.mloaderService.hide();
            }
            this.refreshDoneBtn();
          } else {
            this.mloaderService.hide();
          }
        },
        error => { },
        () => {
          this.loaderService.hide();
        }
      );
  }

  loadMorePackages() {
    const userId = this.authenticationService.getUserId();
    this.productService
      .getPackagesByLocation(userId, this.pFilters)
      .subscribe(
        result => {
          if (result.success === true) {
            const packages = result.data.packages.map(listing => {
              return this.productAdapter.adaptListings(listing);
            });
            if (result.data.packages.length > 0) {
              this.pFilters.offset = this.pFilters.offset + result.data.packages.length;
              this.stateService.addToProducts(packages);
              this.loadMorePackages();
            } else {
              this.mloaderService.hide();
            }
          } else {
            this.mloaderService.hide();
          }
        },
        error => {
          this.mloaderService.hide();
        },
        () => {
          this.mloaderService.hide();
        }
      );
  }

  loadStays() {
    this.searchHotelKeyCheck = '';
    this.searchPackageKeyCheck = '';
    this.router.navigateByUrl(this.stayLink + this.filters.locationId + '/stays?refresh=false');
  }

  resetTagFilters() {
    this.filters.tagIds = [];
    this.filters.tags = this.filters.tags.map(tag => {
      tag.isChecked = false;
      return tag;
    });
    return this;
  }

  resetOffset() {
    this.filters.offset = 0;
    this.pFilters.offset = 0;
  }

  refreshDoneBtn() {
    this.productCount = 0;
    this.packageCount = 0;
    this.hotelCount = 0;
    if (this.allProducts) {
      this.allProducts.filter(product => {
        if (product.productListingId !== null) {
          this.productCount++;
        }
        if (product.packageId !== null) {
          this.packageCount++;
        }
        if (product.hotelId !== null || product.listingId !== null) {
          this.hotelCount++;
        }
      });
    }
    // if (this.editMode === true) {
    //   this.doneBtnStyle = {
    //     display: 'block'
    //   };
    // } else {
    //   this.doneBtnStyle = {
    //     display: 'none'
    //   };
    // }
  }

  getLocationsAlreadyAdded() {
    const userId = this.authenticationService.getUserId();
    this.locationService.getLocations(userId).subscribe(
      res => {
        this.locationsAdded = res.data.map(location => {
          return location.location;
        });
      },
      error => { },
      () => { }
    );
  }

  search($event) {
    let keyword = $event.keyword;
    if (keyword === null || keyword === '') {
      keyword = null;
    }
    if(keyword != null && keyword.length > 2){
      this.locationService
      .search(keyword)
      .subscribe(
        result => {
          if (result.success === true) {
            this.locations = [];
            const locationResult = result.data.locations;
            locationResult.filter(location => {
              let data;
              if (location.city_id) {
                data = {
                  key: location.city_id,
                  value: location.location,
                  type: 'city'
                };
              } else if (location.state_id) {
                data = {
                  key: location.state_id,
                  value: location.location,
                  type: 'state'
                };
              } else if (location.country_id) {
                data = {
                  key: location.country_id,
                  value: location.location,
                  type: 'country'
                };
              }
              this.locationsAdded.forEach(item => {
                if (
                  location.city == (item) ||
                  location.state == (item) ||
                  location.country == (item)
                ) {
                  data.disabled = true;
                  data.disableText = 'Already added';
                }
              });
              this.locations.push(data);
            });
          }
        },
        error => { },
        () => {
        });
    } else if(keyword == null || keyword.length < 3) {
      this.locations = [];
    }
  }

  locationSelected($event) {
    this.selectedLocation = $event.selected.value;
    this.location = $event.selected;
    this.locationForm.get('locationId').reset($event.selected.key);
    this.setDefaultLocationProps({ type: $event.selected.type, keyword: $event.selected.key });
  }

  setDefaultLocationProps(param) {
    this.loaderService.show();
    this.productService
      .getLocationDetails(param)
      .subscribe(
        res => {
          if (res.success === true) {
            this.tempLocationImage = res.data.image;
            this.locationFormControl.description.setValue(res.data.description);
            this.locationFormControl.location_name.setValue(res.data.location_name);
          } else {
            console.log(res.message);
          }
          this.loaderService.hide();
        },
        error => { },
        () => {
          this.loaderService.hide();
        }
      );
  }

  setLocationFilters(locationRef) {
    if (locationRef.type === 'city') {
      this.filters.city = locationRef.value;
      this.pFilters.city = locationRef.value;
    } else if (locationRef.type === 'state') {
      this.filters.state = locationRef.value;
      this.pFilters.state = locationRef.value;
    } else if (locationRef.type === 'country') {
      this.filters.country = locationRef.value;
      this.pFilters.country = locationRef.value;
    }
    return this;
  }

  browseLocationImage() {
    this.locationFormControl.locationImage.reset('');
    this.locationImage.nativeElement.click();
  }

  addLocationImage($event) {
    this.crop.addImage($event, this.locationConfig);
  }

  browseOptionalLocationImage() {
    this.tempOptionalForm.get('optLocImgCtrl').reset('');
    this.optionalLocationImage.nativeElement.click();
  }

  addOptionalLocationImage($event) {
    this.crop.addImage($event, this.optionalLocationConfig);
  }

  browseAnotherOptLocImage(imageIndex){
    this.replaceImageIndex = imageIndex;
    this.tempOptionalForm.get('repLocImgCtrl').reset('');
    this.replacementLocationImage.nativeElement.click();
  }

  browseReplacementOptionalLocationImage($event){
    this.crop.addImage($event, this.optionalLocationReplaceImage);
  }

  drop(event: CdkDragDrop<any>) {
    this.locOptImg[event.previousContainer.data.index]=event.container.data.item;
    this.locOptImg[event.container.data.index]=event.previousContainer.data.item;
    const userId = this.authenticationService.getUserId();
    this.locOptImg.forEach((item, index) => {
      item.order = index;
      this.reOrderedImages.push(item);
    });
    let data = {
      'location_id': this.filters.locationId,
      'reOrderedImages': this.reOrderedImages,
      'actionType': 'reOrderImages'
    }
    this.reOrderedImages = [];
    this.updateLocationAPI(userId, data);
  }

  submitLocationForm() {
    this.locationMessage = '';
    this.submitted = true;
    this.locationFormControl.saveLocation.disable();
    if (this.location && this.locationForm.valid && this.editMode === false) {
      this.responseMessageClass = '';
      this.locationMessage = 'Saving...';
      this.saveLocation();
    } else if (this.editMode === true && this.locationForm.valid) {
      this.responseMessageClass = '';
      this.locationMessage = 'Saving...';
      this.updateLocation();
      setTimeout(()=>{
        this.panelState = 'open';
        this.visibility = 'hidden';
      }, 2000);
    } else {
      this.locationFormControl.description.markAsDirty();
    }
    this.locationFormControl.saveLocation.enable();
  }

  updateLocation() {
    const data = new FormData();
    data.append('location_id', this.filters.locationId);
    data.append('description', this.locationFormControl.description.value);
    if (this.locationImageFile) {
      data.append('image', this.locationImageFile);
    }
    const userId = this.authenticationService.getUserId();
    this.updateLocationAPI(userId, data);
  }

  deleteLocationImage(imageIndex){
    const data = new FormData();
    data.append('location_id', this.filters.locationId);
    data.append('actionType', 'removeOptImg');
    data.append('imageIndex', imageIndex);
    const userId = this.authenticationService.getUserId();
    this.updateLocationAPI(userId, data);
  }

  updateLocationAPI(userId, data) {
    this.loaderService.show();
    this.locationService.updateLocation(userId, data).subscribe(
      result => {
        this.loaderService.hide();
        if (result.success === true) {
          if(result.data.optional_images) {
            this.locOptImg = result.data.optional_images;
          }
          this.responseMessageClass = 'submitmsgcolor';
          this.locationMessage = 'Successfully updated';
        } else {
          this.responseMessageClass = 'errormsgcolor';
          this.locationMessage = result.message;
        }
      },
      error => {
        this.responseMessageClass = 'errormsgcolor';
        this.locationMessage = 'Network error occured';
      },
      () => {
        this.loaderService.hide();
      });
  }

  saveLocation() {
    const data = new FormData();
    if (this.location.type === 'city') {
      data.append('city_id', this.location.key);
    } else if (this.location.type === 'state') {
      data.append('state_id', this.location.key);
    } else {
      data.append('country_id', this.location.key);
    }
    data.append('location', this.locationFormControl.location_name.value);
    data.append('description', this.locationFormControl.description.value);
    if (this.locationImageFile) {
      data.append('image', this.locationImageFile);
    }
    if (this.optionalLocationImageFile) {
      data.append('actionType', 'uploadOptImg');
      data.append('optionalImage', this.optionalLocationImageFile);
    }
    const userId = this.authenticationService.getUserId();
    this.saveLocationAPI(userId, data);
  }

  saveLocationAPI(userId, data) {
    this.loaderService.show();
    this.locationService.saveLocation(userId, data)
      .subscribe(
        result => {
          this.loaderService.hide();
          if (result.success === true) {
            this.responseMessageClass = 'submitmsgcolor';
            this.locationMessage = 'Successfully saved';
            if (this.onboarding === 'true') {
              this.router.navigate(['product/edit/onboard/' + result.data.location_id + '/stays']);
            } else {
              this.router.navigate(['product/edit/' + result.data.location_id + '/stays']);
            }
          } else {
            this.responseMessageClass = 'errormsgcolor';
            this.locationMessage = result.message;
          }
        },
        error => {
          this.responseMessageClass = 'errormsgcolor';
          this.locationMessage = 'Network error occured';
        },
        () => {
          this.loaderService.hide();
        });
  }

  saveImage(image) {
    if (image.type === 'location') {
      this.locationImageFile = image.file;
      this.tempLocationImage = image.dataURI;
      this.uploadLocationImage();
    } else if (image.type === 'optionalLocation') {
      this.optionalLocationImageFile = image.file;
      this.optionalTempLocationImage = image.dataURI;
      this.uploadLocationImage();
    } else if (image.type === 'optionalLocationReplaceImage') {
      this.optionalLocationImageFile = image.file;
      this.optionalTempLocationImage = image.dataURI;
      this.uploadLocationImage();
    } else if (image.type === 'product') {
      this.uploadImage(image.file);
    } else if (image.type === 'replace') {
      this.replaceProductImage(image.file);
    } 
  }

  uploadLocationImage() {
    if (this.location && this.locationForm.valid && this.editMode === false) {
      this.responseMessageClass = '';
      this.locationMessage = 'Saving...';
      const data = new FormData();
      if (this.location.type === 'city') {
        data.append('city_id', this.location.key);
      } else if (this.location.type === 'state') {
        data.append('state_id', this.location.key);
      } else {
        data.append('country_id', this.location.key);
      }
      data.append('location', this.locationFormControl.location_name.value);
      data.append('description', this.locationFormControl.description.value);
      if (this.locationImageFile) {
        data.append('image', this.locationImageFile);
      }
      if (this.optionalLocationImageFile && this.replaceImageIndex == null) {
        data.append('actionType', 'uploadOptImg');
        data.append('optionalImage', this.optionalLocationImageFile);
        this.optionalLocationImageFile = null;
      } else if (this.optionalLocationImageFile && this.replaceImageIndex != null) {
        data.append('imageIndex', this.replaceImageIndex);
        data.append('actionType', 'replaceOptImg');
        data.append('optionalImage', this.optionalLocationImageFile);
      }
      const userId = this.authenticationService.getUserId();
      this.saveLocationAPI(userId, data);
    } else if (this.editMode === true) {
      this.responseMessageClass = '';
      this.locationMessage = 'Saving...';
      const data = new FormData();
      data.append('location_id', this.filters.locationId);
      if (this.locationImageFile) {
        data.append('image', this.locationImageFile);
      }
      if (this.optionalLocationImageFile && this.replaceImageIndex == null) {
        data.append('actionType', 'uploadOptImg');
        data.append('optionalImage', this.optionalLocationImageFile);
        this.optionalLocationImageFile = null;
      } else if (this.optionalLocationImageFile && this.replaceImageIndex != null) {
        data.append('imageIndex', this.replaceImageIndex);
        data.append('actionType', 'replaceOptImg');
        data.append('optionalImage', this.optionalLocationImageFile);
      }
      const userId = this.authenticationService.getUserId();
      this.updateLocationAPI(userId, data);
    }
    this.replaceImageIndex = null;
  }

  filterListings(filters) {
    this.filters.offset = 0;
    this.filters.tagIds = new Array();
    let tagSelected = filters.tags.filter(tag => {
      if (tag.isChecked === true) {
        return tag.tag;
      }
    });
    if (tagSelected.length > 0) {
      tagSelected = tagSelected[0].tag;
    } else {
      tagSelected = null;
    }
    const addedProducts = this.allProducts.filter(product => {
      if (product.productListingId !== null && product.tags) {
        const tagExists = product.tags.filter(tag => {
          if (tagSelected && tag.tag === tagSelected) {
            return tag;
          }
        });
        if (tagExists.length > 0) {
          return product;
        }
      }
    });
    this.stateService.setProducts(addedProducts);
    filters.tags.filter(tag => {
      if (tag.isChecked === true) {
        this.filters.tagIds.push(tag.tagId);
      }
    });
    this.setHotels(false);
  }

  pFilterListings(filters) {
    this.pFilters.offset = 0;
    this.pFilters.tagIds = new Array();
    const addedProducts = this.allProducts.filter(product => {
      if (product.productListingId !== null) {
        return product;
      }
    });
    this.stateService.setProducts(addedProducts);
    filters.tags.filter(tag => {
      if (tag.isChecked === true) {
        this.pFilters.tagIds.push(tag.tagId);
      }
    });
    this.setPackages(false);
  }

  updateDescCharCount() {
    this.descCharCount = this.descMaxCharCount - this.locationFormControl.description.value.length;
  }

  get locationFormControl() {
    return this.locationForm.controls;
  }

  addingProduct(hotelId) {
    this.openedProduct = hotelId;
  }

  onBrowseImage(productListingId) {
    this.productListingId = productListingId;
    this.tempForm.get('prodImgCtrl').reset('');
    this.productImage.nativeElement.click();
  }

  onBrowseAnotherImage(imageId) {
    this.productImageId = imageId;
    this.tempForm.get('repImgCtrl').reset('');
    this.replacement.nativeElement.click();
  }

  addProductImage($event) {
    const cropConfig = this.productConfig;
    cropConfig.type = 'product';
    this.crop.addImage($event, cropConfig);
  }

  updateImage($event) {
    const cropConfig = this.productConfig;
    cropConfig.type = 'replace';
    this.crop.addImage($event, cropConfig);
  }

  uploadImage(imageFile) {
    this.loaderService.show();
    const data = new FormData();
    data.append('productlisting_id', this.productListingId);
    data.append('image', imageFile);
    const userId = this.authenticationService.getUserId();
    this.productService
      .addProductImage(userId, data)
      .subscribe(
        result => {
          this.loaderService.hide();
          if (result.success === true) {
            // this.message = 'Image added successfully';
            const imageData = {
              imageId: result.data.image_id,
              url: result.data.url
            };
            this.allProducts = this.allProducts.map(product => {
              if (product.productListingId === this.productListingId) {
                product.images.push(imageData);
              }
              return product;
            });
            this.stateService.setProducts(this.allProducts);
          } else {
            // this.message = result.message;
          }
        },
        error => {
          // this.message = error;
        },
        () => {
          this.loaderService.hide();
        });
  }

  replaceProductImage(imageFile) {
    const data = new FormData();
    data.append('productimage_id', this.productImageId);
    data.append('image', imageFile);
    const userId = this.authenticationService.getUserId();
    this.loaderService.show();
    this.productService
      .replaceProductImage(userId, data)
      .subscribe(
        result => {
          if (result.success === true) {
            this.allProducts = this.allProducts.map(product => {
              product.images = product.images.map(image => {
                if (image.imageId === this.productImageId) {
                  image.url = result.data.image;
                }
                return image;
              });
              return product;
            });
            this.stateService.setProducts(this.allProducts);
          } else {
            // this.message = result.message;
          }
          this.loaderService.hide();
        },
        error => {
          // this.message = error;
        },
        () => {
          this.loaderService.hide();
        });
  }

  slideUpPanel() {
    this.visibility = 'hidden';
    this.panelState = 'open';
    this.renderer.addClass(document.body, 'scroll-none');
  }

  slideDownPanel() {
    this.visibility = 'visible';
    this.panelState = 'close';
    this.renderer.removeClass(document.body, 'scroll-none');
  }

  done() {
    if (this.onboarding === 'true') {
      const userId = this.authenticationService.getUserId();
      const data = {
        progress: 'dashboard'
      };
      this.loaderService.show();
      this.commonService.saveProgress(userId, data).subscribe(
        result => {
          if (result.success === true) {
            localStorage.setItem('isOnboarded', 'true');
            this.router.navigateByUrl(this.doneLink);
          }
        },
        error => { },
        () => {
          this.loaderService.hide();
        }
      );
    } else {
      localStorage.setItem('isOnboarded', 'true');
      this.router.navigateByUrl(this.doneLink);
    }
  }

  productsHeight() {
    return {
      height: 'calc(' + this.viewportHeight + ' - 55px)'
    };
  }

  showLoader() {
    this.loaderService.show();
    this.loaderCount = this.loaderCount + 1;
  }

  hideLoader() {
    this.loaderCount--;
    if (this.loaderCount <= 0) {
      this.loaderService.hide();
    }
  }

  get f() {
    return this.suggestionForm.controls;
  }

  onSubmitSuggestion(): void {
    this.clearMessage();
    this.submitted = true;
    this.f.destination.markAsTouched();
    this.f.message.markAsTouched();
    if (this.suggestionForm.status === 'INVALID') {
      this.loading = false;
      return;
    }
    this.loading = true;
    this.loaderService.show();
    const suggestiondata = new FormData();
    suggestiondata.append('category', this.feedbackCategory);
    suggestiondata.append('destination', this.suggestionForm.value.destination);
    suggestiondata.append('message', this.suggestionForm.value.message);
    const userId = this.authenticationService.getUserId();
    this.feedbackService.submitfeedback(userId, suggestiondata).subscribe(
      res => {
        this.loaderService.hide();
        if (res.success === true) {
          this.suggestionForm.reset();
          this.Errormsg = '';
          this.successmsg = 'Successfully done';
          this.loading = false;
        } else {
          this.successmsg = '';
          this.Errormsg = res.message;
          this.loading = false;
        }
      },
      error => { },
      () => {
        this.loading = false;
        this.loaderService.hide();
      }
    );
  }

  clearMessage() {
    this.Errormsg = '';
    this.successmsg = '';
  }

  keyEmitCatch(event, type){
    this.startInterval(event);
    if(type == 1){
      this.searchHotelKeyCheck = event;
    } else if(type == 2){
      this.searchPackageKeyCheck = event;
    }
  }

  onScrollingProducts(){
    if(this.controlAllProductScroll == false && this.controlSearchProductScroll == true){
      this.mloaderService.show();
      if (this.allProducts.length > 0) {
        this.filters.offset = this.filters.offset + this.filters.limit;
        this.loadMoreHotels();
      }
    } else if (this.controlAllProductScroll == true && this.controlSearchProductScroll == false){
        this.mloaderService.show();
        this.sFilters.offset = this.sFilters.offset + this.sFilters.limit;
        this.loadMoreSearchHotels();
    }
  }

  startInterval(key){
    this.searchKey = key.replace(/[^a-zA-Z0-9 ]/g, '');
    this.searchKey = this.searchKey.trim();
    this.resetInterval();
    this.timeRemains = 10;
    this.noMoreSearchProducts = false;
    this.interval = setInterval(() => {
      if(this.timeRemains >= 1) {
        if(this.searchKey.length > 2) {
          this.timeRemains--;
        } else if(this.searchKey.length <= 2) {
          this.sFilters.offset = 0;
          this.pFilters.offset = 0;
          this.timeRemains = 10;
          this.resetInterval();
          this.controlAllProductScroll = false;
          this.controlSearchProductScroll = true;
        }
      } else {
        this.timeRemains = 10;
        this.noMoreAllProducts = false;
        this.resetInterval();
        if (this.productType && this.productType === 'stays') {
          this.displayPackage = false;
          this.searchHotel();
        } else if (this.productType && this.productType === 'experiences') {
          this.displayPackage = true;
          this.searchPackage();
        } else {
          this.displayPackage = true;
          this.searchPackage();
        }
        this.controlAllProductScroll = true;
        this.controlSearchProductScroll = false;
      }
      if(this.productType && this.productType === 'stays' && this.searchKey.length == 0){
        this.setHotels(true);
      }
      if(this.productType && this.productType === 'experiences' && this.searchKey.length == 0){
        this.searchPackage();
      }
    },100);
  }

  resetInterval() {
    clearInterval(this.interval);
  }

  searchHotel(){
    this.setProducts(this.filters.locationId, () => {});
    this.mloaderService.show();
    setTimeout(()=>{
      if(this.locationReference.type == "city"){
        this.sFilters.city = this.locationReference.value;
      } else if (this.locationReference.type == "state"){
        this.sFilters.state = this.locationReference.value;
      } else {
        this.sFilters.country = this.locationReference.value;
      }
      const userId = this.authenticationService.getUserId();
      this.sFilters.offset = 0;
      this.productService
      .searchHotel(userId, this.searchKey, this.sFilters)
      .subscribe(
        result => {
          if (result.success === true) {
            this.message = 'Product searched successfully';
            this.pushData = result;
            const hotels = this.pushData.data.map(hotel => {
              if(hotel._id && hotel._id != null){
                return this.productAdapter.adaptProductListings(hotel);
              } else if(hotel.listing_id != null){
                return this.productAdapter.adaptListings(hotel);
              } else if(!hotel.isDynamic){
                return this.hotelAdapter.adaptHotels(hotel);
              } else if(hotel.isDynamic) {
                return this.hotelAdapter.adaptDynamicHotels(hotel);
              }
            });
            this.stateService.addToProducts(hotels);
          } else {
            this.message = result.message;
          }
        },
        error => {
          this.message = error;
        },
        () => {
          this.mloaderService.hide();
        }
      );
    }, 1000);
  }

  loadMoreSearchHotels() {
    if(this.locationReference.type == "city"){
      this.sFilters.city = this.locationReference.value;
    } else if (this.locationReference.type == "state"){
      this.sFilters.state = this.locationReference.value;
    } else {
      this.sFilters.country = this.locationReference.value;
    }
    const userId = this.authenticationService.getUserId();
    this.productService
    .searchHotel(userId, this.searchKey, this.sFilters)
    .subscribe(
      result => {
        if (result.success === true  && result.data.length > 0) {
          this.message = 'Product searched successfully';
          this.pushData = result;
          const hotels = this.pushData.data.map(hotel => {
            if(hotel.listing_id != null){
              return this.productAdapter.adaptListings(hotel);
            } else if(!hotel.isDynamic){
              return this.hotelAdapter.adaptHotels(hotel);
            } else if(hotel.isDynamic) {
              return this.hotelAdapter.adaptDynamicHotels(hotel);
            }
          });
          this.stateService.addToProducts(hotels);
        } else {
          this.message = result.message;
        }
      },
      error => {
        this.message = error;
      },
      () => {
        this.mloaderService.hide();
      }
    );
  }

  searchPackage(){
    this.setProducts(this.filters.locationId, () => {});
    this.mloaderService.show();
    this.controlAllProductScroll = true;
    this.controlSearchProductScroll = true;
    setTimeout(()=>{
      if(this.locationReference.type == "city"){
        this.pFilters.city = this.locationReference.value;
      } else if (this.locationReference.type == "state"){
        this.pFilters.state = this.locationReference.value;
      } else {
        this.pFilters.country = this.locationReference.value;
      }
      const userId = this.authenticationService.getUserId();
      this.pFilters.offset = 0;
      this.productService
      .searchPackage(userId, this.searchKey, this.pFilters)
      .subscribe(
        result => {
          if (result.success === true) {
            this.message = 'Product searched successfully';
            this.pushData = result;
            const productItems = this.pushData.data.packages.map((packageItem: any) => {
              return this.productAdapter.adaptListings(packageItem);
            });
            this.stateService.addToProducts(productItems);
          } else {
            this.message = result.message;
          }
        },
        error => {
          this.message = error;
        },
        () => {
          this.mloaderService.hide();
        }
      );
    }, 1000);
  }

  emitHotelKeys(event){
    this.hotelKey = event.target.value;
    this.keyEmitCatch(this.hotelKey, 1);
  }

  emitPackageKeys(event){
    this.packageKey = event.target.value;
    this.keyEmitCatch(this.packageKey, 2);
  }
}
