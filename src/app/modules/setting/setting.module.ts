import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingRoutingModule } from './setting-routing.module';
import { SettingComponent } from './components/setting/setting.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {SharedModule} from '../../common/shared/shared.module';
import { SettingcontainerComponent } from './components/settingcontainer/settingcontainer.component';
import { SettingpasswordComponent } from './components/settingpassword/settingpassword.component';

@NgModule({
  declarations: [SettingComponent, SettingcontainerComponent, SettingpasswordComponent],
  imports: [
    CommonModule,
    SettingRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SettingModule { }
