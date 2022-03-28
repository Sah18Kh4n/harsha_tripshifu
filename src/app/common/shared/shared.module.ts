import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { UserBoxComponent } from './user-box/user-box.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { DropdownMenuComponent } from './dropdown-menu/dropdown-menu.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { ProfileServices } from '../../modules/profile/services/profile.services';
import { FooterComponent } from './footer/footer.component';
import { EmailVerificationService } from '../services/email-verification.service';



@NgModule({
  declarations: [
    HeaderComponent,
    SearchBoxComponent,
    UserBoxComponent,
    SidebarComponent,
    DropdownMenuComponent,
    EmailVerificationComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ClickOutsideModule
  ],
  exports: [
    HeaderComponent,
    SearchBoxComponent,
    UserBoxComponent,
    SidebarComponent,
    DropdownMenuComponent,
    EmailVerificationComponent,
    FooterComponent
  ],
  providers: [
    ProfileServices,
    EmailVerificationService
  ]
})
export class SharedModule { }
