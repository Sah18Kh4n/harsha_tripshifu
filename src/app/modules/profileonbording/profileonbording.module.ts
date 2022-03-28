import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ProfileonbordingRoutingModule } from './profileonbording-routing.module';
import { ProfileonbordingcontainerComponent } from './components/profileonbordingcontainer/profileonbordingcontainer.component';
import { ProfileonbordingimageuploadComponent } from './components/profileonbordingimageupload/profileonbordingimageupload.component';
import { ProfileonbordingbodyComponent } from './components/profileonbordingbody/profileonbordingbody.component';
import { ProfileServices } from '../profile/services/profile.services';
import { ProfileAdapter } from '../profile/adapters/profileadapters';
import { SharedModule } from '../../common/shared/shared.module';
import { SuggestModule } from '../../common/shared/suggest/suggest.module';
import { LocationService } from '../product/services/location.service';
import { CropperModule } from '../../common/modules/image-cropper/cropper.module';
import { VerificationComponent } from './components/verification/verification.component';
import { AccountService } from '../account/services/account.service';

@NgModule({
  declarations: [
    VerificationComponent,
    ProfileonbordingcontainerComponent,
    ProfileonbordingimageuploadComponent,
    ProfileonbordingbodyComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    SuggestModule,
    CropperModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    ProfileonbordingRoutingModule
  ],
  providers: [
    AccountService,
    ProfileServices,
    ProfileAdapter,
    LocationService
  ]
})
export class ProfileonbordingModule { }
