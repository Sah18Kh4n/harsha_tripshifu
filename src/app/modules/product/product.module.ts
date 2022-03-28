import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProductRoutingModule } from './product-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LocationsComponent } from './components/locations/locations.component';
import { LocationComponent } from './components/location/location.component';
import { EditListingComponent } from './components/edit-listing/edit-listing.component';
import { ListingsComponent } from './components/listings/listings.component';
import { OnboardProductComponent } from './components/onboard-product/onboard-product.component';
import { OnboardListingComponent } from './components/onboard-listing/onboard-listing.component';
import { LocationService } from './services/location.service';
import { ProductsComponent } from './components/products/products.component';
import { SuggestModule } from '../../common/shared/suggest/suggest.module';
import { ProductComponent } from './components/product/product.component';
import { ProductAdapter } from './adapters/product.adapter';
import { HotelAdapter } from './adapters/hotel.adapter';
import { ProductService } from './services/product.service';
import { RatingModule } from 'ng-starrating';
import { FilterComponent } from './components/filter/filter.component';
import { MainListingComponent } from './components/main-listing/main-listing.component';
import { MainProductComponent } from './components/main-product/main-product.component';
import { SharedModule } from '../../common/shared/shared.module';
import { CropperModule } from '../../common/modules/image-cropper/cropper.module';
import { ProductThumbnailComponent } from './components/product-thumbnail/product-thumbnail.component';
import { StateService } from './services/state.service';
import { MiniLoaderModule } from '../../common/modules/mini-loader/mini-loader.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    LocationsComponent,
    LocationComponent,
    EditListingComponent,
    ListingsComponent,
    OnboardProductComponent,
    OnboardListingComponent,
    ProductsComponent,
    ProductComponent,
    FilterComponent,
    MainListingComponent,
    MainProductComponent,
    ProductThumbnailComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    ProductRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SuggestModule,
    RatingModule,
    CropperModule,
    MiniLoaderModule,
    DragDropModule,
    InfiniteScrollModule
  ],
  providers: [
    LocationService,
    ProductService,
    ProductAdapter,
    StateService,
    HotelAdapter
  ]
})
export class ProductModule { }
