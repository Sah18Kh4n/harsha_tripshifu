import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuccessComponent } from './components/success/success.component';
import { WarningComponent } from './components/warning/warning.component';
import { ErrorComponent } from './components/error/error.component';
import { InfoComponent } from './components/info/info.component';
import { ToastComponent } from './components/toast/toast.component';



@NgModule({
  declarations: [
    SuccessComponent,
    WarningComponent,
    ErrorComponent,
    InfoComponent,
    ToastComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ToastComponent
  ]
})
export class ToasterModule { }
