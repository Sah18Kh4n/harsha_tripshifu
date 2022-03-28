import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OnboardListingComponent } from './components/onboard-listing/onboard-listing.component';
import { OnboardProductComponent } from './components/onboard-product/onboard-product.component';
import { MainListingComponent } from './components/main-listing/main-listing.component';
import { MainProductComponent } from './components/main-product/main-product.component';
import { ModalComponent } from '../../common/modules/image-cropper/components/modal/modal.component';
import { OnboardedGuard } from '../../common/guards/onboarded.guard';
import { LoggedInGuard } from '../../common/modules/authentication/guards/logged-in.guard';


const routes: Routes = [
  {
    path: 'listings/onboard',
    component: OnboardListingComponent,
    canActivate: [
      LoggedInGuard
    ]
  },
  {
    path: 'new/onboard',
    component: OnboardProductComponent,
    canActivate: [
      LoggedInGuard
    ]
  },
  {
    path: 'edit/onboard/:locationId/:type',
    component: OnboardProductComponent,
    canActivate: [
      LoggedInGuard
    ]
  },
  {
    path: 'edit/onboard/:locationId',
    component: OnboardProductComponent,
    canActivate: [
      LoggedInGuard
    ]
  },
  {
    path: 'listings',
    component: MainListingComponent,
    canActivate: [
      LoggedInGuard
    ]
  },
  {
    path: 'new',
    component: MainProductComponent,
    canActivate: [
      LoggedInGuard
    ]
  },
  {
    path: 'edit/:locationId/:type',
    component: MainProductComponent,
    canActivate: [
      LoggedInGuard
    ]
  },
  {
    path: 'edit/:locationId',
    component: MainProductComponent,
    canActivate: [
      LoggedInGuard
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
