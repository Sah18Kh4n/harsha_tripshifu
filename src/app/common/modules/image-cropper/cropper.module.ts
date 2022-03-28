import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ModalComponent } from './components/modal/modal.component';
import { CropComponent } from './components/crop/crop.component';
import { CropperComponent } from './components/cropper/cropper.component';



@NgModule({
  declarations: [
    CropperComponent,
    ModalComponent,
    CropComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ImageCropperModule
  ],
  exports: [
    CropComponent
  ]
})
export class CropperModule { }
