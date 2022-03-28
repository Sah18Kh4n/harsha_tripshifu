import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { ProfileBodyComponent } from './components/profile-body/profile-body.component';
import { ProfileContainerComponent } from './components/profile-container/profile-container.component';
import { BasicComponent } from './components/basic/basic.component';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { BankDetailsComponent } from './components/bank-details/bank-details.component';
import { InterestComponent } from './components/interest/interest.component';
import { LocationTravelledComponent } from './components/location-travelled/location-travelled.component';
import { ProfileServices } from './services/profile.services';
import { SharedModule } from '../../common/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ProfileAdapter } from './adapters/profileadapters';
import { ClickOutsideModule } from 'ng-click-outside';
import { SuggestModule } from '../../common/shared/suggest/suggest.module';
import { LocationService } from '../product/services/location.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CropperModule } from '../../common/modules/image-cropper/cropper.module';
import { ShareButtonModule } from '@ngx-share/button';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCoffee, fas } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { ShareButtonsModule } from '@ngx-share/buttons';
import { InstagramComponent } from './components/instagram/instagram.component';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink';
import { ShareModule } from '@ngx-share/core';



@NgModule({
  declarations: [
    AboutMeComponent,
    BankDetailsComponent,
    ProfileComponent,
    ProfileHeaderComponent,
    ProfileBodyComponent,
    ProfileContainerComponent,
    BasicComponent,
    InterestComponent,
    LocationTravelledComponent,
    InstagramComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    NgbModule,
    CropperModule,
    FormsModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    ClickOutsideModule,
    CommonModule,
    FormsModule,
    SuggestModule,
    SuggestModule,
    FontAwesomeModule,
    ShareButtonModule,
    BsDatepickerModule.forRoot(),
    ShareButtonsModule.withConfig({
      debug: true
    }),
    ShareModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [
    ProfileServices,
    LocationService,
    ProfileAdapter,
  ]
})
export class ProfileModule { 
  constructor(library: FaIconLibrary) {
    library.addIcons(faCoffee);
    library.addIconPacks(fas);
    library.addIcons(faFacebookF);
    library.addIcons(faTwitter);
    library.addIcons(faWhatsapp);
    library.addIcons(faEnvelope);
    library.addIcons(faCheck);
    library.addIcons(faLink);

     }
}
